#!/usr/bin/env bash
set -euo pipefail

DEPLOY_DIR="${DEPLOY_DIR:-/srv/ultima-linea-front}"
BRANCH="${DEPLOY_BRANCH:-main}"

cd "$DEPLOY_DIR"

echo ">> Pulling latest from origin/${BRANCH}..."
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

if [[ -f scripts/sync-env.sh ]]; then
  echo ">> Syncing environment variables..."
  bash scripts/sync-env.sh
fi

echo ">> Building containers..."
echo ">> Disk: $(df -h / | awk 'NR==2 {print $4 " free of " $2}')"
echo ">> Memory: $(free -m | awk '/^Mem:/{print $3 " MB used / " $2 " MB total"}')"
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
export COMPOSE_BAKE=false
docker compose build --progress=plain

echo ">> Restarting containers..."
docker compose up -d

echo ">> Deploy complete."
docker compose ps
