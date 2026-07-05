-- Ensure every ticket holder has a profile row (required for FK below)
insert into public.profiles (id, full_name, email, updated_at)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', split_part(u.email, '@', 1), 'User'),
  coalesce(u.email, ''),
  now()
from auth.users u
where exists (select 1 from public.tickets t where t.user_id = u.id)
  and not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

-- Link tickets.user_id → profiles for reliable attendee lookups
alter table public.tickets
  drop constraint if exists tickets_user_id_profiles_fkey;

alter table public.tickets
  add constraint tickets_user_id_profiles_fkey
  foreign key (user_id) references public.profiles (id) on delete cascade;

-- Organizer can read bookings on legacy events (created_by null, organizer name match)
drop policy if exists "tickets_select_organizer" on public.tickets;
create policy "tickets_select_organizer"
  on public.tickets
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.events e
      left join public.profiles p on p.id = auth.uid()
      where e.id = tickets.event_id
        and (
          e.created_by = auth.uid()
          or (
            e.created_by is null
            and p.full_name is not null
            and e.organizer = p.full_name
          )
        )
    )
  );

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
      left join public.profiles org on org.id = auth.uid()
      where t.user_id = profiles.id
        and (
          e.created_by = auth.uid()
          or (
            e.created_by is null
            and org.full_name is not null
            and e.organizer = org.full_name
          )
        )
    )
  );
