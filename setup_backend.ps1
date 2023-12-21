param(
    [string]$dbH = "localhost",
    [string]$dbU = "root",
    [string]$dbP = "PASS",
    [string]$scriptPath = "./Backend/logic.sql"
)

# Function to check if a command is available
function Test-CommandExists {
    param($command)
    $exists = $false
    try {
        if (Get-Command $command -ErrorAction Stop) {
            $exists = $true
        }
    }
    catch {
        $exists = $false
    }
    return $exists
}

# Check for MySQL
if (-not (Test-CommandExists "mysql")) {
    Write-Host "MySQL is not installed or not in PATH. Please install it and try again."
    exit
}

# Check for node
if (-not (Test-CommandExists "node")) {
    Write-Host "node is not installed or not in PATH. Please install it and try again."
    exit
}

# Check for npm
if (-not (Test-CommandExists "npm")) {
    Write-Host "npm is not installed or not in PATH. Please install it and try again."
    exit
}

# Alias SQL script as full path
$fullScriptPath = Resolve-Path $scriptPath

# Preparates MySQL command
$mysqlCommand = "mysql -h $dbH -u $dbU"
if ($dbP -ne "PASS") {
    $mysqlCommand += " -p$dbP"
}

# Executes MySQL command
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

# Checks output
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
