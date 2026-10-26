import { NextResponse } from 'next/server';
import { whatsappQuickSchema, fieldErrors } from '@/lib/validation';
import { saveLead } from '@/lib/leads';
import { buildWhatsappMessage, buildWhatsappUrl } from '@/lib/whatsapp';
import { clientIp, rateLimit } from '@/lib/rate-limit';

// POST /api/whatsapp-leads — widget "Falar no WhatsApp" (botão flutuante e hero).
// Grava o lead (source = whatsapp_quick) e devolve o link de WhatsApp com a mensagem pronta.
// Corpo: JSON com name, clinic_name, challenge (opcional), website (honeypot), attribution.
// Respostas: 201 { id, waUrl } | 400 { errors } | 429 | 500 | 503.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const limit = rateLimit(`whatsapp:${clientIp(request.headers)}`);
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

  const parsed = whatsappQuickSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: fieldErrors(parsed.error) }, { status: 400 });
  }

  const data = parsed.data;
  const message = buildWhatsappMessage({
    name: data.name,
    clinic_name: data.clinic_name,
    challenge: data.challenge,
  });
  const waUrl = buildWhatsappUrl(message);

  if (!waUrl) {
    return NextResponse.json(
      { error: 'Atendimento por WhatsApp indisponível no momento.' },
      { status: 503 },
    );
  }

  if (data.website) {
    return NextResponse.json({ id: 'ok', waUrl }, { status: 201 });
  }

  try {
    const result = await saveLead({
      source: 'whatsapp_quick',
      name: data.name,
      clinic_name: data.clinic_name,
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
      console.error('[api/whatsapp-leads] lead não gravado:', result.error);
      return NextResponse.json({ id: 'unsaved', waUrl }, { status: 201 });
    }
    return NextResponse.json({ id: result.id, waUrl }, { status: 201 });
  } catch (err) {
    console.error('[api/whatsapp-leads] erro ao salvar lead:', err);
    // Mesmo sem gravar, o lead segue para o WhatsApp: não perder a conversa é prioridade.
    return NextResponse.json({ id: 'unsaved', waUrl }, { status: 201 });
  }
}
