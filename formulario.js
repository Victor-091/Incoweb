document.addEventListener('DOMContentLoaded', () => {
    // --- 1. LÓGICA DEL MENÚ ---
    const menuToggle = document.getElementById('menuToggle');
    const navbarMenu = document.getElementById('navbarMenu');

    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navbarMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!navbarMenu.contains(e.target) && navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
            }
        });
    }

    // --- 2. LÓGICA DEL FORMULARIO DE CONTACTO ---
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    const button = document.getElementById("submit-btn");

    if (form) {
        form.addEventListener("submit", async function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            event.preventDefault();
            form.classList.add('was-validated');

            const data = new FormData(event.target);
            button.disabled = true;
            button.innerText = "Enviando...";

            fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "<div class='alert alert-success'>¡Mensaje enviado con éxito!</div>";
                    form.reset();
                    form.classList.remove('was-validated');
                } else {
                    status.innerHTML = "<div class='alert alert-danger'>Error al enviar. Intenta de nuevo.</div>";
                }
            }).catch(error => {
                status.innerHTML = "<div class='alert alert-danger'>Error de conexión.</div>";
            }).finally(() => {
                button.disabled = false;
                button.innerText = "Enviar Mensaje";
            });
        });
    }

    // --- 3. LÓGICA DE LA GALERÍA (REFACTORIZADA) ---
    const modalGaleria = document.getElementById('modalGaleria');
    const galeriaContenedor = document.getElementById('galeria-dinamica');
    const modalTitulo = document.getElementById('modalTitulo');

    if (modalGaleria) {
        modalGaleria.addEventListener('show.bs.modal', function(event) {
            const card = event.relatedTarget; 
            if (!card) return;

            // Corrección: Limpiar el contenedor DE INMEDIATO para sacar fotos anteriores
            if (galeriaContenedor) {
                galeriaContenedor.innerHTML = '';
            }

            const titulo = card.getAttribute('data-titulo') || "Galería de Fotos";
            const fotosString = card.getAttribute('data-fotos');
            
            // Separar por comas y filtrar elementos vacíos o con espacios extras
            const fotosArray = fotosString 
                ? fotosString.split(',').map(foto => foto.trim()).filter(foto => foto !== '') 
                : [];

            if (modalTitulo) modalTitulo.textContent = titulo;

            if (galeriaContenedor) {
                if (fotosArray.length === 0) {
                    galeriaContenedor.innerHTML = `<div class='text-white text-center p-4'>No hay fotos disponibles para este proyecto.</div>`;
                    return;
                }

                fotosArray.forEach((nombreFoto, index) => {
                    const divItem = document.createElement('div');
                    divItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
                    divItem.innerHTML = `
                        <img src="${nombreFoto}" 
                             class="d-block w-100 rounded" 
                             style="max-height: 75vh; object-fit: contain; background: #000;" 
                             alt="Foto de ${titulo}">
                    `;
                    galeriaContenedor.appendChild(divItem);
                });
            }
        });
    }
});