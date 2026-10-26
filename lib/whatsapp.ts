// Monta o link de WhatsApp com a mensagem pronta. O número vem do servidor (WHATSAPP_NUMBER).

export function whatsappNumber(): string | null {
  const n = (process.env.WHATSAPP_NUMBER ?? '').replace(/\D/g, '');
  return n.length >= 12 ? n : null;
}

export function buildWhatsappMessage(input: { name: string; clinic_name: string; challenge?: string }): string {
  let msg = `Olá! Sou ${input.name}, da clínica ${input.clinic_name}. Gostaria de solicitar um diagnóstico.`;
  if (input.challenge) msg += ` Meu principal desafio hoje: ${input.challenge}.`;
  return msg;
}

export function buildWhatsappUrl(message: string): string | null {
  const number = whatsappNumber();
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
