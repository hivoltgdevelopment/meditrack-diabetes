param([string]$Url)

if (-not $Url) {
    Write-Host "Usage: .\scripts\update-dev-qr.ps1 -Url 'exp://192.168.0.xxx:19000'"
    exit 1
}

$qrPath = "docs/dev-qr.png"
Invoke-WebRequest "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=$Url" -OutFile $qrPath
Write-Host "QR code updated at $qrPath"
