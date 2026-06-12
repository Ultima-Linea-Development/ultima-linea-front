$ErrorActionPreference = "Stop"

$sshKey = Join-Path $env:USERPROFILE ".ssh\id_ed25519"
$sshHost = "admin@138.36.236.110"
$sshPort = 5143
$localPort = 27017

if (-not (Test-Path $sshKey)) {
  throw "No se encontró la clave SSH en $sshKey"
}

$listening = Get-NetTCPConnection -LocalPort $localPort -State Listen -ErrorAction SilentlyContinue
if ($listening) {
  Write-Host "Túnel MongoDB ya activo en localhost:$localPort"
  exit 0
}

$mongoIp = (
  ssh -p $sshPort -o BatchMode=yes -i $sshKey $sshHost `
    "docker inspect camisetas_mongodb --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'"
).Trim()

if (-not $mongoIp) {
  throw "No se pudo obtener la IP del contenedor camisetas_mongodb en el VPS"
}

Write-Host "Iniciando túnel: localhost:$localPort -> ${mongoIp}:27017 (VPS)"

Start-Process -FilePath "ssh" -ArgumentList @(
  "-p", $sshPort,
  "-i", $sshKey,
  "-o", "ServerAliveInterval=60",
  "-o", "ServerAliveCountMax=3",
  "-N",
  "-L", "${localPort}:${mongoIp}:27017",
  $sshHost
) -WindowStyle Hidden

Start-Sleep -Seconds 2

$ready = Get-NetTCPConnection -LocalPort $localPort -State Listen -ErrorAction SilentlyContinue
if (-not $ready) {
  throw "El túnel no pudo iniciarse en localhost:$localPort"
}

Write-Host "Túnel MongoDB listo. Dejá esta sesión abierta o volvé a ejecutar npm run db:tunnel si se corta."
