-- Allow authenticated users to publish events (hackathon demo)
drop policy if exists "events_insert_authenticated" on public.events;
create policy "events_insert_authenticated"
  on public.events
  for insert
  to authenticated
  with check (true);

grant insert on table public.events to authenticated;

-- Free community event for demo
insert into public.events (id, title, description, city, venue, date, price, currency, category, image_url, organizer, tag, featured)
values
  ('evt-community-free', 'Lusaka Open Mic Night', 'Free entry open mic for poets, comedians and musicians. First come, first served seating.', 'Lusaka', 'East Park Mall', '2026-08-01T17:00:00+00:00', 0, 'ZMW', 'Music', 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80', 'Creative Hub ZM', 'Free', true)
on conflict (id) do nothing;
