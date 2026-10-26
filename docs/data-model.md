# Modelo de dados

Banco: **PostgreSQL 14+**. Esquema em `db/schema.sql`. Idempotente: pode ser aplicado mais de uma vez.

## Tabelas

### `leads`

Um registro por pessoa que pediu contato, por qualquer um dos dois caminhos.

| Coluna | Tipo | Nulo | Padrão | Descrição |
|---|---|---|---|---|
| `id` | uuid | não | `gen_random_uuid()` | Identificador. Também é a chave de idempotência enviada ao CRM |
| `source` | enum `lead_source` | não | — | `diagnostico_form` ou `whatsapp_quick` |
| `status` | enum `lead_status` | não | `new` | `new`, `contacted`, `qualified`, `won`, `lost` |
| `name` | text | não | — | 2 a 80 caracteres |
| `clinic_name` | text | não | — | 2 a 120 caracteres |
| `whatsapp` | text | sim | — | DDI + DDD + número, só dígitos, ex.: `5531987654321`. Nulo no fluxo WhatsApp rápido |
| `monthly_revenue` | text | sim | — | `ate_20_mil`, `20_a_50_mil`, `50_a_100_mil`, `acima_100_mil` |
| `challenge` | text | sim | — | Até 500 caracteres |
| `utm_source` ... `utm_term` | text | sim | — | Atribuição de marketing (5 campos) |
| `referrer` | text | sim | — | Página de origem |
| `crm_external_id` | text | sim | — | Id devolvido pelo CRM |
| `crm_synced_at` | timestamptz | sim | — | Quando o CRM confirmou o recebimento. Nulo = pendente |
| `crm_sync_attempts` | integer | não | `0` | Quantas vezes o envio foi tentado |
| `crm_last_error` | text | sim | — | Último erro de envio |
| `created_at` | timestamptz | não | `now()` | Criação |
| `updated_at` | timestamptz | não | `now()` | Atualizado por trigger em cada alteração |

Índices:

- `leads_created_at_idx`: listagem por data
- `leads_status_idx`: filtro por status no CRM ou em relatórios
- `leads_pending_crm_idx`: parcial, só leads com `crm_synced_at IS NULL`. Usado no reenvio

Restrições de domínio (`CHECK`) reforçam as regras da API. Se a API for contornada, o banco ainda recusa dados inválidos. Em particular, `whatsapp` precisa ser `55` seguido de 10 ou 11 dígitos.

### `lead_events`

Trilha de auditoria. Uma linha por evento relevante do lead.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid | Identificador |
| `lead_id` | uuid | Referência a `leads.id`. Excluído junto com o lead (`ON DELETE CASCADE`) |
| `type` | text | `created`, `crm_synced`, `crm_failed` |
| `payload` | jsonb | Detalhes. Ex.: `{ "status": 200, "external_id": "crm-123" }` |
| `created_at` | timestamptz | Momento do evento |

## Tipos enumerados

- `lead_source`: `diagnostico_form`, `whatsapp_quick`
- `lead_status`: `new`, `contacted`, `qualified`, `won`, `lost`

Para acrescentar um valor a um enum, usar `ALTER TYPE lead_source ADD VALUE '...';` em uma migração nova. Não editar o `CREATE TYPE` original.

## Segurança

- **RLS ativado** nas duas tabelas, sem políticas para `anon` nem `authenticated`. O acesso público direto pela API do Supabase fica bloqueado.
- A aplicação grava com a conexão de `DATABASE_URL`, que pertence ao dono do banco e não é afetada pelo RLS. Essa URL deve ficar só no servidor.
- Dados pessoais (nome, WhatsApp, clínica) estão em texto puro. Ver [open-items.md](open-items.md) sobre consentimento (LGPD).

## Como aplicar

```bash
DATABASE_URL="postgres://..." npm run db:schema
```

O script `scripts/apply-schema.mjs` lê `db/schema.sql` e executa em uma única chamada. Também é possível colar o arquivo no SQL editor do Supabase.

## Consultas úteis

Leads pendentes de envio ao CRM:

```sql
SELECT id, name, clinic_name, created_at, crm_sync_attempts, crm_last_error
FROM leads
WHERE crm_synced_at IS NULL
ORDER BY created_at;
```

Leads de hoje por origem:

```sql
SELECT source, count(*)
FROM leads
WHERE created_at >= date_trunc('day', now())
GROUP BY source;
```

Histórico de um lead:

```sql
SELECT type, payload, created_at
FROM lead_events
WHERE lead_id = '<uuid>'
ORDER BY created_at;
```
