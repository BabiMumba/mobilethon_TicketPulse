-- tickets.user_id already references auth.users; do not require profiles row
-- (profiles are synced client-side and may lag behind the first ticket purchase)
alter table public.tickets
  drop constraint if exists tickets_user_id_profiles_fkey;
