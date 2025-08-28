/**
 * ImageFilterSystem - Sistema de filtrado de imágenes dinámico
 * Maneja la carga de imágenes basada en los filtros seleccionados
 */

class ImageFilterSystem {
    constructor() {
        this.currentFilters = {
            tipo: 'all',
            superficie: '',
            precio: ''
        };
        
        this.imageStructure = {
            '1d': {
                'superficie_40_60': {
                    'precio_2000_3000': 2,
                    'precio_3000_4000': 2,
                    'precio_4000_5000': 2,
                    'precio_5000_plus': 1
                },
                'superficie_60_80': {
                    'precio_2000_3000': 1,
                    'precio_3000_4000': 2,
                    'precio_4000_5000': 2,
                    'precio_5000_plus': 2
                },
                'superficie_80_100': {
                    'precio_3000_4000': 1,
                    'precio_4000_5000': 2,
                    'precio_5000_plus': 2
                },
                'superficie_100_plus': {
                    'precio_4000_5000': 1,
                    'precio_5000_plus': 2
                }
            },
            '2d': {
                'superficie_40_60': {
                    'precio_2000_3000': 1,
                    'precio_3000_4000': 2,
                    'precio_4000_5000': 2,
                    'precio_5000_plus': 1
                },
                'superficie_60_80': {
                    'precio_2000_3000': 1,
                    'precio_3000_4000': 2,
                    'precio_4000_5000': 2,
                    'precio_5000_plus': 2
                },
                'superficie_80_100': {
                    'precio_2000_3000': 1,
                    'precio_3000_4000': 2,
                    'precio_4000_5000': 2,
                    'precio_5000_plus': 2
                },
                'superficie_100_plus': {
                    'precio_3000_4000': 1,
                    'precio_4000_5000': 2,
                    'precio_5000_plus': 2
                }
            },
            '3d': {
                'superficie_40_60': {
                    'precio_3000_4000': 1,
                    'precio_4000_5000': 2,
                    'precio_5000_plus': 1
                },
                'superficie_60_80': {
                    'precio_3000_4000': 1,
                    'precio_4000_5000': 2,
                    'precio_5000_plus': 2
                },
                'superficie_80_100': {
                    'precio_3000_4000': 1,
                    'precio_4000_5000': 2,
                    'precio_5000_plus': 2
                },
                'superficie_100_plus': {
                    'precio_4000_5000': 2,
                    'precio_5000_plus': 2
                }
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('🖼️ Initializing ImageFilterSystem...');
        this.setupEventListeners();
        console.log('✅ ImageFilterSystem initialized');
    }
    
    setupEventListeners() {
        // Event listeners para botones de tipo de dormitorio
        const typeButtons = document.querySelectorAll('.type-btn');
        typeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tipo = e.target.getAttribute('data-type');
                this.updateTipoFilter(tipo);
            });
        });
        
        // Event listeners para filtros de superficie y precio
        const surfaceFilter = document.getElementById('surfaceFilter');
        const priceFilter = document.getElementById('priceFilter');
        
        if (surfaceFilter) {
            surfaceFilter.addEventListener('change', (e) => {
                this.currentFilters.superficie = e.target.value;
                this.updateImages();
            });
        }
        
        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                this.currentFilters.precio = e.target.value;
                this.updateImages();
            });
        }
        
        // Event listener para botón de búsqueda
        const searchButton = document.getElementById('searchButton');
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.applyFilters();
            });
        }
        
        // Event listener para botón de limpiar filtros
        const clearButton = document.getElementById('clearFilters');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearFilters();
            });
        }
        
        // Event listeners para botones de apartamentos (delegación de eventos)
        document.addEventListener('click', (e) => {
            console.log('🔍 Click detectado en:', e.target);
            console.log('🔍 Clases del elemento:', e.target.classList);
            
            if (e.target.classList.contains('watchVideoBtn')) {
                console.log('🎬 Botón Ver Video clickeado');
                this.handleWatchVideo(e.target);
            } else if (e.target.classList.contains('contactModelBtn')) {
                console.log('📞 Botón Solicitar Información clickeado');
                this.handleContactModal(e.target);
            }
        });
    }
    
    updateTipoFilter(tipo) {
        console.log(`🏠 Tipo de dormitorio cambiado a: ${tipo}`);
        
        // Actualizar UI de botones
        const typeButtons = document.querySelectorAll('.type-btn');
        typeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-type') === tipo) {
                btn.classList.add('active');
            }
        });
        
        this.currentFilters.tipo = tipo;
        console.log('🔍 Filtros actuales:', this.currentFilters);
        this.updateImages();
    }
    
    getAvailableImages() {
        const { tipo, superficie, precio } = this.currentFilters;
        const availableImages = [];
        
        console.log('🔍 getAvailableImages - Filtros:', { tipo, superficie, precio });
        
        // Si no hay filtros específicos, mostrar todas las imágenes
        if (tipo === 'all' && !superficie && !precio) {
            console.log('📊 Mostrando todas las imágenes');
            return this.getAllImages();
        }
        
        // Filtrar por tipo de dormitorio
        const tiposToCheck = tipo === 'all' ? Object.keys(this.imageStructure) : [tipo];
        console.log('🔍 Tipos a verificar:', tiposToCheck);
        
        tiposToCheck.forEach(tipoKey => {
            console.log('🔍 Verificando tipo:', tipoKey);
            if (!this.imageStructure[tipoKey]) {
                console.log('❌ Tipo no encontrado en imageStructure:', tipoKey);
                return;
            }
            
            const superficies = this.imageStructure[tipoKey];
            const superficiesToCheck = superficie ? [this.mapSuperficieToKey(superficie)] : Object.keys(superficies);
            console.log('🔍 Superficies a verificar:', superficiesToCheck);
            
            superficiesToCheck.forEach(superficieKey => {
                if (!superficies[superficieKey]) return;
                
                const precios = superficies[superficieKey];
                const preciosToCheck = precio ? [this.mapPrecioToKey(precio)] : Object.keys(precios);
                
                preciosToCheck.forEach(precioKey => {
                    if (!precios[precioKey]) return;
                    
                    const cantidadImagenes = precios[precioKey];
                    for (let i = 1; i <= cantidadImagenes; i++) {
                        availableImages.push({
                            path: `video/imagenes/${tipoKey}/${superficieKey}/${precioKey}/imagen_${i}.svg`,
                            tipo: tipoKey,
                            superficie: superficieKey,
                            precio: precioKey,
                            index: i
                        });
                    }
                });
            });
        });
        
        console.log('📊 Imágenes encontradas:', availableImages.length);
        return availableImages;
    }
    
    getAllImages() {
        const allImages = [];
        
        Object.entries(this.imageStructure).forEach(([tipo, superficies]) => {
            Object.entries(superficies).forEach(([superficie, precios]) => {
                Object.entries(precios).forEach(([precio, cantidad]) => {
                    for (let i = 1; i <= cantidad; i++) {
                        allImages.push({
                            path: `video/imagenes/${tipo}/${superficie}/${precio}/imagen_${i}.svg`,
                            tipo,
                            superficie,
                            precio,
                            index: i
                        });
                    }
                });
            });
        });
        
        return allImages;
    }
    
    mapSuperficieToKey(superficie) {
        const mapping = {
            '40-60': 'superficie_40_60',
            '60-80': 'superficie_60_80',
            '80-100': 'superficie_80_100',
            '100+': 'superficie_100_plus'
        };
        return mapping[superficie] || superficie;
    }
    
    mapPrecioToKey(precio) {
        const mapping = {
            '2000-3000': 'precio_2000_3000',
            '3000-4000': 'precio_3000_4000',
            '4000-5000': 'precio_4000_5000',
            '5000+': 'precio_5000_plus'
        };
        return mapping[precio] || precio;
    }
    
    updateImages() {
        console.log('🔄 Actualizando imágenes con filtros:', this.currentFilters);
        
        const availableImages = this.getAvailableImages();
        console.log(`📊 Imágenes disponibles: ${availableImages.length}`);
        
        // Actualizar la lista de apartamentos
        this.updateApartmentList(availableImages);
    }
    
    updateApartmentList(images) {
        const apartmentList = document.getElementById('apartmentList');
        if (!apartmentList) {
            console.log('❌ No se encontró el elemento apartmentList');
            return;
        }
        
        console.log('🔄 Actualizando lista de apartamentos con', images.length, 'imágenes');
        
        // Limpiar lista actual
        apartmentList.innerHTML = '';
        
        if (images.length === 0) {
            apartmentList.innerHTML = `
                <div class="no-results">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"></circle>
                        <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <h3>No se encontraron apartamentos</h3>
                    <p>Intenta ajustar los filtros de búsqueda</p>
                </div>
            `;
            return;
        }
        
        // Crear tarjetas de apartamentos
        console.log('🏗️ Creando', images.length, 'tarjetas de apartamentos...');
        images.forEach((image, index) => {
            const apartmentCard = this.createApartmentCard(image, index);
            apartmentList.appendChild(apartmentCard);
        });
        console.log('✅ Tarjetas creadas y agregadas al DOM');
        
        // Mostrar lista
        console.log('👁️ Mostrando lista de apartamentos...');
        apartmentList.style.display = 'grid';
        apartmentList.style.opacity = '1';
        apartmentList.style.transform = 'translateY(0)';
        apartmentList.style.animation = 'fadeInUp 0.5s ease';
        console.log('✅ Lista de apartamentos visible');
        
        // Ocultar mensaje inicial
        const initialMessage = document.getElementById('initialMessage');
        if (initialMessage) {
            initialMessage.style.display = 'none';
        }
    }
    
    createApartmentCard(image, index) {
        const card = document.createElement('div');
        card.className = 'apartment-card';
        card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s`;
        
        const tipoText = this.getTipoText(image.tipo);
        const superficieText = this.getSuperficieText(image.superficie);
        const precioText = this.getPrecioText(image.precio);
        
        card.innerHTML = `
            <div class="apartment-image">
                <img src="${image.path}" alt="${tipoText}" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiAxPC90ZXh0Pjwvc3ZnPg=='">
            </div>
            <div class="apartment-info">
                <h3>${tipoText}</h3>
                <p><strong>Superficie:</strong> ${superficieText}</p>
                <p><strong>Precio:</strong> ${precioText}</p>
                <div class="apartment-actions">
                    <button class="btn-secondary watchVideoBtn" data-apartment="${tipoText}" data-superficie="${superficieText}" data-precio="${precioText}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5v14l11-7z" fill="currentColor"/>
                        </svg>
                        Recorrer
                    </button>
                    <button class="btn-primary contactModelBtn" data-apartment="${tipoText}" data-superficie="${superficieText}" data-precio="${precioText}">
                        Solicitar Información
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    getTipoText(tipo) {
        const mapping = {
            '1d': '1 Dormitorio',
            '2d': '2 Dormitorios',
            '3d': '3 Dormitorios'
        };
        return mapping[tipo] || tipo;
    }
    
    getSuperficieText(superficie) {
        const mapping = {
            'superficie_40_60': '40-60 m²',
            'superficie_60_80': '60-80 m²',
            'superficie_80_100': '80-100 m²',
            'superficie_100_plus': '100+ m²'
        };
        return mapping[superficie] || superficie;
    }
    
    getPrecioText(precio) {
        const mapping = {
            'precio_2000_3000': '$2.000-3.000 UF',
            'precio_3000_4000': '$3.000-4.000 UF',
            'precio_4000_5000': '$4.000-5.000 UF',
            'precio_5000_plus': '$5.000+ UF'
        };
        return mapping[precio] || precio;
    }
    
    applyFilters() {
        console.log('🔍 Aplicando filtros...');
        this.updateImages();
    }
    
    clearFilters() {
        console.log('🧹 Limpiando filtros...');
        
        // Resetear filtros
        this.currentFilters = {
            tipo: 'all',
            superficie: '',
            precio: ''
        };
        
        // Resetear UI
        const typeButtons = document.querySelectorAll('.type-btn');
        typeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-type') === 'all') {
                btn.classList.add('active');
            }
        });
        
        const surfaceFilter = document.getElementById('surfaceFilter');
        const priceFilter = document.getElementById('priceFilter');
        
        if (surfaceFilter) surfaceFilter.value = '';
        if (priceFilter) priceFilter.value = '';
        
        // Ocultar lista y mostrar mensaje inicial
        const apartmentList = document.getElementById('apartmentList');
        if (apartmentList) {
            apartmentList.style.display = 'none';
            apartmentList.style.opacity = '0';
            apartmentList.style.transform = 'translateY(30px)';
        }
        
        const initialMessage = document.getElementById('initialMessage');
        if (initialMessage) {
            initialMessage.style.display = 'block';
        }
        
        console.log('✅ Filtros limpiados');
    }
    
    // Métodos públicos para control externo
    getCurrentFilters() {
        return { ...this.currentFilters };
    }
    
    setFilters(filters) {
        this.currentFilters = { ...this.currentFilters, ...filters };
        this.updateImages();
    }
    
    getAvailableImageCount() {
        return this.getAvailableImages().length;
    }
    
    handleWatchVideo(button) {
        console.log('🎬 handleWatchVideo llamado con:', button);
        
        const apartment = button.getAttribute('data-apartment');
        const superficie = button.getAttribute('data-superficie');
        const precio = button.getAttribute('data-precio');
        
        console.log('🎬 Activando modo recorrido para:', { apartment, superficie, precio });
        
        // Activar modo recorrido
        this.activateRecorridoMode(apartment, superficie, precio);
    }
    
    handleContactModal(button) {
        console.log('📞 handleContactModal llamado con:', button);
        
        const apartment = button.getAttribute('data-apartment');
        const superficie = button.getAttribute('data-superficie');
        const precio = button.getAttribute('data-precio');
        
        console.log('📞 Abriendo modal de contacto para:', { apartment, superficie, precio });
        
        // Crear modal de contacto
        this.createContactModal(apartment, superficie, precio);
    }
    
    createVideoModal(apartment, superficie, precio) {
        // Remover modal existente si hay uno
        const existingModal = document.getElementById('videoModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modalHTML = `
            <div class="modal-overlay" id="videoModal">
                <div class="modal video-modal">
                    <div class="modal-header">
                        <h3>Video - ${apartment}</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="video-container">
                            <video controls autoplay muted>
                                <source src="video/apartamento/video-0.mp4" type="video/mp4">
                                Tu navegador no soporta el elemento video.
                            </video>
                        </div>
                        <div class="video-info">
                            <h4>${apartment}</h4>
                            <p><strong>Superficie:</strong> ${superficie}</p>
                            <p><strong>Precio:</strong> ${precio}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Agregar event listener para cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('videoModal');
                if (modal) modal.remove();
            }
        });
    }
    
    createContactModal(apartment, superficie, precio) {
        console.log('📞 createContactModal llamado con:', { apartment, superficie, precio });
        
        // Remover modal existente si hay uno
        const existingModal = document.getElementById('contactModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modalHTML = `
            <div class="modal-overlay" id="contactModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;">
                <div class="modal" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 15px; max-width: 600px; width: 90%; max-height: 90vh; overflow: hidden;">
                    <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.2);">
                        <h3 style="margin: 0; color: white; font-size: 1.5rem; font-weight: 600;">Solicitar Información - ${apartment}</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0.5rem;">&times;</button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem; overflow-y: auto; max-height: 70vh;">
                        <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.2); margin-bottom: 1.5rem;">
                            <h4 style="margin: 0 0 0.5rem 0; color: white; font-size: 1.2rem;">${apartment}</h4>
                            <p style="margin: 0.25rem 0; color: #cccccc;"><strong>Superficie:</strong> ${superficie}</p>
                            <p style="margin: 0.25rem 0; color: #cccccc;"><strong>Precio:</strong> ${precio}</p>
                        </div>
                        <form id="contactForm" style="display: flex; flex-direction: column; gap: 1rem;">
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <label style="color: white; font-weight: 600; font-size: 0.9rem;">Nombre completo *</label>
                                <input type="text" name="name" required style="padding: 0.75rem; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; background: rgba(255, 255, 255, 0.05); color: white; font-size: 1rem;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <label style="color: white; font-weight: 600; font-size: 0.9rem;">Email *</label>
                                <input type="email" name="email" required style="padding: 0.75rem; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; background: rgba(255, 255, 255, 0.05); color: white; font-size: 1rem;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <label style="color: white; font-weight: 600; font-size: 0.9rem;">Teléfono</label>
                                <input type="tel" name="phone" style="padding: 0.75rem; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; background: rgba(255, 255, 255, 0.05); color: white; font-size: 1rem;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <label style="color: white; font-weight: 600; font-size: 0.9rem;">Mensaje</label>
                                <textarea name="message" rows="4" placeholder="Cuéntanos más sobre tu interés en este apartamento..." style="padding: 0.75rem; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; background: rgba(255, 255, 255, 0.05); color: white; font-size: 1rem; resize: vertical; min-height: 100px;"></textarea>
                            </div>
                            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                                <button type="submit" style="flex: 1; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; font-size: 1rem; background: #007bff; color: white; border: none; cursor: pointer;">Enviar Solicitud</button>
                                <button type="button" onclick="this.closest('.modal-overlay').remove()" style="flex: 1; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; font-size: 1rem; background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.2); cursor: pointer;">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        console.log('📞 Modal insertado en el DOM');
        
        // Agregar event listener para el formulario
        const form = document.getElementById('contactForm');
        if (form) {
            console.log('📞 Formulario encontrado, agregando event listener');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmit(e.target, apartment, superficie, precio);
            });
        } else {
            console.log('❌ Formulario no encontrado');
        }
        
        // Agregar event listener para cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('contactModal');
                if (modal) modal.remove();
            }
        });
    }
    
    handleContactFormSubmit(form, apartment, superficie, precio) {
        const formData = new FormData(form);
        const data = {
            apartment,
            superficie,
            precio,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message')
        };
        
        console.log('📧 Enviando formulario de contacto:', data);
        
        // Aquí puedes agregar la lógica para enviar el formulario
        // Por ahora solo mostraremos un mensaje de éxito
        this.showSuccessMessage('¡Solicitud enviada exitosamente! Nos pondremos en contacto contigo pronto.');
        
        // Cerrar modal
        const modal = document.getElementById('contactModal');
        if (modal) modal.remove();
    }
    
    showSuccessMessage(message) {
        const messageHTML = `
            <div class="success-message" id="successMessage">
                <div class="success-content">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>${message}</span>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', messageHTML);
        
        // Remover mensaje después de 3 segundos
        setTimeout(() => {
            const messageEl = document.getElementById('successMessage');
            if (messageEl) messageEl.remove();
        }, 3000);
    }
    
    // ===== MODO RECORRIDO =====
    
    activateRecorridoMode(apartment, superficie, precio) {
        console.log('🎬 Activando modo recorrido...');
        
        // Obtener el video correspondiente
        const videoPath = this.getRecorridoVideoPath(apartment, superficie, precio);
        console.log('🎬 Video de recorrido:', videoPath);
        
        // Ocultar todas las tarjetas excepto la activa
        this.hideAllCardsExceptActive(apartment, superficie, precio);
        
        // Cambiar el video de fondo
        this.changeBackgroundVideo(videoPath);
        
        // Mostrar controles de recorrido
        this.showRecorridoControls(apartment, superficie, precio);
        
        // Agregar clase al body para estilos específicos
        document.body.classList.add('recorrido-mode');
    }
    
    getRecorridoVideoPath(apartment, superficie, precio) {
        // Mapear los datos de la tarjeta a las claves del sistema
        const tipo = this.getTipoFromText(apartment);
        const superficieKey = this.getSuperficieKeyFromText(superficie);
        const precioKey = this.getPrecioKeyFromText(precio);
        
        console.log('🔍 Mapeando datos:', { tipo, superficieKey, precioKey });
        
        // Construir el nombre del video
        const videoName = `recorrido_${tipo}_${superficieKey}_${precioKey}.mp4`;
        const videoPath = `video/recorridos/${videoName}`;
        
        console.log('🎬 Video path:', videoPath);
        return videoPath;
    }
    
    getTipoFromText(apartmentText) {
        const mapping = {
            '1 Dormitorio': '1d',
            '2 Dormitorios': '2d',
            '3 Dormitorios': '3d'
        };
        return mapping[apartmentText] || '1d';
    }
    
    getSuperficieKeyFromText(superficieText) {
        const mapping = {
            '40-60 m²': '40_60',
            '60-80 m²': '60_80',
            '80-100 m²': '80_100',
            '100+ m²': '100_plus'
        };
        return mapping[superficieText] || '40_60';
    }
    
    getPrecioKeyFromText(precioText) {
        const mapping = {
            '$2.000-3.000 UF': '2000_3000',
            '$3.000-4.000 UF': '3000_4000',
            '$4.000-5.000 UF': '4000_5000',
            '$5.000+ UF': '5000_plus'
        };
        return mapping[precioText] || '2000_3000';
    }
    
    hideAllCardsExceptActive(apartment, superficie, precio) {
        const apartmentList = document.getElementById('apartmentList');
        if (!apartmentList) return;
        
        const cards = apartmentList.querySelectorAll('.apartment-card');
        
        cards.forEach(card => {
            const cardApartment = card.querySelector('h3').textContent;
            const cardSuperficie = card.querySelector('p:nth-child(2)').textContent.replace('Superficie: ', '');
            const cardPrecio = card.querySelector('p:nth-child(3)').textContent.replace('Precio: ', '');
            
            if (cardApartment === apartment && 
                cardSuperficie === superficie && 
                cardPrecio === precio) {
                // Esta es la tarjeta activa - mantenerla visible
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1.1)';
                card.style.transition = 'all 0.5s ease';
                card.classList.add('recorrido-active');
            } else {
                // Ocultar otras tarjetas
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 500);
            }
        });
        
        // Cambiar el layout de la lista para centrar la tarjeta activa
        apartmentList.style.display = 'flex';
        apartmentList.style.justifyContent = 'center';
        apartmentList.style.alignItems = 'center';
        apartmentList.style.minHeight = '60vh';
    }
    
    changeBackgroundVideo(videoPath) {
        // Buscar el video de fondo actual
        let backgroundVideo = document.querySelector('.background-video');
        
        if (!backgroundVideo) {
            // Crear nuevo video si no existe
            backgroundVideo = document.createElement('video');
            backgroundVideo.className = 'background-video';
            backgroundVideo.style.position = 'fixed';
            backgroundVideo.style.top = '0';
            backgroundVideo.style.left = '0';
            backgroundVideo.style.width = '100%';
            backgroundVideo.style.height = '100%';
            backgroundVideo.style.objectFit = 'cover';
            backgroundVideo.style.zIndex = '-1';
            backgroundVideo.style.transition = 'opacity 0.5s ease-in-out';
            document.body.appendChild(backgroundVideo);
        }
        
        // Cambiar la fuente del video
        backgroundVideo.src = videoPath;
        backgroundVideo.autoplay = true;
        backgroundVideo.muted = true;
        backgroundVideo.loop = true;
        backgroundVideo.controls = false;
        
        // Fade in del nuevo video
        backgroundVideo.style.opacity = '0';
        setTimeout(() => {
            backgroundVideo.style.opacity = '1';
        }, 100);
        
        console.log('🎬 Video de fondo cambiado a:', videoPath);
    }
    
    showRecorridoControls(apartment, superficie, precio) {
        // Remover controles existentes si los hay
        const existingControls = document.getElementById('recorridoControls');
        if (existingControls) {
            existingControls.remove();
        }
        
        const controlsHTML = `
            <div id="recorridoControls" class="recorrido-controls">
                <div class="recorrido-info">
                    <h3>${apartment}</h3>
                    <p>${superficie} • ${precio}</p>
                </div>
                <div class="recorrido-actions">
                    <button class="btn-secondary" onclick="window.imageFilterSystem.exitRecorridoMode()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Salir del Recorrido
                    </button>
                    <button class="btn-primary" onclick="window.imageFilterSystem.toggleVideoPlayback()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5v14l11-7z" fill="currentColor"/>
                        </svg>
                        <span id="playPauseText">Pausar</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', controlsHTML);
        
        // Agregar estilos específicos para los controles
        this.addRecorridoStyles();
    }
    
    addRecorridoStyles() {
        if (document.getElementById('recorridoStyles')) return;
        
        const styles = `
            <style id="recorridoStyles">
                .recorrido-controls {
                    position: fixed;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 15px;
                    padding: 1.5rem;
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    min-width: 300px;
                }
                
                .recorrido-info {
                    text-align: center;
                }
                
                .recorrido-info h3 {
                    color: white;
                    margin: 0 0 0.5rem 0;
                    font-size: 1.2rem;
                }
                
                .recorrido-info p {
                    color: #cccccc;
                    margin: 0;
                    font-size: 0.9rem;
                }
                
                .recorrido-actions {
                    display: flex;
                    gap: 1rem;
                }
                
                .recorrido-actions button {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    border: none;
                }
                
                .recorrido-active {
                    box-shadow: 0 0 30px rgba(0, 123, 255, 0.5) !important;
                    border: 2px solid rgba(0, 123, 255, 0.8) !important;
                }
                
                .recorrido-mode .apartment-list {
                    transition: all 0.5s ease;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    exitRecorridoMode() {
        console.log('🚪 Saliendo del modo recorrido...');
        
        // Remover clase del body
        document.body.classList.remove('recorrido-mode');
        
        // Remover controles
        const controls = document.getElementById('recorridoControls');
        if (controls) controls.remove();
        
        // Remover estilos específicos
        const styles = document.getElementById('recorridoStyles');
        if (styles) styles.remove();
        
        // Restaurar todas las tarjetas
        this.restoreAllCards();
        
        // Restaurar video de fondo original
        this.restoreBackgroundVideo();
        
        console.log('✅ Modo recorrido desactivado');
    }
    
    restoreAllCards() {
        const apartmentList = document.getElementById('apartmentList');
        if (!apartmentList) return;
        
        // Restaurar layout original
        apartmentList.style.display = 'grid';
        apartmentList.style.justifyContent = 'center';
        apartmentList.style.alignItems = 'start';
        apartmentList.style.minHeight = 'auto';
        
        const cards = apartmentList.querySelectorAll('.apartment-card');
        
        cards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.classList.remove('recorrido-active');
        });
    }
    
    restoreBackgroundVideo() {
        // Restaurar el video de fondo original (puedes ajustar esto según tu configuración)
        const backgroundVideo = document.querySelector('.background-video');
        if (backgroundVideo) {
            backgroundVideo.src = 'video/apartamento/video-0.mp4'; // Video por defecto
            backgroundVideo.style.opacity = '1';
        }
    }
    
    toggleVideoPlayback() {
        const backgroundVideo = document.querySelector('.background-video');
        const playPauseText = document.getElementById('playPauseText');
        
        if (backgroundVideo) {
            if (backgroundVideo.paused) {
                backgroundVideo.play();
                if (playPauseText) playPauseText.textContent = 'Pausar';
            } else {
                backgroundVideo.pause();
                if (playPauseText) playPauseText.textContent = 'Reproducir';
            }
        }
    }
}

// Export for global use
window.ImageFilterSystem = ImageFilterSystem;

// Crear instancia global para acceso directo
window.imageFilterSystem = null;

// Función para inicializar la instancia global
window.initImageFilterSystem = function() {
    if (!window.imageFilterSystem) {
        window.imageFilterSystem = new ImageFilterSystem();
    }
    return window.imageFilterSystem;
};
