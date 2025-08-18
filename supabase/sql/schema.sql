
-- Enable UUIDs
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles for select
to authenticated using (id = auth.uid());

create policy "profiles_update_own"
on public.profiles for update
to authenticated using (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Prescriptions table
create table if not exists public.prescriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  dosage text,
  frequency text,
  next_refill_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.prescriptions enable row level security;

create policy "rx_select_own"
on public.prescriptions for select
to authenticated using (user_id = auth.uid());

create policy "rx_insert_own"
on public.prescriptions for insert
to authenticated with check (user_id = auth.uid());

create policy "rx_update_own"
on public.prescriptions for update
to authenticated using (user_id = auth.uid());

create policy "rx_delete_own"
on public.prescriptions for delete
to authenticated using (user_id = auth.uid());

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_prescriptions on public.prescriptions;
create trigger set_updated_at_prescriptions
before update on public.prescriptions
for each row execute function public.touch_updated_at();
