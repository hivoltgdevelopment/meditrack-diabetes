$ErrorActionPreference = "Stop"

function Remove-Bom($path) {
    if (-not (Test-Path $path)) { return }
    $bytes = [System.IO.File]::ReadAllBytes($path)
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        $new = $bytes[3..($bytes.Length - 1)]
        [System.IO.File]::WriteAllBytes($path, $new)
        Write-Host "✔ Removed BOM: $path"
    }
    else {
        Write-Host "OK (no BOM): $path"
    }
}

# Ensure supabase/config.toml exists with sane ports
$configPath = "supabase\config.toml"
if (-not (Test-Path $configPath)) {
    @'
[db]
port = 55432

[studio]
port = 55555

[kong]
port = 55501
metrics_port = 55502

[inbucket]
smtp_port = 45587
imap_port = 49993
pop3_port = 41110
web_port = 55588
'@ | Set-Content -Path $configPath -Encoding UTF8
    Write-Host "✔ Created $configPath"
}

# Strip BOM from likely files
Remove-Bom $configPath
Remove-Bom "env\.edge-functions.local"
Remove-Bom ".env"
Remove-Bom ".env.local"

Write-Host "`nDone. Try your dev command again:"
Write-Host "  pnpm dev" -ForegroundColor Cyan
