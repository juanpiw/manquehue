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
        
        // Estado del tipo de proyecto (apartamento/casa)
        this.currentProjectType = 'apartamento'; // Por defecto apartamento
        
        this.imageStructure = {
            '1d': {
                'superficie_40_60': {
                    'precio_2000_3000': 1,
                    'precio_3000_4000': 1,
                    'precio_4000_5000': 1,
                    'precio_5000_plus': 1
                },
                'superficie_80_100': {
                    'precio_3000_4000': 1,
                    'precio_4000_5000': 1,
                    'precio_5000_plus': 1
                }
            },
            '2d': {
                'superficie_40_60': {
                    'precio_2000_3000': 1,
                    'precio_3000_4000': 1,
                    'precio_4000_5000': 1,
                    'precio_5000_plus': 1
                },
                'superficie_60_80': {
                    'precio_2000_3000': 1,
                    'precio_3000_4000': 1,
                    'precio_4000_5000': 1,
                    'precio_5000_plus': 1
                },
                'superficie_80_100': {
                    'precio_2000_3000': 1,
                    'precio_3000_4000': 1,
                    'precio_4000_5000': 1,
                    'precio_5000_plus': 1
                },
                'superficie_100_plus': {
                    'precio_2000_3000': 1,
                    'precio_3000_4000': 1,
                    'precio_4000_5000': 1,
                    'precio_5000_plus': 1
                }
            },
            '3d': {
                'superficie_40_60': {
                    'precio_3000_4000': 1,
                    'precio_4000_5000': 1,
                    'precio_5000_plus': 1
                },
                'superficie_60_80': {
                    'precio_2000_3000': 1,
                    'precio_3000_4000': 1,
                    'precio_4000_5000': 1,
                    'precio_5000_plus': 1
                },
                'superficie_80_100': {
                    'precio_2000_3000': 1,
                    'precio_3000_4000': 1,
                    'precio_4000_5000': 1,
                    'precio_5000_plus': 1
                },
                'superficie_100_plus': {
                    'precio_2000_3000': 1,
                    'precio_3000_4000': 1,
                    'precio_4000_5000': 1,
                    'precio_5000_plus': 1
                }
            }
        };
        
        this.init();
    }
    
    init() {

        this.setupEventListeners();
        this.setupBackButton();

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
        
        // Event listener para el selector de proyecto (Apartamento/Casa)
        this.setupProjectTypeSelector();
        
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

            
            if (e.target.classList.contains('watchVideoBtn')) {

                this.handleWatchVideo(e.target);
            } else if (e.target.classList.contains('contactModelBtn')) {

                this.handleContactModal(e.target);
            }
        });
    }
    
    updateTipoFilter(tipo) {
        console.log('🎯 Actualizando filtro de tipo:', tipo);
        
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
        
        console.log('🔍 Buscando imágenes disponibles con filtros:', { tipo, superficie, precio });
        
        // Si no hay filtros específicos, mostrar todas las imágenes
        if (tipo === 'all' && !superficie && !precio) {
            console.log('📋 Mostrando todas las imágenes (sin filtros)');
            return this.getAllImages();
        }
        
        // Filtrar por tipo de dormitorio
        const tiposToCheck = tipo === 'all' ? Object.keys(this.imageStructure) : [tipo];
        
        
        tiposToCheck.forEach(tipoKey => {

            if (!this.imageStructure[tipoKey]) {

                return;
            }
            
            const superficies = this.imageStructure[tipoKey];
            const superficiesToCheck = superficie ? [this.mapSuperficieToKey(superficie)] : Object.keys(superficies);

            
            superficiesToCheck.forEach(superficieKey => {
                if (!superficies[superficieKey]) return;
                
                const precios = superficies[superficieKey];
                const preciosToCheck = precio ? [this.mapPrecioToKey(precio)] : Object.keys(precios);
                
                preciosToCheck.forEach(precioKey => {
                    if (!precios[precioKey]) return;
                    
                    const cantidadImagenes = precios[precioKey];
                    for (let i = 1; i <= cantidadImagenes; i++) {
                        // Mapear las claves a los nombres de directorio correctos
                        const tipoDir = this.mapTipoToDirectory(tipoKey);
                        // Obtener la ruta correcta de la imagen basada en los archivos reales
                        const imagePath = this.getImagePath(tipoDir, superficieKey, precioKey, i);
                        availableImages.push({
                            path: imagePath,
                            tipo: tipoKey,
                            superficie: superficieKey,
                            precio: precioKey,
                            index: i
                        });
                    }
                });
            });
        });
        
        console.log(`✅ Encontradas ${availableImages.length} imágenes disponibles`);
        return availableImages;
    }
    
    getAllImages() {
        const allImages = [];
        
        Object.entries(this.imageStructure).forEach(([tipo, superficies]) => {
            Object.entries(superficies).forEach(([superficie, precios]) => {
                Object.entries(precios).forEach(([precio, cantidad]) => {
                    for (let i = 1; i <= cantidad; i++) {
                        // Mapear las claves a los nombres de directorio correctos
                        const tipoDir = this.mapTipoToDirectory(tipo);
                        // Obtener la ruta correcta de la imagen basada en los archivos reales
                        const imagePath = this.getImagePath(tipoDir, superficie, precio, i);
                        allImages.push({
                            path: imagePath,
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
    
    mapTipoToDirectory(tipo) {
        const mapping = {
            '1d': '1_dormitorio',
            '2d': '2_dormitorios',
            '3d': '3_dormitorios'
        };
        return mapping[tipo] || tipo;
    }

    /**
     * Obtiene la ruta correcta de la imagen basada en los archivos reales disponibles
     * @param {string} tipoDir - Directorio del tipo (1_dormitorio, 2_dormitorios, etc.)
     * @param {string} superficie - Clave de superficie (superficie_40_60, etc.)
     * @param {string} precio - Clave de precio (precio_2000_3000, etc.)
     * @param {number} index - Índice de la imagen
     * @returns {string} Ruta de la imagen
     */
    getImagePath(tipoDir, superficie, precio, index) {
        // Mapear las claves a los nombres de archivo reales
        const superficieMapping = {
            'superficie_40_60': '40-60 m2',
            'superficie_60_80': '60-80 m2',
            'superficie_80_100': '80-100 m2',
            'superficie_100_plus': '100+ m2'
        };

        const precioMapping = {
            'precio_2000_3000': 'AS-2',
            'precio_3000_4000': 'AS-3',
            'precio_4000_5000': 'AS-4',
            'precio_5000_plus': 'AS-5'
        };

        const tipoMapping = {
            '1_dormitorio': 'D1',
            '2_dormitorios': 'D2',
            '3_dormitorios': 'D3'
        };

        const superficieText = superficieMapping[superficie] || superficie;
        const precioText = precioMapping[precio] || precio;
        const tipoText = tipoMapping[tipoDir] || tipoDir;

        // Construir el nombre del archivo basado en los archivos reales encontrados
        let fileName = '';
        
        if (tipoDir === '1_dormitorio') {
            if (superficie === 'superficie_40_60') {
                // Para 1 dormitorio, superficie 40-60, usar AS-2 como imagen principal
                fileName = `D1 ${superficieText}_AS-2.jpg`;
            } else if (superficie === 'superficie_80_100') {
                // Para 1 dormitorio, superficie 80-100, usar AS_4 como imagen principal
                fileName = `D1 ${superficieText}_AS_4.png`;
            } else {
                // Para otras superficies de 1 dormitorio, usar el patrón estándar
                fileName = `planta_1.png`;
            }
        } else if (tipoDir === '2_dormitorios') {
            // Para 2 dormitorios, usar los archivos reales de 2_dormitorio
            if (superficie === 'superficie_40_60') {
                // Para 2 dormitorios, superficie 40-60, usar BS_2 como imagen principal
                fileName = `40_60 m2 BS_2.jpg`;
            } else if (superficie === 'superficie_80_100') {
                // Para 2 dormitorios, superficie 80-100, usar Bs-4 como imagen principal
                fileName = `80-100 m2_Bs-4.jpg`;
            } else {
                // Para otras superficies de 2 dormitorios, usar el patrón estándar
                fileName = `planta_1.png`;
            }
        } else if (tipoDir === '3_dormitorios') {
            // Para 3 dormitorios, usar planta_1.png
            fileName = `planta_1.png`;
        }

        // Si no se pudo construir un nombre específico, usar un fallback
        if (!fileName) {
            fileName = `planta_${index}.png`;
        }

        // Construir la ruta de la imagen
        let imagePath;
        
        if (tipoDir === '2_dormitorios') {
            // Para 2 dormitorios, los archivos están en 2_dormitorio (sin 's')
            imagePath = `video/imagenes/2_dormitorio/${fileName}`;
        } else {
            // Para otros tipos, usar la estructura de carpetas normal
            imagePath = `video/imagenes/${tipoDir}/${superficie}/${precio}/${fileName}`;
        }
        
        // Para debugging, loggear la ruta generada
        console.log(`🔍 [ImageFilterSystem] Generando ruta: ${imagePath}`);
        
        return imagePath;
    }
    
    updateImages() {
        console.log('🔄 Actualizando imágenes...');
        
        const availableImages = this.getAvailableImages();
        console.log(`📊 Imágenes disponibles: ${availableImages.length}`);
        
        // Actualizar la lista de apartamentos
        this.updateApartmentList(availableImages);
    }
    
    updateApartmentList(images) {
        const apartmentList = document.getElementById('apartmentList');
        if (!apartmentList) {
    
            return;
        }
        

        
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

        images.forEach((image, index) => {
            const apartmentCard = this.createApartmentCard(image, image.index, index);
            apartmentList.appendChild(apartmentCard);
        });

        
        // Mostrar lista

        apartmentList.style.display = 'grid';
        apartmentList.style.opacity = '1';
        apartmentList.style.transform = 'translateY(0)';
        apartmentList.style.animation = 'fadeInUp 0.5s ease';

        
        // Ocultar mensaje inicial
        const initialMessage = document.getElementById('initialMessage');
        if (initialMessage) {
            initialMessage.style.display = 'none';
        }
    }
    
    createApartmentCard(image, imageIndex, animationIndex) {
        const card = document.createElement('div');
        card.className = 'apartment-card';
        card.style.animation = `fadeInUp 0.5s ease ${animationIndex * 0.1}s`;
        
        const tipoText = this.getTipoText(image.tipo);
        const superficieText = this.getSuperficieText(image.superficie);
        const precioText = this.getPrecioText(image.precio);
        const tipoDepartamento = this.getTipoDepartamento(image.tipo, image.superficie, image.precio);
        
        // Crear identificador único para el botón
        const buttonId = `recorrer-${image.tipo}-${image.superficie}-${image.precio}-${imageIndex}`;
        
        // Crear el HTML de manera más limpia para evitar problemas de concatenación
        const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iUGxhbnRhIGRlICR7dGlwb1RleHR9PC90ZXh0Pjwvc3ZnPg==';
        
        card.innerHTML = `
            <div class="apartment-image">
                <img src="${image.path}" alt="${tipoText}" onerror="this.src='${fallbackImage}'">
            </div>
            <div class="apartment-info">
                <h3>${tipoText}</h3>
                <p><strong>Superficie:</strong> ${superficieText}</p>
                <p><strong>Precio:</strong> ${precioText}</p>
                <p><strong>Tipo de Departamento:</strong> ${tipoDepartamento}</p>
                <div class="apartment-actions">
                    <button id="${buttonId}" class="btn-secondary watchVideoBtn" 
                            data-apartment="${tipoText}" 
                            data-superficie="${superficieText}" 
                            data-precio="${precioText}"
                            data-tipo-departamento="${tipoDepartamento}"
                            data-tipo="${image.tipo}"
                            data-superficie-code="${image.superficie}"
                            data-precio-code="${image.precio}"
                            data-index="${imageIndex}">
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
    
    getTipoDepartamento(tipo, superficie, precio) {
        // Generar tipo de departamento basado en las características
        const tipoMapping = {
            '1d': 'A',
            '2d': 'B', 
            '3d': 'C'
        };
        
        const superficieMapping = {
            'superficie_40_60': 'S',
            'superficie_60_80': 'M',
            'superficie_80_100': 'L',
            'superficie_100_plus': 'XL'
        };
        
        const precioMapping = {
            'precio_2000_3000': '2',
            'precio_3000_4000': '3',
            'precio_4000_5000': '4',
            'precio_5000_plus': '5'
        };
        
        const tipoCode = tipoMapping[tipo] || 'X';
        const superficieCode = superficieMapping[superficie] || 'X';
        const precioCode = precioMapping[precio] || 'X';
        
        return `Tipo ${tipoCode}-${superficieCode}-${precioCode}`;
    }
    
    getTipoDepartamentoFromText(apartment, superficie, precio) {
        // Extraer información del texto ya formateado
        const dormitoriosMatch = apartment.match(/(\d+)/);
        const superficieMatch = superficie.match(/(\d+)-(\d+)/);
        const precioMatch = precio.match(/\$(\d+\.\d+)-(\d+\.\d+)/);
        
        let tipoCode = 'X';
        let superficieCode = 'X';
        let precioCode = 'X';
        
        // Mapear dormitorios
        if (dormitoriosMatch) {
            const dormitorios = parseInt(dormitoriosMatch[1]);
            if (dormitorios === 1) tipoCode = 'A';
            else if (dormitorios === 2) tipoCode = 'B';
            else if (dormitorios === 3) tipoCode = 'C';
        }
        
        // Mapear superficie
        if (superficieMatch) {
            const min = parseInt(superficieMatch[1]);
            const max = parseInt(superficieMatch[2]);
            if (min >= 40 && max <= 60) superficieCode = 'S';
            else if (min >= 60 && max <= 80) superficieCode = 'M';
            else if (min >= 80 && max <= 100) superficieCode = 'L';
            else if (min >= 100) superficieCode = 'XL';
        }
        
        // Mapear precio
        if (precioMatch) {
            const min = parseInt(precioMatch[1]);
            if (min >= 2000 && min < 3000) precioCode = '2';
            else if (min >= 3000 && min < 4000) precioCode = '3';
            else if (min >= 4000 && min < 5000) precioCode = '4';
            else if (min >= 5000) precioCode = '5';
        }
        
        return `Tipo ${tipoCode}-${superficieCode}-${precioCode}`;
    }
    
    applyFilters() {
        console.log('🔍 Aplicando filtros:', this.currentFilters);
        this.updateImages();
    }
    
    clearFilters() {
        console.log('🧹 Limpiando filtros');
        
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

        
        const apartment = button.getAttribute('data-apartment');
        const superficie = button.getAttribute('data-superficie');
        const precio = button.getAttribute('data-precio');
        

        
        // Activar modo recorrido
        this.activateRecorridoMode(apartment, superficie, precio);
    }
    
    handleContactModal(button) {

        
        const apartment = button.getAttribute('data-apartment');
        const superficie = button.getAttribute('data-superficie');
        const precio = button.getAttribute('data-precio');
        

        
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

        
        // Agregar event listener para el formulario
        const form = document.getElementById('contactForm');
        if (form) {
    
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmit(e.target, apartment, superficie, precio);
            });
        } else {
    
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

        
        // Obtener el video correspondiente
        const videoPath = this.getRecorridoVideoPath(apartment, superficie, precio);

        
        // Ocultar todas las tarjetas excepto la activa
        this.hideAllCardsExceptActive(apartment, superficie, precio);
        
        // Cambiar el video de fondo
        this.changeBackgroundVideo(videoPath);
        
        // Mostrar controles de recorrido
        this.showRecorridoControls(apartment, superficie, precio);
        
        // Agregar clase al body para estilos específicos
        document.body.classList.add('recorrido-mode');
        
        // Bloquear el scroll para mantener la sección visible
        this.lockScrollToCurrentSection();
    }
    
    getRecorridoVideoPath(apartment, superficie, precio) {
        // Mapear los datos de la tarjeta a las claves del sistema
        const tipo = this.getTipoFromText(apartment);
        const superficieKey = this.getSuperficieKeyFromText(superficie);
        const precioKey = this.getPrecioKeyFromText(precio);
        

        
        // Construir el nombre del video
        const videoName = `recorrido_${tipo}_${superficieKey}_${precioKey}.mp4`;
        const videoPath = `video/recorridos/${videoName}`;
        

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
        let activeCardFound = false;
        
        cards.forEach(card => {
            const cardApartment = card.querySelector('h3').textContent;
            const cardSuperficie = card.querySelector('p:nth-child(2)').textContent.replace('Superficie: ', '');
            const cardPrecio = card.querySelector('p:nth-child(3)').textContent.replace('Precio: ', '');
            
            if (cardApartment === apartment && 
                cardSuperficie === superficie && 
                cardPrecio === precio && 
                !activeCardFound) {
                // Esta es la primera tarjeta que coincide - mantenerla visible
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1.1)';
                card.style.transition = 'all 0.5s ease';
                card.classList.add('recorrido-active');
                
                // Ocultar los botones de acción para evitar confusión
                const actionButtons = card.querySelector('.apartment-actions');
                if (actionButtons) {
                    actionButtons.style.display = 'none';
                }
                
                // Ocultar la sección de filtros para mantener la interfaz limpia
                const filtersSection = document.querySelector('.apartment-filters');
                if (filtersSection) {
                    filtersSection.style.display = 'none';
                }
                
                const typeSelector = document.querySelector('.apartment-type-selector');
                if (typeSelector) {
                    typeSelector.style.display = 'none';
                }
                
                activeCardFound = true;
        
            } else {
                // Ocultar todas las demás tarjetas
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                card.classList.remove('recorrido-active');
                
                // Asegurar que los botones estén visibles en las tarjetas ocultas
                const actionButtons = card.querySelector('.apartment-actions');
                if (actionButtons) {
                    actionButtons.style.display = 'flex';
                }
                
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
        

    }
    
    showRecorridoControls(apartment, superficie, precio) {
        // Remover controles existentes si los hay
        const existingControls = document.getElementById('recorridoControls');
        if (existingControls) {
            existingControls.remove();
        }
        
        // Determinar qué función de detalles usar según el tipo de proyecto
        const detailsFunction = this.currentProjectType === 'casa' ? 
            `window.imageFilterSystem.showHouseDetails()` : 
            `window.imageFilterSystem.showApartmentDetails('${apartment}', '${superficie}', '${precio}')`;
        
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
                    <button class="btn-secondary" onclick="${detailsFunction}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Detalles
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
        
        // Ocultar el botón hero-recorrer cuando se muestran los controles
        const heroButton = document.querySelector('.hero-recorrer-button');
        if (heroButton) {
            heroButton.style.display = 'none';
        }
        
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
        
        // Verificar si hay una tarjeta en modo detalles
        const detailsCard = document.querySelector('.apartment-card.details-mode, .house-card.details-mode');
        if (detailsCard) {
            console.log('🔄 Tarjeta en modo detalles detectada, saliendo también del modo detalles...');
            this.exitDetailsMode();
            return; // exitDetailsMode ya maneja la salida completa
        }
        
        // Desbloquear el scroll
        this.unlockScroll();
        
        // Remover clase del body
        document.body.classList.remove('recorrido-mode');
        
        // Remover controles
        const controls = document.getElementById('recorridoControls');
        if (controls) controls.remove();
        
        // Remover estilos específicos
        const styles = document.getElementById('recorridoStyles');
        if (styles) styles.remove();
        
        // Mostrar de nuevo el botón hero-recorrer
        const heroButton = document.querySelector('.hero-recorrer-button');
        if (heroButton) {
            heroButton.style.display = 'block';
        }
        
        // Restaurar todas las tarjetas
        this.restoreAllCards();
        
        // Restaurar video de fondo original
        this.restoreBackgroundVideo();
        
        console.log('✅ Modo recorrido desactivado');
    }
    
    restoreAllCards() {
        // Restaurar tarjetas de apartamentos
        const apartmentList = document.getElementById('apartmentList');
        if (apartmentList) {
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
                
                // Restaurar visibilidad de los botones de acción
                const actionButtons = card.querySelector('.apartment-actions');
                if (actionButtons) {
                    actionButtons.style.display = 'flex';
                }
            });
        }
        
        // Restaurar tarjetas de casa
        const houseCards = document.querySelectorAll('.house-card');
        houseCards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.classList.remove('recorrido-active');
            
            // Si la tarjeta está en modo detalles, restaurarla a su estado original
            if (card.classList.contains('details-mode')) {
                console.log('🔄 Restaurando tarjeta de casa desde modo detalles...');
                this.restoreOriginalCard(card);
            }
            
            // Restaurar visibilidad de los botones de acción
            const actionButtons = card.querySelector('.apartment-actions');
            if (actionButtons) {
                actionButtons.style.display = 'flex';
            }
        });
        
        // Restaurar visibilidad de los filtros según el tipo de proyecto actual
        if (this.currentProjectType === 'casa') {
            // Para casa, ocultar filtros de apartamentos
            const filtersSection = document.querySelector('.apartment-filters');
            if (filtersSection) {
                filtersSection.style.display = 'none';
            }
            
            const typeSelector = document.querySelector('.apartment-type-selector');
            if (typeSelector) {
                typeSelector.style.display = 'none';
            }
        } else {
            // Para apartamentos, mostrar filtros
            const filtersSection = document.querySelector('.apartment-filters');
            if (filtersSection) {
                filtersSection.style.display = 'flex';
            }
            
            const typeSelector = document.querySelector('.apartment-type-selector');
            if (typeSelector) {
                typeSelector.style.display = 'flex';
            }
        }
    }
    
    restoreBackgroundVideo() {
        // Restaurar el video de fondo original según el tipo de proyecto actual
        const backgroundVideo = document.querySelector('.background-video');
        if (backgroundVideo) {
            if (this.currentProjectType === 'casa') {
                backgroundVideo.src = 'video/casa/video-0.mp4';
            } else {
                backgroundVideo.src = 'video/apartamento/video-0.mp4';
            }
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
    
    showApartmentDetails(apartment, superficie, precio) {

        
        // Ocultar inmediatamente el fondo oscuro SIN TIMER
        this.hideSectionBackground();
        
        // Agregar video de fondo por encima del fondo actual
        this.addDetailsBackgroundVideo(apartment);
        
        // Encontrar la tarjeta activa
        const apartmentList = document.getElementById('apartmentList');
        if (!apartmentList) return;
        
        const activeCard = apartmentList.querySelector('.apartment-card.recorrido-active');
        if (!activeCard) {
    
            return;
        }
        
        // Transformar la tarjeta en modo detalles INMEDIATAMENTE
        this.transformCardToDetails(activeCard, apartment, superficie, precio);
        
        // Activar animaciones llamativas del botón volver
        this.enhanceBackButtonVisibility();
        
        // Bloquear el scroll para mantener la sección visible
        this.lockScrollToCurrentSection();
    }
    
    hideSectionBackground() {

        
        // Agregar clase CSS para activar modo detalles inmediatamente
        const apartmentsSection = document.querySelector('.apartments-section');
        if (apartmentsSection) {
            apartmentsSection.classList.add('details-mode-active');
            apartmentsSection.style.background = 'transparent';
            apartmentsSection.style.backdropFilter = 'none';
            apartmentsSection.style.transition = 'none'; // SIN TRANSICIÓN
        }
        
        // Ocultar el contenido de la sección
        const apartmentsContent = document.querySelector('.apartments-content');
        if (apartmentsContent) {
            apartmentsContent.style.background = 'transparent';
            apartmentsContent.style.backdropFilter = 'none';
            apartmentsContent.style.boxShadow = 'none';
            apartmentsContent.style.transition = 'none'; // SIN TRANSICIÓN
        }
        
        // Ocultar títulos INMEDIATAMENTE
        const sectionTitle = document.querySelector('.apartments-section .section-title');
        if (sectionTitle) {
            sectionTitle.style.display = 'none';
            sectionTitle.style.transition = 'none'; // SIN TRANSICIÓN
        }
        
        const sectionSubtitle = document.querySelector('.apartments-section .section-subtitle');
        if (sectionSubtitle) {
            sectionSubtitle.style.display = 'none';
            sectionSubtitle.style.transition = 'none'; // SIN TRANSICIÓN
        }
        
        // Ocultar el overlay gradiente INMEDIATAMENTE
        const apartmentsSectionWithBefore = document.querySelector('.apartments-section.animate-in');
        if (apartmentsSectionWithBefore) {
            apartmentsSectionWithBefore.style.setProperty('--before-display', 'none');
            apartmentsSectionWithBefore.style.setProperty('--before-opacity', '0');
        }
        
        // Forzar repaint para asegurar que los cambios se apliquen inmediatamente
        apartmentsSection?.offsetHeight;
        

    }
    
    toggleCollapse() {

        
        const detailsCard = document.querySelector('.apartment-card.details-mode');
        const collapseBtn = document.querySelector('.btn-collapse');
        
        if (!detailsCard || !collapseBtn) {
    
            return;
        }
        
        const isCollapsed = detailsCard.classList.contains('collapsed');
        
        if (isCollapsed) {
            // Expandir
            detailsCard.classList.remove('collapsed');
            collapseBtn.classList.remove('collapsed');
    
        } else {
            // Contraer
            detailsCard.classList.add('collapsed');
            collapseBtn.classList.add('collapsed');
    
        }
    }
    
    showHeroVideo() {

        
        // Ocultar elementos del hero para mostrar el video
        this.hideHeroElements();
        
        // Cambiar el video de fondo si es necesario
        this.switchToHeroVideo();
        
        // Mostrar controles de navegación
        this.showVideoControls();
        
        console.log('✅ Video del hero activado');
    }
    
    hideHeroElements() {
        // Ocultar todo el contenido del hero
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(-20px)';
            heroContent.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                heroContent.style.display = 'none';
            }, 500);
        }
        
        // Ocultar el selector de proyecto
        const previewSelector = document.querySelector('.preview-selector');
        if (previewSelector) {
            previewSelector.style.opacity = '0';
            previewSelector.style.transform = 'translateY(-20px)';
            previewSelector.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                previewSelector.style.display = 'none';
            }, 500);
        }
        
        // Ocultar la sección de estadísticas
        const previewStats = document.querySelector('.preview-stats');
        if (previewStats) {
            previewStats.style.opacity = '0';
            previewStats.style.transform = 'translateY(-20px)';
            previewStats.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                previewStats.style.display = 'none';
            }, 500);
        }
        
        // Ocultar el botón de recorrer
        const heroRecorrerBtn = document.querySelector('.hero-recorrer-button');
        if (heroRecorrerBtn) {
            heroRecorrerBtn.style.opacity = '0';
            heroRecorrerBtn.style.transform = 'translateY(-20px)';
            heroRecorrerBtn.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                heroRecorrerBtn.style.display = 'none';
            }, 500);
        }
        
        // Ocultar el location tag
        const locationTag = document.querySelector('.location-tag-container');
        if (locationTag) {
            locationTag.style.opacity = '0';
            locationTag.style.transform = 'translateY(-20px)';
            locationTag.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                locationTag.style.display = 'none';
            }, 500);
        }
        
        // Ocultar el título del hero si existe
        const heroTitle = document.querySelector('.preview-hero .hero-title');
        if (heroTitle) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(-20px)';
            heroTitle.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                heroTitle.style.display = 'none';
            }, 500);
        }
        
        // Eliminar el fondo empapelado que hace el video borroso
        this.removeBlurOverlay();
    }
    
    removeBlurOverlay() {
        // Buscar y eliminar cualquier overlay que esté causando el efecto borroso
        const overlays = document.querySelectorAll('.preview-hero::before, .preview-hero::after, .hero-overlay, .blur-overlay, .video-overlay');
        
        // También buscar elementos con backdrop-filter o filter que puedan estar causando el efecto
        const blurElements = document.querySelectorAll('[style*="backdrop-filter"], [style*="filter"], [class*="blur"], [class*="overlay"]');
        
        blurElements.forEach(element => {
            // Remover efectos de blur y overlay
            element.style.backdropFilter = 'none';
            element.style.filter = 'none';
            element.style.backgroundColor = 'transparent';
            element.style.opacity = '0';
        });
        
        // Agregar CSS específico para eliminar el fondo empapelado
        const style = document.createElement('style');
        style.id = 'hero-video-mode-styles';
        style.textContent = `
            .hero-video-mode .preview-hero::before,
            .hero-video-mode .preview-hero::after {
                display: none !important;
            }
            
            .hero-video-mode .preview-hero {
                background: transparent !important;
                backdrop-filter: none !important;
                filter: none !important;
            }
            
            .hero-video-mode .background-video {
                opacity: 1 !important;
                z-index: 1 !important;
                filter: none !important;
            }
            
            /* Asegurar que el selector se mantenga centrado al restaurar */
            .preview-selector {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                text-align: center !important;
            }
            
            .preview-selector .selector-container {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
            }
            
            .preview-selector .radio-group {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                gap: 1rem !important;
            }
        `;
        
        // Remover estilos previos si existen
        const existingStyle = document.getElementById('hero-video-mode-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.head.appendChild(style);
        
        console.log('✅ Blur overlay removed for video mode');
    }
    
    removeVideoModeStyles() {
        // Remover los estilos específicos del modo video
        const videoModeStyles = document.getElementById('hero-video-mode-styles');
        if (videoModeStyles) {
            videoModeStyles.remove();
        }
        
        // Restaurar estilos originales de elementos que pudieron haber sido modificados
        const blurElements = document.querySelectorAll('[style*="backdrop-filter"], [style*="filter"]');
        blurElements.forEach(element => {
            // Restaurar estilos originales si es necesario
            element.style.removeProperty('backdrop-filter');
            element.style.removeProperty('filter');
            element.style.removeProperty('background-color');
            element.style.removeProperty('opacity');
        });
        
        // Asegurar que el selector mantenga su centrado original
        const previewSelector = document.querySelector('.preview-selector');
        if (previewSelector) {
            // Restaurar estilos de centrado originales
            previewSelector.style.display = 'block';
            previewSelector.style.textAlign = 'center';
            previewSelector.style.justifyContent = 'center';
            previewSelector.style.alignItems = 'center';
            
            // Asegurar que el contenedor interno también esté centrado
            const selectorContainer = previewSelector.querySelector('.selector-container');
            if (selectorContainer) {
                selectorContainer.style.display = 'flex';
                selectorContainer.style.justifyContent = 'center';
                selectorContainer.style.alignItems = 'center';
            }
            
            // Asegurar que el grupo de radio buttons esté centrado
            const radioGroup = previewSelector.querySelector('.radio-group');
            if (radioGroup) {
                radioGroup.style.display = 'flex';
                radioGroup.style.justifyContent = 'center';
                radioGroup.style.alignItems = 'center';
                radioGroup.style.gap = '1rem';
            }
        }
        
        console.log('✅ Video mode styles removed and selector centering restored');
    }
    
    switchToHeroVideo() {
        // Buscar el video de fondo
        const backgroundVideo = document.querySelector('.background-video');
        if (backgroundVideo) {
            // Determinar qué video usar según el tipo de proyecto
            let videoPath;
            if (this.currentProjectType === 'casa') {
                videoPath = 'video/casa/video-0.mp4';
                console.log('🏡 Using Casa video:', videoPath);
            } else {
                videoPath = 'video/apartamento/video-1.mp4';
                console.log('🏢 Using Apartamento video:', videoPath);
            }
            
            // Cambiar al video correspondiente
            backgroundVideo.src = videoPath;
            backgroundVideo.style.opacity = '1';
            backgroundVideo.style.zIndex = '1';
            
            // Asegurar que el video esté reproduciéndose
            backgroundVideo.play().catch(e => {
                console.log('⚠️ Error playing video:', e);
            });
        }
        
        // Agregar clase al body para indicar que estamos en modo video
        document.body.classList.add('hero-video-mode');
        
        console.log('✅ Video del hero activado');
    }
    
    restoreHeroElements() {
        // Remover clase del body
        document.body.classList.remove('hero-video-mode');
        
        // Remover estilos específicos del modo video
        this.removeVideoModeStyles();
        
        // Restaurar todo el contenido del hero
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.display = 'block';
            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        }
        
        // Restaurar el selector de proyecto
        const previewSelector = document.querySelector('.preview-selector');
        if (previewSelector) {
            previewSelector.style.display = 'block';
            // Asegurar que el centrado se mantenga
            previewSelector.style.textAlign = 'center';
            previewSelector.style.justifyContent = 'center';
            previewSelector.style.alignItems = 'center';
            
            setTimeout(() => {
                previewSelector.style.opacity = '1';
                previewSelector.style.transform = 'translateY(0)';
            }, 200);
        }
        
        // Restaurar la sección de estadísticas
        const previewStats = document.querySelector('.preview-stats');
        if (previewStats) {
            previewStats.style.display = 'block';
            setTimeout(() => {
                previewStats.style.opacity = '1';
                previewStats.style.transform = 'translateY(0)';
            }, 300);
        }
        
        // Restaurar el botón de recorrer
        const heroRecorrerBtn = document.querySelector('.hero-recorrer-button');
        if (heroRecorrerBtn) {
            heroRecorrerBtn.style.display = 'block';
            setTimeout(() => {
                heroRecorrerBtn.style.opacity = '1';
                heroRecorrerBtn.style.transform = 'translateY(0)';
            }, 400);
        }
        
        // Restaurar el location tag
        const locationTag = document.querySelector('.location-tag-container');
        if (locationTag) {
            locationTag.style.display = 'block';
            setTimeout(() => {
                locationTag.style.opacity = '1';
                locationTag.style.transform = 'translateY(0)';
            }, 500);
        }
        
        // Restaurar el título del hero si existe
        const heroTitle = document.querySelector('.preview-hero .hero-title');
        if (heroTitle) {
            heroTitle.style.display = 'block';
            setTimeout(() => {
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 600);
        }
        
        console.log('✅ Hero elements restored');
        

    }
    
    showVideoControls() {

        
        // Crear controles de video
        const videoControlsHTML = `
            <div class="video-controls" style="position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 1rem; align-items: center;">
                <button class="btn-video-control btn-next" onclick="window.imageFilterSystem.nextHeroVideo()" style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); border: none; color: #000; padding: 0.8rem 1.5rem; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3); display: flex; align-items: center; gap: 0.5rem;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Siguiente Video
                </button>
                <button class="btn-video-control btn-stop" onclick="window.imageFilterSystem.stopHeroVideo()" style="background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.3); color: white; padding: 0.8rem 1.5rem; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(10px); display: flex; align-items: center; gap: 0.5rem;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Volver
                </button>
            </div>
        `;
        
        // Insertar controles en el body
        document.body.insertAdjacentHTML('beforeend', videoControlsHTML);
        
        // Animar entrada de controles
        setTimeout(() => {
            const controls = document.querySelector('.video-controls');
            if (controls) {
                controls.style.opacity = '1';
                controls.style.transform = 'translateX(-50%) translateY(0)';
            }
        }, 100);
        

    }
    
    nextHeroVideo() {
        // Array de videos disponibles según el tipo de proyecto
        let heroVideos;
        
        if (this.currentProjectType === 'casa') {
            // Videos de casa
            heroVideos = [
                'video/casa/video-0.mp4',
                'video/casa/video-1.mp4',
                'video/casa/living.mp4',
                'video/casa/dormitorio.mp4',
                'video/casa/cocina.mp4',
                'video/casa/cosina.mp4',
                'video/casa/baño1.mp4',
                'video/casa/baño2.mp4'
            ];
        } else {
            // Videos de apartamento
            heroVideos = [
                'video/apartamento/video-0.mp4',
                'video/apartamento/video-1.mp4',
                'video/apartamento/livin_depa.mp4',
                'video/apartamento/cocina_depa.mp4',
                'video/apartamento/baño_depa.mp4'
            ];
        }
        
        // Obtener video actual
        const backgroundVideo = document.querySelector('.background-video');
        if (!backgroundVideo) return;
        
        // Encontrar índice del video actual
        const currentSrc = backgroundVideo.src;
        const currentIndex = heroVideos.findIndex(video => currentSrc.includes(video.split('/').pop()));
        const nextIndex = (currentIndex + 1) % heroVideos.length;
        
        // Cambiar al siguiente video
        backgroundVideo.src = heroVideos[nextIndex];
        backgroundVideo.play().catch(e => {

        });
        
        // Mostrar indicador de cambio
        const videoName = heroVideos[nextIndex].split('/').pop().replace('.mp4', '');
        this.showVideoChangeIndicator(`Reproduciendo: ${videoName}`);
        

    }
    
    stopHeroVideo() {

        
        // Ocultar controles de video
        const videoControls = document.querySelector('.video-controls');
        if (videoControls) {
            videoControls.style.opacity = '0';
            videoControls.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => {
                videoControls.remove();
            }, 300);
        }
        
        // Restaurar elementos del hero
        this.restoreHeroElements();
        
        // Restaurar video original según el tipo de proyecto
        const backgroundVideo = document.querySelector('.background-video');
        if (backgroundVideo) {
            if (this.currentProjectType === 'casa') {
                backgroundVideo.src = 'video/casa/video-0.mp4';
            } else {
                backgroundVideo.src = 'video/apartamento/video-0.mp4';
            }
            backgroundVideo.style.opacity = '0.3';
            backgroundVideo.style.zIndex = '0';
        }
        

    }
    
    showVideoChangeIndicator(message) {

        
        // Crear indicador temporal
        const indicatorHTML = `
            <div class="video-change-indicator" style="position: fixed; top: 2rem; left: 50%; transform: translateX(-50%); background: rgba(0, 0, 0, 0.8); color: white; padding: 1rem 2rem; border-radius: 10px; font-weight: 600; z-index: 1001; backdrop-filter: blur(10px); opacity: 0; transition: all 0.3s ease;">
                ${message}
            </div>
        `;
        
        // Insertar indicador
        document.body.insertAdjacentHTML('beforeend', indicatorHTML);
        
        // Animar entrada
        setTimeout(() => {
            const indicator = document.querySelector('.video-change-indicator');
            if (indicator) {
                indicator.style.opacity = '1';
            }
        }, 100);
        
        // Remover después de 2 segundos
        setTimeout(() => {
            const indicator = document.querySelector('.video-change-indicator');
            if (indicator) {
                indicator.style.opacity = '0';
                setTimeout(() => {
                    indicator.remove();
                }, 300);
            }
        }, 2000);
    }
    
    transformCardToDetails(card, apartment, superficie, precio) {
        // Crear el nuevo contenido con carrusel
        const detailsHTML = `
            <div class="apartment-details-mode">
                <div class="details-header">
                    <button class="btn-back" onclick="window.imageFilterSystem.exitDetailsMode()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Volver
                    </button>
                    <h3 class="details-title">${apartment}</h3>
                    <button class="btn-collapse" onclick="window.imageFilterSystem.toggleCollapse()" title="Contraer/Expandir">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                
                <div class="details-content">
                    <div class="details-left-panel">
                        <div class="apartment-specs">
                            <div class="spec-item">
                                <label>Habitación:</label>
                                <span>2</span>
                            </div>
                            <div class="spec-item">
                                <label>Área:</label>
                                <span>55,43 M²</span>
                            </div>
                            <div class="spec-item">
                                <label>Balcón:</label>
                                <span>12m²</span>
                            </div>
                            <div class="spec-item">
                                <label>Área:</label>
                                <span>4</span>
                            </div>
                        </div>
                        
                        <div class="orientation-section">
                            <label>Orientación:</label>
                            <span>Norte</span>
                        </div>
                        
                        ${apartment !== 'Casa' ? `
                        <div class="floor-type-section">
                            <label>Tipo de piso:</label>
                            <div class="floor-type-options">
                                <button class="floor-type-btn active">Tipo A</button>
                                <button class="floor-type-btn">Tipo B</button>
                                <button class="floor-type-btn">Tipo C</button>
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="floor-plan">
                            <h4>${apartment === 'Casa' ? 'Plano de la Casa' : 'Plano del Apartamento'}</h4>
                            <div class="floor-plan-image">
                                <img src="${apartment === 'Casa' ? 'video/imagenes/casa/planta-casa.png' : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBsYW5vIDNEIEFwYXJ0YW1lbnRvPC90ZXh0Pjwvc3ZnPg=='}" alt="${apartment === 'Casa' ? 'Plano de la Casa' : 'Plano 3D'}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBsYW5vIDNEIEFwYXJ0YW1lbnRvPC90ZXh0Pjwvc3ZnPg=='">
                            </div>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="btn-secondary" onclick="window.imageFilterSystem.sendPDF('${apartment}')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Enviar PDF
                            </button>
                            <button class="btn-primary quote-btn" onclick="window.imageFilterSystem.quoteModel('${apartment}')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                                </svg>
                                Cotizar Modelo
                            </button>
                        </div>
                    </div>
                    
                    <div class="details-right-panel">

                        
                        <div class="image-gallery">
                            <button class="gallery-nav prev" onclick="window.imageFilterSystem.prevImage()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            
                            <div class="thumbnail-container">
                                <div class="thumbnail active" data-index="0" onclick="window.imageFilterSystem.openImageModal(0)">
                                    <img src="video/imagenes/carrousel/car_01.png" alt="Imagen 1" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iSW1hZ2VuIDE8L3RleHQ+PC9zdmc+'">
                                </div>
                                <div class="thumbnail" data-index="1" onclick="window.imageFilterSystem.openImageModal(1)">
                                    <img src="video/imagenes/carrousel/car_02.png" alt="Imagen 2" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iSW1hZ2VuIDI8L3RleHQ+PC9zdmc+'">
                                </div>
                                <div class="thumbnail" data-index="2" onclick="window.imageFilterSystem.openImageModal(2)">
                                    <img src="video/imagenes/carrousel/car_03.png" alt="Imagen 3" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iSW1hZ2VuIDM8L3RleHQ+PC9zdmc+'">
                                </div>
                                <div class="thumbnail" data-index="3">
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJhw7FvPC90ZXh0Pjwvc3ZnPg==" alt="Baño" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJhw7FvPC90ZXh0Pjwvc3ZnPg==">
                                </div>
                            </div>
                            
                            <button class="gallery-nav next" onclick="window.imageFilterSystem.nextImage()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Reemplazar el contenido de la tarjeta
        card.innerHTML = detailsHTML;
        card.classList.add('details-mode');
        card.classList.remove('recorrido-active');
        
        // Animación de expansión INMEDIATA
        card.style.transform = 'scale(1)';
        card.style.opacity = '1';
        card.style.transition = 'all 0.3s ease';
        
        // Agregar estilos específicos para el modo detalles
        this.addDetailsModeStyles();
        
        // Inicializar el carrusel
        this.initializeImageCarousel();
        
        console.log('✅ Tarjeta transformada a modo detalles');
    }
    
    transformCardToHouseDetails(card, apartment, superficie, precio) {
        // Crear el nuevo contenido con carrusel - EXACTAMENTE igual que transformCardToDetails
        const detailsHTML = `
            <div class="apartment-details-mode">
                <div class="details-header">
                    <button class="btn-back attention-mode" onclick="window.imageFilterSystem.exitHouseDetailsMode()" style="position: relative;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        Volver
                        <div class="button-particles" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; pointer-events: none; z-index: 1;">
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 0s infinite normal none running particleFloat;"></div>
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 0.2s infinite normal none running particleFloat;"></div>
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 0.4s infinite normal none running particleFloat;"></div>
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 0.6s infinite normal none running particleFloat;"></div>
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 0.8s infinite normal none running particleFloat;"></div>
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 1s infinite normal none running particleFloat;"></div>
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 1.2s infinite normal none running particleFloat;"></div>
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 1.4s infinite normal none running particleFloat;"></div>
                        </div>
                    </button>
                    <h3 class="details-title">${apartment}</h3>
                    <button class="btn-collapse" onclick="window.imageFilterSystem.toggleCollapse()" title="Contraer/Expandir">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="details-content">
                    <div class="details-left-panel">
                        <div class="apartment-specs">
                            <div class="spec-item">
                                <label>Habitación:</label>
                                <span>2</span>
                            </div>
                            <div class="spec-item">
                                <label>Área:</label>
                                <span>55,43 M²</span>
                            </div>
                            <div class="spec-item">
                                <label>Balcón:</label>
                                <span>12m²</span>
                            </div>
                            <div class="spec-item">
                                <label>Área:</label>
                                <span>4</span>
                            </div>
                        </div>
                        
                        <div class="orientation-section">
                            <label>Orientación:</label>
                            <span>Norte</span>
                        </div>
                        
                        <div class="floor-type-section">
                            <label>Tipo de piso:</label>
                            <div class="floor-type-options">
                                <button class="floor-type-btn active">Tipo A</button>
                                <button class="floor-type-btn">Tipo B</button>
                                <button class="floor-type-btn">Tipo C</button>
                            </div>
                        </div>
                        
                        <div class="floor-plan">
                            <h4>Plano del Apartamento</h4>
                            <div class="floor-plan-image">
                                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBsYW5vIDNEIEFwYXJ0YW1lbnRvPC90ZXh0Pjwvc3ZnPg==" plano="" 3d"="" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBsYW5vIDNEIEFwYXJ0YW1lbnRvPC90ZXh0Pjwvc3ZnPg=='">
                            </div>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="btn-secondary" onclick="window.imageFilterSystem.sendPDF('${apartment}')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line>
                                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line>
                                    <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline>
                                </svg>
                                Enviar PDF
                            </button>
                            <button class="btn-primary quote-btn" onclick="window.imageFilterSystem.quoteModel('${apartment}')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"></path>
                                </svg>
                                Cotizar Modelo
                            </button>
                        </div>
                    </div>
                    
                    <div class="details-right-panel">
                        <div class="image-gallery">
                            <button class="gallery-nav prev" onclick="window.imageFilterSystem.prevImage()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </button>
                            
                            <div class="thumbnail-container">
                                <div class="thumbnail active" data-index="0" onclick="window.imageFilterSystem.openImageModal(0)">
                                    <img src="video/imagenes/carrousel/car_01.png" alt="Imagen 1" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iSW1hZ2VuIDE8L3RleHQ+PC9zdmc+'">
                                </div>
                                <div class="thumbnail" data-index="1" onclick="window.imageFilterSystem.openImageModal(1)">
                                    <img src="video/imagenes/carrousel/car_02.png" alt="Imagen 2" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iSW1hZ2VuIDI8L3RleHQ+PC9zdmc+'">
                                </div>
                                <div class="thumbnail" data-index="2" onclick="window.imageFilterSystem.openImageModal(2)">
                                    <img src="video/imagenes/carrousel/car_03.png" alt="Imagen 3" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMVAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iSW1hZ2VuIDM8L3RleHQ+PC9zdmc+'">
                                </div>
                                <div class="thumbnail" data-index="3">
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJhw7FvPC90ZXh0Pjwvc3ZnPg==" alt="Baño" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJhw7FvPC90ZXh0Pjwvc3ZnPg==">
                                </div>
                            </div>
                            
                            <button class="gallery-nav next" onclick="window.imageFilterSystem.nextImage()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Reemplazar el contenido de la tarjeta
        card.innerHTML = detailsHTML;
        card.classList.add('details-mode');
        card.classList.remove('recorrido-active');
        
        // Animación de expansión INMEDIATA
        card.style.transform = 'scale(1)';
        card.style.opacity = '1';
        card.style.transition = 'all 0.3s ease';
        
        // Agregar estilos específicos para el modo detalles
        this.addDetailsModeStyles();
        
        // Inicializar el carrusel
        this.initializeImageCarousel();
        
        console.log('✅ Tarjeta de casa transformada a modo detalles');
    }
    
    addDetailsModeStyles() {
        if (document.getElementById('detailsModeStyles')) return;
        
        const styles = `
            <style id="detailsModeStyles">
                .apartment-card.details-mode {
                    max-width: 700px !important;
                    width: 80% !important;
                    height: auto !important;
                    min-height: 400px !important;
                    background: rgba(0, 0, 0, 0.9) !important;
                    border: 2px solid rgba(255, 255, 255, 0.2) !important;
                    border-radius: 15px !important;
                    overflow: hidden !important;
                    margin-left: 0 !important;
                    margin-right: auto !important;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                
                .apartment-card.details-mode.collapsed {
                    max-width: 60px !important;
                    width: 60px !important;
                    min-height: 60px !important;
                    overflow: hidden !important;
                }
                
                .apartment-card.details-mode.collapsed .details-content {
                    opacity: 0 !important;
                    transform: translateX(-100%) !important;
                    pointer-events: none !important;
                }
                
                .apartment-card.details-mode.collapsed .details-title {
                    opacity: 0 !important;
                    transform: translateX(-100%) !important;
                }
                
                .apartment-card.details-mode.collapsed .btn-back {
                    position: absolute !important;
                    top: 10px !important;
                    left: 10px !important;
                    width: 40px !important;
                    height: 40px !important;
                    padding: 8px !important;
                    border-radius: 50% !important;
                    opacity: 1 !important;
                    transform: none !important;
                    z-index: 15 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    background: linear-gradient(135deg, #007bff, #00d4ff) !important;
                    border: 2px solid rgba(255, 255, 255, 0.3) !important;
                    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4) !important;
                    font-size: 0 !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                }
                
                .apartment-card.details-mode.collapsed .btn-back::after {
                    content: "" !important;
                }
                
                .apartment-card.details-mode.collapsed .btn-back svg {
                    width: 20px !important;
                    height: 20px !important;
                    color: white !important;
                    flex-shrink: 0 !important;
                }
                
                .apartment-card.details-mode.collapsed .btn-back svg path {
                    stroke: white !important;
                    stroke-width: 2 !important;
                }
                
                /* Animaciones suaves para el contenido */
                .details-content {
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                
                .details-title {
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                
                .btn-back {
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                
                /* Estado colapsado - solo mostrar el botón de contraer */
                .apartment-card.details-mode.collapsed .btn-collapse {
                    position: absolute !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    margin: 0 !important;
                    z-index: 10 !important;
                }
                
                .apartment-card.details-mode.collapsed .btn-collapse svg {
                    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                
                /* Estilos para el botón de recorrer del hero */
                .hero-recorrer-btn {
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%) !important;
                    border: none !important;
                    color: #000 !important;
                    padding: 1rem 2rem !important;
                    border-radius: 12px !important;
                    font-weight: 600 !important;
                    font-size: 1.1rem !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3) !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 0.5rem !important;
                }
                
                .hero-recorrer-btn:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4) !important;
                }
                
                .hero-recorrer-btn:active {
                    transform: translateY(0) !important;
                }
                
                /* Modo video del hero */
                .hero-video-mode .preview-hero {
                    background: transparent !important;
                }
                
                .hero-video-mode .background-video {
                    opacity: 1 !important;
                    z-index: 1 !important;
                }
                
                /* Estilos para controles de video */
                .video-controls {
                    position: fixed !important;
                    bottom: 2rem !important;
                    left: 50% !important;
                    transform: translateX(-50%) translateY(20px) !important;
                    z-index: 1000 !important;
                    display: flex !important;
                    gap: 1rem !important;
                    align-items: center !important;
                    opacity: 0 !important;
                    transition: all 0.3s ease !important;
                }
                
                .video-controls.show {
                    opacity: 1 !important;
                    transform: translateX(-50%) translateY(0) !important;
                }
                
                .btn-video-control {
                    padding: 0.8rem 1.5rem !important;
                    border-radius: 10px !important;
                    font-weight: 600 !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 0.5rem !important;
                    border: none !important;
                }
                
                .btn-video-control.btn-next {
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%) !important;
                    color: #000 !important;
                    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3) !important;
                }
                
                .btn-video-control.btn-next:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4) !important;
                }
                
                .btn-video-control.btn-stop {
                    background: rgba(255, 255, 255, 0.2) !important;
                    border: 1px solid rgba(255, 255, 255, 0.3) !important;
                    color: white !important;
                    backdrop-filter: blur(10px) !important;
                }
                
                .btn-video-control.btn-stop:hover {
                    background: rgba(255, 255, 255, 0.3) !important;
                    transform: translateY(-2px) !important;
                }
                
                /* Indicador de cambio de video */
                .video-change-indicator {
                    position: fixed !important;
                    top: 2rem !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    background: rgba(0, 0, 0, 0.8) !important;
                    color: white !important;
                    padding: 1rem 2rem !important;
                    border-radius: 10px !important;
                    font-weight: 600 !important;
                    z-index: 1001 !important;
                    backdrop-filter: blur(10px) !important;
                    opacity: 0 !important;
                    transition: all 0.3s ease !important;
                }
                
                .apartment-list:has(.apartment-card.details-mode) {
                    justify-content: flex-start !important;
                    align-items: flex-start !important;
                }
                
                /* Ocultar el fondo oscuro cuando está en modo detalles */
                .apartments-section:has(.apartment-card.details-mode) {
                    background: transparent !important;
                    backdrop-filter: none !important;
                }
                
                .apartments-content:has(.apartment-card.details-mode) {
                    background: transparent !important;
                    backdrop-filter: none !important;
                }
                
                /* Ocultar títulos cuando está en modo detalles */
                .apartments-section:has(.apartment-card.details-mode) .section-title,
                .apartments-section:has(.apartment-card.details-mode) .section-subtitle {
                    display: none !important;
                }
                
                /* Mejorar visibilidad del video de fondo en modo detalles */
                .apartments-section:has(.apartment-card.details-mode) {
                    position: relative;
                    z-index: 1;
                    background: transparent !important;
                    backdrop-filter: none !important;
                }
                
                .apartments-section:has(.apartment-card.details-mode)::before {
                    display: none !important;
                }
                
                /* Asegurar que el contenido también sea transparente */
                .apartments-section:has(.apartment-card.details-mode) .apartments-content {
                    background: transparent !important;
                    backdrop-filter: none !important;
                    box-shadow: none !important;
                }
                
                /* Ocultar overlay gradiente inmediatamente */
                .apartments-section.details-mode-active::before {
                    display: none !important;
                    opacity: 0 !important;
                }
                
                /* Clase para activar modo detalles inmediatamente */
                .apartments-section.details-mode-active {
                    background: transparent !important;
                    backdrop-filter: none !important;
                    transition: none !important;
                }
                
                .apartments-section.details-mode-active .apartments-content {
                    background: transparent !important;
                    backdrop-filter: none !important;
                    box-shadow: none !important;
                    transition: none !important;
                }
                
                .apartments-section.details-mode-active .section-title,
                .apartments-section.details-mode-active .section-subtitle {
                    display: none !important;
                    transition: none !important;
                }
                
                .apartments-section.details-mode-active .apartments-content {
                    background: transparent !important;
                    backdrop-filter: none !important;
                    box-shadow: none !important;
                }
                
                .apartments-section.details-mode-active .section-title,
                .apartments-section.details-mode-active .section-subtitle {
                    display: none !important;
                }
                
                .apartment-details-mode {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    color: white;
                }
                
                .details-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                    background: rgba(255, 255, 255, 0.05);
                }
                
                .btn-back {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 0.4rem 0.8rem;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.8rem;
                    transition: all 0.3s ease;
                }
                
                .btn-back:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .btn-collapse {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 0.4rem 0.8rem;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.8rem;
                    transition: all 0.3s ease;
                    margin-left: auto;
                }
                
                .btn-collapse:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.05);
                }
                
                .btn-collapse.collapsed svg {
                    transform: rotate(180deg);
                }
                
                .details-title {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                }
                
                .details-content {
                    display: flex;
                    flex: 1;
                    gap: 1rem;
                    padding: 0.75rem;
                }
                
                .details-left-panel {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .apartment-specs {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.75rem;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .spec-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.4rem;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                }
                
                .spec-item label {
                    color: #cccccc;
                    font-size: 0.75rem;
                }
                
                .spec-item span {
                    color: white;
                    font-weight: 600;
                    font-size: 0.8rem;
                }
                
                .orientation-section {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.6rem;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .orientation-section label {
                    color: #cccccc;
                    font-size: 0.75rem;
                    display: block;
                    margin-bottom: 0.3rem;
                }
                
                .orientation-section span {
                    color: white;
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                
                .floor-type-section {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.6rem;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .floor-type-section label {
                    color: #cccccc;
                    font-size: 0.75rem;
                    display: block;
                    margin-bottom: 0.3rem;
                }
                
                .floor-type-options {
                    display: flex;
                    gap: 0.4rem;
                }
                
                .floor-type-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 0.3rem 0.6rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 0.75rem;
                    transition: all 0.3s ease;
                }
                
                .floor-type-btn.active {
                    background: #FFD700;
                    color: #000;
                    border-color: #FFD700;
                }
                
                .floor-type-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .floor-plan {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.6rem;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .floor-plan h4 {
                    margin: 0 0 0.5rem 0;
                    color: white;
                    font-size: 0.9rem;
                }
                
                .floor-plan-image {
                    width: 100%;
                    height: 120px;
                    border-radius: 6px;
                    overflow: hidden;
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .floor-plan-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: auto;
                }
                
                .action-buttons button {
                    flex: 1;
                    padding: 0.6rem;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.4rem;
                    transition: all 0.3s ease;
                    border: none;
                    font-size: 0.75rem;
                }
                
                .action-buttons .btn-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                
                .action-buttons .btn-primary {
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                    color: #000;
                }
                
                .action-buttons button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                }
                
                .details-right-panel {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    justify-content: center;
                }
                
                .image-gallery {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.6rem;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .gallery-nav {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                
                .gallery-nav:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .thumbnail-container {
                    display: flex;
                    gap: 0.4rem;
                    flex: 1;
                    overflow-x: auto;
                    padding: 0.4rem 0;
                }
                
                .thumbnail {
                    min-width: 60px;
                    height: 40px;
                    border-radius: 6px;
                    overflow: hidden;
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .thumbnail.active {
                    border-color: #FFD700;
                    transform: scale(1.05);
                }
                
                .thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .thumbnail:hover {
                    transform: scale(1.05);
                }
                
                @media (max-width: 768px) {
                    .details-content {
                        flex-direction: column;
                    }
                    
                    .apartment-specs {
                        grid-template-columns: 1fr;
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                    }
                }
                
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    initializeImageCarousel() {
        this.currentImageIndex = 0;
        this.images = [
            'video/imagenes/carrousel/car_01.png',
            'video/imagenes/carrousel/car_02.png',
            'video/imagenes/carrousel/car_03.png',
            'video/imagenes/carrousel/car_04.png',
            'video/imagenes/carrousel/car_05.png',
            'video/imagenes/carrousel/car_06.png'
        ];
        
        // Agregar event listeners a los thumbnails (si existen)
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que se propague al click del thumbnail
                this.openImageModal(index);
            });
        });
        
        console.log('✅ Carrusel de imágenes inicializado con 6 imágenes');
    }
    
    showImage(index) {
        this.currentImageIndex = index;
        
        // Actualizar imagen principal
        const mainImage = document.querySelector('.main-image');
        if (mainImage) {
            mainImage.src = this.images[index];
        }
        
        // Actualizar thumbnails activos
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumbnail, i) => {
            if (i === index) {
                thumbnail.classList.add('active');
            } else {
                thumbnail.classList.remove('active');
            }
        });
        
        console.log('🖼️ Imagen cambiada a índice:', index);
    }
    
    nextImage() {
        const nextIndex = (this.currentImageIndex + 1) % this.images.length;
        this.showImage(nextIndex);
    }
    
    prevImage() {
        const prevIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.showImage(prevIndex);
    }
    
    exitDetailsMode() {
        console.log('🚪 Saliendo del modo detalles...');
        
        // Remover el video de fondo de detalles
        this.removeDetailsBackgroundVideo();
        
        // Remover efectos de atención del botón volver
        this.removeBackButtonAttention();
        
        // Desbloquear el scroll
        this.unlockScroll();
        
        // Encontrar la tarjeta en modo detalles
        const detailsCard = document.querySelector('.apartment-card.details-mode');
        if (!detailsCard) return;
        
        // Verificar si estamos en modo de recorrido
        const isInRecorridoMode = document.body.classList.contains('recorrido-mode') || 
                                 document.querySelector('#recorridoControls') !== null;
        
        // Restaurar la tarjeta original
        this.restoreOriginalCard(detailsCard);
        
        // Remover estilos específicos
        const styles = document.getElementById('detailsModeStyles');
        if (styles) styles.remove();
        
        // Si estábamos en modo de recorrido, salir también del recorrido
        if (isInRecorridoMode) {
            console.log('🔄 También saliendo del modo recorrido...');
            this.exitRecorridoMode();
        }
        
        console.log('✅ Modo detalles desactivado');
    }
    
    restoreOriginalCard(card) {
        // Verificar si es una tarjeta de casa
        const isHouseCard = card.classList.contains('house-card');
        
        // Restaurar el contenido original de la tarjeta
        const apartment = card.querySelector('.details-title')?.textContent || (isHouseCard ? 'Casa' : '1 Dormitorio');
        const superficie = isHouseCard ? 'Variable' : '40-60 m²';
        const precio = isHouseCard ? 'Consultar' : '$2.000-3.000 UF';
        const tipo = isHouseCard ? 'Casa Independiente' : this.getTipoDepartamentoFromText(apartment, superficie, precio);
        
        // Restaurar el fondo de la sección
        const apartmentsSection = document.querySelector('.apartments-section');
        if (apartmentsSection) {
            apartmentsSection.classList.remove('details-mode-active');
            apartmentsSection.style.background = '';
            apartmentsSection.style.backdropFilter = '';
        }
        
        const apartmentsContent = document.querySelector('.apartments-content');
        if (apartmentsContent) {
            apartmentsContent.style.background = '';
            apartmentsContent.style.backdropFilter = '';
            apartmentsContent.style.boxShadow = '';
        }
        
        // Restaurar títulos
        const sectionTitle = document.querySelector('.apartments-section .section-title');
        if (sectionTitle) {
            sectionTitle.style.display = '';
        }
        
        const sectionSubtitle = document.querySelector('.apartments-section .section-subtitle');
        if (sectionSubtitle) {
            sectionSubtitle.style.display = '';
        }
        
        // Limpiar estado de contracción
        card.classList.remove('collapsed');
        const collapseBtn = document.querySelector('.btn-collapse');
        if (collapseBtn) {
            collapseBtn.classList.remove('collapsed');
        }
        
        // Generar HTML original según el tipo de tarjeta
        let originalHTML;
        if (isHouseCard) {
            originalHTML = `
                <div class="apartment-image">
                    <img src="video/imagenes/casa/casa1.jpeg" alt="Casa" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iQ2FzYSBQcmV2aWV3PC90ZXh0Pjwvc3ZnPg=='">
                </div>
                <div class="apartment-info">
                    <h3>${apartment}</h3>
                    <p><strong>Superficie:</strong> ${superficie}</p>
                    <p><strong>Precio:</strong> ${precio}</p>
                    <p><strong>Tipo:</strong> ${tipo}</p>
                    <div class="apartment-actions">
                        <button class="btn-secondary watchVideoBtn" data-apartment="${apartment}" data-superficie="${superficie}" data-precio="${precio}" data-tipo-departamento="${tipo}" data-tipo="casa" data-superficie-code="casa" data-precio-code="casa" data-index="1">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5v14l11-7z" fill="currentColor"></path>
                            </svg>
                            Recorrer
                        </button>
                        <button class="btn-primary contactModelBtn" data-apartment="${apartment}" data-superficie="${superficie}" data-precio="${precio}">
                            Solicitar Información
                        </button>
                    </div>
                </div>
            `;
        } else {
            originalHTML = `
                <div class="apartment-image">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiAxPC90ZXh0Pjwvc3ZnPg==" alt="${apartment}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiAxPC90ZXh0Pjwvc3ZnPg=='">
                </div>
                <div class="apartment-info">
                    <h3>${apartment}</h3>
                    <p><strong>Superficie:</strong> ${superficie}</p>
                    <p><strong>Precio:</strong> ${precio}</p>
                    <p><strong>Tipo de Departamento:</strong> ${tipo}</p>
                    <div class="apartment-actions">
                        <button class="btn-secondary watchVideoBtn" data-apartment="${apartment}" data-superficie="${superficie}" data-precio="${precio}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5v14l11-7z" fill="currentColor"></path>
                            </svg>
                            Recorrer
                        </button>
                        <button class="btn-primary contactModelBtn" data-apartment="${apartment}" data-superficie="${superficie}" data-precio="${precio}">
                            Solicitar Información
                        </button>
                    </div>
                </div>
            `;
        }
        
        card.innerHTML = originalHTML;
        card.classList.remove('details-mode');
        card.classList.add('recorrido-active');
        
        // Restaurar estilos originales
        card.style.maxWidth = '';
        card.style.width = '';
        card.style.height = '';
        card.style.minHeight = '';
        card.style.background = '';
        card.style.border = '';
        card.style.borderRadius = '';
        card.style.overflow = '';
        
        console.log('✅ Tarjeta original restaurada', isHouseCard ? '(Casa)' : '(Apartamento)');
    }
    
    sendPDF(apartment) {
        console.log('📄 Abriendo modal para enviar PDF:', apartment);
        
        // Remover modal existente si hay uno
        const existingModal = document.getElementById('pdfModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modalHTML = `
            <div class="modal-overlay" id="pdfModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;">
                <div class="modal" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 15px; max-width: 500px; width: 90%; backdrop-filter: blur(10px);">
                    <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.2);">
                        <h3 style="margin: 0; color: white; font-size: 1.5rem; font-weight: 600;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 0.5rem; display: inline-block; vertical-align: middle;">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Enviar PDF
                        </h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0.5rem;">&times;</button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <div style="background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.2); margin-bottom: 1.5rem;">
                            <h4 style="margin: 0 0 1rem 0; color: white; font-size: 1.2rem;">${apartment}</h4>
                            <p style="margin: 0; color: #cccccc; font-size: 0.95rem;">Ingresa tu correo electrónico para recibir el PDF con toda la información del apartamento.</p>
                        </div>
                        
                        <form id="pdfForm" onsubmit="window.imageFilterSystem.submitPDFForm(event, '${apartment}')" style="display: flex; flex-direction: column; gap: 1rem;">
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <label for="email" style="color: white; font-size: 0.9rem; font-weight: 500;">Correo Electrónico</label>
                                <input type="email" id="email" name="email" required 
                                       placeholder="tu@correo.com"
                                       style="padding: 1rem; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 8px; color: white; font-size: 1rem; transition: all 0.3s ease;"
                                       onfocus="this.style.borderColor='#FFD700'; this.style.background='rgba(255, 255, 255, 0.15)'"
                                       onblur="this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.background='rgba(255, 255, 255, 0.1)'">
                                <div id="emailError" style="color: #ff6b6b; font-size: 0.8rem; display: none;"></div>
                            </div>
                            
                            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                                <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove()" 
                                        style="flex: 1; padding: 1rem; background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                                    Cancelar
                                </button>
                                <button type="submit" class="btn-primary" id="submitBtn"
                                        style="flex: 1; padding: 1rem; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    Enviar PDF
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Agregar event listener para cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('pdfModal');
                if (modal) modal.remove();
            }
        });
        
        // Focus en el input de email
        setTimeout(() => {
            const emailInput = document.getElementById('email');
            if (emailInput) emailInput.focus();
        }, 100);
        
        console.log('✅ Modal de PDF abierto');
    }
    
    submitPDFForm(event, apartment) {
        event.preventDefault();
        
        const emailInput = document.getElementById('email');
        const submitBtn = document.getElementById('submitBtn');
        const emailError = document.getElementById('emailError');
        
        const email = emailInput.value.trim();
        
        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailError.textContent = 'Por favor ingresa un correo electrónico válido';
            emailError.style.display = 'block';
            emailInput.style.borderColor = '#ff6b6b';
            return;
        }
        
        // Ocultar error si existe
        emailError.style.display = 'none';
        emailInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        
        // Cambiar estado del botón
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;">
                <path d="M21 12a9 9 0 11-6.219-8.56" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Enviando...
        `;
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        // Simular envío (aquí puedes implementar la lógica real)
        setTimeout(() => {
            console.log('📧 PDF enviado a:', email, 'para apartamento:', apartment);
            
            // Mostrar mensaje de éxito
            const modal = document.getElementById('pdfModal');
            if (modal) {
                modal.innerHTML = `
                    <div class="modal-overlay" id="pdfModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;">
                        <div class="modal" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 15px; max-width: 500px; width: 90%; backdrop-filter: blur(10px); text-align: center;">
                            <div class="modal-body" style="padding: 2rem;">
                                <div style="margin-bottom: 1.5rem;">
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: #4CAF50;">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h3 style="margin: 0 0 1rem 0; color: white; font-size: 1.5rem; font-weight: 600;">¡PDF Enviado!</h3>
                                <p style="margin: 0 0 1.5rem 0; color: #cccccc; font-size: 1rem;">El PDF con la información de <strong>${apartment}</strong> ha sido enviado a <strong>${email}</strong></p>
                                <button class="btn-primary" onclick="this.closest('.modal-overlay').remove()" 
                                        style="padding: 1rem 2rem; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }
            
        }, 2000); // Simular 2 segundos de envío
        
        console.log('✅ Formulario de PDF enviado');
    }
    
    quoteModel(apartment) {
        console.log('💰 Cotizando modelo:', apartment);
        // Aquí puedes implementar la lógica para cotizar
        this.createContactModal(apartment, '40-60 m²', '$2.000-3.000 UF');
    }
    
    openImageModal(imageIndex) {
        console.log('🖼️ Abriendo imagen en modal:', imageIndex);
        
        // Remover modal existente si hay uno
        const existingModal = document.getElementById('imageModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const imageUrl = this.images[imageIndex];
        const imageTitle = `Imagen ${imageIndex + 1} del Apartamento`;
        
        const modalHTML = `
            <div class="modal-overlay" id="imageModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.95); display: flex; align-items: center; justify-content: center; z-index: 10000;">
                <div class="image-modal-container" style="position: relative; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column; align-items: center;">
                    
                    <!-- Header del modal -->
                    <div class="image-modal-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 1rem 2rem; background: rgba(0, 0, 0, 0.8); border-radius: 10px 10px 0 0;">
                        <h3 style="margin: 0; color: white; font-size: 1.2rem; font-weight: 600;">${imageTitle}</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); color: white; font-size: 1.5rem; cursor: pointer; padding: 0.5rem; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                            &times;
                        </button>
                    </div>
                    
                    <!-- Imagen principal -->
                    <div class="image-modal-content" style="position: relative; max-width: 100%; max-height: 80vh; overflow: hidden; border-radius: 0 0 10px 10px; background: rgba(0, 0, 0, 0.5);">
                        <img src="${imageUrl}" alt="${imageTitle}" style="max-width: 100%; max-height: 100%; object-fit: contain; display: block;" 
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiAke imageIndex + 1}</dGV4dD48L3N2Zz4='">
                        
                        <!-- Botón anterior -->
                        <button class="modal-nav-btn prev" onclick="window.imageFilterSystem.prevImageModal()" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background: rgba(0, 0, 0, 0.7); border: 1px solid rgba(255, 255, 255, 0.3); color: white; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; transition: all 0.3s ease;">
                            &#8249;
                        </button>
                        
                        <!-- Botón siguiente -->
                        <button class="modal-nav-btn next" onclick="window.imageFilterSystem.nextImageModal()" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: rgba(0, 0, 0, 0.7); border: 1px solid rgba(255, 255, 255, 0.3); color: white; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; transition: all 0.3s ease;">
                            &#8250;
                        </button>
                    </div>
                    
                    <!-- Footer con navegación -->
                    <div class="image-modal-footer" style="display: flex; align-items: center; gap: 1rem; padding: 1rem 2rem; background: rgba(0, 0, 0, 0.8); border-radius: 0 0 10px 10px; width: 100%; justify-content: center;">
                        <span style="color: white; font-size: 0.9rem;">${imageIndex + 1} de ${this.images.length}</span>
                        <div style="display: flex; gap: 0.5rem;">
                            ${this.images.map((_, i) => `
                                <div class="modal-indicator ${i === imageIndex ? 'active' : ''}" 
                                     onclick="window.imageFilterSystem.openImageModal(${i})"
                                     style="width: 8px; height: 8px; border-radius: 50%; background: ${i === imageIndex ? '#FFD700' : 'rgba(255, 255, 255, 0.5)'}; cursor: pointer; transition: all 0.3s ease;">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Guardar el índice actual
        this.currentModalImageIndex = imageIndex;
        
        // Agregar event listeners
        document.addEventListener('keydown', this.handleModalKeyboard.bind(this));
        
        // Agregar efecto hover a los botones
        const modalNavBtns = document.querySelectorAll('.modal-nav-btn');
        modalNavBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(255, 255, 255, 0.2)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(0, 0, 0, 0.7)';
            });
        });
        
        const closeBtn = document.querySelector('.modal-close');
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        console.log('✅ Modal de imagen abierto');
    }
    
    handleModalKeyboard(e) {
        if (e.key === 'Escape') {
            this.closeImageModal();
        } else if (e.key === 'ArrowLeft') {
            this.prevImageModal();
        } else if (e.key === 'ArrowRight') {
            this.nextImageModal();
        }
    }
    
    closeImageModal() {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.remove();
        }
        document.removeEventListener('keydown', this.handleModalKeyboard.bind(this));
    }
    
    nextImageModal() {
        const nextIndex = (this.currentModalImageIndex + 1) % this.images.length;
        this.openImageModal(nextIndex);
    }
    
    prevImageModal() {
        const prevIndex = (this.currentModalImageIndex - 1 + this.images.length) % this.images.length;
        this.openImageModal(prevIndex);
    }
    
    setupBackButton() {
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Mostrar confirmación antes de recargar
                if (confirm('¿Estás seguro de que quieres volver al inicio? Se perderá el progreso actual.')) {
                    console.log('🔄 Recargando página desde botón Volver...');
                    
                    // Agregar efecto visual antes de recargar
                    backButton.style.transform = 'scale(0.95)';
                    backButton.style.opacity = '0.7';
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 200);
                }
            });
            
            // Efectos hover adicionales
            backButton.addEventListener('mouseenter', () => {
                backButton.style.transform = 'scale(1.05)';
                backButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            });
            
            backButton.addEventListener('mouseleave', () => {
                backButton.style.transform = 'scale(1)';
                backButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
            });
            
            console.log('✅ Botón Volver configurado');
        }
    }
    
    setupProjectTypeSelector() {
        // Detectar cambios en el selector de proyecto (Apartamento/Casa)
        const radioOptions = document.querySelectorAll('.radio-option');
        
        radioOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remover selección previa
                radioOptions.forEach(o => o.classList.remove('selected'));
                // Agregar selección actual
                option.classList.add('selected');
                
                // Determinar el tipo seleccionado
                const label = option.querySelector('.radio-label');
                if (label) {
                    const projectType = label.textContent.toLowerCase().trim();
                    this.updateProjectType(projectType);
                }
            });
        });
        
        // Detectar el tipo inicial seleccionado
        this.detectInitialProjectType();
        
        console.log('✅ Project type selector setup complete');
    }
    
    detectInitialProjectType() {
        // Buscar la opción seleccionada inicialmente
        const selectedOption = document.querySelector('.radio-option.selected');
        if (selectedOption) {
            const label = selectedOption.querySelector('.radio-label');
            if (label) {
                const projectType = label.textContent.toLowerCase().trim();
                this.updateProjectType(projectType);
                console.log(`🏠 Initial project type detected: ${projectType}`);
            }
        }
    }
    
    updateProjectType(type) {
        console.log(`🏠 Project type changed to: ${type}`);
        this.currentProjectType = type;
        
        // Actualizar el sistema según el tipo de proyecto
        if (type === 'casa') {
            console.log('🏡 Switching to Casa mode');
            this.showHouseCard();
        } else {
            console.log('🏢 Switching to Apartamento mode');
            this.showApartmentFilters();
        }
    }
    
    showHouseCard() {
        const apartmentsContent = document.querySelector('.apartments-content');
        if (!apartmentsContent) return;
        
        const apartmentList = document.getElementById('apartmentList');
        const initialMessage = document.getElementById('initialMessage');
        const apartmentTypeSelector = document.querySelector('.apartment-type-selector');
        const apartmentFilters = document.querySelector('.apartment-filters');
        
        // Ocultar elementos de apartamentos
        if (apartmentList) apartmentList.style.display = 'none';
        if (initialMessage) initialMessage.style.display = 'none';
        if (apartmentTypeSelector) apartmentTypeSelector.style.display = 'none';
        if (apartmentFilters) apartmentFilters.style.display = 'none';
        
        // Cambiar título y subtítulo
        const sectionTitle = apartmentsContent.querySelector('.section-title');
        const sectionSubtitle = apartmentsContent.querySelector('.section-subtitle');
        
        if (sectionTitle) sectionTitle.textContent = 'Descubre nuestras exclusivas casas';
        if (sectionSubtitle) sectionSubtitle.textContent = 'Con las mejores vistas y acabados de lujo';
        
        // Verificar si ya existe una card de casa
        const existingHouseCard = document.querySelector('.house-card');
        if (!existingHouseCard) {
            // Crear y mostrar la card de casa solo si no existe
            this.createHouseCard();
        } else {
            // Si ya existe, asegurar que esté visible
            existingHouseCard.style.display = 'block';
        }
    }
    
    showApartmentFilters() {
        const apartmentsContent = document.querySelector('.apartments-content');
        if (!apartmentsContent) return;
        
        const apartmentList = document.getElementById('apartmentList');
        const initialMessage = document.getElementById('initialMessage');
        const apartmentTypeSelector = document.querySelector('.apartment-type-selector');
        const apartmentFilters = document.querySelector('.apartment-filters');
        
        // Mostrar elementos de apartamentos
        if (apartmentList) apartmentList.style.display = 'none';
        if (initialMessage) initialMessage.style.display = 'block';
        if (apartmentTypeSelector) apartmentTypeSelector.style.display = 'flex';
        if (apartmentFilters) apartmentFilters.style.display = 'flex';
        
        // Restaurar título y subtítulo originales
        const sectionTitle = apartmentsContent.querySelector('.section-title');
        const sectionSubtitle = apartmentsContent.querySelector('.section-subtitle');
        
        if (sectionTitle) sectionTitle.textContent = 'Descubre nuestros exclusivos apartamentos';
        if (sectionSubtitle) sectionSubtitle.textContent = 'Con las mejores vistas y acabados de lujo';
        
        // Remover card de casa si existe
        const existingHouseCard = document.querySelector('.house-card');
        if (existingHouseCard) {
            existingHouseCard.remove();
        }
    }
    
    createHouseCard() {
        const apartmentsContent = document.querySelector('.apartments-content');
        
        // Remover card de casa existente si hay una
        const existingHouseCard = document.querySelector('.house-card');
        if (existingHouseCard) {
            existingHouseCard.remove();
        }
        
        // Crear la card de casa
        const houseCard = document.createElement('div');
        houseCard.className = 'house-card apartment-card';
        houseCard.style.cssText = `
            animation: 0.5s ease 0s 1 normal none running fadeInUp;
            display: block;
            max-width: 400px;
            margin: 2rem auto;
        `;
        
        houseCard.innerHTML = `
            <div class="apartment-image">
                <img src="video/imagenes/casa/casa1.jpeg" alt="Casa" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iQ2FzYSBQcmV2aWV3PC90ZXh0Pjwvc3ZnPg=='">
            </div>
            <div class="apartment-info">
                <h3>Casa</h3>
                <p><strong>Superficie:</strong> Variable</p>
                <p><strong>Precio:</strong> Consultar</p>
                <p><strong>Tipo:</strong> Casa Independiente</p>
                <div class="apartment-actions">
                    <button class="btn-secondary watchVideoBtn" data-apartment="Casa" data-superficie="Variable" data-precio="Consultar" data-tipo-departamento="Casa Independiente" data-tipo="casa" data-superficie-code="casa" data-precio-code="casa" data-index="1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5v14l11-7z" fill="currentColor"></path>
                        </svg>
                        Recorrer
                    </button>
                    <button class="btn-primary contactModelBtn" data-apartment="Casa" data-superficie="Variable" data-precio="Consultar">
                        Solicitar Información
                    </button>
                </div>
            </div>
        `;
        
        // Insertar después del subtítulo
        const sectionSubtitle = apartmentsContent.querySelector('.section-subtitle');
        if (sectionSubtitle) {
            sectionSubtitle.insertAdjacentElement('afterend', houseCard);
        } else {
            apartmentsContent.appendChild(houseCard);
        }
        
        // Agregar event listeners a los botones de la casa
        this.addHouseCardEventListeners(houseCard);
    }
    
    addHouseCardEventListeners(houseCard) {
        const watchVideoBtn = houseCard.querySelector('.watchVideoBtn');
        const contactBtn = houseCard.querySelector('.contactModelBtn');
        
        if (watchVideoBtn) {
            watchVideoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🎬 Iniciando recorrido de casa');
                // Iniciar el recorrido de casa
                this.startHouseTour();
            });
        }
        
        if (contactBtn) {
            contactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📞 Mostrando detalles de casa');
                // Mostrar detalles de casa
                this.showHouseDetails();
            });
        }
    }
    
    showHouseDetails() {
        // Ocultar inmediatamente el fondo oscuro SIN TIMER
        this.hideSectionBackground();
        
        // Agregar video de fondo por encima del fondo actual
        this.addDetailsBackgroundVideo('Casa');
        
        // Encontrar la tarjeta activa de casa (buscar en toda la página, no solo en apartmentList)
        const activeCard = document.querySelector('.house-card.recorrido-active, .apartment-card.recorrido-active');
        if (!activeCard) {
            // Si no hay tarjeta activa, buscar la tarjeta de casa
            const houseCard = document.querySelector('.house-card');
            if (houseCard) {
                // Transformar la tarjeta de casa en modo detalles INMEDIATAMENTE usando la misma función que apartamentos
                this.transformCardToDetails(houseCard, 'Casa', 'Variable', 'Consultar');
            } else {
                console.warn('No se encontró tarjeta de casa para mostrar detalles');
                return;
            }
        } else {
            // Transformar la tarjeta activa en modo detalles INMEDIATAMENTE usando la misma función que apartamentos
            this.transformCardToDetails(activeCard, 'Casa', 'Variable', 'Consultar');
        }
        
        // Activar animaciones llamativas del botón volver
        this.enhanceBackButtonVisibility();
        
        // Bloquear el scroll para mantener la sección visible
        this.lockScrollToCurrentSection();
    }
    
    createHouseDetailsCard() {
        const apartmentList = document.getElementById('apartmentList');
        if (!apartmentList) return;
        
        // Limpiar contenido existente
        apartmentList.innerHTML = '';
        
        // Crear la card de detalles de casa
        const houseDetailsCard = document.createElement('div');
        houseDetailsCard.className = 'apartment-card details-mode';
        houseDetailsCard.style.cssText = `
            animation: 0.5s ease 0s 1 normal none running fadeInUp;
            display: block;
            opacity: 1;
            transform: scale(1);
            transition: 0.3s;
        `;
        
        houseDetailsCard.innerHTML = `
            <div class="apartment-details-mode">
                <div class="details-header">
                    <button class="btn-back attention-mode" onclick="window.imageFilterSystem.exitHouseDetailsMode()" style="position: relative;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        Volver
                        <div class="button-particles" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; pointer-events: none; z-index: 1;">
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 0s infinite normal none running particleFloat;"></div>
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 0.2s infinite normal none running particleFloat;"></div>
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 0.4s infinite normal none running particleFloat;"></div>
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 0.6s infinite normal none running particleFloat;"></div>
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 0.8s infinite normal none running particleFloat;"></div>
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 1s infinite normal none running particleFloat;"></div>
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 1.2s infinite normal none running particleFloat;"></div>
                            <div class="attention-particle" style="position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, rgb(0, 123, 255), rgb(0, 212, 255)); border-radius: 50%; animation: 3s ease-out 1.4s infinite normal none running particleFloat;"></div>
                        </div>
                    </button>
                    <h3 class="details-title">Casa</h3>
                    <button class="btn-collapse" onclick="window.imageFilterSystem.toggleCollapse()" title="Contraer/Expandir">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="details-content">
                    <div class="details-left-panel">
                        <div class="apartment-specs">
                            <div class="spec-item">
                                <label>Habitaciones:</label>
                                <span>Variable</span>
                            </div>
                            <div class="spec-item">
                                <label>Área:</label>
                                <span>Variable</span>
                            </div>
                            <div class="spec-item">
                                <label>Jardín:</label>
                                <span>Sí</span>
                            </div>
                            <div class="spec-item">
                                <label>Estacionamiento:</label>
                                <span>2+</span>
                            </div>
                        </div>
                        
                        <div class="orientation-section">
                            <label>Orientación:</label>
                            <span>Norte/Sur</span>
                        </div>
                        
                        <div class="floor-type-section">
                            <label>Tipo de Casa:</label>
                            <div class="floor-type-options">
                                <button class="floor-type-btn active">Casa A</button>
                                <button class="floor-type-btn">Casa B</button>
                                <button class="floor-type-btn">Casa C</button>
                            </div>
                        </div>
                        
                        <div class="floor-plan">
                            <h4>Plano de la Casa</h4>
                            <div class="floor-plan-image">
                                <img src="video/imagenes/casa/casa2.png" alt="Plano 3D Casa" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iUGxhbm8gM0QgQ2FzYTwvdGV4dD48L3N2Zz4='">
                            </div>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="btn-secondary" onclick="window.imageFilterSystem.sendPDF('Casa')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line>
                                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line>
                                    <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline>
                                </svg>
                                Enviar PDF
                            </button>
                            <button class="btn-primary quote-btn" onclick="window.imageFilterSystem.quoteModel('Casa')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"></path>
                                </svg>
                                Cotizar Modelo
                            </button>
                        </div>
                    </div>
                    
                    <div class="details-right-panel">
                        <div class="image-gallery">
                            <button class="gallery-nav prev" onclick="window.imageFilterSystem.prevImage()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </button>
                            
                            <div class="thumbnail-container">
                                <div class="thumbnail active" data-index="0" onclick="window.imageFilterSystem.openImageModal(0)">
                                    <img src="video/imagenes/carrousel/car_01.png" alt="Imagen 1" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iSW1hZ2VuIDE8L3RleHQ+PC9zdmc+'" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iSW1hZ2VuIDE8L3RleHQ+PC9zdmc+'">
                                </div>
                                <div class="thumbnail" data-index="1" onclick="window.imageFilterSystem.openImageModal(1)">
                                    <img src="video/imagenes/carrousel/car_02.png" alt="Imagen 2" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iSW1hZ2VuIDI8L3RleHQ+PC9zdmc+'" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iSW1hZ2VuIDI8L3RleHQ+PC9zdmc+'">
                                </div>
                                <div class="thumbnail" data-index="2" onclick="window.imageFilterSystem.openImageModal(2)">
                                    <img src="video/imagenes/carrousel/car_03.png" alt="Imagen 3" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iSW1hZ2VuIDM8L3RleHQ+PC9zdmc+'" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iSW1hZ2VuIDM8L3RleHQ+PC9zdmc+'">
                                </div>
                                <div class="thumbnail" data-index="3">
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iSmFyZMOtbjwvdGV4dD48L3N2Zz4=" alt="Jardín" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iSmFyZMOtbjwvdGV4dD48L3N2Zz4=">
                                </div>
                            </div>
                            
                            <button class="gallery-nav next" onclick="window.imageFilterSystem.nextImage()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        apartmentList.appendChild(houseDetailsCard);
        
        // Agregar event listeners a los botones de la card de detalles
        this.addHouseDetailsEventListeners(houseDetailsCard);
    }
    
    addHouseDetailsEventListeners(houseDetailsCard) {
        // Event listeners para los botones de tipo de casa
        const floorTypeBtns = houseDetailsCard.querySelectorAll('.floor-type-btn');
        floorTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                floorTypeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Event listeners para la galería de imágenes
        const thumbnails = houseDetailsCard.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                // Aquí puedes agregar lógica para cambiar la imagen principal
            });
        });
    }
    
    exitHouseDetailsMode() {
        const apartmentsContent = document.querySelector('.apartments-content');
        if (!apartmentsContent) return;
        
        // Ocultar la sección de detalles
        const apartmentList = document.getElementById('apartmentList');
        if (apartmentList) {
            apartmentList.style.display = 'none';
            apartmentList.innerHTML = '';
        }
        
        // Mostrar nuevamente la card de casa
        const houseCard = document.querySelector('.house-card');
        if (houseCard) {
            houseCard.style.display = 'block';
        }
    }
    
    startHouseTour() {
        console.log('🏠 Iniciando tour de casa...');
        
        // Encontrar la tarjeta de casa
        const houseCard = document.querySelector('.house-card');
        if (!houseCard) {
            console.warn('No se encontró tarjeta de casa para iniciar tour');
            return;
        }
        
        // Ocultar todas las tarjetas excepto la de casa
        this.hideAllCardsExcept(houseCard);
        
        // Agregar clase activa a la tarjeta de casa
        houseCard.classList.add('recorrido-active');
        
        // Mostrar controles de recorrido para casa
        this.showRecorridoControls('Casa', 'Variable', 'Consultar');
        
        // Cargar video de casa
        this.loadHouseVideo();
        
        console.log('🏠 Tour de casa iniciado correctamente');
    }
    
    loadHouseVideo() {
        const backgroundVideo = document.getElementById('backgroundVideo');
        if (backgroundVideo) {
            backgroundVideo.src = 'video/casa/video-0.mp4';
            backgroundVideo.load();
            backgroundVideo.play().catch(e => {
                console.warn('Error reproduciendo video de casa:', e);
            });
        }
    }
    
    hideAllCardsExcept(targetCard) {
        // Ocultar todas las tarjetas de apartamentos
        const apartmentList = document.getElementById('apartmentList');
        if (apartmentList) {
            const apartmentCards = apartmentList.querySelectorAll('.apartment-card');
            apartmentCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                card.classList.remove('recorrido-active');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 500);
            });
        }
        
        // Ocultar la tarjeta de casa si no es la targetCard
        const houseCards = document.querySelectorAll('.house-card');
        houseCards.forEach(card => {
            if (card !== targetCard) {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                card.classList.remove('recorrido-active');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 500);
            }
        });
        
        // Ocultar secciones de filtros y selectores
        const filtersSection = document.querySelector('.apartment-filters');
        if (filtersSection) {
            filtersSection.style.display = 'none';
        }
        
        const typeSelector = document.querySelector('.apartment-type-selector');
        if (typeSelector) {
            typeSelector.style.display = 'none';
        }
        
        const initialMessage = document.getElementById('initialMessage');
        if (initialMessage) {
            initialMessage.style.display = 'none';
        }
        
        // Asegurar que la targetCard esté visible y activa
        if (targetCard) {
            targetCard.style.display = 'block';
            targetCard.style.opacity = '1';
            targetCard.style.transform = 'scale(1.1)';
            targetCard.style.transition = 'all 0.5s ease';
            targetCard.classList.add('recorrido-active');
            
            // Ocultar los botones de acción para evitar confusión
            const actionButtons = targetCard.querySelector('.apartment-actions');
            if (actionButtons) {
                actionButtons.style.display = 'none';
            }
        }
    }
    
    contactHouse() {
        // Lógica específica para contacto de casa
        console.log('📞 Contactando sobre casa...');
        // Aquí puedes implementar la lógica específica para casas
    }
    
    // Variables para el carrusel de features
    featuresCurrentSlide = 0;
    featuresImages = [
        'video/imagenes/carrousel/car_01.png',
        'video/imagenes/carrousel/car_02.png',
        'video/imagenes/carrousel/car_03.png',
        'video/imagenes/carrousel/car_04.png',
        'video/imagenes/carrousel/car_05.png',
        'video/imagenes/carrousel/car_06.png'
    ];
    
    featuresSlideTitles = [
        'Vista Principal',
        'Áreas Comunes',
        'Interiores',
        'Exteriores',
        'Amenities',
        'Detalles'
    ];
    
    // Funciones del carrusel de features
    nextFeaturesSlide() {
        this.featuresCurrentSlide = (this.featuresCurrentSlide + 1) % this.featuresImages.length;
        this.updateFeaturesCarousel();
    }
    
    prevFeaturesSlide() {
        this.featuresCurrentSlide = (this.featuresCurrentSlide - 1 + this.featuresImages.length) % this.featuresImages.length;
        this.updateFeaturesCarousel();
    }
    
    goToFeaturesSlide(index) {
        this.featuresCurrentSlide = index;
        this.updateFeaturesCarousel();
    }
    
    updateFeaturesCarousel() {
        const track = document.getElementById('featuresCarouselTrack');
        const indicators = document.querySelectorAll('#featuresCarouselIndicators .indicator');
        
        if (track) {
            const slideWidth = track.querySelector('.carousel-slide').offsetWidth;
            track.style.transform = `translateX(-${this.featuresCurrentSlide * slideWidth}px)`;
        }
        
        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            if (index === this.featuresCurrentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        console.log('🖼️ Carrusel de features actualizado a slide:', this.featuresCurrentSlide);
    }
    
    openFeaturesImageModal(imageIndex) {
        console.log('🖼️ Abriendo imagen de features en modal:', imageIndex);
        
        // Remover modal existente si hay uno
        const existingModal = document.getElementById('featuresImageModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const imageUrl = this.featuresImages[imageIndex];
        const imageTitle = this.featuresSlideTitles[imageIndex];
        
        const modalHTML = `
            <div class="modal-overlay" id="featuresImageModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.95); display: flex; align-items: center; justify-content: center; z-index: 10000;">
                <div class="image-modal-container" style="position: relative; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column; align-items: center;">
                    
                    <!-- Header del modal -->
                    <div class="image-modal-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 1rem 2rem; background: rgba(0, 0, 0, 0.8); border-radius: 10px 10px 0 0;">
                        <h3 style="margin: 0; color: white; font-size: 1.2rem; font-weight: 600;">${imageTitle}</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); color: white; font-size: 1.5rem; cursor: pointer; padding: 0.5rem; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                            &times;
                        </button>
                    </div>
                    
                    <!-- Imagen principal -->
                    <div class="image-modal-content" style="position: relative; max-width: 100%; max-height: 80vh; overflow: hidden; border-radius: 0 0 10px 10px; background: rgba(0, 0, 0, 0.5);">
                        <img src="${imageUrl}" alt="${imageTitle}" style="max-width: 100%; max-height: 100%; object-fit: contain; display: block;" 
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiAke imageIndex + 1}</dGV4dD48L3N2Zz4='">
                        
                        <!-- Botón anterior -->
                        <button class="modal-nav-btn prev" onclick="window.imageFilterSystem.prevFeaturesImageModal()" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background: rgba(0, 0, 0, 0.7); border: 1px solid rgba(255, 255, 255, 0.3); color: white; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; transition: all 0.3s ease;">
                            &#8249;
                        </button>
                        
                        <!-- Botón siguiente -->
                        <button class="modal-nav-btn next" onclick="window.imageFilterSystem.nextFeaturesImageModal()" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: rgba(0, 0, 0, 0.7); border: 1px solid rgba(255, 255, 255, 0.3); color: white; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; transition: all 0.3s ease;">
                            &#8250;
                        </button>
                    </div>
                    
                    <!-- Footer con navegación -->
                    <div class="image-modal-footer" style="display: flex; align-items: center; gap: 1rem; padding: 1rem 2rem; background: rgba(0, 0, 0, 0.8); border-radius: 0 0 10px 10px; width: 100%; justify-content: center;">
                        <span style="color: white; font-size: 0.9rem;">${imageIndex + 1} de ${this.featuresImages.length}</span>
                        <div style="display: flex; gap: 0.5rem;">
                            ${this.featuresImages.map((_, i) => `
                                <div class="modal-indicator ${i === imageIndex ? 'active' : ''}" 
                                     onclick="window.imageFilterSystem.openFeaturesImageModal(${i})"
                                     style="width: 8px; height: 8px; border-radius: 50%; background: ${i === imageIndex ? '#FFD700' : 'rgba(255, 255, 255, 0.5)'}; cursor: pointer; transition: all 0.3s ease;">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Guardar el índice actual
        this.currentFeaturesModalImageIndex = imageIndex;
        
        // Agregar event listeners
        document.addEventListener('keydown', this.handleFeaturesModalKeyboard.bind(this));
        
        // Agregar efecto hover a los botones
        const modalNavBtns = document.querySelectorAll('.modal-nav-btn');
        modalNavBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(255, 255, 255, 0.2)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(0, 0, 0, 0.7)';
            });
        });
        
        const closeBtn = document.querySelector('.modal-close');
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        console.log('✅ Modal de imagen de features abierto');
    }
    
    handleFeaturesModalKeyboard(e) {
        if (e.key === 'Escape') {
            this.closeFeaturesImageModal();
        } else if (e.key === 'ArrowLeft') {
            this.prevFeaturesImageModal();
        } else if (e.key === 'ArrowRight') {
            this.nextFeaturesImageModal();
        }
    }
    
    closeFeaturesImageModal() {
        const modal = document.getElementById('featuresImageModal');
        if (modal) {
            modal.remove();
        }
        document.removeEventListener('keydown', this.handleFeaturesModalKeyboard.bind(this));
    }
    
    nextFeaturesImageModal() {
        const nextIndex = (this.currentFeaturesModalImageIndex + 1) % this.featuresImages.length;
        this.openFeaturesImageModal(nextIndex);
    }
    
    prevFeaturesImageModal() {
        const prevIndex = (this.currentFeaturesModalImageIndex - 1 + this.featuresImages.length) % this.featuresImages.length;
        this.openFeaturesImageModal(prevIndex);
    }
    
    // Método para bloquear el scroll en la sección actual
    lockScrollToCurrentSection() {
        console.log('🔒 Bloqueando scroll en la sección actual...');
        
        // Guardar la posición actual del scroll
        this.savedScrollPosition = window.pageYOffset;
        
        // Agregar clase al body para bloquear scroll
        document.body.classList.add('scroll-locked');
        
        // Agregar event listeners para prevenir scroll
        this.scrollPreventionHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };
        
        // Prevenir scroll con rueda del mouse
        document.addEventListener('wheel', this.scrollPreventionHandler, { passive: false });
        
        // Prevenir scroll con touch en dispositivos móviles
        document.addEventListener('touchmove', this.scrollPreventionHandler, { passive: false });
        
        // Prevenir scroll con teclado
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
                e.preventDefault();
                return false;
            }
        });
        
        console.log('✅ Scroll bloqueado en la sección actual');
    }
    
    // Método para desbloquear el scroll
    unlockScroll() {
        console.log('🔓 Desbloqueando scroll...');
        
        // Remover clase del body
        document.body.classList.remove('scroll-locked');
        
        // Remover event listeners
        if (this.scrollPreventionHandler) {
            document.removeEventListener('wheel', this.scrollPreventionHandler);
            document.removeEventListener('touchmove', this.scrollPreventionHandler);
            this.scrollPreventionHandler = null;
        }
        
        // NO restaurar posición del scroll automáticamente para evitar scroll no deseado
        // if (this.savedScrollPosition !== undefined) {
        //     window.scrollTo({
        //         top: this.savedScrollPosition,
        //         behavior: 'smooth'
        //     });
        //     this.savedScrollPosition = undefined;
        // }
        
        console.log('✅ Scroll desbloqueado');
    }
    
    addDetailsBackgroundVideo(apartment) {
        console.log('🎬 Agregando video de fondo para modo detalles...', { apartment });
        
        // Remover video anterior si existe
        this.removeDetailsBackgroundVideo();
        
        // Crear el elemento de video
        const detailsVideo = document.createElement('video');
        detailsVideo.id = 'detailsBackgroundVideo';
        detailsVideo.className = 'details-background-video';
        detailsVideo.autoplay = true;
        detailsVideo.muted = true;
        detailsVideo.loop = true;
        detailsVideo.playsInline = true;
        
        // Seleccionar video según el tipo de apartamento
        let videoPath = 'video/casa/video-0.mp4'; // Video por defecto
        
        if (apartment) {
            if (apartment.includes('1 Dormitorio')) {
                videoPath = 'video/apartamento/video-0.mp4';
            } else if (apartment.includes('2 Dormitorios')) {
                videoPath = 'video/apartamento/video-1.mp4';
            } else if (apartment.includes('3 Dormitorios')) {
                videoPath = 'video/casa/video-1.mp4';
            }
        }
        
        // Agregar fuente de video
        const videoSource = document.createElement('source');
        videoSource.src = videoPath;
        videoSource.type = 'video/mp4';
        detailsVideo.appendChild(videoSource);
        
        // Agregar estilos CSS inline para posicionamiento
        detailsVideo.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
            opacity: 0.8;
            transition: opacity 0.5s ease;
        `;
        
        // Insertar el video después del video principal
        const mainVideo = document.getElementById('backgroundVideo');
        if (mainVideo && mainVideo.parentNode) {
            mainVideo.parentNode.insertBefore(detailsVideo, mainVideo.nextSibling);
        } else {
            // Si no hay video principal, insertar al inicio del body
            document.body.insertBefore(detailsVideo, document.body.firstChild);
        }
        
        // Reproducir el video
        detailsVideo.play().catch(error => {
            console.log('⚠️ Error al reproducir video de detalles:', error);
            // Si falla, intentar con el video por defecto
            if (videoPath !== 'video/casa/video-0.mp4') {
                console.log('🔄 Intentando con video por defecto...');
                videoSource.src = 'video/casa/video-0.mp4';
                detailsVideo.load();
                detailsVideo.play().catch(err => {
                    console.log('❌ Error al reproducir video por defecto:', err);
                });
            }
        });
        
        console.log('✅ Video de fondo para detalles agregado:', videoPath);
    }
    
    removeDetailsBackgroundVideo() {
        console.log('🎬 Removiendo video de fondo de detalles...');
        
        const detailsVideo = document.getElementById('detailsBackgroundVideo');
        if (detailsVideo) {
            detailsVideo.pause();
            detailsVideo.remove();
            console.log('✅ Video de fondo de detalles removido');
        }
    }
    
    // Método para agregar animaciones llamativas al botón volver
    addBackButtonAttention() {
        const backButton = document.querySelector('.btn-back');
        if (backButton) {
            // Agregar clase para animaciones adicionales
            backButton.classList.add('attention-mode');
            
            // Crear efecto de partículas alrededor del botón
            this.createButtonParticles(backButton);
            
            // Agregar efecto de vibración sutil
            setTimeout(() => {
                backButton.style.animation += ', attentionVibrate 0.5s ease-in-out infinite';
            }, 1000);
            
            console.log('✨ Back button attention effects added');
        }
    }

    // Método para crear partículas alrededor del botón
    createButtonParticles(button) {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'button-particles';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        button.style.position = 'relative';
        button.appendChild(particleContainer);
        
        // Crear partículas
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'attention-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: linear-gradient(45deg, #007bff, #00d4ff);
                border-radius: 50%;
                animation: particleFloat 3s ease-out infinite;
                animation-delay: ${i * 0.2}s;
            `;
            
            particleContainer.appendChild(particle);
        }
    }

    // Método para remover efectos de atención del botón volver
    removeBackButtonAttention() {
        const backButton = document.querySelector('.btn-back');
        if (backButton) {
            backButton.classList.remove('attention-mode');
            
            // Remover partículas
            const particleContainer = backButton.querySelector('.button-particles');
            if (particleContainer) {
                particleContainer.remove();
            }
            
            // Remover animación de vibración
            backButton.style.animation = backButton.style.animation.replace(', attentionVibrate 0.5s ease-in-out infinite', '');
            
            console.log('✨ Back button attention effects removed');
        }
    }

    // Método para hacer el botón volver más llamativo cuando se entra en modo detalles
    enhanceBackButtonVisibility() {
        setTimeout(() => {
            this.addBackButtonAttention();
        }, 500); // Pequeño delay para que aparezca después de la animación de entrada
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

// Solo crear la instancia si no existe ya una instancia global
// Esto evita crear múltiples instancias cuando se carga desde main.js
if (!window.imageFilterSystem) {
    // Verificar si ya existe una instancia creada por main.js
    setTimeout(() => {
        if (!window.imageFilterSystem) {
            console.log('🖼️ Creating ImageFilterSystem instance from ImageFilterSystem.js');
            window.imageFilterSystem = new ImageFilterSystem();
        } else {
            console.log('🖼️ Using existing ImageFilterSystem instance from main.js');
        }
    }, 100);
}
