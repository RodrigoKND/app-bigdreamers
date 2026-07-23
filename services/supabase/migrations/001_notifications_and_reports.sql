-- Ejecutar una sola vez en el SQL Editor del proyecto Supabase.
-- Crea las tablas necesarias para:
--   1) el centro de notificaciones in-app
--   2) los reportes mensuales de inversión en PDF generados por el admin
-- No modifica ninguna tabla existente (users, companies, investments, gem_requests, etc.).

-- ─── Notificaciones in-app ────────────────────────────────────────────────
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null check (type in ('gems_assigned', 'report_generated')),
  title text not null,
  body text not null,
  data jsonb not null default '{}',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_id_created_at_idx
  on notifications (user_id, created_at desc);

alter table notifications enable row level security;

create policy "users select own notifications" on notifications
  for select using (user_id = auth.uid());

create policy "users update own notifications" on notifications
  for update using (user_id = auth.uid());

create policy "admins insert notifications" on notifications
  for insert with check (
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

-- ─── Reportes mensuales de inversión ──────────────────────────────────────
create table investment_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  company_id uuid references companies(id) on delete set null,
  company_name text not null,
  investor_name text not null,
  report_date date not null default current_date,
  investment_amount numeric not null,
  interest_rate numeric not null,
  updated_capital numeric not null,
  updated_profit numeric not null,
  next_month_capital numeric,
  observations text,
  pdf_url text not null,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now()
);

create index investment_reports_user_id_created_at_idx
  on investment_reports (user_id, created_at desc);

alter table investment_reports enable row level security;

create policy "users select own reports" on investment_reports
  for select using (user_id = auth.uid());

create policy "admins select all reports" on investment_reports
  for select using (
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

create policy "admins insert reports" on investment_reports
  for insert with check (
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

-- ─── Storage ───────────────────────────────────────────────────────────────
-- Además de este SQL, crear manualmente en Storage un bucket público llamado
-- "reports" (igual que "receipts" / "companies" / "avatars"), con política de
-- lectura pública, para alojar los PDFs generados.
