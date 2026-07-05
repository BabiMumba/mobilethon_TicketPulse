-- Fix: "Database error saving new user" on signup
-- The auth trigger runs as supabase_auth_admin; RLS must allow that insert.

grant usage on schema public to postgres, anon, authenticated, service_role, supabase_auth_admin;
grant select, insert, update on table public.profiles to authenticated, service_role;
grant insert on table public.profiles to supabase_auth_admin;

drop policy if exists "profiles_insert_auth_admin" on public.profiles;
create policy "profiles_insert_auth_admin"
  on public.profiles
  for insert
  to supabase_auth_admin
  with check (true);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_email text;
begin
  v_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'TicketPulse User'
  );
  v_email := coalesce(nullif(trim(new.email), ''), 'unknown@ticketpulse.local');

  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    v_name,
    v_email,
    nullif(trim(new.raw_user_meta_data ->> 'phone'), '')
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    phone = coalesce(excluded.phone, public.profiles.phone),
    updated_at = now();

  return new;
end;
$$;

alter function public.handle_new_user() owner to postgres;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
