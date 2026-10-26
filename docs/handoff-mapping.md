# Mapeamento: handoff original → implementação

Cada seção do documento original (`handoff-original/README.md`) e onde ela está implementada. Use esta página para conferir se algo foi perdido na passagem.

## Layout global

| Item do handoff | Implementação | Arquivo |
|---|---|---|
| Fundo `#0b0a09` | Token `--bg`, aplicado em `html` e `body` | `app/globals.css` |
| Faixa gradiente por seção (270deg, `#b8460b` → `#4a1c07` → `#140b06` → `#0b0a09`) | Token `--band` e classe `.band`, uma por seção | `app/globals.css`, `app/page.tsx` |
| Container `max-width: 1240px`, padding fluido `clamp(20px, 5vw, 64px)` | Classe `.wrap` | `app/globals.css` |
| Padding vertical das seções `clamp(64px, 8vw, 112px)` | Classe `.sec` | `app/globals.css` |
| Grids `auto-fit` que colapsam em uma coluna no celular | `grid-template-columns: repeat(auto-fit, minmax(...))` | `app/globals.css` |
| Rolagem suave | `html { scroll-behavior: smooth }` | `app/globals.css` |
| Fonte Source Serif 4, pesos 400, 600 e itálico 400 | `next/font/google` | `app/layout.tsx` |

## 1. Cabeçalho

| Item | Implementação | Arquivo |
|---|---|---|
| Logo 40×46 px, `object-fit: contain` | `<Image>` com `/logo-sosales.png` | `components/sections.tsx` (`Header`) |
| "So Sales" 19px / 600 | `.brand-name b` | `app/globals.css` |
| "Marketing e Vendas" 12px, maiúsculas | `.brand-name small` | `app/globals.css` |
| Nav: Serviços, Resultados, Dúvidas | `.main-nav` com âncoras | `components/sections.tsx` |
| Botão "Solicitar diagnóstico" → `#contato` | `.btn.btn-primary.btn-sm` | `components/sections.tsx` |

## 2. Hero

| Item | Implementação | Arquivo |
|---|---|---|
| Eyebrow "Assessoria para clínicas · Belo Horizonte" | `hero.eyebrow` | `lib/content.ts` |
| H1 com a segunda parte em itálico | `hero.titleStart` + `hero.titleEmphasis` | `lib/content.ts`, `components/sections.tsx` |
| Texto de apoio | `hero.lead` | `lib/content.ts` |
| "Solicitar diagnóstico" → `#contato` | Botão primário | `components/sections.tsx` |
| "Conhecer os planos" → `#servicos` | Botão secundário | `components/sections.tsx` |
| **"Falar no WhatsApp"** (adicionado após o handoff) | `OpenWhatsappButton` abre o modal | `components/WhatsappWidget.tsx` |

## 3. Serviços

| Item | Implementação | Arquivo |
|---|---|---|
| Cabeçalho em grid (título + parágrafo) | `.svc-head` | `components/sections.tsx`, `app/globals.css` |
| Cards dos planos | `.card` | `components/sections.tsx` |
| Planos "Essencial" e "Completo" com itens, tag e descrição | `services.plans` | `lib/content.ts` |
| Itens com travessão "—" em `#ffb27a` | `.feats .dash` | `components/sections.tsx` |
| Preço "Sob consulta" | `plan.price` | `lib/content.ts` |
| "Quero este plano" → `#contato` | `.btn-card` | `components/sections.tsx` |

## 4. Case

| Item | Implementação | Arquivo |
|---|---|---|
| Eyebrow, título e parágrafo | `caseStudy` | `lib/content.ts` |
| "R$ 900 mil" riscado → "R$ 1,2 mi" com seta | `.result`, `.old`, `.new` | `components/sections.tsx`, `app/globals.css` |
| Vídeo 16:9 com placeholder | `.video`. Aceita `videoUrl` para iframe quando o vídeo chegar | `components/sections.tsx` |

