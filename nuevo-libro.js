const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

// Configuración del editor predeterminado
// Cambia 'swriter' por 'code' (VS Code), 'notepad' o 'wordpad'
const EDITOR = 'swriter';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("=== ASISTENTE PARA AÑADIR UN NUEVO LIBRO ===\n");

function generarID() {
    let nuevoId = 'libro1'; // Por defecto, si el archivo está vacío
    
    if (fs.existsSync('libros.csv')) {
        const contenidoCsv = fs.readFileSync('libros.csv', 'utf-8');
        const lineas = contenidoCsv.split('\n').filter(linea => linea.trim() !== '');
        let maxId = 0;
        
        // Buscamos el número más alto entre los libros existentes
        for (let i = 1; i < lineas.length; i++) {
            const idActual = lineas[i].split(',')[0].trim();
            const match = idActual.match(/^libro(\d+)$/i); // Busca el patrón "libroX"
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > maxId) maxId = num;
            }
        }
        nuevoId = `libro${maxId + 1}`;
    }

    console.log(`1. ID asignado automáticamente: ${nuevoId}\n`);
    preguntarTitulo(nuevoId); // Avanza directamente al paso 2
}

function preguntarTitulo(id) {
    rl.question('2. Ingresa el Título completo del libro (o deja en blanco para cancelar): ', (titulo) => {
        titulo = titulo.trim();
        
        if (titulo === '' || titulo.toLowerCase() === 'cancelar') {
            console.log('\n❌ Operación cancelada. No se ha creado ningún archivo ni registro.');
            rl.close();
            return;
        }

        console.log(`\n--- RESUMEN DEL NUEVO LIBRO ---`);
        console.log(`ID asignado: ${id}`);
        console.log(`Título:      ${titulo}`);

        rl.question('\n3. ¿Son correctos estos datos y deseas crear el libro? (s/n): ', (respuesta) => {
            if (respuesta.trim().toLowerCase() !== 's') {
                console.log('\n❌ Operación cancelada. No se ha creado ningún archivo ni registro.');
                rl.close();
                return;
            }

            // 1. Definir las rutas estándar con nombres de archivo más descriptivos
            const resumen = `resumenes/${id}-resumen.html`;
            const mapa = `mapas/${id}.png`;
            const guia = `guias/${id}-informe.html`;
            const cronologia = `cronologias/${id}-tabla_de_datos.html`;
            const ejercicios = `ejercicios/${id}-ejercicios.html`;
            const conversacion = `audios/conversacion_${id}.mp3`;
        const foro = `Foro...`;

        // 2. Asegurar que las carpetas existan
        const carpetas = ['resumenes', 'mapas', 'guias', 'cronologias', 'audios', 'ejercicios'];
        carpetas.forEach(carpeta => {
            if (!fs.existsSync(carpeta)) {
                fs.mkdirSync(carpeta);
            }
        });

        // 3. Crear archivos HTML con una plantilla básica
        const plantillaHTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 30px;
            color: #333;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <h2>${titulo}</h2>
    <p>Escribe aquí el contenido...</p>
</body>
</html>`;
        
        fs.writeFileSync(resumen, plantillaHTML);
        fs.writeFileSync(guia, plantillaHTML);
        fs.writeFileSync(cronologia, plantillaHTML);
        fs.writeFileSync(ejercicios, plantillaHTML);

        // 4. Añadir la nueva fila al archivo CSV
        const nuevaFila = `\n${id},${titulo},${resumen},${mapa},${guia},${cronologia},${ejercicios},${conversacion},${foro}`;
        fs.appendFileSync('libros.csv', nuevaFila);

        console.log(`\n¡ÉXITO! Se ha añadido "${titulo}" al archivo libros.csv.`);
        console.log(`Se han creado automáticamente los archivos HTML en sus respectivas carpetas.`);
        
        // Abrir automáticamente los archivos HTML recién creados
        console.log(`\nAbriendo los archivos en tu editor ('${EDITOR}')...`);
        console.log(`(Si da error, puedes cambiar la variable EDITOR al inicio de este script)`);
        
        const abrirArchivo = (ruta) => exec(`start ${EDITOR} "${ruta}"`);
        
        abrirArchivo(resumen);
        abrirArchivo(guia);
        abrirArchivo(cronologia);
        abrirArchivo(ejercicios);

        console.log(`Solo te falta guardar tu imagen en 'mapas/${id}.png' y tu audio en 'audios/conversacion_${id}.mp3'.`);
        
        rl.close();
        });
    });
}

// Iniciar el flujo
generarID();