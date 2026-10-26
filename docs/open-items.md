# Pendências antes do lançamento

Itens que dependem do cliente ou de uma decisão, e o que ainda não está implementado. Ordem por prioridade.

## Bloqueantes para produção

| # | Item | Quem resolve | Situação |
|---|---|---|---|
| 1 | **Número real do WhatsApp** da So Sales. O `.env.example` traz um número de exemplo | Cliente | Pendente. Definir `WHATSAPP_NUMBER` |
| 2 | **Contrato do CRM próprio**: URL, segredo, formato de resposta e tratamento de `409`. O contrato em [crm-integration.md](crm-integration.md) é proposto e precisa ser validado com quem mantém o CRM | Equipe técnica e cliente | Pendente |
| 3 | **Banco de dados em produção.** O esquema foi escrito e a aplicação compila, mas não foi executado contra um Postgres real nesta etapa | Equipe técnica | Pendente. Rodar `npm run db:schema` em um ambiente de teste e enviar um lead |
| 4 | **Consentimento (LGPD).** Os formulários coletam nome, WhatsApp e desafio, mas não há checkbox de aceite de política de privacidade nem de contato. Falta definir o texto e a forma de registro | Cliente e jurídico | Pendente. Decisão necessária |
| 5 | **Política de privacidade.** A LP não tem página própria. O aviso de consentimento depende dela | Cliente e jurídico | Pendente |

## Conteúdo que depende do cliente

| # | Item | Local no código |
|---|---|---|
| 6 | Vídeo do case | `caseStudy.videoUrl` em `lib/content.ts` |
| 7 | Revisão das cinco respostas do FAQ (o handoff marca como rascunho) | `faqs` em `lib/content.ts` |
| 8 | Confirmação dos números do case (R$ 900 mil e R$ 1,2 mi) e autorização para publicar | `caseStudy` em `lib/content.ts` |
| 9 | Preço dos planos. Hoje "Sob consulta", por pedido do cliente | `services.plans` em `lib/content.ts` |

## Pendências técnicas

| # | Item | Situação |
|---|---|---|
| 10 | **Reenvio automático ao CRM** dos leads pendentes. Hoje só há consulta manual (ver [crm-integration.md](crm-integration.md)) | Não implementado. Sugestão: job a cada 5–15 minutos |
| 11 | **Limite de requisições em memória.** Funciona por instância. Em serverless ou com várias instâncias, cada uma tem o próprio contador | Aceitável para o volume atual. Trocar por Redis ou pelo WAF do host se o volume crescer |
| 12 | **Evento de conversão** (analytics, Meta Pixel, Google Ads) no envio bem-sucedido. Faltou no handoff | Não implementado. Definir ferramenta e identificadores |
| 13 | **Estados de erro de rede** cobertos na interface, mas sem telemetria. Sem alerta quando o CRM fica fora por horas | Não implementado. Sugestão: alerta sobre leads pendentes há mais de 1 hora |
| 14 | **Testes automatizados.** Hoje a verificação é de compilação, tipos e smoke test manual das rotas | Não implementado. Prioridade: validação (`lib/validation.ts`) e assinatura (`lib/crm.ts`) |
| 15 | **Painel de leads.** Os leads ficam no banco e no CRM. Não há tela interna para a equipe da So Sales | Fora do escopo desta entrega. Pode ser o próprio CRM |

## Melhorias de conversão sugeridas (não implementadas)

Estas foram recomendadas antes e ainda não entraram:

- Depoimentos ou logos de clínicas atendidas
- Seção "Como funciona" com as etapas do serviço
- Linha de autoridade perto do formulário
- Aviso de privacidade abaixo do botão de envio (depende do item 5)

## Decisões já tomadas

| Decisão | Motivo |
|---|---|
| Next.js em vez de estático puro | O handoff previu formulário e API. Next.js resolve front e back no mesmo projeto |
| PostgreSQL com `pg` e não o cliente do Supabase | Mantém o código portável entre provedores. Supabase funciona por `DATABASE_URL` |
| Gravar antes de enviar ao CRM | Nenhum lead se perde se o CRM estiver fora |
| Honeypot e limite por IP em vez de CAPTCHA | Menos atrito para o lead. Se o spam aparecer, adicionar CAPTCHA |
| Número do WhatsApp no servidor | Evita expor a configuração e permite trocar sem novo build do front |
| Mensagem de WhatsApp enviada mesmo sem gravar | Não perder a conversa tem prioridade sobre o registro |
