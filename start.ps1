# Smart Cache Management System - Startup Script

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Starting Smart Cache Management System..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Start backend server
Write-Host "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Yellow
$BackendProcess = Start-Process cmd -ArgumentList "/c python server.py" -PassThru -NoNewWindow

# 2. Start frontend dev server
Write-Host "[2/2] Starting Vite Frontend..." -ForegroundColor Yellow
$FrontendProcess = Start-Process cmd -ArgumentList "/c npm run dev" -WorkingDirectory "dashboard" -PassThru -NoNewWindow

Write-Host ""
Write-Host "Both services have been started successfully!" -ForegroundColor Green
Write-Host "- Backend: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "- Frontend dev server is launching (usually at http://localhost:5173)" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to terminate both servers." -ForegroundColor Gray

# Monitor and handle Ctrl+C to stop both processes cleanly
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    Write-Host "`nStopping servers..." -ForegroundColor Red
    if ($BackendProcess) {
        Stop-Process -Id $BackendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    if ($FrontendProcess) {
        Stop-Process -Id $FrontendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Servers stopped." -ForegroundColor Red
}
