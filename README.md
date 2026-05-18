# 📚 Gestor del Portal de Lecturas

Un gestor de contenidos (CMS) local y ligero diseñado para organizar apuntes, resúmenes, mapas conceptuales, audios y guías de estudio de tus lecturas. 

Funciona sin dependencias de bases de datos complejas, utilizando un archivo CSV como origen de datos y scripts interactivos de Node.js para automatizar la gestión de archivos. Ideal para estudiantes, investigadores y lectores empedernidos que buscan un entorno de estudio personal y con privacidad total (funciona 100% offline).

## ✨ Características

- **Automatización mediante CLI:** Un menú interactivo en consola (`gestor.bat`) que automatiza el trabajo pesado de crear, enlazar, editar y eliminar archivos HTML de tus notas.
- **Generación Automática de Plantillas:** Al añadir un libro, crea automáticamente los archivos HTML base para resúmenes, guías, cronologías y ejercicios en sus respectivas carpetas.
- **Interfaz Web Limpia:** Visualiza tus notas en un navegador web con un diseño responsivo, barra lateral de búsqueda en tiempo real y sistema de pestañas.
- **Privacidad Total:** Todos los datos se almacenan y sirven en tu máquina local.

## 🚀 Requisitos Previos

- Node.js instalado en tu sistema.
- **Editor de texto predeterminado:** Por defecto, los scripts intentan abrir `swriter` (LibreOffice Writer) para editar los HTML generados. *Nota: Puedes editar los scripts `.js` para cambiar `swriter` por `code` (VS Code), `notepad` u otro editor de tu preferencia.*

## 🛠️ Instalación y Configuración

1. **Clona este repositorio:**
   ```bash
   git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   cd TU_REPOSITORIO
   ```

2. **Instala las dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **(Opcional) Instala JSON Server globalmente:**
   Si utilizas `json-server` para levantar la API local, asegúrate de tenerlo instalado:
   ```bash
   npm install -g json-server
   ```

## 📖 Uso

Para iniciar el programa en Windows, simplemente haz doble clic en el archivo **`gestor.bat`** o ejecútalo desde tu terminal:

Se desplegará el Menú Principal con las siguientes opciones:
1. **Iniciar Servidor:** Levanta la interfaz web de manera silenciosa en segundo plano.
2. **Añadir un Nuevo Libro:** Asistente paso a paso que crea el registro y los archivos HTML.
3. **Editar el Título de un Libro:** Actualiza el nombre en la base de datos y en los encabezados HTML.
4. **Editar el Contenido (HTML):** Abre los archivos asociados al libro en tu editor.
5. **Eliminar un Libro:** Borra de forma segura el registro y todos sus archivos físicos asociados.
6. **Detener Servidor:** Apaga los procesos en segundo plano.
7. **Ver Libros Registrados:** Lista por consola tu biblioteca actual.
8. **Salir**

## 📁 Estructura del Proyecto

- `gestor.bat` - Punto de entrada principal (CLI de Windows).
- `*.js` - Scripts de Node.js que manejan toda la lógica de gestión (CRUD).
- `index.html`, `style.css` - Interfaz frontend (Portal de Lecturas).
- `libros-ejemplo.csv` - Archivo de muestra para ver la estructura de la base de datos (tu archivo `libros.csv` real será ignorado por Git por privacidad).

*(Las carpetas de contenidos personales como `/resumenes`, `/guias` o `/mapas` se generarán automáticamente en tu equipo local al añadir tu primer libro).*

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Siéntete libre de hacer un *fork* del repositorio, proponer mejoras en la automatización o adaptar la interfaz web.