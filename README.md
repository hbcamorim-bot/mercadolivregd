# Mercado Livre GD

Plataforma operacional para fornecedores de geração compartilhada controlarem usinas, capacidade mensal, parceiros, prospects, locação de quotas, ativações e comissões.

O produto não compra ou vende créditos de energia. Cada fornecedor permanece responsável por sua entidade, estrutura jurídica, instrumentos contratuais, obrigações regulatórias, faturamento e relação com a distribuidora.

## Desenvolvimento

1. Copie `.env.example` para `.env.local` e configure PostgreSQL, senha administrativa e `AUTH_SECRET`.
2. Instale dependências com `npm.cmd install`.
3. Gere o client com `npm.cmd run db:generate`.
4. Em um banco local descartável, aplique com `npm.cmd run db:migrate`.
5. Carregue distribuidoras de referência com `npm.cmd run db:seed`.
6. Inicie com `npm.cmd run dev`.

## Produção

Não use `db:push`. Revise backup, conexão e SQL da migração antes de executar `npm.cmd run db:deploy`. Consulte `docs/IMPLANTACAO_MVP.md`.

## Validação

```text
npm.cmd run db:generate
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```
