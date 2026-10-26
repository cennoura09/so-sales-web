# Rotas

Todas as rotas do sistema, com o contrato de cada uma.

## Páginas

| Rota | Tipo | Arquivo | Descrição |
|---|---|---|---|
| `/` | Página (estática, com ilhas client) | `app/page.tsx` | Landing page completa |
| `/*` (rota não existente) | Página 404 padrão do Next.js | — | Sem página customizada nesta versão |

### Âncoras da página `/`

Os links de navegação usam âncoras da mesma página. O comportamento de rolagem suave está em `app/globals.css` (`scroll-behavior: smooth`, desativado com `prefers-reduced-motion`).

| Âncora | Seção | Origem do link |
|---|---|---|
| `#top` | Hero (topo da página) | Logo do cabeçalho |
| `#servicos` | Serviços (planos) | Nav "Serviços", botão "Conhecer os planos" |
| `#case` | Case de cliente | Nav "Resultados" |
| `#faq` | Perguntas frequentes | Nav "Dúvidas" |
| `#contato` | Formulário de diagnóstico | Botão "Solicitar diagnóstico" (cabeçalho, hero, planos) |

### Ações que não mudam de rota

| Elemento | Onde | Comportamento |
|---|---|---|
| Botão "Falar no WhatsApp" | Hero | Abre o modal de captura rápida |
| Botão circular verde (flutuante) | Todas as telas, canto inferior direito | Abre o modal de captura rápida |
| Modal "Fale com a So Sales" | Sobreposto à página | Envia para `POST /api/whatsapp-leads` e abre o WhatsApp |
| Acordeão de FAQ | Seção Dúvidas | Abre e fecha perguntas. Uma aberta por vez. A primeira começa aberta |
| Botão "Quero este plano" | Cada card de plano | Âncora para `#contato` |
| Links de e-mail e Instagram | Contato e rodapé | `mailto:` e `https://instagram.com/so.sales.br` (nova aba) |

## API

Todas as rotas de API são `POST`, aceitam `Content-Type: application/json` e respondem JSON. Nenhuma rota de leitura é exposta: os leads só saem do sistema pelo banco e pelo CRM.

### `POST /api/leads`

Formulário "Solicitar diagnóstico". Arquivo: `app/api/leads/route.ts`.

**Corpo da requisição**

| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| `name` | string | sim | 2 a 80 caracteres, sem espaços nas pontas |
| `clinic_name` | string | sim | 2 a 120 caracteres |
| `whatsapp` | string | sim | 10 ou 11 dígitos com DDD. Pontuação é removida. Gravado com DDI `55` |
| `monthly_revenue` | string | sim | Um de: `ate_20_mil`, `20_a_50_mil`, `50_a_100_mil`, `acima_100_mil` |
| `challenge` | string | não | Até 500 caracteres |
| `website` | string | não | Honeypot. Deve vir vazio. Se vier preenchido, a resposta é 201 e nada é gravado |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` | string | não | Até 120 a 160 caracteres cada |
| `referrer` | string | não | Até 500 caracteres |

**Respostas**

| Status | Corpo | Quando |
|---|---|---|
| `201` | `{ "id": "<uuid>" }` | Lead aceito. Gravado no banco e/ou enviado ao CRM |
| `201` | `{ "id": "ok" }` | Honeypot preenchido. Nada gravado |
| `400` | `{ "errors": { "<campo>": "<mensagem>" } }` | Validação falhou. Uma mensagem por campo, em pt-BR |
| `400` | `{ "error": "Corpo da requisição inválido." }` | Corpo não é JSON |
| `429` | `{ "error": "..." }` + cabeçalho `Retry-After` | Mais de 5 requisições por minuto do mesmo IP |
| `500` | `{ "error": "..." }` | Erro inesperado ao gravar |
| `503` | `{ "error": "Serviço de cadastro indisponível." }` | Produção sem banco nem CRM configurados |

Exemplo:

```bash
curl -X POST https://www.sosales.com.br/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana Souza","clinic_name":"Clínica Vida","whatsapp":"(31) 9 8765-4321","monthly_revenue":"20_a_50_mil","challenge":"poucos agendamentos"}'
```

### `POST /api/whatsapp-leads`

Widget "Falar no WhatsApp". Arquivo: `app/api/whatsapp-leads/route.ts`.

Grava o lead com `source = whatsapp_quick` e devolve o link de atendimento. O lead **sempre** segue para o WhatsApp, mesmo que a gravação falhe, porque a conversa não pode se perder.

**Corpo da requisição**

| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| `name` | string | sim | 2 a 80 caracteres |
| `clinic_name` | string | sim | 2 a 120 caracteres |
| `challenge` | string | não | Até 500 caracteres |
| `website` | string | não | Honeypot, igual ao da rota anterior |
| atribuição | string | não | Mesmos campos UTM e `referrer` da rota anterior |

**Respostas**

| Status | Corpo | Quando |
|---|---|---|
| `201` | `{ "id": "<uuid>", "waUrl": "https://wa.me/...?text=..." }` | Lead gravado ou enviado ao CRM |
| `201` | `{ "id": "unsaved", "waUrl": "..." }` | Lead não gravado (erro registrado no log). O atendimento segue normalmente |
| `201` | `{ "id": "ok", "waUrl": "..." }` | Honeypot preenchido. Nada gravado |
| `400` | `{ "errors": { ... } }` | Validação falhou |
| `429` | `{ "error": "..." }` + `Retry-After` | Mais de 5 requisições por minuto do mesmo IP |
| `503` | `{ "error": "Atendimento por WhatsApp indisponível no momento." }` | `WHATSAPP_NUMBER` não configurado. Não há para onde enviar |

A mensagem pronta tem este formato:

> Olá! Sou {nome}, da clínica {clínica}. Gostaria de solicitar um diagnóstico. Meu principal desafio hoje: {desafio}.

(A parte do desafio só aparece quando o campo é preenchido.)

## Rotas de arquivos estáticos

| Caminho | Arquivo | Uso |
|---|---|---|
| `/logo-sosales.png` | `public/logo-sosales.png` | Logo do cabeçalho e favicon |
| `/logo-original.png` | `public/logo-original.png` | Logo original do cliente, fora da página. Guardado para uso em materiais |

## Rotas internas do Next.js

`/_next/*` (assets gerados) e `/_not-found` são geradas pelo framework. Não devem ser editadas.
