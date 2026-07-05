-- TicketPulse Zambia — initial schema
-- Run in Supabase SQL Editor or via `npx prisma migrate deploy`

-- Events catalogue (public read)
create table if not exists public.events (
  id text primary key,
  title text not null,
  description text not null,
  city text not null check (city in ('Lusaka', 'Ndola', 'Kitwe', 'Livingstone')),
  venue text not null,
  date timestamptz not null,
  price numeric(10, 2) not null,
  currency text not null default 'ZMW',
  category text not null,
  image_url text not null,
  organizer text not null,
  tag text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- User profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  city text check (city is null or city in ('Lusaka', 'Ndola', 'Kitwe', 'Livingstone')),
  is_organizer boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Purchased tickets
create table if not exists public.tickets (
  id text primary key,
  code text not null unique,
  event_id text not null references public.events (id) on delete restrict,
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  seat text not null,
  quantity int not null check (quantity > 0),
  amount_paid numeric(10, 2) not null,
  currency text not null default 'ZMW',
  status text not null default 'valid' check (status in ('valid', 'used', 'refunded')),
  purchased_at timestamptz not null default now(),
  event jsonb not null
);

create index if not exists tickets_user_id_idx on public.tickets (user_id);
create index if not exists events_featured_idx on public.events (featured) where featured = true;
create index if not exists events_city_idx on public.events (city);

-- Row Level Security
alter table public.events enable row level security;
alter table public.profiles enable row level security;
alter table public.tickets enable row level security;

-- Events: anyone can read
create policy "events_public_read"
  on public.events for select
  using (true);

-- Profiles: users manage their own row
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Tickets: users see and create their own
create policy "tickets_select_own"
  on public.tickets for select
  using (auth.uid() = user_id);

create policy "tickets_insert_own"
  on public.tickets for insert
  with check (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
