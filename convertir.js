const fs = require('fs');
const csv = require('csv-parser');

const resultados = [];

// Lee el archivo libros.csv
fs.createReadStream('libros.csv')
  .pipe(csv())
  .on('data', (data) => {
    // 'data' es cada fila del CSV como un objeto
    resultados.push(data);
  })
  .on('end', () => {
    // Cuando termina de leer, crea el objeto final
    const dbJson = {
      libros: resultados
    };

    // Convierte el objeto a un string JSON bonito y lo guarda en db.json
    fs.writeFileSync('db.json', JSON.stringify(dbJson, null, 2));

    console.log('¡Éxito! El archivo db.json ha sido actualizado desde libros.csv.');
  });