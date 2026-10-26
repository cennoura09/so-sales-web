-- So Sales: esquema do banco de dados para os leads da landing page.
-- PostgreSQL 14+. Idempotente: pode ser executado mais de uma vez.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Origem do lead: qual formulário ou botão ele usou.
DO $$ BEGIN
  CREATE TYPE lead_source AS ENUM ('diagnostico_form', 'whatsapp_quick');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Ciclo de vida do lead no funil comercial. Ajustar conforme o CRM.
DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'won', 'lost');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS leads (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source             lead_source NOT NULL,
  status             lead_status NOT NULL DEFAULT 'new',

  name               text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  clinic_name        text NOT NULL CHECK (char_length(clinic_name) BETWEEN 2 AND 120),
  -- Somente dígitos, com DDI 55. Nulo no fluxo do WhatsApp rápido, que não pede o número.
  whatsapp           text CHECK (whatsapp IS NULL OR whatsapp ~ '^55[0-9]{10,11}$'),
  monthly_revenue    text CHECK (monthly_revenue IS NULL OR monthly_revenue IN (
                       'ate_20_mil', '20_a_50_mil', '50_a_100_mil', 'acima_100_mil')),
  challenge          text CHECK (challenge IS NULL OR char_length(challenge) <= 500),

  -- Atribuição de marketing (preenchida a partir da URL de entrada).
  utm_source         text,
  utm_medium         text,
  utm_campaign       text,
  utm_content        text,
  utm_term           text,
  referrer           text,

  -- Sincronização com o CRM próprio.
  crm_external_id    text,
  crm_synced_at      timestamptz,
  crm_sync_attempts  integer NOT NULL DEFAULT 0,
  crm_last_error     text,

  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
CREATE INDEX IF NOT EXISTS leads_pending_crm_idx ON leads (created_at) WHERE crm_synced_at IS NULL;

-- Trilha de eventos: cada criação, tentativa de envio ao CRM e mudança de status.
CREATE TABLE IF NOT EXISTS lead_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     uuid NOT NULL REFERENCES leads (id) ON DELETE CASCADE,
  type        text NOT NULL,
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_events_lead_idx ON lead_events (lead_id, created_at);

-- Mantém updated_at correto em cada alteração.
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_set_updated_at ON leads;
CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Acesso público (anon) não deve ler nem gravar leads direto pelo cliente.
-- A escrita acontece somente pela API do servidor, com a conexão DATABASE_URL.
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
