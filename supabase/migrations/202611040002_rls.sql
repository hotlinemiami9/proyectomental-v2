-- ProyectoMental V2 — row level security.
-- This migration is intentionally not applied by the application.

begin;

alter table public.profiles enable row level security;
alter table public.charts enable row level security;

revoke all on table public.profiles from anon;
revoke all on table public.charts from anon;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.charts to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "charts_select_own" on public.charts;
create policy "charts_select_own"
on public.charts for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "charts_insert_own" on public.charts;
create policy "charts_insert_own"
on public.charts for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "charts_update_own" on public.charts;
create policy "charts_update_own"
on public.charts for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "charts_delete_own" on public.charts;
create policy "charts_delete_own"
on public.charts for delete
to authenticated
using (auth.uid() = user_id);

commit;
