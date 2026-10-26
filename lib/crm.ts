import { createHmac } from 'node:crypto';

// Contrato do webhook do CRM próprio. Ver docs/crm-integration.md.
export interface CrmLeadPayload {
  event: 'lead.created';
  version: 1;
  sent_at: string;
  lead: {
    id: string;
    source: 'diagnostico_form' | 'whatsapp_quick';
    name: string;
    clinic_name: string;
    whatsapp: string | null;
    monthly_revenue: string | null;
    challenge: string | null;
    attribution: {
      utm_source: string | null;
      utm_medium: string | null;
      utm_campaign: string | null;
      utm_content: string | null;
      utm_term: string | null;
      referrer: string | null;
    };
    created_at: string;
  };
}

export type CrmResult =
  | { ok: true; externalId: string | null; status: number }
  | { ok: false; status: number | null; error: string };

export function isCrmConfigured(): boolean {
  return Boolean(process.env.CRM_WEBHOOK_URL && process.env.CRM_WEBHOOK_SECRET);
}

// Assinatura HMAC-SHA256 do corpo, no cabeçalho X-SoSales-Signature. O CRM valida antes de aceitar.
export function signBody(body: string, secret: string): string {
  return 'sha256=' + createHmac('sha256', secret).update(body).digest('hex');
}

export async function sendLeadToCrm(payload: CrmLeadPayload): Promise<CrmResult> {
  const url = process.env.CRM_WEBHOOK_URL;
  const secret = process.env.CRM_WEBHOOK_SECRET;
  if (!url || !secret) {
    return { ok: false, status: null, error: 'CRM não configurado' };
  }

  const body = JSON.stringify(payload);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SoSales-Event': payload.event,
        'X-SoSales-Signature': signBody(body, secret),
        'Idempotency-Key': payload.lead.id,
      },
      body,
      signal: AbortSignal.timeout(5_000),
      cache: 'no-store',
    });

    if (!res.ok) {
      return { ok: false, status: res.status, error: `CRM respondeu ${res.status}` };
    }

    // O CRM deve responder { "id": "..." } com o identificador do registro criado lá.
    const json = (await res.json().catch(() => null)) as { id?: unknown } | null;
    const externalId = json && typeof json.id === 'string' ? json.id : null;
    return { ok: true, externalId, status: res.status };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'erro desconhecido';
    return { ok: false, status: null, error: message };
  }
}
