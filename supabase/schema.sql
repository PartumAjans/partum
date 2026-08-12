-- ============================================================================
-- Partum Panel - Supabase şeması (DEMO_MODE=false üretim kurulumu için)
-- Supabase projenizde SQL Editor'da çalıştırın.
-- ============================================================================

-- Kullanıcı profilleri: auth.users ile 1-1, rol ve reklam hesabı eşleştirmesi.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'client' check (role in ('admin', 'client')),
  ad_account_id text,                       -- örn: act_123456789
  created_at timestamptz not null default now()
);

-- RLS: müşteriler yalnızca kendi profilini görür; servis anahtarı her şeyi görür.
alter table public.profiles enable row level security;

drop policy if exists "kendi profilini gör" on public.profiles;
create policy "kendi profilini gör"
  on public.profiles for select
  using (auth.uid() = id);

-- Yeni kullanıcı kaydolduğunda otomatik profil oluştur.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- JARVIS GÖREVLERİ (komuta merkezi yapılacaklar listesi)
-- Not: Uygulamanın ilk sürümü görevleri bellek-içi tutar. Kalıcılık isteniyorsa
-- bu tabloyu oluşturun ve lib/jarvis/tasks.ts içindeki TODO'yu uygulayın.
-- ----------------------------------------------------------------------------
create table if not exists public.jarvis_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  note text,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  status text not null default 'open' check (status in ('open', 'done')),
  client text,
  due date,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.jarvis_tasks enable row level security;

-- Yalnızca yöneticiler görevleri görür/yönetir (servis anahtarı zaten RLS'yi atlar).
drop policy if exists "yonetici gorevleri" on public.jarvis_tasks;
create policy "yonetici gorevleri"
  on public.jarvis_tasks for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ----------------------------------------------------------------------------
-- KURULUM NOTLARI
-- 1. Supabase Dashboard > Authentication > Users'tan müşteri ekleyin
--    (veya müşteri kendi kaydolsun). Profili otomatik oluşur.
-- 2. Yönetici yapmak için: update public.profiles set role='admin' where email='siz@ajans.com';
-- 3. Müşteriyi hesaba eşlemek panel içindeki "Müşteri Yönetimi" ekranından
--    yapılır (servis anahtarı ile yazılır).
-- ----------------------------------------------------------------------------
