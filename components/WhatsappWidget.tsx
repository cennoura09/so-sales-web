'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { whatsappWidget } from '@/lib/content';
import { readAttribution } from '@/lib/attribution';

// Widget "Falar no WhatsApp": botão flutuante, botão do hero e modal de captura rápida.
// Envia para POST /api/whatsapp-leads, que grava o lead e devolve o link wa.me com a mensagem pronta.

type Ctx = { open: () => void };
const WhatsappContext = createContext<Ctx>({ open: () => {} });

export function useWhatsapp() {
  return useContext(WhatsappContext);
}

export function WhatsappProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);

  return (
    <WhatsappContext.Provider value={{ open }}>
      {children}
      <button
        type="button"
        className="wpp-float"
        onClick={open}
        aria-label={whatsappWidget.button}
        title={whatsappWidget.button}
      >
        <WhatsappIcon />
      </button>
      {isOpen && <WhatsappModal onClose={() => setIsOpen(false)} />}
    </WhatsappContext.Provider>
  );
}

// Botão de texto usado no hero.
export function OpenWhatsappButton({ className }: { className?: string }) {
  const { open } = useWhatsapp();
  return (
    <button type="button" className={className} onClick={open}>
      {whatsappWidget.button}
    </button>
  );
}

type Errors = Partial<Record<'name' | 'clinic_name' | 'challenge' | 'form', string>>;

function WhatsappModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstField.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch('/api/whatsapp-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          clinic_name: data.get('clinic_name'),
          challenge: data.get('challenge'),
          website: data.get('website'),
          ...readAttribution(),
        }),
      });

      const json = (await res.json().catch(() => ({}))) as { waUrl?: string; errors?: Errors; error?: string };

      if (res.status === 201 && json.waUrl) {
        setWaUrl(json.waUrl);
        // Em alguns ambientes a janela é bloqueada. O link na tela cobre esse caso.
        try {
          window.open(json.waUrl, '_blank', 'noopener');
        } catch {
          /* ignorado: o link continua disponível */
        }
        return;
      }

      if (res.status === 400 && json.errors) {
        setErrors(json.errors);
      } else {
        setErrors({ form: json.error ?? 'Não foi possível continuar agora. Tente novamente.' });
      }
    } catch {
      setErrors({ form: 'Sem conexão. Verifique sua internet e tente novamente.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="wpp-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wpp-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="wpp-card">
        <button type="button" className="wpp-close" onClick={onClose} aria-label="Fechar">
          ×
        </button>

        {!waUrl ? (
          <>
            <h2 id="wpp-title">{whatsappWidget.title}</h2>
            <p className="wpp-sub">{whatsappWidget.lead}</p>
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className={`field${errors.name ? ' invalid' : ''}`}>
                <label htmlFor="w-nome">Nome</label>
                <input
                  id="w-nome"
                  ref={firstField}
                  name="name"
                  placeholder="Seu nome"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className={`field${errors.clinic_name ? ' invalid' : ''}`}>
                <label htmlFor="w-clinica">Nome da clínica</label>
                <input
                  id="w-clinica"
                  name="clinic_name"
                  placeholder="Clínica"
                  required
                  aria-invalid={Boolean(errors.clinic_name)}
                />
                {errors.clinic_name && <span className="field-error">{errors.clinic_name}</span>}
              </div>

              <div className="field">
                <label htmlFor="w-desafio">Principal desafio hoje (opcional)</label>
                <input id="w-desafio" name="challenge" placeholder="Ex.: poucos agendamentos" />
              </div>

              <div className="hp" aria-hidden="true">
                <label>
                  Site
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              {errors.form && (
                <p className="form-error" role="alert">
                  {errors.form}
                </p>
              )}

              <button type="submit" className="btn btn-primary btn-md submit" disabled={submitting}>
                {submitting ? 'Abrindo…' : whatsappWidget.submit}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 id="wpp-title">{whatsappWidget.doneTitle}</h2>
            <p className="wpp-sub">{whatsappWidget.doneLead}</p>
            <a className="btn btn-primary btn-md" href={waUrl} target="_blank" rel="noopener">
              {whatsappWidget.doneLink}
            </a>
          </>
        )}
      </div>
    </div>
  );
}

// Logo do WhatsApp em SVG, para o botão circular verde.
function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  );
}
