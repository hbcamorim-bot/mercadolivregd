# Deploy no VPS Hostinger

Esta stack publica o Mercado Livre GD ao lado dos projetos existentes, sem
compartilhar banco, volume ou rede interna com eles.

- URL gratuita: `https://mercadolivregd.187-127-45-24.sslip.io`
- Diretorio no VPS: `/opt/mercadolivregd`
- Projeto Compose: `mercadolivregd`
- Debug somente no VPS: `http://127.0.0.1:3016`
- Proxy existente: Traefik na rede `n8n-zmdc_default`

## Primeira instalacao

O repositorio precisa estar acessivel pelo VPS via Git. Depois de clonar em
`/opt/mercadolivregd`, execute no servidor:

```sh
cd /opt/mercadolivregd/deploy/vps
cp .env.example .env
chmod 600 .env
nano .env
mkdir -p /opt/mercadolivregd/uploads /opt/mercadolivregd/backups
chmod 700 /opt/mercadolivregd/uploads /opt/mercadolivregd/backups
docker compose --env-file .env config --quiet
docker compose --env-file .env build
docker compose --env-file .env up -d
```

Preencha os segredos diretamente no terminal do VPS. Nao envie o conteudo do
`.env` por chat e nao o adicione ao Git.

## Validacao

```sh
cd /opt/mercadolivregd/deploy/vps
docker compose --env-file .env ps
curl --fail http://127.0.0.1:3016/api/health
curl --fail https://mercadolivregd.187-127-45-24.sslip.io/api/health
set -a; . ./.env; set +a
docker compose --env-file .env exec -T postgres \
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\dt'
```

Resultado esperado: app e Postgres saudaveis, migracao encerrada com codigo 0,
healthcheck com `{"status":"ok"}` e tabelas Prisma listadas.

## Primeiro acesso administrativo

A senha inicial e gerada no proprio VPS e nao aparece em logs. No terminal da
Hostinger, visualize-a uma unica vez, guarde-a em um gerenciador de senhas e
remova o arquivo:

```sh
cat /root/mercadolivregd-initial-admin-password
rm /root/mercadolivregd-initial-admin-password
```

Painel: `https://mercadolivregd.187-127-45-24.sslip.io/admin/login`.

## Backup diario

Primeiro teste manual:

```sh
chmod 700 /opt/mercadolivregd/deploy/vps/backup/backup.sh
/opt/mercadolivregd/deploy/vps/backup/backup.sh
ls -lh /opt/mercadolivregd/backups
```

Depois adicione ao `crontab -e` do root:

```cron
40 3 * * * /opt/mercadolivregd/deploy/vps/backup/backup.sh >> /var/log/mercadolivregd-backup.log 2>&1
```

Os arquivos locais sao retidos por 14 dias. Para resiliencia real, mantenha uma
segunda copia criptografada fora deste VPS.

## Atualizacao

O primeiro deploy pode ser feito por snapshot quando ainda ha alteracoes locais
sem commit. Nesse caso, os comandos Git abaixo so passam a valer depois que o
repositorio no VPS for sincronizado com o remoto. Nao sobrescreva o `.env`, os
uploads nem os backups ao trocar o snapshot por um clone Git.

```sh
cd /opt/mercadolivregd
git fetch origin
git merge --ff-only origin/main
cd deploy/vps
docker compose --env-file .env build
docker compose --env-file .env up -d
docker compose --env-file .env ps
```

## Restauracao do banco

Pare apenas o app, preserve o Postgres e restaure um dump explicitamente
escolhido:

```sh
cd /opt/mercadolivregd/deploy/vps
set -a; . ./.env; set +a
docker compose --env-file .env stop app
docker compose --env-file .env exec -T postgres \
  dropdb -U "$POSTGRES_USER" --if-exists "$POSTGRES_DB"
docker compose --env-file .env exec -T postgres \
  createdb -U "$POSTGRES_USER" "$POSTGRES_DB"
docker compose --env-file .env exec -T postgres \
  pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists \
  < /opt/mercadolivregd/backups/database-AAAAMMDDTHHMMSSZ.dump
docker compose --env-file .env start app
```

A restauracao e destrutiva para o banco atual. Confirme o arquivo e gere um
backup novo antes de executa-la.

## Rollback operacional

Se a nova versao falhar, volte o codigo para um commit conhecido por meio de uma
branch ou tag de rollback e refaca o build. Nao use `git reset --hard`. A versao
da Vercel deve permanecer ativa ate a validacao final do VPS.

Para retirar somente esta aplicacao do ar sem apagar dados:

```sh
cd /opt/mercadolivregd/deploy/vps
docker compose --env-file .env down
```

Nao use `down -v`: essa opcao remove o volume do Postgres.
