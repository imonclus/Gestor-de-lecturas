const fs = require('fs');
const { exec } = require('child_process');
const readline = require('readline');

// Configuración del editor predeterminado
// Cambia 'swriter' por 'code' (VS Code), 'notepad' o 'wordpad'
const EDITOR = 'swriter';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("=== ASISTENTE PARA EDITAR CONTENIDO ===\n");

rl.question('Ingresa el ID del libro que quieres editar (ej. libro3): ', (id) => {
    const idLimpio = id.trim();

    // Se comprueban tanto los nombres de archivo nuevos como los antiguos para dar compatibilidad
    const archivos = [
        // Nuevo formato
        `resumenes/${idLimpio}-resumen.html`,
        `guias/${idLimpio}-informe.html`,
        `cronologias/${idLimpio}-tabla_de_datos.html`,
        `ejercicios/${idLimpio}-ejercicios.html`,
        // Formato antiguo (para libros ya existentes)
        `resumenes/${idLimpio}.html`,
        `guias/${idLimpio}.html`,
        `cronologias/${idLimpio}.html`,
        `ejercicios/${idLimpio}.html`
    ];

    let encontrados = 0;

    // Buscamos y abrimos cada archivo que exista para ese libro
    archivos.forEach(archivo => {
        if (fs.existsSync(archivo)) {
            exec(`start ${EDITOR} "${archivo}"`, (error) => {
                if (error) {
                    console.log(`\n  ⚠️ Aviso: No se pudo iniciar '${EDITOR}'. Puedes abrir el archivo manualmente.`);
                }
            });
            encontrados++;
        }
    });

    if (encontrados === 0) {
        console.log(`\n  ⚠️ ERROR: No se encontraron archivos de texto para el ID "${idLimpio}".`);
    } else {
        console.log(`\n¡ÉXITO! Abriendo ${encontrados} archivos en tu editor predeterminado...`);
    }

    rl.close();
});