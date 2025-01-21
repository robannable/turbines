@echo off
echo Wind Turbine Propeller Designer Setup
echo ====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    echo Recommended version: 16.0 or higher
    echo.
    echo Press any key to open the Node.js download page...
    pause >nul
    start https://nodejs.org/
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node -v') do (
    set NODE_MAJOR=%%a
    set NODE_MINOR=%%b
)
set NODE_MAJOR=%NODE_MAJOR:~1%

if %NODE_MAJOR% LSS 16 (
    echo Your Node.js version is too old. Please install version 16.0 or higher.
    echo Current version: %NODE_MAJOR%.%NODE_MINOR%
    exit /b 1
)

echo Node.js is properly installed (version %NODE_MAJOR%.%NODE_MINOR%)
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing dependencies
    exit /b 1
)
echo Dependencies installed successfully
echo.

REM Start the development server
echo Starting the development server...
echo The application will open in your default browser...
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.
timeout /t 3 >nul

REM Start the server and open the browser
start http://localhost:5173
npm run dev

exit /b 0 