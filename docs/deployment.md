# Instalação, configuração e publicação

## Requisitos

- Node.js 20 ou superior (testado com Node 24)
- npm 10 ou superior
- PostgreSQL 14 ou superior (Supabase, RDS ou equivalente)
- Um endpoint de webhook no CRM próprio (ver [crm-integration.md](crm-integration.md))

## Variáveis de ambiente

Copiar `.env.example` para `.env.local` (desenvolvimento) ou configurar no painel do host (produção).

| Variável | Obrigatória | Exemplo | Descrição |
|---|---|---|---|
| `DATABASE_URL` | recomendada | `postgres://user:pass@host:5432/so_sales` | Conexão com o Postgres. Sem ela os leads não são persistidos |
| `DATABASE_SSL` | não | `false` | Use `false` só em Postgres local sem SSL. Padrão: SSL ativo |
| `CRM_WEBHOOK_URL` | recomendada | `https://crm.../api/webhooks/so-sales` | Endpoint do CRM |
| `CRM_WEBHOOK_SECRET` | com a URL | string de 32+ caracteres | Segredo da assinatura HMAC |
| `WHATSAPP_NUMBER` | sim, para o WhatsApp | `5531999999999` | DDI + DDD + número, só dígitos |
| `NEXT_PUBLIC_SITE_URL` | recomendada | `https://www.sosales.com.br` | Usada em metadados e Open Graph |

Regras de ambiente:

- Em **produção**, sem `DATABASE_URL` nem `CRM_WEBHOOK_URL`, o formulário responde `503`. Isso é proposital: não aceitar lead que não será guardado.
- Em **desenvolvimento**, sem os dois, o lead é apenas registrado no log do servidor, e a API responde sucesso.
- Sem `WHATSAPP_NUMBER`, o widget do WhatsApp responde `503` e não abre atendimento.

Gerar um segredo forte:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Instalação local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrir http://localhost:3000.

## Banco de dados

1. Criar o banco (no Supabase: New Project; em outro provedor: criar a base `so_sales`).
2. Definir `DATABASE_URL`.
3. Aplicar o esquema:

```bash
npm run db:schema
```

Alternativa: colar o conteúdo de `db/schema.sql` no SQL editor do painel. O arquivo é idempotente.

Detalhes das tabelas e consultas em [data-model.md](data-model.md).

## Checagens antes de publicar

```bash
npm run typecheck    # tipos TypeScript
npm run build        # build de produção, inclui checagem de rotas
npm start            # servidor de produção local
```

Smoke test manual das rotas (com o servidor rodando):

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/                 # 200
curl -s -X POST http://localhost:3000/api/leads -H 'Content-Type: application/json' -d '{}'           # 400 com errors
curl -s -X POST http://localhost:3000/api/whatsapp-leads -H 'Content-Type: application/json' -d '{}'  # 400 com errors
```

## Publicação

O projeto é um app Next.js padrão. Pode ser publicado em:

- **Vercel**: importar o repositório, configurar as variáveis e publicar. O host detecta o Next.js sozinho.
- **Servidor próprio ou container**: `npm run build` e `npm start`, atrás de um proxy HTTPS.

Em qualquer host:

- Configurar todas as variáveis de ambiente antes do primeiro deploy.
- Confirmar que `NEXT_PUBLIC_SITE_URL` aponta para o domínio final.
- Se houver mais de uma instância, o limite de requisições por IP é **por instância**. Ver [open-items.md](open-items.md).
- Confirmar o IP real do visitante. O limite usa `X-Forwarded-For` (primeiro valor), então a rede do host precisa preencher esse cabeçalho.

## Após o deploy

1. Enviar um lead de teste pelo formulário e pelo WhatsApp.
2. Confirmar a linha em `leads` e os eventos em `lead_events`.
3. Confirmar que o CRM recebeu o lead com a assinatura válida.
4. Abrir o link do WhatsApp gerado e confirmar que a mensagem aparece pronta.
5. Apagar os leads de teste do banco e do CRM.
