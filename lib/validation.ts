import { z } from 'zod';

export const REVENUE_VALUES = ['ate_20_mil', '20_a_50_mil', '50_a_100_mil', 'acima_100_mil'] as const;
export type MonthlyRevenue = (typeof REVENUE_VALUES)[number];

// UTMs e referrer chegam da URL de entrada. Limitados para não gravar lixo.
const shortText = (max: number) => z.string().trim().max(max).optional().or(z.literal('').transform(() => undefined));

const attribution = z.object({
  utm_source: shortText(120),
  utm_medium: shortText(120),
  utm_campaign: shortText(160),
  utm_content: shortText(160),
  utm_term: shortText(160),
  referrer: shortText(500),
});

// Campo "website" é um honeypot: humanos não o veem, robôs costumam preenchê-lo.
// Qualquer valor é aceito aqui; a rota decide descartar quando vier preenchido.
const honeypot = z.string().optional();

const nameField = z
  .string({ required_error: 'Informe seu nome.', invalid_type_error: 'Informe seu nome.' })
  .trim()
  .min(2, 'Informe seu nome.')
  .max(80, 'O nome deve ter até 80 caracteres.');

const clinicField = z
  .string({ required_error: 'Informe o nome da clínica.', invalid_type_error: 'Informe o nome da clínica.' })
  .trim()
  .min(2, 'Informe o nome da clínica.')
  .max(120, 'O nome da clínica deve ter até 120 caracteres.');

export const diagnosticoSchema = z
  .object({
    name: nameField,
    clinic_name: clinicField,
    whatsapp: z
      .string({ required_error: 'Informe seu WhatsApp.', invalid_type_error: 'Informe seu WhatsApp.' })
      .transform((v) => v.replace(/\D/g, ''))
      .refine((digits) => digits.length === 10 || digits.length === 11, {
        message: 'Informe um WhatsApp com DDD.',
      })
      .transform((digits) => `55${digits}`),
    monthly_revenue: z.enum(REVENUE_VALUES, {
      errorMap: () => ({ message: 'Selecione o faturamento.' }),
    }),
    challenge: z.string().trim().max(500).optional().or(z.literal('').transform(() => undefined)),
    website: honeypot,
  })
  .merge(attribution);

export const whatsappQuickSchema = z
  .object({
    name: nameField,
    clinic_name: clinicField,
    challenge: z.string().trim().max(500).optional().or(z.literal('').transform(() => undefined)),
    website: honeypot,
  })
  .merge(attribution);

export type DiagnosticoInput = z.infer<typeof diagnosticoSchema>;
export type WhatsappQuickInput = z.infer<typeof whatsappQuickSchema>;

export type FieldErrors = Record<string, string>;

// Converte o erro do zod em { campo: mensagem }, para o formulário mostrar por campo.
export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
