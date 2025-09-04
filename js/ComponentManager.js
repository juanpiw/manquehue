/**
 * ComponentManager - Gestor de componentes interactivos
 * Maneja galerías, carruseles, modales, filtros y otros componentes interactivos
 */
class ComponentManager {
    constructor() {
        this.components = {};
        this.activeModals = [];
        
        this.init();
    }

    init() {
        console.log('🎛️ Initializing ComponentManager...');
        
        this.setupGalleries();
        this.setupCarousels();
        this.setupModals();
        this.setupFilters();
        this.setupSelectors();
        this.setupButtons();
        this.setupFilterButtons();
        
        console.log('✅ ComponentManager initialized');
    }

    setupGalleries() {
        // Galería principal
        const galleryMain = document.getElementById('galleryMain');
        const galleryThumbnails = document.querySelectorAll('.gallery-thumbnails .thumbnail');
        
        if (galleryMain && galleryThumbnails.length > 0) {
            galleryThumbnails.forEach(thumbnail => {
                thumbnail.addEventListener('click', () => {
                    const imageSrc = thumbnail.getAttribute('data-image');
                    galleryMain.src = imageSrc;
                    
                    // Actualizar thumbnails activos
                    galleryThumbnails.forEach(t => t.classList.remove('active'));
                    thumbnail.classList.add('active');
                });
            });
            
            console.log('✅ Gallery setup complete');
        }

        // Carrusel principal
        const carouselMain = document.getElementById('carouselMain');
        const carouselThumbs = document.querySelectorAll('.carousel-thumb');
        const carouselPrev = document.getElementById('carouselPrev');
        const carouselNext = document.getElementById('carouselNext');
        
        if (carouselMain && carouselThumbs.length > 0) {
            let currentCarouselIndex = 0;
            
            const updateCarousel = (index) => {
                if (index < 0) index = carouselThumbs.length - 1;
                if (index >= carouselThumbs.length) index = 0;
                
                currentCarouselIndex = index;
                const imageSrc = carouselThumbs[index].getAttribute('data-image');
                carouselMain.src = imageSrc;
                
                // Actualizar thumbnails activos
                carouselThumbs.forEach(t => t.classList.remove('active'));
                carouselThumbs[index].classList.add('active');
            };
            
            carouselThumbs.forEach((thumb, index) => {
                thumb.addEventListener('click', () => updateCarousel(index));
            });
            
            if (carouselPrev) {
                carouselPrev.addEventListener('click', () => updateCarousel(currentCarouselIndex - 1));
            }
            
            if (carouselNext) {
                carouselNext.addEventListener('click', () => updateCarousel(currentCarouselIndex + 1));
            }
            
            console.log('✅ Carousel setup complete');
        }
    }

