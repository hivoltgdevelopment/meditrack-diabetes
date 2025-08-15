param([string]$Version)

if (-not $Version) {
  Write-Host "Usage: .\scripts\make-release.ps1 0.2.0" -ForegroundColor Yellow
  exit 1
}

# optional: update version in package.json (root only)
(Get-Content package.json -Raw) `
  -replace '"version":\s*"\d+\.\d+\.\d+"', '"version": "' + $Version + '"' `
  | Set-Content package.json -Encoding UTF8

git add -A
git commit -m "chore(release): v$Version"
git tag v$Version
git push origin main --follow-tags
git push origin v$Version
Write-Host "Tag v$Version pushed. Release workflow will attach the zip." -ForegroundColor Green
