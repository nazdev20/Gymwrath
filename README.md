# GymWrath

GymWrath is a Next.js App Router application backed by Supabase Auth and the `fitness` Postgres schema.

## Supabase setup

Configure these environment variables in `.env.local` for development and in the deployment environment for production:

```text
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
INITIAL_ADMIN_SETUP_TOKEN=a-long-random-one-time-setup-token
```

`SUPABASE_SERVICE_ROLE_KEY` and `INITIAL_ADMIN_SETUP_TOKEN` are server-only secrets. Do not prefix them with `NEXT_PUBLIC_`, commit them, or send them to browser code.

In Supabase, expose `fitness` under **Project Settings → API → Exposed schemas**, then run the latest SQL from GymWrath's **Database → SQL** view. The SQL creates the Auth-to-profile trigger, schema grants, role-aware RLS policies, and notifies PostgREST to reload its schema cache. If an RPC reports that a function cannot be found in the schema cache, confirm `fitness` is exposed and apply the latest SQL. Review/migrate any existing profile rows before deploying: new profile IDs must match `auth.users.id`.

## Initial administrator

After deploying the server with `INITIAL_ADMIN_SETUP_TOKEN` set and applying the SQL above, make a one-time request to `POST /api/setup/initial-admin` with the same token in the `x-initial-admin-token` header and JSON fields `email`, `password`, and `fullName`. The password must be at least 12 characters. The database trigger creates the matching `fitness.profiles` row; if it does not, the route rolls back the Auth account and returns an error. Once an Auth-linked admin profile exists, initial setup is permanently closed.

For example, send this request from a trusted terminal (replace the placeholders; do not put real values in shell history):

```sh
curl --request POST 'https://your-app.example/api/setup/initial-admin' \
  --header 'content-type: application/json' \
  --header 'x-initial-admin-token: REPLACE_WITH_SETUP_TOKEN' \
  --data '{"email":"admin@example.com","password":"REPLACE_WITH_A_LONG_PASSWORD","fullName":"GymWrath Admin"}'
```

Administrators sign in through the application and create coach/client accounts from **User Management**. Public registration only creates pending client accounts.
