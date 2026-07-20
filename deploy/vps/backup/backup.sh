#!/usr/bin/env sh
set -eu

PROJECT_DIR="${PROJECT_DIR:-/opt/mercadolivregd}"
DEPLOY_DIR="$PROJECT_DIR/deploy/vps"
ENV_FILE="$DEPLOY_DIR/.env"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"

if [ ! -f "$ENV_FILE" ]; then
  echo "Arquivo de ambiente nao encontrado: $ENV_FILE" >&2
  exit 1
fi

set -a
. "$ENV_FILE"
set +a

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

DB_TMP="$BACKUP_DIR/database-$TIMESTAMP.dump.tmp"
DB_FINAL="$BACKUP_DIR/database-$TIMESTAMP.dump"
UPLOADS_TMP="$BACKUP_DIR/uploads-$TIMESTAMP.tar.gz.tmp"
UPLOADS_FINAL="$BACKUP_DIR/uploads-$TIMESTAMP.tar.gz"

docker compose --project-directory "$DEPLOY_DIR" --env-file "$ENV_FILE" \
  -f "$DEPLOY_DIR/docker-compose.yml" exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc > "$DB_TMP"
mv "$DB_TMP" "$DB_FINAL"
chmod 600 "$DB_FINAL"

tar -C "$PROJECT_DIR" -czf "$UPLOADS_TMP" uploads
mv "$UPLOADS_TMP" "$UPLOADS_FINAL"
chmod 600 "$UPLOADS_FINAL"

find "$BACKUP_DIR" -type f \
  \( -name 'database-*.dump' -o -name 'uploads-*.tar.gz' \) \
  -mtime "+$RETENTION_DAYS" -delete

echo "Backup concluido em $BACKUP_DIR"
