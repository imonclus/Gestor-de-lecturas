@echo off
title Gestor del Portal de Lecturas

:menu
cls
echo ==================================================
echo         GESTOR DEL PORTAL DE LECTURAS
echo ==================================================
echo.
echo   1. Iniciar Servidor (Abrir la pagina web)
echo   2. Anadir un Nuevo Libro
echo   3. Editar el Titulo de un Libro
echo   4. Editar el Contenido (HTML) de un Libro
echo   5. Eliminar un Libro
echo   6. Detener Servidor (Apagar invisible)
echo   7. Ver Libros Registrados
echo   8. Salir
echo.
echo ==================================================
set /p opcion="Elige una opcion (1-8): "

if "%opcion%"=="1" goto iniciar
if "%opcion%"=="2" goto nuevo
if "%opcion%"=="3" goto titulo
if "%opcion%"=="4" goto contenido
if "%opcion%"=="5" goto eliminar
if "%opcion%"=="6" goto detener
if "%opcion%"=="7" goto listar
if "%opcion%"=="8" goto salir

echo.
echo Opcion invalida. Intentalo de nuevo.
pause
goto menu

:iniciar
echo.
echo Iniciando el servidor de forma invisible en segundo plano...
powershell -WindowStyle Hidden -Command "Start-Process 'iniciar-servidor.bat' -WindowStyle Hidden"
goto menu

:nuevo
cls
node nuevo-libro.js
pause
goto menu

:titulo
cls
node editar-titulo.js
pause
goto menu

:contenido
cls
node editar-contenido.js
pause
goto menu

:eliminar
cls
node eliminar-libro.js
pause
goto menu

:detener
cls
echo Deteniendo el servidor oculto...
taskkill /F /IM node.exe >nul 2>nul
echo Servidor apagado correctamente.
pause
goto menu

:listar
cls
node ver-libros.js
pause
goto menu

:salir
exit