    setupCarousels() {
        // Configuración adicional para carruseles
        const carousels = document.querySelectorAll('.carousel-container');
        
        carousels.forEach(carousel => {
            let isDragging = false;
            let startPos = 0;
            let currentTranslate = 0;
            let prevTranslate = 0;
            
            carousel.addEventListener('mousedown', (e) => {
                isDragging = true;
                startPos = e.clientX;
                carousel.style.cursor = 'grabbing';
            });
            
            carousel.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const currentPosition = e.clientX;
                const diff = currentPosition - startPos;
                currentTranslate = prevTranslate + diff;
                
                carousel.style.transform = `translateX(${currentTranslate}px)`;
            });
            
            carousel.addEventListener('mouseup', () => {
                isDragging = false;
                prevTranslate = currentTranslate;
                carousel.style.cursor = 'grab';
            });
            
            carousel.addEventListener('mouseleave', () => {
                isDragging = false;
                carousel.style.cursor = 'grab';
            });
        });
    }

    setupModals() {
        // Modal de contacto
        const contactModal = document.getElementById('contactModal');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        const contactButtons = document.querySelectorAll('.contactModelBtn, .contact-method');
        
        const openContactModal = () => {
            if (contactModal) {
                contactModal.style.display = 'block';
                contactModal.classList.add('active');
                this.activeModals.push(contactModal);
                document.body.style.overflow = 'hidden';
            }
        };
        
        const closeContactModal = () => {
            if (contactModal) {
                contactModal.style.display = 'none';
                contactModal.classList.remove('active');
                this.activeModals = this.activeModals.filter(m => m !== contactModal);
                document.body.style.overflow = '';
            }
        };
        
        contactButtons.forEach(button => {
            button.addEventListener('click', openContactModal);
        });
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeContactModal);
        }
        
        if (modalClose) {
            modalClose.addEventListener('click', closeContactModal);
        }
        
        // Modal de apartamento
        const apartmentModelContainer = document.getElementById('apartmentModelContainer');
        const viewModelBtn = document.getElementById('viewModelBtn');
        const closeModelBtn = document.getElementById('closeModelBtn');
        
        const openApartmentModal = () => {
            if (apartmentModelContainer) {
                apartmentModelContainer.classList.add('active');
                this.activeModals.push(apartmentModelContainer);
            }
        };
        
        const closeApartmentModal = () => {
            if (apartmentModelContainer) {
                apartmentModelContainer.classList.remove('active');
                this.activeModals = this.activeModals.filter(m => m !== apartmentModelContainer);
            }
        };
        
        if (viewModelBtn) {
            viewModelBtn.addEventListener('click', openApartmentModal);
        }
        
        if (closeModelBtn) {
            closeModelBtn.addEventListener('click', closeApartmentModal);
        }
        
        console.log('✅ Modals setup complete');
    }

    setupFilters() {
        // Filtros de apartamentos
        const filterInputs = document.querySelectorAll('.filter-input, .filter-select');
        
        filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateApartmentList();
            });
        });
        
        // Selector de tipo de apartamento
        const typeOptions = document.querySelectorAll('.type-option');
        
        typeOptions.forEach(option => {
            option.addEventListener('click', () => {
                typeOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.updateApartmentList();
            });
        });
        
        console.log('✅ Filters setup complete');
    }

    setupSelectors() {
        // Selector de proyecto (Apartamento/Casa)
        const projectRadios = document.querySelectorAll('input[name="projectType"]');
        
        projectRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateProjectType(radio.value);
            });
        });
        
        // Selector de equipamiento
        const equipmentOptions = document.querySelectorAll('.equipment-option input');
        
        equipmentOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updateEquipmentSelection();
            });
        });
        
        // Selector de tipos de piso
        const floorOptions = document.querySelectorAll('.floor-option');
        
        floorOptions.forEach(option => {
            option.addEventListener('click', () => {
                floorOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.updateFloorType(option.getAttribute('data-floor'));
            });
        });
        
        console.log('✅ Selectors setup complete');
    }

    setupButtons() {
        // Botón de volver
        const backButton = document.getElementById('backToApartmentsBtn');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.navigateBack();
            });
        }
        
        // Botón de cotizar
        const quoteButtons = document.querySelectorAll('.quote-btn, .equipment-quote-btn');
        quoteButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleQuoteRequest();
            });
        });
        
        // Botón de enviar PDF
        const pdfButtons = document.querySelectorAll('.pdf-btn');
        pdfButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handlePdfRequest();
            });
        });
        
        // Botón del footer
        const footerButton = document.getElementById('footerButton');
        if (footerButton) {
            footerButton.addEventListener('click', () => {
                this.handleFooterAction();
            });
        }
        
        console.log('✅ Buttons setup complete');
    }

    updateApartmentList() {
        // Simular actualización de lista de apartamentos basada en filtros
        const listItems = document.querySelectorAll('.list-item');
        const activeItem = document.querySelector('.list-item.active');
        
        if (listItems.length > 0) {
            // Simular filtrado
            listItems.forEach((item, index) => {
                item.textContent = `Apartamento ${index + 1} (Filtrado)`;
            });
            
            console.log('📋 Apartment list updated');
        }
    }

    updateProjectType(type) {
        console.log(`🏠 Project type changed to: ${type}`);
        
        // Actualizar contenido basado en el tipo de proyecto
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            if (type === 'casa') {
                statsSection.style.display = 'none';
            } else {
                statsSection.style.display = 'block';
            }
        }
    }

    updateEquipmentSelection() {
        const selectedEquipment = [];
        const equipmentOptions = document.querySelectorAll('.equipment-option input:checked');
        
        equipmentOptions.forEach(option => {
            selectedEquipment.push(option.value);
        });
        
        console.log('🏋️ Selected equipment:', selectedEquipment);
    }

    updateFloorType(floorType) {
        console.log(`🏢 Floor type changed to: ${floorType}`);
        
        // Actualizar especificaciones basadas en el tipo de piso
        const specItems = document.querySelectorAll('.spec-item');
        if (specItems.length > 0) {
            specItems.forEach(item => {
                const label = item.querySelector('.spec-label');
                const value = item.querySelector('.spec-value');
                
                if (label && value) {
                    // Simular actualización de especificaciones
                    if (label.textContent.includes('Habitación')) {
                        value.textContent = `${Math.floor(Math.random() * 3) + 1} Habitación`;
                    }
                }
            });
        }
    }

    navigateBack() {
        // Navegar de vuelta a la sección de apartamentos
        const apartmentsSection = document.getElementById('apartments');
        if (apartmentsSection) {
            apartmentsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleQuoteRequest() {
        console.log('💰 Quote request initiated');
        
        // Simular solicitud de cotización
        const quoteData = {
            projectType: document.querySelector('input[name="projectType"]:checked')?.value || 'apartamento',
            equipment: Array.from(document.querySelectorAll('.equipment-option input:checked')).map(input => input.value),
            timestamp: new Date().toISOString()
        };
        
        console.log('📊 Quote data:', quoteData);
        
        // Mostrar confirmación
        this.showNotification('Cotización enviada', 'success');
    }

    handlePdfRequest() {
        console.log('📄 PDF request initiated');
        
        // Simular envío de PDF
        this.showNotification('PDF enviado por email', 'success');
    }

    handleFooterAction() {
        console.log('🔄 Footer action triggered');
        
        // Simular acción del footer
        this.showNotification('Recorrido iniciado', 'info');
    }

    showNotification(message, type = 'info') {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Métodos públicos para control externo
    getActiveModals() {
        return this.activeModals;
    }

    closeAllModals() {
        this.activeModals.forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('active');
        });
        this.activeModals = [];
        document.body.style.overflow = '';
    }

    updateComponent(componentName, data) {
        if (this.components[componentName]) {
            this.components[componentName].update(data);
        }
    }
    
    setupFilterButtons() {
        console.log('🔍 Setting up filter buttons...');
        
        const searchButton = document.getElementById('searchButton');
        const clearFiltersButton = document.getElementById('clearFilters');
        const surfaceFilter = document.getElementById('surfaceFilter');
        const priceFilter = document.getElementById('priceFilter');
        
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                console.log('🔍 Search button clicked');
                this.applyFilters();
            });
        }
        
        if (clearFiltersButton) {
            clearFiltersButton.addEventListener('click', () => {
                console.log('🧹 Clear filters button clicked');
                this.clearFilters();
            });
        }
        
        // También aplicar filtros al presionar Enter en los selects
        if (surfaceFilter) {
            surfaceFilter.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.applyFilters();
                }
            });
        }
        
        if (priceFilter) {
            priceFilter.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.applyFilters();
                }
            });
        }
        
        console.log('✅ Filter buttons setup complete');
    }
    
    applyFilters() {
        console.log('🔍 Applying filters...');
        
        const surfaceFilter = document.getElementById('surfaceFilter');
        const priceFilter = document.getElementById('priceFilter');
        const apartmentList = document.getElementById('apartmentList');
        
        if (!apartmentList) return;
        
        const surfaceValue = surfaceFilter ? surfaceFilter.value : '';
        const priceValue = priceFilter ? priceFilter.value : '';
        
        console.log('📊 Filter values:', { surface: surfaceValue, price: priceValue });
        
        // Ocultar mensaje inicial
        const initialMessage = document.getElementById('initialMessage');
        if (initialMessage) {
            initialMessage.style.display = 'none';
        }
        
        // Mostrar la lista de apartamentos
        apartmentList.style.display = 'grid';
        apartmentList.style.animation = 'fadeInUp 0.5s ease';
        
        // Obtener todas las tarjetas de apartamentos
        const apartmentCards = apartmentList.querySelectorAll('.apartment-card');
        
        apartmentCards.forEach(card => {
            let showCard = true;
            
            // Filtrar por superficie
            if (surfaceValue) {
                // Buscar el párrafo que contenga "Superficie"
                const paragraphs = card.querySelectorAll('p');
                let surfaceText = '';
                for (const p of paragraphs) {
                    if (p.textContent.includes('Superficie')) {
                        surfaceText = p.textContent;
                        break;
                    }
                }
                if (!this.matchesSurfaceFilter(surfaceText, surfaceValue)) {
                    showCard = false;
                }
            }
            
            // Filtrar por precio
            if (priceValue && showCard) {
                const priceText = card.querySelector('p:contains("Precio")')?.textContent || '';
                if (!this.matchesPriceFilter(priceText, priceValue)) {
                    showCard = false;
                }
            }
            
            // Mostrar/ocultar tarjeta
            card.style.display = showCard ? 'block' : 'none';
            
            if (showCard) {
                card.style.animation = 'fadeInUp 0.5s ease';
            }
        });
        
        // Mostrar mensaje si no hay resultados
        this.showFilterResults(apartmentCards, surfaceValue, priceValue);
        
        console.log('✅ Filters applied');
    }
    
    matchesSurfaceFilter(surfaceText, filterValue) {
        // Extraer números de la superficie
        const surfaceMatch = surfaceText.match(/(\d+)/);
        if (!surfaceMatch) return false;
        
        const surface = parseInt(surfaceMatch[1]);
        
        switch (filterValue) {
            case '40-60':
                return surface >= 40 && surface <= 60;
            case '60-80':
                return surface >= 60 && surface <= 80;
            case '80-100':
                return surface >= 80 && surface <= 100;
            case '100+':
                return surface >= 100;
            default:
                return true;
        }
    }
    
    matchesPriceFilter(priceText, filterValue) {
        // Extraer números del precio
        const priceMatch = priceText.match(/(\d+)/);
        if (!priceMatch) return false;
        
        const price = parseInt(priceMatch[1]);
        
        switch (filterValue) {
            case '2000-3000':
                return price >= 2000 && price <= 3000;
            case '3000-4000':
                return price >= 3000 && price <= 4000;
            case '4000-5000':
                return price >= 4000 && price <= 5000;
            case '5000+':
                return price >= 5000;
            default:
                return true;
        }
    }
    
    clearFilters() {
        console.log('🧹 Clearing filters...');
        
        const surfaceFilter = document.getElementById('surfaceFilter');
        const priceFilter = document.getElementById('priceFilter');
        const apartmentList = document.getElementById('apartmentList');
        
        // Resetear selects
        if (surfaceFilter) surfaceFilter.value = '';
        if (priceFilter) priceFilter.value = '';
        
        // Ocultar la lista de apartamentos
        if (apartmentList) {
            apartmentList.style.display = 'none';
        }
        
        // Mostrar mensaje inicial
        const initialMessage = document.getElementById('initialMessage');
        if (initialMessage) {
            initialMessage.style.display = 'block';
        }
        
        // Ocultar mensaje de resultados
        const resultsMessage = document.getElementById('filterResultsMessage');
        if (resultsMessage) {
            resultsMessage.remove();
        }
        
        console.log('✅ Filters cleared');
    }
    
    showFilterResults(apartmentCards, surfaceValue, priceValue) {
        const visibleCards = Array.from(apartmentCards).filter(card => 
            card.style.display !== 'none'
        );
        
        // Remover cualquier mensaje anterior (no mostrar conteos)
        const existingMessage = document.getElementById('filterResultsMessage');
        if (existingMessage) existingMessage.remove();
        
        const apartmentList = document.getElementById('apartmentList');
        
        if (visibleCards.length === 0) {
            if (apartmentList) {
                // Ocultar la lista si no hay resultados
                apartmentList.style.display = 'none';
                
                // Mostrar mensaje de no resultados en el contenedor de filtros
                const filterContainer = document.querySelector('.apartment-filters');
                // No mostrar mensaje contextual en filtros (el de no resultados ya existe en lista)
            }
        } else if (surfaceValue || priceValue) {
            // No insertar conteo de resultados
        }
    }
}

// Export for global use
window.ComponentManager = ComponentManager;

