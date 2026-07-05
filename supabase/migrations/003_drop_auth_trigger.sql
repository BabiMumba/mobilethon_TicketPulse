-- Drop auth trigger (RLS conflict on supabase_auth_admin).
-- Profiles are created client-side after signup / on session start.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Ensure authenticated users can manage their own profile row
drop policy if exists "profiles_insert_auth_admin" on public.profiles;

grant select, insert, update on table public.profiles to authenticated;
