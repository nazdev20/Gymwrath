import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '../../../../src/lib/supabase/admin';
import { createSupabaseServerClient } from '../../../../src/lib/supabase/server';

export const runtime = 'nodejs';

function requestOrigin(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const host = forwardedHost || request.headers.get('host');
  const forwardedProtocol = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const protocol = forwardedProtocol || new URL(request.url).protocol.replace(/:$/, '');
  return host ? new URL(`${protocol}://${host}`).origin : new URL(request.url).origin;
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  let isSameOrigin = false;
  try {
    if (origin) isSameOrigin = new URL(origin).origin === requestOrigin(request);
  } catch {
    isSameOrigin = false;
  }
  if (!isSameOrigin) {
    return NextResponse.json({ error: 'Cross-origin requests are not allowed.' }, { status: 403 });
  }

  let body: { email?: unknown; password?: unknown; fullName?: unknown; role?: unknown; goals?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const role = body.role;
  const goals = typeof body.goals === 'string' ? body.goals.trim().slice(0, 1000) : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || fullName.length < 2 || fullName.length > 150 || (role !== 'coach' && role !== 'client')) {
    return NextResponse.json({ error: 'Provide a valid email, a password of at least 8 characters, a full name, and a client or coach role.' }, { status: 400 });
  }

  try {
    const sessionClient = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await sessionClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Sign in is required to create users.' }, { status: 401 });
    }

    const admin = createSupabaseAdminClient();
    const { data: caller, error: callerError } = await admin
      .from('profiles')
      .select('role, approval_status, is_active')
      .eq('id', user.id)
      .maybeSingle();
    if (callerError) {
      console.error('Admin authorization lookup failed:', callerError);
      return NextResponse.json({ error: `Unable to verify administrator access: ${callerError.message}` }, { status: 500 });
    }
    if (!caller || caller.role !== 'admin' || !['approved', 'not_applicable'].includes(caller.approval_status) || !caller.is_active) {
      return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 });
    }

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role },
      user_metadata: { full_name: fullName, fitness_goals: goals ? [goals] : [] },
    });
    if (error || !data.user) {
      console.error('Admin-created Auth account failed:', error);
      return NextResponse.json({ error: error?.message || 'Supabase Auth did not return the new user.' }, { status: 400 });
    }

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle();
    if (profileError || !profile) {
      const { error: rollbackError } = await admin.auth.admin.deleteUser(data.user.id);
      console.error('Admin-created profile missing; Auth user rollback attempted.', profileError, rollbackError);
      return NextResponse.json({
        error: profileError
          ? `Profile creation failed: ${profileError.message}${rollbackError ? ` Auth rollback also failed: ${rollbackError.message}` : ' The Auth account was rolled back.'}`
          : `Profile creation failed.${rollbackError ? ` Auth rollback also failed: ${rollbackError.message}` : ' The Auth account was rolled back.'}`,
      }, { status: 500 });
    }

    return NextResponse.json({ id: data.user.id, message: `${role === 'coach' ? 'Coach' : 'Client'} account created.` }, { status: 201 });
  } catch (error) {
    console.error('Admin user creation failed:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'User creation failed.' }, { status: 500 });
  }
}
