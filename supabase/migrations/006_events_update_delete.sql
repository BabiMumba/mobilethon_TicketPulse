-- Organizers can update and delete their own events
drop policy if exists "events_update_own" on public.events;
create policy "events_update_own"
  on public.events
  for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

drop policy if exists "events_delete_own" on public.events;
create policy "events_delete_own"
  on public.events
  for delete
  to authenticated
  using (created_by = auth.uid());

grant update, delete on table public.events to authenticated;
