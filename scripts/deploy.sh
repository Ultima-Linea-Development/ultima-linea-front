#!/usr/bin/env bash
set -euo pipefail

DEPLOY_DIR="${DEPLOY_DIR:-/srv/ultima-linea-front}"
BRANCH="${DEPLOY_BRANCH:-main}"
DOCKER_IMAGE="${DOCKER_IMAGE:-ultima-linea-front:latest}"

cd "$DEPLOY_DIR"

echo ">> Pulling latest from origin/${BRANCH}..."
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

if [[ -f scripts/sync-env.sh ]]; then
  echo ">> Syncing environment variables..."
  bash scripts/sync-env.sh
fi

use_prebuilt_image=false
if [[ "${SKIP_DOCKER_BUILD:-0}" == "1" ]] && docker image inspect "$DOCKER_IMAGE" >/dev/null 2>&1; then
  use_prebuilt_image=true
  echo ">> Using prebuilt image ${DOCKER_IMAGE} from CI."
elif [[ "${SKIP_DOCKER_BUILD:-0}" == "1" ]]; then
  echo ">> Prebuilt image ${DOCKER_IMAGE} not found; building on server..."
fi

if [[ "$use_prebuilt_image" == "false" ]]; then
  echo ">> Building containers..."
  docker compose build
fi

echo ">> Restarting containers..."
if [[ "$use_prebuilt_image" == "true" ]]; then
  docker compose up -d --no-build
else
  docker compose up -d
fi

echo ">> Deploy complete."
docker compose ps
