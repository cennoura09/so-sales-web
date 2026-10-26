import { query, isDatabaseConfigured } from './db';
import { isCrmConfigured, sendLeadToCrm, type CrmLeadPayload } from './crm';

// Regras de negócio do lead: persistir, enviar ao CRM, registrar eventos.
// A ordem é: grava primeiro (nada se perde), depois tenta o CRM.
// Se o CRM falhar, o lead fica no banco com crm_synced_at nulo para reenvio.

export type LeadSource = 'diagnostico_form' | 'whatsapp_quick';

export interface NewLead {
  source: LeadSource;
  name: string;
  clinic_name: string;
  whatsapp?: string | null;
  monthly_revenue?: string | null;
  challenge?: string | null;
  attribution: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    referrer?: string;
  };
}

export type SaveResult =
  | { ok: true; id: string; stored: 'database' | 'crm' | 'none' }
  | { ok: false; error: string };

export async function saveLead(lead: NewLead): Promise<SaveResult> {
  const dbOn = isDatabaseConfigured();
  const crmOn = isCrmConfigured();

  // Sem banco nem CRM, o lead não tem onde ficar. Em desenvolvimento, registra no log e segue.
  if (!dbOn && !crmOn) {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, error: 'Serviço de cadastro indisponível.' };
    }
    console.info('[lead:dev] nenhum banco ou CRM configurado. Lead recebido:', lead);
    return { ok: true, id: 'dev-' + Date.now(), stored: 'none' };
  }

  let id: string;
  let createdAt: string;

  if (dbOn) {
    const inserted = await query<{ id: string; created_at: Date }>(
      `INSERT INTO leads
         (source, name, clinic_name, whatsapp, monthly_revenue, challenge,
          utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id, created_at`,
      [
        lead.source,
        lead.name,
        lead.clinic_name,
        lead.whatsapp ?? null,
        lead.monthly_revenue ?? null,
        lead.challenge ?? null,
        lead.attribution.utm_source ?? null,
        lead.attribution.utm_medium ?? null,
        lead.attribution.utm_campaign ?? null,
        lead.attribution.utm_content ?? null,
        lead.attribution.utm_term ?? null,
        lead.attribution.referrer ?? null,
      ],
    );
    id = inserted.rows[0].id;
    createdAt = inserted.rows[0].created_at.toISOString();
    await query(`INSERT INTO lead_events (lead_id, type, payload) VALUES ($1, 'created', $2)`, [
      id,
      JSON.stringify({ source: lead.source }),
    ]);
  } else {
    // Sem banco, o id é gerado aqui para o CRM ainda receber um identificador estável.
    id = crypto.randomUUID();
    createdAt = new Date().toISOString();
  }

  if (!crmOn) {
    return { ok: true, id, stored: dbOn ? 'database' : 'none' };
  }

  const payload: CrmLeadPayload = {
    event: 'lead.created',
    version: 1,
    sent_at: new Date().toISOString(),
    lead: {
      id,
      source: lead.source,
      name: lead.name,
      clinic_name: lead.clinic_name,
      whatsapp: lead.whatsapp ?? null,
      monthly_revenue: lead.monthly_revenue ?? null,
      challenge: lead.challenge ?? null,
      attribution: {
        utm_source: lead.attribution.utm_source ?? null,
        utm_medium: lead.attribution.utm_medium ?? null,
        utm_campaign: lead.attribution.utm_campaign ?? null,
        utm_content: lead.attribution.utm_content ?? null,
        utm_term: lead.attribution.utm_term ?? null,
        referrer: lead.attribution.referrer ?? null,
      },
      created_at: createdAt,
    },
  };

  const result = await sendLeadToCrm(payload);

  if (dbOn) {
    if (result.ok) {
      await query(
        `UPDATE leads SET crm_external_id = $2, crm_synced_at = now(),
                          crm_sync_attempts = crm_sync_attempts + 1, crm_last_error = NULL
         WHERE id = $1`,
        [id, result.externalId],
      );
      await query(`INSERT INTO lead_events (lead_id, type, payload) VALUES ($1, 'crm_synced', $2)`, [
        id,
        JSON.stringify({ status: result.status, external_id: result.externalId }),
      ]);
    } else {
      console.warn('[lead] falha ao enviar ao CRM:', result.error);
      await query(
        `UPDATE leads SET crm_sync_attempts = crm_sync_attempts + 1, crm_last_error = $2 WHERE id = $1`,
        [id, result.error],
      );
      await query(`INSERT INTO lead_events (lead_id, type, payload) VALUES ($1, 'crm_failed', $2)`, [
        id,
        JSON.stringify({ status: result.status, error: result.error }),
      ]);
    }
  } else if (!result.ok) {
    console.warn('[lead] falha ao enviar ao CRM (sem banco para reenvio):', result.error);
  }

  return { ok: true, id, stored: dbOn ? 'database' : 'crm' };
}
