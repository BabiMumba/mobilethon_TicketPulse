-- Fix infinite recursion: never SELECT from profiles inside a profiles RLS policy.
-- Migration 007 joined public.profiles inside profiles_select_organizer, which
-- re-triggered the same policy on every upsert/select.

drop policy if exists "profiles_select_organizer" on public.profiles;
create policy "profiles_select_organizer"
  on public.profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.tickets t
      join public.events e on e.id = t.event_id
      where t.user_id = profiles.id
        and (
          e.created_by = auth.uid()
          or (
            e.created_by is null
            and (
              e.organizer = coalesce(
                auth.jwt() -> 'user_metadata' ->> 'full_name',
                split_part(coalesce(auth.jwt() ->> 'email', ''), '@', 1)
              )
              or e.organizer = coalesce(auth.jwt() ->> 'email', '')
            )
          )
        )
    )
  );

drop policy if exists "tickets_select_organizer" on public.tickets;
create policy "tickets_select_organizer"
  on public.tickets
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.events e
      where e.id = tickets.event_id
        and (
          e.created_by = auth.uid()
          or (
            e.created_by is null
            and (
              e.organizer = coalesce(
                auth.jwt() -> 'user_metadata' ->> 'full_name',
                split_part(coalesce(auth.jwt() ->> 'email', ''), '@', 1)
              )
              or e.organizer = coalesce(auth.jwt() ->> 'email', '')
            )
          )
        )
    )
  );
