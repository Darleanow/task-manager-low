param(
    [string]$dbH = "localhost",
    [string]$dbU = "root",
    [string]$dbP = "PASS",
    [string]$scriptPath = "./Backend/logic.sql"
)

# Définition du chemin complet vers le script SQL
$fullScriptPath = Resolve-Path $scriptPath

# Préparation de la commande MySQL
$mysqlCommand = "mysql -h $dbH -u $dbU"
if ($dbP -ne "PASS") {
    $mysqlCommand += " -p$dbP"
}

# Exécution de la commande MySQL
$mysqlProcessInfo = New-Object System.Diagnostics.ProcessStartInfo
$mysqlProcessInfo.FileName = "cmd.exe"
$mysqlProcessInfo.RedirectStandardInput = $true
$mysqlProcessInfo.RedirectStandardOutput = $true
$mysqlProcessInfo.UseShellExecute = $false
$mysqlProcessInfo.Arguments = "/c $mysqlCommand"
$mysqlProcess = [System.Diagnostics.Process]::Start($mysqlProcessInfo)
$mysqlProcess.StandardInput.WriteLine("source $fullScriptPath")
$mysqlProcess.StandardInput.Close()
$mysqlProcess.WaitForExit()

# Vérifier le résultat de l'exécution
if ($mysqlProcess.ExitCode -ne 0) {
    Write-Host "Error occurred during SQL execution"
    exit
}

# Updates .env File
$envContent = @"
DB_HOST=$dbH
DB_USER=$dbU
DB_PASS=$dbP
DB_NAME=TaskManagerLow
"@

$envPath = "./Backend/.env"

# Check if .env file exists, if not, create it
if (-Not (Test-Path $envPath)) {
    New-Item -Path $envPath -ItemType "file" -Force
}

# Write database configuration to .env file with UTF8 encoding
$envContent | Out-File -FilePath $envPath -Encoding UTF8
Write-Host ".env file updated with database configuration."
