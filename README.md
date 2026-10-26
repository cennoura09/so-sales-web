# So Sales — Landing page e captação de leads

Site da Assessoria So Sales | Marketing e Vendas, com formulário de diagnóstico, atendimento pelo WhatsApp, banco de dados PostgreSQL e integração com o CRM próprio.

Documentação completa em [docs/](docs/README.md). Pontos de entrada:

- [Rotas e API](docs/routes.md)
- [Modelo de dados](docs/data-model.md)
- [Integração com o CRM](docs/crm-integration.md)
- [Mapeamento do handoff original](docs/handoff-mapping.md)
- [Instalação e publicação](docs/deployment.md)
- [Pendências antes do lançamento](docs/open-items.md)

## Início rápido

```bash
npm install
cp .env.example .env.local
npm run dev
```

Para criar as tabelas:

```bash
DATABASE_URL="postgres://..." npm run db:schema
```
