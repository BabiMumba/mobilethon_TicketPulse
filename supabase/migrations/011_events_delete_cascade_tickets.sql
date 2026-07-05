-- Allow organizers to delete events that already have ticket reservations
alter table public.tickets
  drop constraint if exists tickets_event_id_fkey;

alter table public.tickets
  add constraint tickets_event_id_fkey
  foreign key (event_id) references public.events (id) on delete cascade;
