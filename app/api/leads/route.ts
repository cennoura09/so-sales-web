import { NextResponse } from 'next/server';
import { diagnosticoSchema, fieldErrors } from '@/lib/validation';
import { saveLead } from '@/lib/leads';
import { clientIp, rateLimit } from '@/lib/rate-limit';

// POST /api/leads — formulário "Solicitar diagnóstico" (seção Contato).
// Corpo: JSON com name, clinic_name, whatsapp, monthly_revenue, challenge (opcional), website (honeypot), attribution.
// Respostas: 201 { id } | 400 { errors } | 429 | 500 | 503.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const limit = rateLimit(`leads:${clientIp(request.headers)}`);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Aguarde um minuto e tente novamente.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição inválido.' }, { status: 400 });
  }

  const parsed = diagnosticoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: fieldErrors(parsed.error) }, { status: 400 });
  }

  const data = parsed.data;

  // Honeypot preenchido: responde como sucesso, mas não grava nada.
  if (data.website) {
    return NextResponse.json({ id: 'ok' }, { status: 201 });
  }

  try {
    const result = await saveLead({
      source: 'diagnostico_form',
      name: data.name,
      clinic_name: data.clinic_name,
      whatsapp: data.whatsapp,
      monthly_revenue: data.monthly_revenue,
      challenge: data.challenge ?? null,
      attribution: {
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        utm_content: data.utm_content,
        utm_term: data.utm_term,
        referrer: data.referrer,
      },
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }
    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (err) {
    console.error('[api/leads] erro ao salvar lead:', err);
    return NextResponse.json(
      { error: 'Não foi possível enviar agora. Tente novamente em instantes.' },
      { status: 500 },
    );
  }
}
