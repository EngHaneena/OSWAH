-- Enable pgvector
create extension if not exists vector;

-- جدول المواقف الرئيسي
create table if not exists situations (
  id text primary key,
  title text not null,
  story_summary text,
  source_text_ar text,
  source_book text,
  source_ref text,
  narrator text,
  grade text,
  source_url text,
  problem_tags text[],
  emotions text[],
  lesson text,
  prophetic_method text,
  related_verse text,
  sensitivity_level text check (sensitivity_level in ('أ','ب','ج')),
  age_suitability text,
  kid_version text,
  kid_question text,
  status text check (status in ('approved','demo','pending','rejected')) default 'pending',
  reviewed_by text,
  review_date date,
  reviewer_notes text,
  search_text text,
  embedding vector(1024),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- HNSW index for fast cosine similarity
create index if not exists situations_embedding_idx
  on situations using hnsw (embedding vector_cosine_ops);

-- دالة البحث بالتشابه الدلالي
create or replace function match_situations(
  query_embedding vector(1024),
  match_count int default 3,
  allow_demo boolean default false
)
returns table (
  id text,
  title text,
  story_summary text,
  source_text_ar text,
  source_book text,
  source_ref text,
  narrator text,
  grade text,
  source_url text,
  problem_tags text[],
  emotions text[],
  lesson text,
  prophetic_method text,
  related_verse text,
  sensitivity_level text,
  age_suitability text,
  kid_version text,
  kid_question text,
  status text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    s.id, s.title, s.story_summary, s.source_text_ar,
    s.source_book, s.source_ref, s.narrator, s.grade,
    s.source_url, s.problem_tags, s.emotions,
    s.lesson, s.prophetic_method, s.related_verse,
    s.sensitivity_level, s.age_suitability,
    s.kid_version, s.kid_question, s.status,
    1 - (s.embedding <=> query_embedding) as similarity
  from situations s
  where
    s.embedding is not null
    and (
      s.status = 'approved'
      or (allow_demo and s.status = 'demo')
    )
  order by s.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- جدول الصحابة
create table if not exists companions (
  id text primary key,
  name_ar text not null,
  name_en text,
  description text,
  render_style text default 'back_only',
  robe_color text default '#3F5233',
  head_cover text default 'turban',
  height_class text default 'medium',
  related_situation_id text references situations(id),
  status text default 'demo',
  created_at timestamptz default now()
);

-- جدول المفضلة
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  situation_id text references situations(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, situation_id)
);

-- جدول البلاغات
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  situation_id text references situations(id),
  report_type text,
  description text,
  user_consented boolean default false,
  user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- جدول تقدم الأطفال
create table if not exists kid_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  companion_id text references companions(id),
  game_type text,
  completed boolean default false,
  stars int default 0,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- أدوار المستخدمين
create table if not exists user_roles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  role text check (role in ('user','admin','reviewer')) default 'user',
  created_at timestamptz default now()
);

-- تفعيل RLS
alter table situations enable row level security;
alter table companions enable row level security;
alter table favorites enable row level security;
alter table reports enable row level security;
alter table kid_progress enable row level security;
alter table user_roles enable row level security;

-- سياسات RLS
-- situations: قراءة عامة للمعتمدة فقط (الخادم يصل لكل السجلات عبر service role)
create policy "situations_read_approved" on situations
  for select using (status = 'approved');

-- companions: قراءة عامة
create policy "companions_read" on companions
  for select using (true);

-- favorites: المستخدم يقرأ ويكتب بياناته فقط
create policy "favorites_own" on favorites
  for all using (auth.uid() = user_id);

-- reports: المستخدم يكتب فقط
create policy "reports_insert" on reports
  for insert with check (user_consented = true);

-- kid_progress: المستخدم يقرأ ويكتب بياناته
create policy "kid_progress_own" on kid_progress
  for all using (auth.uid() = user_id);

-- user_roles: القراءة للمستخدم نفسه
create policy "user_roles_read_own" on user_roles
  for select using (auth.uid() = user_id);
