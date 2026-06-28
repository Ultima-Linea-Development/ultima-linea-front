#!/usr/bin/env bash
# Crear 2GB de swap si no existe. Ejecutar una vez en el VPS como root.
set -euo pipefail

if swapon --show | grep -q '/swapfile'; then
  echo "Swap ya configurado."
  swapon --show
  exit 0
fi

fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
echo "Swap activado:"
swapon --show
free -h
