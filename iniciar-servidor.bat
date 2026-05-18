@echo off
echo Verificando si json-server esta instalado...

where json-server >nul 2>nul
if %errorlevel% neq 0 (
    echo json-server no encontrado. Procediendo a instalarlo automaticamente...
    npm install -g json-server
    if %errorlevel% neq 0 (
        echo ERROR: No se pudo instalar json-server. Asegurate de tener Node.js instalado.
            REM Se quita el "pause" para evitar que el proceso oculto se quede colgado indefinidamente
        exit /b
    )
)

REM Verifica si existe libros.csv (útil la primera vez que un usuario clona el repositorio)
if not exist libros.csv (
    echo No se encontro libros.csv. Creando uno desde libros-ejemplo.csv...
    copy libros-ejemplo.csv libros.csv >nul
)

echo Actualizando la base de datos (db.json) desde libros.csv...
node convertir.js

echo Iniciando el servidor de lecturas...
echo Abriendo el navegador...
start http://localhost:3000
json-server --watch db.json --static . --port 3000