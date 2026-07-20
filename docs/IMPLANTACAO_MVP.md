# Implantação do MVP

## Limite desta entrega

O código, o painel e a migração estão preparados, mas a migração não é aplicada automaticamente ao banco remoto. Essa separação protege os cadastros legados `Cliente` e `Fornecedor` e permite backup e rollback antes da mudança.

## Pré-requisitos

1. Confirmar qual projeto PostgreSQL será usado no piloto.
2. Criar backup verificável do banco atual.
3. Configurar `DATABASE_URL`, `ADMIN_PASSWORD` e um `AUTH_SECRET` aleatório com pelo menos 32 caracteres no ambiente de hospedagem.
4. Confirmar armazenamento persistente para `.data/uploads`. Em Vercel, o filesystem não é persistente; antes de receber documentos em produção, substituir esse diretório por storage privado compatível com S3/R2/Supabase Storage.

## Sequência segura

```text
npm.cmd ci
npm.cmd run db:generate
npm.cmd run typecheck
npm.cmd run build
npm.cmd run db:deploy
npm.cmd run db:seed
```

A migração está em `prisma/migrations/20260718_mvp_foundation/migration.sql`. Ela adiciona enums, tabelas, índices e relações do MVP, sem remover ou alterar as tabelas legadas.

## Smoke test do piloto

1. Entrar em `/admin/login`.
2. Abrir `/admin/operacao`.
3. Cadastrar fornecedor, distribuidora e entidade.
4. Cadastrar e qualificar uma usina.
5. Criar política de comissão.
6. Cadastrar parceiro, prospect e unidade consumidora.
7. Confirmar que usina de outra distribuidora não aparece para matching.
8. Criar matching, reserva e proposta.
9. Aceitar proposta e avançar ativação até `ACTIVATED`.
10. Confirmar quota ativa e comissão elegível.

## Pendências para escala

- Storage privado externo com URLs assinadas e antivírus.
- Autenticação individual por usuário, MFA e recuperação de acesso.
- Assinatura eletrônica integrada.
- Jobs para expirar reservas e propostas.
- Integração com cobrança e conciliação.
- Monitoramento, alertas, backup automático e testes end-to-end em CI.
