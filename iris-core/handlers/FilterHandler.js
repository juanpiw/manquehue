/**
 * FilterHandler - Handles filter commands
 * Implements filter logic from iris-bridge.js
 */
class FilterHandler {
    constructor() {
        this.name = 'FilterHandler';
        this.supportedActions = ['apply', 'clear', 'toggle'];
    }

    /**
     * Handle filter command
     * @param {Object} command - Filter command
     * @param {Object} context - Execution context
     * @returns {Promise} Execution result
     */
    async handle(command, context = {}) {
        console.log(`[IRIS-Handler] Filter: ${command.action}`, command.filters);

        try {
            switch (command.action) {
                case 'apply':
                    return await this.applyFilter(command.filters, context);
                case 'clear':
                    return await this.clearFilter(context);
                case 'show_all':
                    return await this.showAllApartments(context);
                case 'toggle':
                    return await this.toggleFilter(command.filters, context);
                default:
                    return {
                        success: false,
                        error: `Unsupported filter action: ${command.action}`
                    };
            }
        } catch (error) {
            console.error('[IRIS-Handler] Filter error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Apply apartment filters
     * @param {Object} filters - Filter criteria
     * @param {Object} context - Execution context
     * @returns {Promise} Filter result
     */
    async applyFilter(filters, context = {}) {
        console.log('🔧 [Handler] Iniciando applyFilter con filtros:', filters);

        try {
            // Si hay un filtro por tipo de departamento específico, buscar y activar directamente
            if (filters.tipoDepartamento) {
                console.log('🔧 [Handler] Buscando por tipo de departamento:', filters.tipoDepartamento);
                return await this.activateByTipoDepartamento(filters.tipoDepartamento);
            }

            console.log('🔧 [Handler] Obteniendo VideoScrollApp...');
            const app = await this.getAppReady();
            console.log('✅ [Handler] VideoScrollApp obtenido:', app);
            
            // Navigate to apartments section first
            console.log('🔧 [Handler] Navegando a sección de apartamentos...');
            await this.navigateToApartments(app);
            console.log('✅ [Handler] Navegación completada');
            
            // Apply filters using ComponentManager
            if (app.componentManager) {
                console.log('🔧 [Handler] ComponentManager disponible, preparando datos de filtro...');
                const filterData = {};
                
                if (filters.bedrooms) {
                    filterData.bedrooms = filters.bedrooms;
                    console.log('🔧 [Handler] Filtro de dormitorios agregado:', filters.bedrooms);
                }
                if (filters.superficie) {
                    filterData.superficie = filters.superficie;
                    console.log('🔧 [Handler] Filtro de superficie agregado:', filters.superficie);
                }
                if (filters.precio) {
                    filterData.precio = filters.precio;
                    console.log('🔧 [Handler] Filtro de precio agregado:', filters.precio);
                }

                console.log('🔧 [Handler] Datos de filtro preparados:', filterData);

                // Use the existing filter system
                console.log('🔧 [Handler] Aplicando filtros al sistema...');
                await this.applyFiltersToSystem(app, filterData);
                console.log('✅ [Handler] Filtros aplicados al sistema');
                
                return {
                    success: true,
                    message: `Filtros aplicados: ${JSON.stringify(filters)}`,
                    filters: filters
                };
            } else {
                console.log('❌ [Handler] ComponentManager no disponible');
                return {
                    success: false,
                    error: 'ComponentManager not available'
                };
            }
        } catch (error) {
            console.error('❌ [Handler] Error en applyFilter:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Clear all filters
     * @param {Object} context - Execution context
     * @returns {Promise} Clear result
     */
    async clearFilter(context = {}) {
        console.log('[IRIS-Handler] Clearing filters');

        try {
            const app = await this.getAppReady();
            
            if (app.componentManager) {
                // Clear filters using ComponentManager
                await this.clearFiltersFromSystem(app);
                
                return {
                    success: true,
                    message: 'Filtros limpiados'
                };
            } else {
                return {
                    success: false,
                    error: 'ComponentManager not available'
                };
            }
        } catch (error) {
            console.error('[IRIS-Handler] Clear filter error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Show all apartments (clear filters and show all)
     * @param {Object} context - Execution context
     * @returns {Promise} Show all result
     */
    async showAllApartments(context = {}) {
        console.log('[IRIS-Handler] Showing all apartments');

        try {
            const app = await this.getAppReady();
            
            // Navigate to apartments section first
            console.log('🔧 [Handler] Navegando a sección de apartamentos...');
            await this.navigateToApartments(app);
            console.log('✅ [Handler] Navegación completada');
            
            if (app.componentManager) {
                // Clear filters to show all apartments
                await this.clearFiltersFromSystem(app);
                
                return {
                    success: true,
                    message: 'Mostrando todos los departamentos'
                };
            } else {
                return {
                    success: false,
                    error: 'ComponentManager not available'
                };
            }
        } catch (error) {
            console.error('[IRIS-Handler] Show all apartments error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Toggle filter
     * @param {Object} filters - Filter criteria
     * @param {Object} context - Execution context
     * @returns {Promise} Toggle result
     */
    async toggleFilter(filters, context = {}) {
        console.log('[IRIS-Handler] Toggling filters:', filters);

        try {
            // Check if filters are currently applied
            const currentFilters = await this.getCurrentFilters();
            const isApplied = this.filtersMatch(currentFilters, filters);
            
            if (isApplied) {
                return await this.clearFilter(context);
            } else {
                return await this.applyFilter(filters, context);
            }
        } catch (error) {
            console.error('[IRIS-Handler] Toggle filter error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Navigate to apartments section
     * @param {Object} app - VideoScrollApp instance
     * @returns {Promise} Navigation result
     */
    async navigateToApartments(app) {
        console.log('[IRIS-Handler] Navigating to apartments section');

        try {
            if (app.navigationSystem) {
                await app.navigationSystem.navigateToSection(2); // apartments section
                return true;
            } else {
                throw new Error('NavigationSystem not available');
            }
        } catch (error) {
            console.error('[IRIS-Handler] Navigation error:', error);
            throw error;
        }
    }

    /**
     * Apply filters to the system
     * @param {Object} app - VideoScrollApp instance
     * @param {Object} filterData - Filter data
     * @returns {Promise} Apply result
     */
    async applyFiltersToSystem(app, filterData) {
        console.log('🔧 [Handler] Iniciando applyFiltersToSystem con datos:', filterData);

        try {
            // Si hay filtro por dormitorios, activar el botón correspondiente
            if (filterData.bedrooms) {
                console.log('🔧 [Handler] Activando filtro de dormitorios:', filterData.bedrooms);
                await this.activateBedroomFilter(filterData.bedrooms);
            }

            // Si hay filtro por precio, activar el botón correspondiente
            if (filterData.precio) {
                console.log('🔧 [Handler] Activando filtro de precio:', filterData.precio);
                await this.activatePriceFilter(filterData.precio);
            }

            // Apply additional filters if needed
            if (filterData.superficie) {
                console.log('🔧 [Handler] Activando filtro de superficie:', filterData.superficie);
                await this.applyAdvancedFilters(filterData);
            }

            console.log('✅ [Handler] Todos los filtros aplicados exitosamente');
            return true;
        } catch (error) {
            console.error('❌ [Handler] Error en applyFiltersToSystem:', error);
            throw error;
        }
    }

    /**
     * Activate bedroom filter button
     * @param {number} bedrooms - Number of bedrooms
     * @returns {Promise} Activation result
     */
    async activateBedroomFilter(bedrooms) {
        try {
            console.log(`[IRIS-Handler] Activating bedroom filter for ${bedrooms} bedrooms`);
            
            // Primero intentar usar ImageFilterSystem si está disponible
            if (window.imageFilterSystem) {
                console.log('[IRIS-Handler] Usando ImageFilterSystem para aplicar filtro');
                
                // Mapear número de dormitorios a tipo
                const bedroomMapping = {
                    1: '1d',
                    2: '2d', 
                    3: '3d'
                };
                
                const targetType = bedroomMapping[bedrooms];
                if (!targetType) {
                    console.warn(`[IRIS-Handler] Invalid bedroom count: ${bedrooms}`);
                    return { success: false, message: `Número de dormitorios no válido: ${bedrooms}` };
                }
                
                // Usar el método del ImageFilterSystem
                window.imageFilterSystem.updateTipoFilter(targetType);
                
                console.log(`[IRIS-Handler] Filter applied via ImageFilterSystem for ${bedrooms} bedrooms`);
                return { success: true, message: `Filtro de ${bedrooms} dormitorios activado via ImageFilterSystem` };
            }
            
            // Fallback: usar el método manual con botones
            console.log('[IRIS-Handler] ImageFilterSystem no disponible, usando método manual');
            
            // Buscar el selector de tipo de apartamento
            const typeSelector = document.querySelector('.apartment-type-selector');
            if (!typeSelector) {
                console.warn('[IRIS-Handler] Apartment type selector not found');
                return { success: false, message: 'Selector de tipo no encontrado' };
            }
            
            // Mapear número de dormitorios a data-type
            const bedroomMapping = {
                1: '1d',
                2: '2d', 
                3: '3d'
            };
            
            const targetType = bedroomMapping[bedrooms];
            if (!targetType) {
                console.warn(`[IRIS-Handler] Invalid bedroom count: ${bedrooms}`);
                return { success: false, message: `Número de dormitorios no válido: ${bedrooms}` };
            }
            
            // Desactivar todos los botones
            const allButtons = typeSelector.querySelectorAll('.type-btn');
            allButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Activar el botón correspondiente
            const targetButton = typeSelector.querySelector(`[data-type="${targetType}"]`);
            if (targetButton) {
                targetButton.classList.add('active');
                
                // Simular click en el botón para activar el filtro
                targetButton.click();
                
                console.log(`[IRIS-Handler] Activated filter for ${bedrooms} bedrooms`);
                return { success: true, message: `Filtro de ${bedrooms} dormitorios activado` };
            } else {
                console.warn(`[IRIS-Handler] Button for ${bedrooms} bedrooms not found`);
                return { success: false, message: `Botón para ${bedrooms} dormitorios no encontrado` };
            }
            
        } catch (error) {
            console.error('[IRIS-Handler] Error activating bedroom filter:', error);
            return { success: false, message: 'Error al activar filtro de dormitorios', error: error.message };
        }
    }

    /**
     * Activate price filter and click corresponding button
     * @param {string} priceFilter - Price filter criteria
     * @returns {Promise} Activation result
     */
    async activatePriceFilter(priceFilter) {
        try {
            console.log(`🔧 [Handler] Iniciando activatePriceFilter para: "${priceFilter}"`);
            
            // Inicializar el generador de tipos si no existe
            if (!window.apartmentTypeGenerator) {
                console.log('🔧 [Handler] Inicializando ApartmentTypeGenerator...');
                window.apartmentTypeGenerator = new window.ApartmentTypeGenerator();
                window.apartmentTypeGenerator.addTypesToCards();
            }
            
            // Buscar tarjetas por tipo usando el sistema de tipos
            console.log('🔍 [Handler] Buscando tarjetas por tipo...');
            const matchingCards = this.findCardsByPriceFilter(priceFilter);
            console.log(`🔍 [Handler] Encontradas ${matchingCards.length} tarjetas que coinciden`);
            
            if (matchingCards.length > 0) {
                // Tomar la primera tarjeta que coincida
                const targetCard = matchingCards[0];
                const typeInfo = window.apartmentTypeGenerator.getTypeFromCard(targetCard);
                
                console.log(`✅ [Handler] Tarjeta encontrada: ${typeInfo.name} (${typeInfo.code})`);
                
                // Buscar el botón "Recorrer" en la tarjeta
                const recorrerButton = targetCard.querySelector('.watchVideoBtn');
                if (recorrerButton) {
                    console.log('🔧 [Handler] Haciendo scroll a la tarjeta...');
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Esperar un poco para que el scroll termine
                    console.log('⏳ [Handler] Esperando 500ms para que termine el scroll...');
                    await this.wait(500);
                    
                    // Simular click en el botón
                    console.log('🔧 [Handler] Simulando click en el botón...');
                    recorrerButton.click();
                    
                    console.log('✅ [Handler] Click simulado exitosamente');
                    return { 
                        success: true, 
                        message: `Filtro de precio activado: ${priceFilter}`,
                        type: typeInfo.name,
                        code: typeInfo.code
                    };
                } else {
                    console.warn('❌ [Handler] No se encontró botón "Recorrer" en la tarjeta');
                    return { success: false, message: 'No se encontró botón "Recorrer" en la tarjeta' };
                }
            } else {
                console.warn(`❌ [Handler] No se encontró precio que coincida con: ${priceFilter}`);
                return { success: false, message: `No se encontró precio que coincida con: ${priceFilter}` };
            }
            
        } catch (error) {
            console.error('❌ [Handler] Error en activatePriceFilter:', error);
            return { success: false, message: 'Error al activar filtro de precio', error: error.message };
        }
    }

    /**
     * Find cards by price filter using type system
     * @param {string} priceFilter - Price filter criteria
     * @returns {Array} Matching cards
     */
    findCardsByPriceFilter(priceFilter) {
        try {
            console.log(`🔍 [Handler] Buscando tarjetas para filtro de precio: "${priceFilter}"`);
            
            // Normalizar el filtro de precio
            const normalizedFilter = this.normalizePrice(priceFilter);
            console.log(`🔍 [Handler] Precio normalizado: "${normalizedFilter}"`);
            
            const matchingCards = [];
            const allCards = document.querySelectorAll('.apartment-card');
            
            for (const card of allCards) {
                const typeInfo = window.apartmentTypeGenerator.getTypeFromCard(card);
                if (typeInfo) {
                    const cardPrice = typeInfo.criteria.precio;
                    const normalizedCardPrice = this.normalizePrice(cardPrice);
                    
                    console.log(`🔍 [Handler] Comparando: "${normalizedFilter}" con "${normalizedCardPrice}"`);
                    
                    if (this.priceMatches(normalizedFilter, normalizedCardPrice)) {
                        console.log(`✅ [Handler] Coincidencia encontrada: ${typeInfo.name}`);
                        matchingCards.push(card);
                    }
                }
            }
            
            return matchingCards;
        } catch (error) {
            console.error('❌ [Handler] Error en findCardsByPriceFilter:', error);
            return [];
        }
    }

    /**
     * Normalize price string for comparison
     * @param {string} price - Price string
     * @returns {string} Normalized price
     */
    normalizePrice(price) {
        return price.toLowerCase()
            .replace(/[^\d.-]/g, '') // Solo números, puntos y guiones
            .replace(/\./g, '') // Remover puntos (separadores de miles)
            .trim();
    }

    /**
     * Check if price filter matches button price
     * @param {string} filterPrice - Price from filter
     * @param {string} buttonPrice - Price from button data attribute
     * @returns {boolean} True if matches
     */
    priceMatches(filterPrice, buttonPrice) {
        try {
            console.log(`🔍 [Handler] Iniciando priceMatches - Filter: "${filterPrice}", Button: "${buttonPrice}"`);
            
            // Normalizar precios para comparación
            const normalizePrice = (price) => {
                const normalized = price.toLowerCase()
                    .replace(/[^\d.-]/g, '') // Solo números, puntos y guiones
                    .replace(/\./g, '') // Remover puntos (separadores de miles)
                    .trim();
                console.log(`🔍 [Handler] Normalización: "${price}" -> "${normalized}"`);
                return normalized;
            };
            
            const normalizedFilter = normalizePrice(filterPrice);
            const normalizedButton = normalizePrice(buttonPrice);
            
            console.log(`🔍 [Handler] Precios normalizados - Filter: "${normalizedFilter}", Button: "${normalizedButton}"`);
            
            // Si el filtro es un rango (contiene guión)
            if (normalizedFilter.includes('-')) {
                console.log('🔍 [Handler] Filtro es un rango');
                const [minFilter, maxFilter] = normalizedFilter.split('-').map(p => parseInt(p));
                console.log(`🔍 [Handler] Rango filtro: ${minFilter} - ${maxFilter}`);
                
                // Si el botón también es un rango
                if (normalizedButton.includes('-')) {
                    console.log('🔍 [Handler] Botón también es un rango');
                    const [minButton, maxButton] = normalizedButton.split('-').map(p => parseInt(p));
                    console.log(`🔍 [Handler] Rango botón: ${minButton} - ${maxButton}`);
                    
                    // Verificar si hay superposición de rangos
                    const matches = (minFilter <= maxButton && maxFilter >= minButton);
                    console.log(`🔍 [Handler] ¿Hay superposición? ${matches ? 'SÍ' : 'NO'}`);
                    return matches;
                } else {
                    // Si el botón es un precio específico
                    console.log('🔍 [Handler] Botón es precio específico');
                    const buttonValue = parseInt(normalizedButton);
                    console.log(`🔍 [Handler] Valor botón: ${buttonValue}`);
                    
                    const matches = (minFilter <= buttonValue && maxFilter >= buttonValue);
                    console.log(`🔍 [Handler] ¿Está en rango? ${matches ? 'SÍ' : 'NO'}`);
                    return matches;
                }
            } else {
                // Si el filtro es un precio específico
                console.log('🔍 [Handler] Filtro es precio específico');
                const filterValue = parseInt(normalizedFilter);
                console.log(`🔍 [Handler] Valor filtro: ${filterValue}`);
                
                // Si el botón es un rango
                if (normalizedButton.includes('-')) {
                    console.log('🔍 [Handler] Botón es un rango');
                    const [minButton, maxButton] = normalizedButton.split('-').map(p => parseInt(p));
                    console.log(`🔍 [Handler] Rango botón: ${minButton} - ${maxButton}`);
                    
                    const matches = (filterValue >= minButton && filterValue <= maxButton);
                    console.log(`🔍 [Handler] ¿Está en rango? ${matches ? 'SÍ' : 'NO'}`);
                    return matches;
                } else {
                    // Si ambos son precios específicos
                    console.log('🔍 [Handler] Ambos son precios específicos');
                    const buttonValue = parseInt(normalizedButton);
                    console.log(`🔍 [Handler] Valor botón: ${buttonValue}`);
                    
                    const matches = filterValue === buttonValue;
                    console.log(`🔍 [Handler] ¿Son iguales? ${matches ? 'SÍ' : 'NO'}`);
                    return matches;
                }
            }
            
        } catch (error) {
            console.error('❌ [Handler] Error en priceMatches:', error);
            return false;
        }
    }

    /**
     * Apply advanced filters (surface, price)
     * @param {Object} filterData - Filter data
     * @returns {Promise} Apply result
     */
    async applyAdvancedFilters(filterData) {
        console.log('[IRIS-Handler] Applying advanced filters:', filterData);

        try {
            // Find apartment cards and filter by criteria
            const cards = document.querySelectorAll('.apartment-card');
            let visibleCards = 0;

            for (const card of cards) {
                const cardInfo = this.extractCardInfo(card);
                const matches = this.matchesCriteria(cardInfo, filterData);
                
                if (matches) {
                    card.style.display = 'block';
                    visibleCards++;
                } else {
                    card.style.display = 'none';
                }
            }

            console.log(`[IRIS-Handler] ${visibleCards} cards visible after filtering`);
            return visibleCards > 0;
        } catch (error) {
            console.error('[IRIS-Handler] Advanced filters error:', error);
            throw error;
        }
    }

    /**
     * Clear filters from the system
     * @param {Object} app - VideoScrollApp instance
     * @returns {Promise} Clear result
     */
    async clearFiltersFromSystem(app) {
        console.log('[IRIS-Handler] Clearing filters from system');

        try {
            // Click "todos" button to clear filters
            const todosButton = document.querySelector('[data-type="all"]');
            if (todosButton) {
                todosButton.click();
                console.log('[IRIS-Handler] Clicked "todos" button');
            }

            // Show all cards
            const cards = document.querySelectorAll('.apartment-card');
            cards.forEach(card => {
                card.style.display = 'block';
            });

            return true;
        } catch (error) {
            console.error('[IRIS-Handler] Clear from system error:', error);
            throw error;
        }
    }

    /**
     * Extract card information
     * @param {HTMLElement} card - Apartment card element
     * @returns {Object} Card information
     */
    extractCardInfo(card) {
        try {
            const title = card.querySelector('h3')?.textContent?.trim() || '';
            const paragraphs = card.querySelectorAll('p');
            
            let superficie = '';
            let precio = '';
            let dormitorios = '';
            
            // First try to extract information from "Recorrer" buttons with data attributes
            const recorrerButtons = card.querySelectorAll('.watchVideoBtn, .btn-secondary[data-apartment]');
            
            for (const button of recorrerButtons) {
                const dataApartment = button.getAttribute('data-apartment') || '';
                const dataSuperficie = button.getAttribute('data-superficie') || '';
                const dataPrecio = button.getAttribute('data-precio') || '';
                
                if (dataSuperficie) superficie = dataSuperficie;
                if (dataPrecio) precio = dataPrecio;
                if (dataApartment) dormitorios = dataApartment;
            }
            
            // If we don't find information in buttons, look in paragraphs
            if (!superficie || !precio || !dormitorios) {
                for (const p of paragraphs) {
                    const text = p.textContent?.trim() || '';
                    
                    // Detect surface area
                    if (text.includes('m²') || text.includes('metros')) {
                        superficie = superficie || text;
                    }
                    // Detect price
                    else if (text.includes('$') || text.includes('UF')) {
                        precio = precio || text;
                    }
                    // Detect bedrooms
                    else if (text.includes('dormitorio') || text.includes('habitación')) {
                        dormitorios = dormitorios || text;
                    }
                }
            }
            
            return {
                title,
                superficie,
                precio,
                dormitorios
            };
            
        } catch (error) {
            console.error('[IRIS-Handler] Extract card info error:', error);
            return {};
        }
    }

    /**
     * Check if card matches criteria
     * @param {Object} cardInfo - Card information
     * @param {Object} criteria - Filter criteria
     * @returns {boolean} True if matches
     */
    matchesCriteria(cardInfo, criteria) {
        // Bedrooms comparison
        if (criteria.bedrooms && cardInfo.dormitorios) {
            const cardBedrooms = cardInfo.dormitorios.toLowerCase();
            const criteriaBedrooms = criteria.bedrooms.toString();
            
            if (!cardBedrooms.includes(criteriaBedrooms)) {
                return false;
            }
        }

        // Surface area comparison
        if (criteria.superficie && cardInfo.superficie) {
            const cardSuperficie = cardInfo.superficie.toLowerCase();
            const criteriaSuperficie = criteria.superficie.toLowerCase();
            
            if (!cardSuperficie.includes(criteriaSuperficie.replace(' m²', '').replace('m²', '').trim())) {
                return false;
            }
        }

        // Price comparison
        if (criteria.precio && cardInfo.precio) {
            const cardPrecio = cardInfo.precio.toLowerCase();
            const criteriaPrecio = criteria.precio.toLowerCase();
            
            if (!cardPrecio.includes(criteriaPrecio.replace('$', '').replace(' uf', '').replace('uf', '').trim())) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get current filters
     * @returns {Promise} Current filters
     */
    async getCurrentFilters() {
        // This would need to be implemented based on the current UI state
        // For now, return empty object
        return {};
    }

    /**
     * Check if filters match
     * @param {Object} current - Current filters
     * @param {Object} target - Target filters
     * @returns {boolean} True if match
     */
    filtersMatch(current, target) {
        return JSON.stringify(current) === JSON.stringify(target);
    }

    /**
     * Get ready VideoScrollApp instance
     * @returns {Promise} VideoScrollApp instance
     */
    async getAppReady() {
        let attempts = 0;
        const maxAttempts = 100; // 10 seconds max wait
        
        while (!window.videoScrollApp && attempts < maxAttempts) {
            await this.wait(100);
            attempts++;
        }
        
        if (!window.videoScrollApp) {
            throw new Error('VideoScrollApp not available after 10 seconds');
        }

        // Verify app is initialized
        if (!window.videoScrollApp.isInitialized) {
            console.log('[IRIS-Handler] Waiting for VideoScrollApp to initialize...');
            let initAttempts = 0;
            while (!window.videoScrollApp.isInitialized && initAttempts < 50) {
                await this.wait(100);
                initAttempts++;
            }
            if (!window.videoScrollApp.isInitialized) {
                throw new Error('VideoScrollApp not initialized');
            }
        }

        console.log('[IRIS-Handler] VideoScrollApp ready');
        return window.videoScrollApp;
    }

    /**
     * Activate apartment by tipo de departamento code
     * @param {string} tipoDepartamento - Tipo de departamento code (e.g., "Tipo A-S-2")
     * @returns {Promise} Activation result
     */
    async activateByTipoDepartamento(tipoDepartamento) {
        try {
            console.log(`🔧 [Handler] Buscando tarjeta con tipo de departamento: "${tipoDepartamento}"`);
            
            // DEBUG: Mostrar todos los tipos de departamento disponibles
            const allCards = document.querySelectorAll('.apartment-card');
            console.log(`🔍 [Handler] Total de tarjetas encontradas: ${allCards.length}`);
            
            allCards.forEach((card, index) => {
                const paragraphs = card.querySelectorAll('p');
                paragraphs.forEach(p => {
                    const text = p.textContent || p.innerText;
                    if (text.includes('Tipo de Departamento:')) {
                        console.log(`🔍 [Handler] Tarjeta ${index + 1} - Tipo: "${text}"`);
                    }
                });
            });
            
            // DEBUG: Mostrar también los botones "Recorrer" disponibles
            const recorrerButtons = document.querySelectorAll('.watchVideoBtn');
            console.log(`🔍 [Handler] Total de botones "Recorrer" encontrados: ${recorrerButtons.length}`);
            
            recorrerButtons.forEach((button, index) => {
                const dataAttributes = {
                    'data-tipo-departamento': button.getAttribute('data-tipo-departamento'),
                    'data-apartment': button.getAttribute('data-apartment'),
                    'data-superficie': button.getAttribute('data-superficie'),
                    'data-precio': button.getAttribute('data-precio')
                };
                console.log(`🔍 [Handler] Botón ${index + 1} - Atributos:`, dataAttributes);
            });
            
            // Método 1: Buscar por botón con data-tipo-departamento
            console.log('🔍 [Handler] Método 1: Buscando botón por data-tipo-departamento...');
            const targetButton = document.querySelector(`button[data-tipo-departamento="${tipoDepartamento}"]`);
            
            if (targetButton) {
                console.log(`✅ [Handler] Botón encontrado directamente: ${targetButton.id}`);
                const targetCard = targetButton.closest('.apartment-card');
                
                if (targetCard) {
                    console.log('🔧 [Handler] Haciendo scroll a la tarjeta...');
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Esperar un poco para que el scroll termine
                    console.log('⏳ [Handler] Esperando 500ms para que termine el scroll...');
                    await this.wait(500);
                    
                    // Activar el modo de recorrido para esta tarjeta
                    console.log('🔧 [Handler] Activando modo de recorrido...');
                    await this.activateRecorridoMode(targetCard, targetButton);
                    
                    console.log('✅ [Handler] Modo de recorrido activado exitosamente');
                    return { 
                        success: true, 
                        message: `Tarjeta activada y recorrido iniciado: ${tipoDepartamento}`,
                        tipo: tipoDepartamento,
                        buttonId: targetButton.id
                    };
                }
            }
            
            // Método 2: Buscar por texto en las tarjetas (fallback)
            console.log('🔍 [Handler] Método 2: Buscando por texto en tarjetas...');
            const apartmentCards = document.querySelectorAll('.apartment-card');
            console.log(`🔍 [Handler] Encontradas ${apartmentCards.length} tarjetas de apartamentos`);
            
            let targetCard = null;
            
            // Buscar la tarjeta que contenga el tipo de departamento especificado
            for (const card of apartmentCards) {
                // Buscar en el texto del párrafo que contenga "Tipo de Departamento"
                const paragraphs = card.querySelectorAll('p');
                let found = false;
                
                                 for (const p of paragraphs) {
                     const text = p.textContent || p.innerText;
                     console.log(`🔍 [Handler] Revisando párrafo: "${text}"`);
                     
                     // Comparación case-insensitive
                     const normalizedText = text.toLowerCase();
                     const normalizedTipo = tipoDepartamento.toLowerCase();
                     
                     if (normalizedText.includes('tipo de departamento:') && normalizedText.includes(normalizedTipo)) {
                         targetCard = card;
                         console.log(`✅ [Handler] Tarjeta encontrada con tipo: ${tipoDepartamento}`);
                         found = true;
                         break;
                     }
                 }
                
                if (found) break;
            }
            
            if (targetCard) {
                console.log('🔧 [Handler] Tarjeta encontrada, activando modo de recorrido...');
                
                // NO hacer scroll automático - mantener posición actual
                console.log('📍 [Handler] Manteniendo posición de scroll actual');
                
                // Activar el modo de recorrido para esta tarjeta
                console.log('🔧 [Handler] Activando modo de recorrido...');
                await this.activateRecorridoMode(targetCard);
                
                console.log('✅ [Handler] Modo de recorrido activado exitosamente');
                return { 
                    success: true, 
                    message: `Tarjeta activada y recorrido iniciado: ${tipoDepartamento}`,
                    tipo: tipoDepartamento
                };
            } else {
                console.warn(`❌ [Handler] No se encontró tarjeta con tipo de departamento: ${tipoDepartamento}`);
                return { success: false, message: `No se encontró tarjeta con tipo de departamento: ${tipoDepartamento}` };
            }
            
        } catch (error) {
            console.error('❌ [Handler] Error en activateByTipoDepartamento:', error);
            return { success: false, message: 'Error al activar por tipo de departamento', error: error.message };
        }
    }

    /**
     * Activate recorrido mode for a specific card
     * @param {HTMLElement} targetCard - The card to activate
     * @param {HTMLElement} targetButton - The specific button to activate (optional)
     * @returns {Promise} Activation result
     */
    async activateRecorridoMode(targetCard, targetButton = null) {
        try {
            console.log('🔧 [Handler] Iniciando activación de modo recorrido...');
            
            // Ocultar todas las tarjetas excepto la objetivo
            const allCards = document.querySelectorAll('.apartment-card');
            allCards.forEach(card => {
                if (card === targetCard) {
                    // Mostrar la tarjeta objetivo con efectos de recorrido
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1.1)';
                    card.classList.add('recorrido-active');
                    console.log('✅ [Handler] Tarjeta objetivo activada');
                } else {
                    // Ocultar las demás tarjetas
                    card.style.display = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    card.classList.remove('recorrido-active');
                }
            });
            
            // Cambiar el layout del contenedor para centrar la tarjeta activa
            const apartmentList = document.querySelector('#apartmentList');
            if (apartmentList) {
                apartmentList.style.display = 'flex';
                apartmentList.style.justifyContent = 'center';
                apartmentList.style.alignItems = 'center';
                apartmentList.style.minHeight = '60vh';
                console.log('✅ [Handler] Layout del contenedor ajustado');
            }
            
            // Ocultar los botones de acción en la tarjeta activa (modo recorrido)
            const apartmentActions = targetCard.querySelector('.apartment-actions');
            if (apartmentActions) {
                apartmentActions.style.display = 'none';
                console.log('✅ [Handler] Botones de acción ocultados (modo recorrido)');
            }
            
            // Activar el botón específico o buscar el botón "Recorrer" en la tarjeta
            let recorrerButton = targetButton;
            if (!recorrerButton) {
                recorrerButton = targetCard.querySelector('.watchVideoBtn');
            }
            
            if (recorrerButton) {
                console.log(`🔧 [Handler] Simulando click en el botón "Recorrer" (ID: ${recorrerButton.id})...`);
                
                // Agregar un efecto visual al botón antes del click
                recorrerButton.style.transform = 'scale(1.1)';
                recorrerButton.style.boxShadow = '0 0 20px rgba(0,123,255,0.5)';
                
                // Esperar un poco para que se vea el efecto
                await this.wait(200);
                
                // Simular el click SIN hacer scroll
                recorrerButton.click();
                
                // Restaurar el estilo del botón
                setTimeout(() => {
                    recorrerButton.style.transform = '';
                    recorrerButton.style.boxShadow = '';
                }, 500);
                
                console.log('✅ [Handler] Click en botón "Recorrer" simulado exitosamente (sin scroll)');
            } else {
                console.log('⚠️ [Handler] No se encontró botón "Recorrer" en la tarjeta');
            }
            
            console.log('✅ [Handler] Modo de recorrido activado completamente');
            return true;
            
        } catch (error) {
            console.error('❌ [Handler] Error al activar modo de recorrido:', error);
            throw error;
        }
    }

    /**
     * Wait utility function
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise} Promise that resolves after ms
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get handler information
     * @returns {Object} Handler information
     */
    getInfo() {
        return {
            name: this.name,
            supportedActions: this.supportedActions,
            capabilities: ['apartment_filtering', 'criteria_matching']
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FilterHandler;
} else {
    window.FilterHandler = FilterHandler;
}
