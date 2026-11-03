$ErrorActionPreference = "Stop"
$project = Join-Path $env:USERPROFILE "Documents\Little-Hearts-Quran-Stories"
Start-Process explorer.exe -ArgumentList "`"$project`""
