$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$outputDir = Join-Path $root "pacote"
$stageDir = Join-Path $outputDir "raizes-do-nordeste-api"
$zipPath = Join-Path $outputDir "raizes-do-nordeste-api.zip"

if (Test-Path -LiteralPath $stageDir) {
  Remove-Item -LiteralPath $stageDir -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $stageDir | Out-Null

$includePaths = @(
  ".dockerignore",
  ".env.example",
  ".gitignore",
  "docker-compose.yml",
  "Dockerfile",
  "jest.config.ts",
  "jest.e2e.config.ts",
  "nest-cli.json",
  "package-lock.json",
  "package.json",
  "prisma.config.ts",
  "README.md",
  "tsconfig.build.json",
  "tsconfig.json",
  "docs",
  "postman",
  "prisma",
  "scripts",
  "src",
  "test"
)

foreach ($item in $includePaths) {
  $source = Join-Path $root $item
  if (-not (Test-Path -LiteralPath $source)) {
    continue
  }

  $destination = Join-Path $stageDir $item
  $destinationParent = Split-Path -Parent $destination
  New-Item -ItemType Directory -Force -Path $destinationParent | Out-Null
  Copy-Item -LiteralPath $source -Destination $destination -Recurse -Force
}

$blockedNames = @("node_modules", "dist", ".tmp", "coverage", "pacote")
foreach ($name in $blockedNames) {
  Get-ChildItem -LiteralPath $stageDir -Recurse -Force -Directory -Filter $name |
    Remove-Item -Recurse -Force
}

if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

Compress-Archive -Path (Join-Path $stageDir "*") -DestinationPath $zipPath -Force
Remove-Item -LiteralPath $stageDir -Recurse -Force
Write-Output "Pacote gerado: $zipPath"
