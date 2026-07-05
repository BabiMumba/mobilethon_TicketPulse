-- Link events to creators + let organizers read bookings for their events
alter table public.events
  add column if not exists created_by uuid references auth.users (id) on delete set null;

create index if not exists events_created_by_idx on public.events (created_by);

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
        and e.created_by = auth.uid()
    )
  );

-- Allow reading attendee profiles when viewing own event tickets
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
        and e.created_by = auth.uid()
    )
  );
