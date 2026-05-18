document.addEventListener('DOMContentLoaded', function() {
    const bookList = document.getElementById('book-list');
    const mainContent = document.getElementById('main-content');
    const welcomeMessage = document.getElementById('welcome-message');
    const API_URL = 'http://localhost:3000/libros';
    const searchBar = document.getElementById('search-bar');

    window.bookData = {};

    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error('No se pudo conectar con el servidor.');
            return response.json();
        })
        .then(libros => {
            // Ordenar los libros alfabéticamente por su título antes de mostrarlos
            libros.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es', { sensitivity: 'base' }));

            libros.forEach(libro => {
                window.bookData[libro.id] = libro;
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = libro.titulo;
                link.dataset.bookId = libro.id;
                listItem.appendChild(link);
                bookList.appendChild(listItem);
            });
        })
        .catch(error => {
            if (bookList) bookList.innerHTML = `<li><a href="#">${error.message}</a></li>`;
            console.error('Error al cargar la lista de libros:', error);
        });

    bookList.addEventListener('click', function(event) {
        event.preventDefault();
        const link = event.target.closest('a');
        if (link && link.dataset.bookId) {
            document.querySelectorAll('#sidebar a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            loadBookContent(link.dataset.bookId);
        }
    });

    // --- FUNCIÓN DE BÚSQUEDA EN TIEMPO REAL ---
    if (searchBar) {
        const noResultsMsg = document.getElementById('no-results-msg');
        searchBar.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();
            const listItems = bookList.querySelectorAll('li');
            let hasResults = false;

            listItems.forEach(item => {
                if (item.textContent.toLowerCase().includes(term)) {
                    item.style.display = '';
                    hasResults = true; // Encontramos al menos uno
                } else {
                    item.style.display = 'none';
                }
            });

            // Mostrar u ocultar el mensaje de "no hay resultados"
            if (noResultsMsg) {
                noResultsMsg.style.display = hasResults ? 'none' : 'block';
            }
        });
    }

    // --- FUNCIÓN DE CARGA DE CONTENIDO UNIFICADA Y FINAL ---
    function loadBookContent(bookId) {
        const libro = window.bookData[bookId];
        if (!libro) {
            mainContent.innerHTML = `<div class="book-content"><h2>Error</h2><p>No se encontraron datos para este libro.</p></div>`;
            return;
        }

        welcomeMessage.style.display = 'none';

        // 1. Extraer y preparar el Audio para que siempre esté arriba
        let audioHtml = '';
        const rutaAudio = libro.conversacion ? libro.conversacion.trim() : '';
        if (rutaAudio && rutaAudio.match(/\.(wav|mp3|ogg|wma|m4a)$/i)) {
            audioHtml = `
                <div class="audio-container" style="margin-bottom: 25px; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-left: 5px solid #28a745;">
                    <h3 style="margin-bottom: 15px; color: #343a40; font-size: 1.1rem;"><i class="fas fa-headphones"></i> Escuchar Conversación</h3>
                    <audio controls src="${rutaAudio}" style="width: 100%;">Tu navegador no soporta el audio.</audio>
                </div>
            `;
        }

        // 2. Creamos el esqueleto con el sistema de pestañas
        mainContent.innerHTML = `
            <div class="book-content">
                <h2>${libro.titulo}</h2>
                
                ${audioHtml}

                <div class="tabs-container">
                    <div class="tab-buttons">
                        <button class="tab-btn active" data-tab="resumen"><i class="fas fa-file-alt"></i> Resumen</button>
                        <button class="tab-btn" data-tab="mapaConceptual"><i class="fas fa-project-diagram"></i> Mapa</button>
                    <button class="tab-btn" data-tab="guiaEstudio"><i class="fas fa-book-open"></i> Informe</button>
                    <button class="tab-btn" data-tab="cronologia"><i class="fas fa-timeline"></i> Tabla de datos</button>
                    <button class="tab-btn" data-tab="ejercicios"><i class="fas fa-tasks"></i> Ejercicios</button>
                        <button class="tab-btn" data-tab="foro"><i class="fas fa-users"></i> Foro</button>
                    </div>
                    <div class="tab-panels">
                        <div class="tab-panel active" id="tab-resumen" data-content-key="resumen"></div>
                        <div class="tab-panel" id="tab-mapaConceptual" data-content-key="mapaConceptual"></div>
                        <div class="tab-panel" id="tab-guiaEstudio" data-content-key="guiaEstudio"></div>
                        <div class="tab-panel" id="tab-cronologia" data-content-key="cronologia"></div>
                        <div class="tab-panel" id="tab-ejercicios" data-content-key="ejercicios"></div>
                        <div class="tab-panel" id="tab-foro" data-content-key="foro"></div>
                    </div>
                </div>
            </div>`;

        // 3. Lógica inteligente para rellenar cada placeholder
        Object.keys(libro).forEach(key => {
            if (key === 'conversacion') return; // Ignoramos el audio porque ya lo pusimos arriba

            const placeholder = mainContent.querySelector(`[data-content-key="${key}"]`);
            if (!placeholder) return; // Si no hay placeholder para esta clave, la ignoramos

            const value = libro[key];

            if (typeof value === 'string') {
                if (value.endsWith('.html')) {
                    // Quitamos el onLoad problemático, el CSS (height: 75vh) lo hará enorme y legible
                    // Inyectamos padding y fuente por defecto directamente al cargar el iframe
                    placeholder.innerHTML = `<iframe src="${value}" class="auto-iframe" onload="if(this.contentWindow.document.body) { this.contentWindow.document.body.style.padding = '30px'; this.contentWindow.document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif'; }"></iframe>`;
                } else if (value.endsWith('.png') || value.endsWith('.jpg') || value.endsWith('.jpeg') || value.endsWith('.gif')) {
                    placeholder.innerHTML = `<img src="${value}" alt="${key}" style="width: 100%; height: auto; border-radius: 5px;">`;
                } else {
                    // Si no es un tipo de archivo conocido, lo tratamos como texto plano
                    placeholder.innerHTML = `<p>${value}</p>`;
                }
            }
        });

        // 4. Activar el funcionamiento de los botones de pestañas
        const tabButtons = mainContent.querySelectorAll('.tab-btn');
        const tabPanels = mainContent.querySelectorAll('.tab-panel');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                mainContent.querySelector('#tab-' + btn.dataset.tab).classList.add('active');
            });
        });
    }
});