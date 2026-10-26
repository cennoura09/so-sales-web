// Limite simples por IP, em memória do processo.
// Adequado para uma instância. Com várias instâncias ou serverless, trocar por Redis ou pela borda do host.
const WINDOW_MS = 60_000;
const MAX_HITS = 5;

const hits = new Map<string, number[]>();

export function rateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_HITS) {
    const oldest = recent[0];
    hits.set(key, recent);
    return { allowed: false, retryAfterSeconds: Math.ceil((WINDOW_MS - (now - oldest)) / 1000) };
  }

  recent.push(now);
  hits.set(key, recent);

  // Limpeza ocasional para o mapa não crescer sem limite.
  if (hits.size > 10_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers.get('x-real-ip') ?? 'desconhecido';
}