## 5. FAQ

| Item | Implementação | Arquivo |
|---|---|---|
| Cinco perguntas e respostas | `faqs` | `lib/content.ts` |
| Acordeão, uma aberta por vez, primeira aberta, clicar fecha | `openIndex` começando em `0`, `-1` fecha tudo | `components/Faq.tsx` |
| `aria-expanded` no botão | Sim | `components/Faq.tsx` |

## 6. Contato

| Item | Implementação | Arquivo |
|---|---|---|
| Título e texto de apoio | `contact` | `lib/content.ts` |
| Links de e-mail e Instagram | `brand` | `lib/content.ts` |
| Campos Nome, Nome da clínica, WhatsApp, Faturamento, Principal desafio | `components/ContactForm.tsx` | |
| Faturamento: lista com 4 faixas | `contact.revenueOptions` (valor técnico + rótulo) | `lib/content.ts` |
| Validação de campos obrigatórios | No navegador (`required`) e no servidor (zod) | `components/ContactForm.tsx`, `lib/validation.ts` |
| Estado de sucesso "Solicitação recebida." com nome | Substitui o formulário | `components/ContactForm.tsx` |
| "Enviar nova solicitação" reseta o formulário | Sem recarregar a página | `components/ContactForm.tsx` |
| **Envio real** (pendência do handoff) | `POST /api/leads` → banco + CRM | `app/api/leads/route.ts` |
| **Máscara e validação do WhatsApp** (pendência do handoff) | Servidor aceita 10 ou 11 dígitos com DDD e grava com `55` | `lib/validation.ts` |
| **Loading e erro** (pendência do handoff) | Botão "Enviando…", mensagens por campo e mensagem geral | `components/ContactForm.tsx` |
| **Anti-spam** (pendência do handoff) | Honeypot + limite de 5 envios por minuto por IP | `lib/validation.ts`, `lib/rate-limit.ts` |
| **Evento de conversão** (pendência do handoff) | Não implementado. Ver [open-items.md](open-items.md) | — |

## 7. Rodapé

| Item | Implementação | Arquivo |
|---|---|---|
| "© 2026 Assessoria So Sales · Marketing e Vendas" | `Footer` | `components/sections.tsx` |
| Links Instagram e E-mail | `brand` | `lib/content.ts` |

## Interações e comportamento

| Item do handoff | Implementação |
|---|---|
| Botões primário e secundário com hover e active | Classes `.btn-primary`, `.btn-ghost` em `app/globals.css` |
| Links com hover `#ffd9bf` | `a:hover` em `app/globals.css` |
| Foco visível `2px solid #ffb27a` | `:focus-visible` em `app/globals.css` |
| Seleção de texto `rgba(255,140,60,.35)` | `::selection` em `app/globals.css` |
| Sem animações além de hover | Confirmado. Só há transição de cor nos botões |

## Estado da aplicação (handoff)

| Estado | Implementação |
|---|---|
| `openFaq: number` (padrão 0, -1 = todos fechados) | `useState` em `components/Faq.tsx` |
| Formulário: `status: idle \| submitting \| success \| error` | `useState` em `components/ContactForm.tsx` |

## Itens adicionados além do handoff

Estes não estavam no documento original e foram pedidos depois:

| Item | Onde |
|---|---|
| Botão flutuante circular verde do WhatsApp | `components/WhatsappWidget.tsx`, classe `.wpp-float` |
| Modal de captura rápida "Fale com a So Sales" | `components/WhatsappWidget.tsx` |
| Rota `POST /api/whatsapp-leads` | `app/api/whatsapp-leads/route.ts` |
| Atribuição de marketing (UTMs e referrer) | `lib/attribution.ts`, `lib/validation.ts` |
| Banco de dados, CRM e logs de eventos | `db/schema.sql`, `lib/leads.ts`, `lib/crm.ts` |
