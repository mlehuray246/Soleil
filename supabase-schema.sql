-- Todos
create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  text text not null,
  completed boolean default false,
  due_date date,
  created_at timestamptz default now()
);

-- Goals
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  text text not null,
  horizon text check (horizon in ('short', 'medium', 'long')) not null,
  completed boolean default false,
  target_date date,
  created_at timestamptz default now()
);

-- Wellness
create table if not exists wellness (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  type text check (type in ('workout', 'cycle')) not null,
  date date not null,
  label text not null,
  notes text,
  duration_min int,
  phase text,
  created_at timestamptz default now()
);

-- RLS: enable but rely on service role key for all server-side ops
alter table todos enable row level security;
alter table goals enable row level security;
alter table wellness enable row level security;
