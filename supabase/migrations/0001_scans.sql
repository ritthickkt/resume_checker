create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  passenger text not null,
  role text not null,
  company text not null,
  ats_score integer not null,
  summary text not null,
  checks jsonb not null,
  matched_keywords jsonb not null default '[]'::jsonb,
  missing_keywords jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists scans_user_id_created_at_idx
  on public.scans (user_id, created_at desc);

alter table public.scans enable row level security;

create policy "Users can view their own scans"
  on public.scans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own scans"
  on public.scans for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own scans"
  on public.scans for delete
  using (auth.uid() = user_id);
