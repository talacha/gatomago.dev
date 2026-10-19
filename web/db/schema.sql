-- Newsletter storage. Idempotent: safe to run repeatedly (npm run db:migrate).
--
-- Privacy by design (GDPR Art. 5 and 25):
--  * only what is needed: email, language, consent evidence, status timestamps
--  * no IP address or user agent is stored against a subscriber
--  * confirmation tokens are stored hashed (SHA-256), never in clear
--  * Row Level Security is ON with no policies, so Supabase's public (anon) API can never read
--    these tables. The server connects with a privileged role that bypasses RLS.

create table if not exists public.subscribers (
  id                    uuid primary key default gen_random_uuid(),
  email                 text not null,
  lang                  text not null check (lang in ('en', 'es')),
  status                text not null default 'pending'
                          check (status in ('pending', 'confirmed', 'unsubscribed')),
  confirm_token_hash    text,
  confirm_expires_at    timestamptz,
  last_confirmation_at  timestamptz,
  consent_version       text not null,           -- version of the consent text shown
  consented_at          timestamptz not null,    -- when the form was submitted with the box ticked
  confirmed_at          timestamptz,             -- when the double opt-in link was used
  unsubscribed_at       timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint subscribers_email_lower check (email = lower(email)),
  constraint subscribers_email_len check (char_length(email) between 3 and 254)
);

create unique index if not exists subscribers_email_key on public.subscribers (email);
create unique index if not exists subscribers_confirm_token_key
  on public.subscribers (confirm_token_hash) where confirm_token_hash is not null;
create index if not exists subscribers_status_lang_idx on public.subscribers (status, lang);

-- One row per post that has been (or is being) announced, so a post is never emailed twice.
create table if not exists public.post_notifications (
  post_id     text primary key,
  lang        text not null,
  status      text not null default 'sending' check (status in ('sending', 'sent', 'failed')),
  recipients  integer not null default 0,
  started_at  timestamptz not null default now(),
  finished_at timestamptz
);

-- Short-lived counters for abuse protection. Keys are HMAC hashes, never raw IPs or emails.
create table if not exists public.rate_limits (
  key        text not null,
  created_at timestamptz not null default now()
);
create index if not exists rate_limits_key_created_idx on public.rate_limits (key, created_at);

alter table public.subscribers        enable row level security;
alter table public.post_notifications enable row level security;
alter table public.rate_limits        enable row level security;

-- Belt and braces: nothing here is reachable through Supabase's public API roles.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on public.subscribers, public.post_notifications, public.rate_limits from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on public.subscribers, public.post_notifications, public.rate_limits from authenticated;
  end if;
end $$;
