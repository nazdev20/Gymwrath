import App from '../src/App';
import { createSupabaseServerClient } from '../src/lib/supabase/server';
import type { Profile } from '../src/types';

export default async function HomePage() {
  let initialUserId: string | null = null;
  let initialProfile: Profile | null = null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (profile) {
        initialUserId = user.id;
        initialProfile = {
          id: profile.id,
          email: profile.email,
          fullName: `${profile.first_name} ${profile.last_name || ''}`.trim(),
          role: profile.role,
          status: profile.approval_status,
          avatarUrl: profile.avatar_url || '',
          timezone: 'UTC',
          createdAt: profile.created_at || new Date().toISOString(),
          goals: profile.fitness_goals?.join(', ')
        };
      }
    }
  } catch (error) {
    console.error('Failed to load the server Supabase session:', error);
  }

  return <App initialUserId={initialUserId} initialProfile={initialProfile} />;
}