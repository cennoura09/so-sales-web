// Atribuição de marketing lida no navegador. Guarda o primeiro contato (first-touch) na sessão.
// Usado pelos formulários antes de enviar para /api/leads e /api/whatsapp-leads.

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
}

const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const STORAGE_KEY = 'sosales:attribution';

export function readAttribution(): Attribution {
  if (typeof window === 'undefined') return {};

  const fromUrl: Attribution = {};
  const params = new URLSearchParams(window.location.search);
  for (const key of KEYS) {
    const value = params.get(key);
    if (value) fromUrl[key] = value.slice(0, 160);
  }

  // Se a visita atual trouxe UTMs, eles substituem o registro anterior da sessão.
  // Caso contrário, usa o que já estava guardado.
  let stored: Attribution = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}') as Attribution;
  } catch {
    stored = {};
  }

  const hasNewUtm = Object.keys(fromUrl).length > 0;
  const merged: Attribution = hasNewUtm ? fromUrl : stored;
  if (!merged.referrer && document.referrer) {
    merged.referrer = document.referrer.slice(0, 500);
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Armazenamento bloqueado (navegação privada, por exemplo). A atribuição fica sem persistir.
  }

  return merged;
}
