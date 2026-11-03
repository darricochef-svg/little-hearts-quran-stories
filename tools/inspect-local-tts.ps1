Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
foreach ($v in $s.GetInstalledVoices()) {
  $i = $v.VoiceInfo
  Write-Output ("VOICE|" + $i.Name + "|" + $i.Culture.Name + "|" + $i.Gender + "|" + $i.Age)
}
Write-Output ("DEFAULT|" + $s.Voice.Name)
