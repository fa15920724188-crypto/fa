$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$node = "C:\Users\Fa\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$cloudflared = "C:\Users\Fa\Documents\Codex\2026-06-01\ai-ai\work\bin\cloudflared.exe"
$log = Join-Path $root "临时网址.log"

Write-Host "地毯AI智能销售资料库 - 生成临时网址" -ForegroundColor Cyan

if (!(Test-Path $cloudflared)) {
  Write-Host "没有找到 cloudflared.exe，请先让 Codex 下载临时隧道工具。" -ForegroundColor Red
  exit 1
}

Write-Host "正在启动本地资料库服务..." -ForegroundColor Green
Start-Process -FilePath $node -ArgumentList "server.js" -WorkingDirectory $root -WindowStyle Hidden
Start-Sleep -Seconds 2

if (Test-Path $log) {
  Remove-Item -LiteralPath $log -Force
}

Write-Host "正在生成公网临时网址，请稍等 10 秒..." -ForegroundColor Green
Start-Process -FilePath $cloudflared -ArgumentList @("tunnel", "--url", "http://localhost:8787", "--logfile", $log, "--loglevel", "info") -WindowStyle Hidden
Start-Sleep -Seconds 10

$content = Get-Content -LiteralPath $log -ErrorAction SilentlyContinue
$url = ($content | Select-String -Pattern "https://[a-z0-9-]+\.trycloudflare\.com" | Select-Object -First 1).Matches.Value

if ($url) {
  Write-Host ""
  Write-Host "新的临时网址：" -ForegroundColor Yellow
  Write-Host $url -ForegroundColor Cyan
  Write-Host ""
  Write-Host "默认账号：admin / admin123"
  Write-Host "按任意键退出。"
} else {
  Write-Host "没有生成成功。请稍后重试，或先用本地地址：http://localhost:8787" -ForegroundColor Red
}

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
