# Integração com o CRM próprio

O sistema envia cada lead novo ao CRM por **webhook HTTP**. O CRM recebe um `POST` com JSON e responde com o identificador do registro criado.

Implementação: `lib/crm.ts` (envio e assinatura) e `lib/leads.ts` (ordem das operações e registro dos resultados).

## Configuração

| Variável | Obrigatória | Descrição |
|---|---|---|
| `CRM_WEBHOOK_URL` | sim, para ativar o CRM | URL HTTPS do endpoint do CRM |
| `CRM_WEBHOOK_SECRET` | sim, junto com a URL | Segredo compartilhado para assinatura HMAC. Mínimo recomendado: 32 caracteres aleatórios |

Sem as duas variáveis, o CRM fica desativado e os leads só vão para o banco.

## Requisição enviada

```
POST {CRM_WEBHOOK_URL}
Content-Type: application/json
X-SoSales-Event: lead.created
X-SoSales-Signature: sha256=<hex>
Idempotency-Key: <id do lead>
```

O corpo segue o contrato versionado abaixo. O campo `version` permite evoluir o formato sem quebrar o CRM.

```json
{
  "event": "lead.created",
  "version": 1,
  "sent_at": "2026-10-26T14:03:11.000Z",
  "lead": {
    "id": "7dd7e7dc-29a0-4f4d-895e-97ea657f6492",
    "source": "diagnostico_form",
    "name": "Ana Souza",
    "clinic_name": "Clínica Vida",
    "whatsapp": "5531987654321",
    "monthly_revenue": "20_a_50_mil",
    "challenge": "poucos agendamentos",
    "attribution": {
      "utm_source": "instagram",
      "utm_medium": null,
      "utm_campaign": "bh-maio",
      "utm_content": null,
      "utm_term": null,
      "referrer": null
    },
    "created_at": "2026-10-26T14:03:10.912Z"
  }
}
```

Valores de `source`:

- `diagnostico_form`: veio do formulário "Solicitar diagnóstico"
- `whatsapp_quick`: veio do widget do WhatsApp. `whatsapp` e `monthly_revenue` vêm nulos

## Assinatura

A assinatura é HMAC-SHA256 do corpo bruto, com `CRM_WEBHOOK_SECRET` como chave, no formato `sha256=<hex>`.

O CRM deve **recalcular a assinatura sobre o corpo recebido, antes de qualquer parse**, e recusar a requisição se os valores não baterem. Exemplo em Node:

```js
import { createHmac, timingSafeEqual } from 'node:crypto';

function isValid(rawBody, signatureHeader, secret) {
  const expected = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(signatureHeader ?? '');
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
```

## Resposta esperada do CRM

| Status | Significado para o sistema |
|---|---|
| `2xx` com corpo `{ "id": "<id-no-crm>" }` | Sucesso. O id é salvo em `leads.crm_external_id` |
| `2xx` sem JSON ou sem `id` | Sucesso, sem id externo |
| `401` / `403` | Assinatura ou credencial inválida. Verificar o segredo nos dois lados |
| `409` | O sistema trata como falha, porque só aceita `2xx`. Se o CRM usar `409` para lead duplicado, deve responder `200` com o `id` do registro já existente |
| `4xx` outros | Falha. Registrada em `crm_last_error` e `lead_events` |
| `5xx` ou timeout | Falha temporária. Lead fica pendente para reenvio |

O timeout de envio é de **5 segundos**. Se o CRM demorar mais, a requisição é cancelada e o lead fica pendente.

## Ordem de operações

1. O lead é validado e gravado no banco (`leads` e `lead_events` com `created`).
2. O sistema envia ao CRM.
3. Sucesso: `crm_synced_at`, `crm_external_id` e evento `crm_synced`.
4. Falha: `crm_sync_attempts` incrementado, `crm_last_error` preenchido e evento `crm_failed`. O lead continua salvo.

A resposta da API ao visitante não depende do CRM. Se o lead foi gravado, o visitante recebe confirmação mesmo com o CRM fora do ar.

## Reenvio dos leads pendentes

A versão atual **não tem um agendador automático**. Os leads pendentes ficam no banco com `crm_synced_at IS NULL`. Para reenviar, há duas opções:

1. **Manual:** listar os pendentes (consulta em [data-model.md](data-model.md)) e reenviar pelo próprio CRM, ou pelo script a ser criado.
2. **Automático (recomendado para produção):** um job agendado, a cada 5 a 15 minutos, que reenvia os leads com `crm_synced_at IS NULL` e `crm_sync_attempts < 10`. Pode ser um cron do host ou uma rota protegida por segredo. Ainda não está implementado. Ver [open-items.md](open-items.md).

## Sem banco configurado

Se `DATABASE_URL` não existir, o lead é enviado ao CRM mesmo assim, com um id gerado na hora. Nesse caso não há fila de reenvio: uma falha do CRM é registrada apenas no log. Não é recomendado para produção.

## Testando a integração

Um CRM falso mínimo para testes locais:

```js
import http from 'node:http';
import { createHmac } from 'node:crypto';

const secret = process.env.CRM_WEBHOOK_SECRET;
http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    const expected = 'sha256=' + createHmac('sha256', secret).update(body).digest('hex');
    if (req.headers['x-sosales-signature'] !== expected) {
      res.writeHead(401).end('{"error":"assinatura inválida"}');
      return;
    }
    console.log(JSON.parse(body).lead);
    res.writeHead(200, { 'Content-Type': 'application/json' }).end('{"id":"crm-teste"}');
  });
}).listen(4500);
```

Com ele rodando, apontar `CRM_WEBHOOK_URL=http://localhost:4500/...` e enviar um lead pelo formulário.
