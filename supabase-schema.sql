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

-- Media list (books + shows/films)
create table if not exists media_list (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  type text check (type in ('book', 'show')) not null,
  title text not null,
  detail text,
  completed boolean default false,
  completed_at timestamptz,
  rating int check (rating between 1 and 5),
  created_at timestamptz default now()
);

-- Summer plan activities
create table if not exists summer_activities (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  scheduled_date date not null,
  pillar text check (pillar in ('mind', 'culture', 'craft')) not null,
  type text not null,
  title text not null,
  description text,
  source text,
  url text,
  duration_min int,
  completed boolean default false,
  completed_at timestamptz,
  rating int check (rating between 1 and 5),
  feedback text,
  moved_from date,
  created_at timestamptz default now()
);

-- For fun reading / watching sidebar
create table if not exists fun_media (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  type text check (type in ('book', 'film')) not null,
  title text not null,
  detail text,
  status text check (status in ('current', 'completed', 'suggested')) default 'current',
  sort_order int default 0,
  completed_at timestamptz,
  rating int check (rating between 1 and 5),
  created_at timestamptz default now()
);

-- Interview prep log
create table if not exists interview_prep (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  type text check (type in ('case', 'behavioral', 'mental_math', 'framework', 'research')) not null,
  date date not null,
  title text not null,
  notes text,
  confidence int check (confidence between 1 and 5),
  created_at timestamptz default now()
);

-- RLS: enable but rely on service role key for all server-side ops
alter table todos enable row level security;
alter table goals enable row level security;
alter table wellness enable row level security;
alter table media_list enable row level security;
alter table summer_activities enable row level security;
alter table fun_media enable row level security;
alter table interview_prep enable row level security;
