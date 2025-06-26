// Espera a que todo el contenido del DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Seleccionar los elementos importantes del DOM
    const bookLinks = document.querySelectorAll('#sidebar a');
    const bookContents = document.querySelectorAll('.book-content');
    const welcomeMessage = document.getElementById('welcome-message');

    // 2. Añadir un evento de 'click' a cada enlace de libro
    bookLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Prevenir el comportamiento por defecto del enlace (que es recargar la página)
            event.preventDefault();

            // --- Lógica para mostrar/ocultar contenido ---

            // Obtener el ID del libro del atributo 'data-book' (ej: "libro1")
            const bookId = this.dataset.book;

            // Ocultar el mensaje de bienvenida
            welcomeMessage.style.display = 'none';

            // Ocultar TODOS los contenidos de los libros
            bookContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Mostrar SOLAMENTE el contenido del libro seleccionado
            const targetContent = document.getElementById(bookId + '-content');
            if (targetContent) {
                targetContent.style.display = 'block';
            }

            // --- Lógica para marcar el enlace activo ---

            // Quitar la clase 'active' de TODOS los enlaces
            bookLinks.forEach(l => l.classList.remove('active'));
            
            // Añadir la clase 'active' SÓLO al enlace que se ha clicado
            this.classList.add('active');
        });
    });
});