-- ProyectoMental V2 — initial data model.
-- This migration is intentionally not applied by the application.

begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length
    check (display_name is null or char_length(display_name) between 1 and 80)
);

create table if not exists public.charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id uuid not null,
  name text not null,
  birth_date date not null,
  birth_time time not null,
  birth_city text not null,
  birth_country text not null,
  birth_lat double precision not null,
  birth_lng double precision not null,
  birth_timezone text not null,
  birth_utc timestamptz not null,
  chart_data jsonb not null,
  engine_version text not null default 'free-human-design@1.0.1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint charts_name_length check (char_length(name) between 1 and 80),
  constraint charts_birth_date_range check (birth_date >= '1900-01-01'),
  constraint charts_city_length check (char_length(birth_city) between 2 and 100),
  constraint charts_country_length check (char_length(birth_country) between 2 and 100),
  constraint charts_lat_range check (birth_lat between -90 and 90),
  constraint charts_lng_range check (birth_lng between -180 and 180),
  constraint charts_timezone_length check (char_length(birth_timezone) between 1 and 64),
  constraint charts_user_client_unique unique (user_id, client_id)
);

create index if not exists charts_user_created_idx
  on public.charts (user_id, created_at desc);

create index if not exists charts_user_updated_idx
  on public.charts (user_id, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists charts_set_updated_at on public.charts;
create trigger charts_set_updated_at
before update on public.charts
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'display_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

commit;
