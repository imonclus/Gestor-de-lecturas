const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("=== ASISTENTE PARA EDITAR TÍTULO ===\n");

rl.question('1. Ingresa el ID del libro que quieres editar (ej. libro4): ', (id) => {
    const idLimpio = id.trim();

    if (!fs.existsSync('libros.csv')) {
        console.log("  ⚠️ ERROR: No se encontró el archivo libros.csv.");
        rl.close();
        return;
    }

    const contenidoCsv = fs.readFileSync('libros.csv', 'utf-8');
    const lineas = contenidoCsv.split('\n');
    
    let indiceLinea = -1;
    let tituloAntiguo = "";

    // Buscamos en qué línea está el ID
    for (let i = 0; i < lineas.length; i++) {
        const columnas = lineas[i].split(',');
        if (columnas[0].trim() === idLimpio) {
            indiceLinea = i;
            tituloAntiguo = columnas[1]; // Guardamos el título actual
            break;
        }
    }

    if (indiceLinea === -1) {
        console.log(`  ⚠️ ERROR: No se encontró ningún libro con el ID "${idLimpio}".`);
        rl.close();
        return;
    }

    console.log(`\nLibro encontrado: "${tituloAntiguo}"`);
    
    rl.question('2. Ingresa el NUEVO título corregido: ', (nuevoTitulo) => {
        
        // 1. Actualizar el título en el CSV
        const columnas = lineas[indiceLinea].split(',');
        columnas[1] = nuevoTitulo;
        lineas[indiceLinea] = columnas.join(',');
        fs.writeFileSync('libros.csv', lineas.join('\n'));

        // 2. Actualizar el título dentro de los archivos HTML existentes (compatible con nombres nuevos y antiguos)
        const archivosHtml = [
            `resumenes/${idLimpio}-resumen.html`,
            `guias/${idLimpio}-informe.html`,
            `cronologias/${idLimpio}-tabla_de_datos.html`,
            `ejercicios/${idLimpio}-ejercicios.html`,
            `resumenes/${idLimpio}.html`,
            `guias/${idLimpio}.html`,
            `cronologias/${idLimpio}.html`,
            `ejercicios/${idLimpio}.html`
        ];

        archivosHtml.forEach(rutaArchivo => {
            if (fs.existsSync(rutaArchivo)) {
                let contenidoHtml = fs.readFileSync(rutaArchivo, 'utf-8');
                // Reemplazamos el título antiguo por el nuevo respetando las etiquetas h2
                contenidoHtml = contenidoHtml.replace(`<h2>${tituloAntiguo}</h2>`, `<h2>${nuevoTitulo}</h2>`);
                fs.writeFileSync(rutaArchivo, contenidoHtml);
            }
        });

        console.log(`\n¡ÉXITO! El título se ha actualizado en el CSV y en los archivos HTML.`);
        rl.close();
    });
});