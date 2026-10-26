# Conteúdo e textos

Todo texto visível da página está em `lib/content.ts`. Os componentes não têm copy fixa, exceto os rótulos de navegação e as legendas de âncora que estão diretamente em `components/sections.tsx`.

## Onde fica cada texto

| Objeto em `lib/content.ts` | O que controla |
|---|---|
| `brand` | Nome, slogan, e-mail, Instagram, ano do rodapé |
| `hero` | Eyebrow, título e texto de apoio do topo |
| `services` | Título, texto e os dois planos (nome, tag, descrição, itens, preço) |
| `caseStudy` | Texto do case, valores "anterior" e "nova projeção", placeholder e URL do vídeo |
| `faqs` | Perguntas e respostas do acordeão |
| `contact` | Textos da seção Contato, mensagem de sucesso, opções de faturamento |
| `whatsappWidget` | Textos do modal e do botão do WhatsApp |

## Como alterar

### Trocar o preço de um plano

Hoje o cliente pediu "Sob consulta". Para mostrar um valor, editar `price` no plano desejado:

```ts
price: 'R$ 1.490/mês',
```

### Adicionar uma pergunta ao FAQ

Acrescentar um objeto em `faqs`. O acordeão se ajusta sozinho:

```ts
{ q: 'Pergunta nova?', a: 'Resposta nova.' },
```

### Colocar o vídeo do case

Quando o cliente enviar o vídeo, preencher `caseStudy.videoUrl` com a URL de incorporação (por exemplo, `https://www.youtube-nocookie.com/embed/ID`). Enquanto estiver vazio, aparece o placeholder.

### Trocar o número do WhatsApp

Definir `WHATSAPP_NUMBER` no ambiente (DDI + DDD + número, só dígitos). Não é preciso alterar código.

### Alterar a faixa de faturamento

Os valores de `contact.revenueOptions` (`value`) são gravados no banco e enviados ao CRM. **Não alterar o `value`** depois que houver leads, para manter o histórico consistente. Só o `label` (texto visível) pode mudar.

Se o `value` mudar, é preciso atualizar também `REVENUE_VALUES` em `lib/validation.ts` e o `CHECK` da coluna `monthly_revenue` em `db/schema.sql`.

## Convenções de copy

- Português do Brasil, tom formal, conforme o handoff original.
- Frases curtas e diretas. Sem travessões em excesso.
- Os títulos têm duas partes no conteúdo (`titleStart` e `titleEmphasis`). A segunda vai em itálico pelo componente, então não é preciso marcar nada no texto.
