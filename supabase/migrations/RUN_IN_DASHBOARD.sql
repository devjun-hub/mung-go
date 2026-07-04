-- ============================================================
-- Supabase SQL Editor에 이 SQL을 붙여넣고 실행하세요
-- ============================================================

-- 1. 반려동물 동반 장소 테이블
create table if not exists public.pet_places (
  id            uuid primary key default gen_random_uuid(),
  content_id    text unique not null,
  title         text not null,
  addr1         text,
  addr2         text,
  map_x         double precision,
  map_y         double precision,
  cat1          text,
  cat2          text,
  cat3          text,
  content_type  text,
  first_image   text,
  first_image2  text,
  acmpy_type    text,
  rela_fclty    text,
  acmpy_info    text,
  source        text default 'tour_api',
  region_sido   text,
  region_sigungu text,
  synced_at     timestamptz default now(),
  created_at    timestamptz default now()
);

create index if not exists idx_pet_places_location on public.pet_places (map_y, map_x);
create index if not exists idx_pet_places_sido on public.pet_places (region_sido);

alter table public.pet_places enable row level security;

drop policy if exists "pet_places_read_all" on public.pet_places;
create policy "pet_places_read_all" on public.pet_places
  for select using (true);

-- 2. 동물병원 테이블
create table if not exists public.vet_places (
  id           uuid primary key default gen_random_uuid(),
  kakao_id     text unique not null,
  place_name   text not null,
  address      text,
  road_address text,
  lat          double precision,
  lng          double precision,
  phone        text,
  place_url    text,
  region_sido  text,
  region_sigungu text,
  synced_at    timestamptz default now(),
  created_at   timestamptz default now()
);

create index if not exists idx_vet_places_location on public.vet_places (lat, lng);

alter table public.vet_places enable row level security;

drop policy if exists "vet_places_read_all" on public.vet_places;
create policy "vet_places_read_all" on public.vet_places
  for select using (true);

-- 3. 사용자 프로필 (이미 있으면 skip)
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  dog_name   text,
  dog_size   text default '중형',
  dog_breed  text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id);

-- 4. 산책 일기
create table if not exists public.diaries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  emoji      text,
  mood       text,
  content    text,
  created_at timestamptz default now()
);

alter table public.diaries enable row level security;

drop policy if exists "diaries_own" on public.diaries;
create policy "diaries_own" on public.diaries
  for all using (auth.uid() = user_id);
