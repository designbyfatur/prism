# PRISM Worker — Windows Task Scheduler Setup
# Run as Administrator: powershell -ExecutionPolicy Bypass -File install-task-scheduler.ps1

$WorkerPath = "C:\Users\fatur\prism\apps\worker"
$BunPath = "$env:USERPROFILE\.bun\bin\bun.exe"
$TaskName = "PRISM-Worker"
$LogFile = "C:\Users\fatur\prism\worker.log"

Write-Host "=== PRISM Worker — Task Scheduler Setup ===" -ForegroundColor Cyan

# Check bun exists
if (-not (Test-Path $BunPath)) {
    Write-Host "ERROR: Bun not found at $BunPath" -ForegroundColor Red
    Write-Host "Install bun first: https://bun.sh" -ForegroundColor Yellow
    exit 1
}

# Remove existing task if any
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

# Create the action — bun src/index.ts, log to file
$Action = New-ScheduledTaskAction `
    -Execute "cmd.exe" `
    -Argument "/c `"$BunPath src/index.ts >> `"$LogFile`" 2>&1`"" `
    -WorkingDirectory $WorkerPath

# Trigger: at login + repeat every 1 minute (auto-restart if crashes)
$TriggerLogin = New-ScheduledTaskTrigger -AtLogOn
$TriggerBoot = New-ScheduledTaskTrigger -AtStartup

# Settings: restart on failure, run whether or not logged on
$Settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Days 365) `
    -RestartCount 999 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable

# Register task
Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $TriggerLogin `
    -Settings $Settings `
    -RunLevel Highest `
    -Force | Out-Null

Write-Host "✓ Task '$TaskName' registered" -ForegroundColor Green
Write-Host ""

# Start immediately
Write-Host "Starting worker now..." -ForegroundColor Yellow
Start-ScheduledTask -TaskName $TaskName

Start-Sleep -Seconds 3

$Status = (Get-ScheduledTask -TaskName $TaskName).State
Write-Host "Worker status: $Status" -ForegroundColor Cyan
Write-Host ""
Write-Host "Log file: $LogFile" -ForegroundColor Gray
Write-Host ""
Write-Host "=== Commands ===" -ForegroundColor Cyan
Write-Host "Stop worker:    Stop-ScheduledTask -TaskName '$TaskName'"
Write-Host "Start worker:   Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "Remove worker:  Unregister-ScheduledTask -TaskName '$TaskName'"
Write-Host "View logs:      Get-Content '$LogFile' -Tail 50"
