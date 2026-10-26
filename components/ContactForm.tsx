'use client';

import { useState, type FormEvent } from 'react';
import { contact } from '@/lib/content';
import { readAttribution } from '@/lib/attribution';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type Errors = Partial<Record<'name' | 'clinic_name' | 'whatsapp' | 'monthly_revenue' | 'challenge' | 'form', string>>;

// Formulário "Solicitar diagnóstico" (seção Contato). Envia para POST /api/leads.
export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [name, setName] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus('submitting');
    setErrors({});

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          clinic_name: data.get('clinic_name'),
          whatsapp: data.get('whatsapp'),
          monthly_revenue: data.get('monthly_revenue'),
          challenge: data.get('challenge'),
          website: data.get('website'),
          ...readAttribution(),
        }),
      });

      if (res.status === 201) {
        setStatus('success');
        return;
      }

      const json = (await res.json().catch(() => ({}))) as { errors?: Errors; error?: string };
      if (res.status === 400 && json.errors) {
        setErrors(json.errors);
      } else {
        setErrors({ form: json.error ?? 'Não foi possível enviar agora. Tente novamente em instantes.' });
      }
      setStatus('error');
    } catch {
      setErrors({ form: 'Sem conexão. Verifique sua internet e tente novamente.' });
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="success" role="status" style={{ alignSelf: 'center' }}>
        <div className="ttl">{contact.successTitle}</div>
        <div className="sub">Obrigado, {name}. Retornaremos em breve.</div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            setName('');
            setStatus('idle');
          }}
        >
          {contact.successAgain}
        </button>
      </div>
    );
  }

  const busy = status === 'submitting';

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-describedby={errors.form ? 'form-error' : undefined}>
      <Field id="name" label="Nome" error={errors.name} required>
        <input
          id="name"
          name="name"
          placeholder="Seu nome"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(errors.name)}
        />
      </Field>

      <Field id="clinic_name" label="Nome da clínica" error={errors.clinic_name} required>
        <input id="clinic_name" name="clinic_name" placeholder="Clínica" required aria-invalid={Boolean(errors.clinic_name)} />
      </Field>

      <Field id="whatsapp" label="WhatsApp" error={errors.whatsapp} required>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          inputMode="tel"
          placeholder="(31) 9 0000-0000"
          autoComplete="tel"
          required
          aria-invalid={Boolean(errors.whatsapp)}
        />
      </Field>

      <Field id="monthly_revenue" label="Faturamento mensal" error={errors.monthly_revenue} required>
        <select id="monthly_revenue" name="monthly_revenue" required defaultValue="" aria-invalid={Boolean(errors.monthly_revenue)}>
          <option value="" disabled>
            Selecione
          </option>
          {contact.revenueOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field id="challenge" label="Principal desafio hoje" error={errors.challenge} full>
        <textarea
          id="challenge"
          name="challenge"
          rows={3}
          placeholder="Ex.: poucos agendamentos, leads desqualificados…"
        />
      </Field>

      {/* Honeypot: invisível para pessoas. Robôs que preenchem tudo caem aqui. */}
      <div className="hp" aria-hidden="true">
        <label>
          Site
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {errors.form && (
        <p id="form-error" className="form-error" role="alert">
          {errors.form}
        </p>
      )}

      <button type="submit" className="btn btn-primary btn-md submit" disabled={busy}>
        {busy ? 'Enviando…' : contact.submit}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  required,
  full,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`field${full ? ' full' : ''}${error ? ' invalid' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required ? '' : ' (opcional)'}
      </label>
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
