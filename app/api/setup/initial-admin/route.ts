import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '../../../../src/lib/supabase/admin';

export const runtime = 'nodejs';

function tokenMatches(received: string | null, expected: string | undefined): boolean {
  if (!received || !expected) return false;
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
}

export async function POST(request: Request) {
  if (!tokenMatches(request.headers.get('x-initial-admin-token'), process.env.INITIAL_ADMIN_SETUP_TOKEN)) {
    return NextResponse.json({ error: 'Initial administrator setup is not authorized.' }, { status: 403 });
  }

  let body: { email?: unknown; password?: unknown; fullName?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12 || fullName.length < 2 || fullName.length > 150) {
    return NextResponse.json({ error: 'Provide a valid email, a password of at least 12 characters, and a full name.' }, { status: 400 });
  }

  try {
    const admin = createSupabaseAdminClient();
    const { data: setupMarker, error: markerError } = await admin
      .from('system_settings')
      .select('key')
      .eq('key', 'gymwrath_initial_admin_initialized')
      .maybeSingle();
    if (markerError) {
      console.error('Initial admin setup marker lookup failed:', markerError);
      return NextResponse.json({ error: `Unable to verify one-time setup status: ${markerError.message}` }, { status: 500 });
    }
    if (setupMarker) {
      return NextResponse.json({ error: 'Initial administrator setup has already been completed.' }, { status: 409 });
    }

    const { data: existingAdmins, error: lookupError } = await admin
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1000);
    if (lookupError) {
      console.error('Initial admin lookup failed:', lookupError);
      return NextResponse.json({ error: `Unable to check existing administrators: ${lookupError.message}` }, { status: 500 });
    }
    const existingAdminIds = new Set<string>((existingAdmins || []).map(profile => (profile as { id: string }).id));
    let linkedAdminExists = false;
    for (const id of existingAdminIds) {
      const { data: authUser, error: userError } = await admin.auth.admin.getUserById(id);
      if (authUser.user) {
        linkedAdminExists = true;
        break;
      }
      if (userError && userError.status !== 404) {
        console.error('Initial admin Auth account lookup failed:', userError);
        return NextResponse.json({ error: `Unable to check administrator Auth account: ${userError.message}` }, { status: 500 });
      }
    }
    if (linkedAdminExists) {
      return NextResponse.json({ error: 'An administrator already exists; initial setup is closed.' }, { status: 409 });
    }

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: 'admin' },
      user_metadata: { full_name: fullName },
    });
    if (error || !data.user) {
      console.error('Initial administrator creation failed:', error);
      return NextResponse.json({ error: error?.message || 'Supabase Auth did not return the new user.' }, { status: 400 });
    }

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle();
    if (profileError || !profile) {
      const { error: rollbackError } = await admin.auth.admin.deleteUser(data.user.id);
      console.error('Initial administrator profile was not created; Auth user rolled back.', profileError, rollbackError);
      return NextResponse.json({
        error: profileError
          ? `Administrator profile creation failed: ${profileError.message}${rollbackError ? ` Auth rollback also failed: ${rollbackError.message}` : ' The Auth account was rolled back.'}`
          : `Administrator profile creation failed.${rollbackError ? ` Auth rollback also failed: ${rollbackError.message}` : ' The Auth account was rolled back.'}`,
      }, { status: 500 });
    }

    return NextResponse.json({ id: data.user.id, message: 'Initial administrator created.' }, { status: 201 });
  } catch (error) {
    console.error('Initial administrator setup failed:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Initial administrator setup failed.' }, { status: 500 });
  }
}
