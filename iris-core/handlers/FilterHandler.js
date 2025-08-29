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
        console.log('[IRIS-Handler] Applying filters:', filters);

        try {
            const app = await this.getAppReady();
            
            // Navigate to apartments section first
            await this.navigateToApartments(app);
            
            // Apply filters using ComponentManager
            if (app.componentManager) {
                const filterData = {};
                
                if (filters.bedrooms) {
                    filterData.bedrooms = filters.bedrooms;
                }
                if (filters.superficie) {
                    filterData.superficie = filters.superficie;
                }
                if (filters.precio) {
                    filterData.precio = filters.precio;
                }

                // Use the existing filter system
                await this.applyFiltersToSystem(app, filterData);
                
                return {
                    success: true,
                    message: `Filtros aplicados: ${JSON.stringify(filters)}`,
                    filters: filters
                };
            } else {
                return {
                    success: false,
                    error: 'ComponentManager not available'
                };
            }
        } catch (error) {
            console.error('[IRIS-Handler] Apply filter error:', error);
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
        console.log('[IRIS-Handler] Applying filters to system:', filterData);

        try {
            // Si hay filtro por dormitorios, activar el botón correspondiente
            if (filterData.bedrooms) {
                await this.activateBedroomFilter(filterData.bedrooms);
            }

            // Apply additional filters if needed
            if (filterData.superficie || filterData.precio) {
                await this.applyAdvancedFilters(filterData);
            }

            return true;
        } catch (error) {
            console.error('[IRIS-Handler] Apply to system error:', error);
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
