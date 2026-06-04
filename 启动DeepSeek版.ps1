$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$node = "C:\Users\Fa\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

Write-Host "地毯AI销售教练 - DeepSeek版" -ForegroundColor Cyan
Write-Host "请输入 DeepSeek API Key。输入时不会显示在屏幕上。" -ForegroundColor Yellow

$secureKey = Read-Host "DeepSeek API Key" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
$plainKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)

if ([string]::IsNullOrWhiteSpace($plainKey)) {
  Write-Host "没有输入 API Key，已取消启动。" -ForegroundColor Red
  exit 1
}

$env:DEEPSEEK_API_KEY = $plainKey
$env:AI_PROVIDER = "deepseek"
$env:DEEPSEEK_MODEL = "deepseek-v4-flash"
$env:SESSION_SECRET = "carpet-ai-coach-" + [Guid]::NewGuid().ToString("N")

Write-Host ""
Write-Host "启动中..." -ForegroundColor Green
Write-Host "本地地址：http://localhost:8787"
Write-Host "如果你已经打开临时网址，它也会自动连到这个 DeepSeek 版本。"
Write-Host ""

Set-Location $root
& $node server.js
