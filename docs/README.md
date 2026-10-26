# So Sales — Documentação do sistema

Sistema da landing page da **Assessoria So Sales | Marketing e Vendas**: front end, captação de leads, banco de dados e integração com o CRM próprio.

Idioma da interface: pt-BR. Público: donos e gestores de clínicas em Belo Horizonte.
Objetivo da página: gerar leads, por dois caminhos: o formulário "Solicitar diagnóstico" e o atendimento direto pelo WhatsApp.

## Índice

| Documento | Conteúdo |
|---|---|
| [routes.md](routes.md) | Todas as rotas da aplicação, âncoras, endpoints da API e contratos de request/response |
| [data-model.md](data-model.md) | Esquema do banco de dados, campos, regras e como aplicar |
| [crm-integration.md](crm-integration.md) | Contrato do webhook do CRM próprio, assinatura, reenvio e falhas |
| [handoff-mapping.md](handoff-mapping.md) | Cada seção do handoff original mapeada para o arquivo que a implementa |
| [content.md](content.md) | Onde fica cada texto, preço e FAQ, e como alterar |
| [deployment.md](deployment.md) | Variáveis de ambiente, instalação, build, banco e publicação |
| [open-items.md](open-items.md) | Pendências que dependem do cliente ou de decisão antes do lançamento |
| [handoff-original/](handoff-original/) | Documentação original recebida (README do design e HTML de referência), sem alterações |

## Visão geral da arquitetura

```
Navegador
  ├─ "/"                      Página (Server Component) + ilhas client: formulário, FAQ, widget WhatsApp
  │
  ├─ POST /api/leads          Formulário "Solicitar diagnóstico"
  │     validação (zod) → rate limit → honeypot → grava no PostgreSQL → envia ao CRM (HMAC)
  │
  └─ POST /api/whatsapp-leads Widget "Falar no WhatsApp"
        validação (zod) → rate limit → honeypot → grava → devolve link wa.me com mensagem pronta
```

Stack:

- **Next.js 14.2.35** (App Router), **React 18.3.1**, **TypeScript 5.6**
- **zod** para validação de entrada no servidor
- **pg** (node-postgres) para o PostgreSQL. Funciona com Supabase, RDS ou qualquer Postgres 14+
- CSS próprio com tokens (sem framework), fiel aos valores do handoff
- Fonte **Source Serif 4** via `next/font/google`

## Princípios

1. **Nenhum lead se perde.** A gravação no banco acontece antes do envio ao CRM. Se o CRM falhar, o lead fica marcado para reenvio.
2. **Validação sempre no servidor.** O navegador valida para dar feedback, mas a API valida de novo.
3. **Segredos só no servidor.** O número do WhatsApp, a URL do CRM e o segredo de assinatura não vão ao navegador.
4. **Uma fonte de texto.** Toda copy vem de `lib/content.ts`.

## Como rodar localmente

Ver [deployment.md](deployment.md). Resumo:

```bash
npm install
cp .env.example .env.local     # ajustar as variáveis
npm run dev                    # http://localhost:3000
```
