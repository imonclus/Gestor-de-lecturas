const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("=== ASISTENTE PARA ELIMINAR UN LIBRO ===\n");

rl.question('1. Ingresa el ID del libro que quieres eliminar (ej. libro4): ', (id) => {
    const idLimpio = id.trim();

    if (!fs.existsSync('libros.csv')) {
        console.log("  ⚠️ ERROR: No se encontró el archivo libros.csv.");
        rl.close();
        return;
    }

    const contenidoCsv = fs.readFileSync('libros.csv', 'utf-8');
    const lineas = contenidoCsv.split('\n');
    
    let indiceLinea = -1;
    let libroEliminar = null;

    // Buscamos en qué línea está el ID
    for (let i = 0; i < lineas.length; i++) {
        const columnas = lineas[i].split(',');
        if (columnas[0].trim() === idLimpio) {
            indiceLinea = i;
            libroEliminar = columnas; // Guardamos todos los datos de esa fila
            break;
        }
    }

    if (indiceLinea === -1) {
        console.log(`  ⚠️ ERROR: No se encontró ningún libro con el ID "${idLimpio}".`);
        rl.close();
        return;
    }

    const titulo = libroEliminar[1];
    
    rl.question(`¿Estás SEGURO de que quieres eliminar "${titulo}" y borrar TODOS sus archivos? (s/n): `, (respuesta) => {
        if (respuesta.toLowerCase() === 's') {
            // 1. Eliminar la línea del CSV y guardar
            lineas.splice(indiceLinea, 1);
            fs.writeFileSync('libros.csv', lineas.filter(linea => linea.trim() !== '').join('\n'));

            // 2. Borrar los archivos físicos leyendo las rutas del CSV (columnas 2 a 7)
            let archivosBorrados = 0;
            for (let j = 2; j <= 7; j++) {
                const rutaArchivo = libroEliminar[j] ? libroEliminar[j].trim() : '';
                if (rutaArchivo && fs.existsSync(rutaArchivo)) {
                    fs.unlinkSync(rutaArchivo); // Comando para borrar un archivo físico
                    archivosBorrados++;
                }
            }

            console.log(`\n¡ÉXITO! El libro "${titulo}" ha sido eliminado del CSV.`);
            console.log(`Se borraron permanentemente ${archivosBorrados} archivos de tu disco.`);
        } else {
            console.log("\nOperación cancelada. El libro está a salvo.");
        }
        rl.close();
    });
});