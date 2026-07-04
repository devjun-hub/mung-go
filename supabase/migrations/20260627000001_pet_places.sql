-- 반려동물 동반 장소 테이블
create table if not exists public.pet_places (
  id            uuid primary key default gen_random_uuid(),
  content_id    text unique not null,        -- 관광공사 contentId
  title         text not null,
  addr1         text,
  addr2         text,
  map_x         double precision,            -- 경도
  map_y         double precision,            -- 위도
  cat1          text,
  cat2          text,
  cat3          text,
  content_type  text,
  first_image   text,
  first_image2  text,
  -- 반려동물 상세 정보 (detailPetTour2)
  acmpy_type    text,                        -- 동반 유형
  rela_fclty    text,                        -- 보유 시설
  acmpy_info    text,                        -- 기타 동반 정보
  -- 메타
  source        text default 'tour_api',     -- 데이터 출처
  region_sido   text,                        -- 시도
  region_sigungu text,                       -- 시군구
  synced_at     timestamptz default now(),
  created_at    timestamptz default now()
);

-- 지리 인덱스 (PostGIS 없이 위경도 범위 검색용)
create index if not exists idx_pet_places_location on public.pet_places (map_y, map_x);
create index if not exists idx_pet_places_content_id on public.pet_places (content_id);
create index if not exists idx_pet_places_sido on public.pet_places (region_sido);

-- RLS 정책 (읽기는 공개, 쓰기는 service_role만)
alter table public.pet_places enable row level security;
create policy "pet_places_read_all" on public.pet_places
  for select using (true);
create policy "pet_places_write_service" on public.pet_places
  for all using (auth.role() = 'service_role');

-- 카카오 동물병원 테이블
create table if not exists public.vet_places (
  id          uuid primary key default gen_random_uuid(),
  kakao_id    text unique not null,
  place_name  text not null,
  address     text,
  road_address text,
  lat         double precision,
  lng         double precision,
  phone       text,
  place_url   text,
  region_sido text,
  region_sigungu text,
  synced_at   timestamptz default now(),
  created_at  timestamptz default now()
);

create index if not exists idx_vet_places_location on public.vet_places (lat, lng);
create index if not exists idx_vet_places_sido on public.vet_places (region_sido);

alter table public.vet_places enable row level security;
create policy "vet_places_read_all" on public.vet_places for select using (true);
create policy "vet_places_write_service" on public.vet_places for all using (auth.role() = 'service_role');
