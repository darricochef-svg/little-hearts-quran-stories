$ErrorActionPreference = 'Stop'
$files = Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot '.') -Filter '*.mjs' -File
foreach ($file in $files) {
  Write-Host "Checking $($file.Name)"
  & node --check $file.FullName
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
Write-Host "All $($files.Count) JavaScript modules passed syntax checks."
