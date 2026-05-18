const fs = require('fs');

console.log("=== LIBROS REGISTRADOS ===\n");

if (!fs.existsSync('libros.csv')) {
    console.log("⚠️ No se encontró el archivo libros.csv. Aún no hay libros registrados.");
} else {
    const contenido = fs.readFileSync('libros.csv', 'utf-8');
    const lineas = contenido.split('\n').filter(linea => linea.trim() !== '');
    
    if (lineas.length <= 1) {
        console.log("No hay libros registrados actualmente.");
    } else {
        const libros = [];

        // Iteramos desde el índice 1 para saltarnos la cabecera del CSV
        for (let i = 1; i < lineas.length; i++) {
            const columnas = lineas[i].split(',');
            const id = columnas[0].trim();
            const titulo = columnas[1] ? columnas[1].trim() : "Sin título";
            
            // Extraemos las rutas del mapa (columna 4, índice 3) y del audio (columna 8, índice 7)
            const rutaMapa = columnas[3] ? columnas[3].trim() : '';
            const rutaAudio = columnas[7] ? columnas[7].trim() : '';
            
            let advertencias = [];
            if (!rutaMapa || !fs.existsSync(rutaMapa)) advertencias.push("Falta Mapa");
            if (!rutaAudio || !fs.existsSync(rutaAudio)) advertencias.push("Falta Audio");
            
            const alertas = advertencias.length > 0 ? `   [⚠️ ${advertencias.join(' | ')}]` : '';
            
            libros.push({ id, titulo, alertas });
        }

        // Ordenamos la lista alfabéticamente por el título (ignorando mayúsculas y tildes)
        libros.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es', { sensitivity: 'base' }));

        // Mostramos la lista ya ordenada
        libros.forEach(libro => console.log(`[${libro.id}] - ${libro.titulo}${libro.alertas}`));
        console.log(`\nTotal de libros registrados: ${libros.length}`);
    }
}
console.log(""); // Espacio final por limpieza