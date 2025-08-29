/**
 * FilterController - Controls filter behavior using Adapter pattern
 * Adapts filter commands to the actual filter system
 */
class FilterController {
    constructor() {
        this.name = 'FilterController';
        this.supportedActions = ['apply', 'clear', 'toggle'];
        this.currentFilters = {};
        this.filterButtons = new Map();
    }

    /**
     * Execute filter command
     * @param {Object} command - Filter command
     * @param {Object} context - Execution context
     * @returns {Promise} Execution result
     */
    async execute(command, context = {}) {
        console.log(`[IRIS-Controller] Filter: ${command.action}`, command.filters);

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
            console.error('[IRIS-Controller] Filter error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Apply filters
     * @param {Object} filters - Filter criteria
     * @param {Object} context - Execution context
     * @returns {Promise} Filter result
     */
    async applyFilter(filters, context = {}) {
        console.log('[IRIS-Controller] Applying filters:', filters);

        try {
            // Navigate to apartments section first
            await this.navigateToApartments();
            
            // Apply filters
            const result = await this.applyFiltersToUI(filters);
            
            if (result.success) {
                this.currentFilters = { ...filters };
            }
            
            return result;

        } catch (error) {
            console.error('[IRIS-Controller] Apply filter error:', error);
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
        console.log('[IRIS-Controller] Clearing filters');

        try {
            // Clear filter buttons
            await this.clearFilterButtons();
            
            // Show all apartment cards
            await this.showAllCards();
            
            this.currentFilters = {};
            
            return {
                success: true,
                message: 'Filtros limpiados',
                filters: {}
            };

        } catch (error) {
            console.error('[IRIS-Controller] Clear filter error:', error);
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
        console.log('[IRIS-Controller] Toggling filters:', filters);

        try {
            // Check if filters are currently applied
            const isApplied = this.filtersMatch(this.currentFilters, filters);
            
            if (isApplied) {
                return await this.clearFilter(context);
            } else {
                return await this.applyFilter(filters, context);
            }

        } catch (error) {
            console.error('[IRIS-Controller] Toggle filter error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Navigate to apartments section
     * @returns {Promise} Navigation result
     */
    async navigateToApartments() {
        console.log('[IRIS-Controller] Navigating to apartments section');

        try {
            const app = await this.getAppReady();
            
            if (app.navigationSystem) {
                await app.navigationSystem.navigateToSection(2); // apartments section
                return true;
            } else {
                throw new Error('NavigationSystem not available');
            }
        } catch (error) {
            console.error('[IRIS-Controller] Navigation error:', error);
            throw error;
        }
    }

    /**
     * Apply filters to UI
     * @param {Object} filters - Filter criteria
     * @returns {Promise} Apply result
     */
    async applyFiltersToUI(filters) {
        console.log('[IRIS-Controller] Applying filters to UI:', filters);

        try {
            let appliedFilters = 0;

            // Apply bedroom filter
            if (filters.bedrooms) {
                const bedroomResult = await this.applyBedroomFilter(filters.bedrooms);
                if (bedroomResult) appliedFilters++;
            }

            // Apply surface area filter
            if (filters.superficie) {
                const surfaceResult = await this.applySurfaceFilter(filters.superficie);
                if (surfaceResult) appliedFilters++;
            }

            // Apply price filter
            if (filters.precio) {
                const priceResult = await this.applyPriceFilter(filters.precio);
                if (priceResult) appliedFilters++;
            }

            return {
                success: appliedFilters > 0,
                message: `Aplicados ${appliedFilters} filtros`,
                appliedFilters: appliedFilters,
                filters: filters
            };

        } catch (error) {
            console.error('[IRIS-Controller] Apply to UI error:', error);
            throw error;
        }
    }

    /**
     * Apply bedroom filter
     * @param {number} bedrooms - Number of bedrooms
     * @returns {Promise<boolean>} Success result
     */
    async applyBedroomFilter(bedrooms) {
        console.log(`[IRIS-Controller] Applying bedroom filter: ${bedrooms}`);

        try {
            // Find and click appropriate filter button
            const filterButtons = document.querySelectorAll('.filter-buttons button');
            
            for (const button of filterButtons) {
                const buttonText = button.textContent.toLowerCase();
                const dataType = button.getAttribute('data-type');
                
                if (dataType === `${bedrooms}d` || 
                    buttonText.includes(`${bedrooms} dormitorio`)) {
                    button.click();
                    console.log(`[IRIS-Controller] Clicked bedroom filter: ${buttonText}`);
                    return true;
                }
            }

            console.warn(`[IRIS-Controller] No bedroom filter button found for ${bedrooms} bedrooms`);
            return false;

        } catch (error) {
            console.error('[IRIS-Controller] Bedroom filter error:', error);
            return false;
        }
    }

    /**
     * Apply surface area filter
     * @param {string} superficie - Surface area criteria
     * @returns {Promise<boolean>} Success result
     */
    async applySurfaceFilter(superficie) {
        console.log(`[IRIS-Controller] Applying surface filter: ${superficie}`);

        try {
            // Find apartment cards and filter by surface area
            const cards = document.querySelectorAll('.apartment-card');
            let visibleCards = 0;

            for (const card of cards) {
                const cardInfo = this.extractCardInfo(card);
                const matches = this.matchesSurfaceCriteria(cardInfo, superficie);
                
                if (matches) {
                    card.style.display = 'block';
                    visibleCards++;
                } else {
                    card.style.display = 'none';
                }
            }

            console.log(`[IRIS-Controller] ${visibleCards} cards visible after surface filtering`);
            return visibleCards > 0;

        } catch (error) {
            console.error('[IRIS-Controller] Surface filter error:', error);
            return false;
        }
    }

    /**
     * Apply price filter
     * @param {string} precio - Price criteria
     * @returns {Promise<boolean>} Success result
     */
    async applyPriceFilter(precio) {
        console.log(`[IRIS-Controller] Applying price filter: ${precio}`);

        try {
            // Find apartment cards and filter by price
            const cards = document.querySelectorAll('.apartment-card');
            let visibleCards = 0;

            for (const card of cards) {
                const cardInfo = this.extractCardInfo(card);
                const matches = this.matchesPriceCriteria(cardInfo, precio);
                
                if (matches) {
                    card.style.display = 'block';
                    visibleCards++;
                } else {
                    card.style.display = 'none';
                }
            }

            console.log(`[IRIS-Controller] ${visibleCards} cards visible after price filtering`);
            return visibleCards > 0;

        } catch (error) {
            console.error('[IRIS-Controller] Price filter error:', error);
            return false;
        }
    }

    /**
     * Clear filter buttons
     * @returns {Promise} Clear result
     */
    async clearFilterButtons() {
        console.log('[IRIS-Controller] Clearing filter buttons');

        try {
            // Click "todos" button to clear filters
            const todosButton = document.querySelector('[data-type="all"]');
            if (todosButton) {
                todosButton.click();
                console.log('[IRIS-Controller] Clicked "todos" button');
                return true;
            } else {
                console.warn('[IRIS-Controller] "todos" button not found');
                return false;
            }
        } catch (error) {
            console.error('[IRIS-Controller] Clear buttons error:', error);
            return false;
        }
    }

    /**
     * Show all apartment cards
     * @returns {Promise} Show result
     */
    async showAllCards() {
        console.log('[IRIS-Controller] Showing all cards');

        try {
            const cards = document.querySelectorAll('.apartment-card');
            cards.forEach(card => {
                card.style.display = 'block';
            });

            console.log(`[IRIS-Controller] ${cards.length} cards shown`);
            return true;
        } catch (error) {
            console.error('[IRIS-Controller] Show cards error:', error);
            return false;
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
            console.error('[IRIS-Controller] Extract card info error:', error);
            return {};
        }
    }

    /**
     * Check if card matches surface criteria
     * @param {Object} cardInfo - Card information
     * @param {string} superficie - Surface criteria
     * @returns {boolean} True if matches
     */
    matchesSurfaceCriteria(cardInfo, superficie) {
        if (!cardInfo.superficie || !superficie) {
            return true;
        }

        const cardSuperficie = cardInfo.superficie.toLowerCase();
        const criteriaSuperficie = superficie.toLowerCase();
        
        return cardSuperficie.includes(criteriaSuperficie.replace(' m²', '').replace('m²', '').trim());
    }

    /**
     * Check if card matches price criteria
     * @param {Object} cardInfo - Card information
     * @param {string} precio - Price criteria
     * @returns {boolean} True if matches
     */
    matchesPriceCriteria(cardInfo, precio) {
        if (!cardInfo.precio || !precio) {
            return true;
        }

        const cardPrecio = cardInfo.precio.toLowerCase();
        const criteriaPrecio = precio.toLowerCase();
        
        return cardPrecio.includes(criteriaPrecio.replace('$', '').replace(' uf', '').replace('uf', '').trim());
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
     * Get current filters
     * @returns {Object} Current filters
     */
    getCurrentFilters() {
        return { ...this.currentFilters };
    }

    /**
     * Get filter information
     * @returns {Object} Filter information
     */
    getFilterInfo() {
        return {
            currentFilters: this.getCurrentFilters(),
            availableFilters: this.getAvailableFilters(),
            totalCards: this.getTotalCards(),
            visibleCards: this.getVisibleCards()
        };
    }

    /**
     * Get available filters
     * @returns {Array} Available filter options
     */
    getAvailableFilters() {
        const filters = [];
        
        // Get filter buttons
        const filterButtons = document.querySelectorAll('.filter-buttons button');
        filterButtons.forEach(button => {
            filters.push({
                text: button.textContent,
                dataType: button.getAttribute('data-type'),
                active: button.classList.contains('active')
            });
        });

        return filters;
    }

    /**
     * Get total number of cards
     * @returns {number} Total cards
     */
    getTotalCards() {
        return document.querySelectorAll('.apartment-card').length;
    }

    /**
     * Get visible number of cards
     * @returns {number} Visible cards
     */
    getVisibleCards() {
        const cards = document.querySelectorAll('.apartment-card');
        let visible = 0;
        
        cards.forEach(card => {
            if (card.style.display !== 'none') {
                visible++;
            }
        });

        return visible;
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
            console.log('[IRIS-Controller] Waiting for VideoScrollApp to initialize...');
            let initAttempts = 0;
            while (!window.videoScrollApp.isInitialized && initAttempts < 50) {
                await this.wait(100);
                initAttempts++;
            }
            if (!window.videoScrollApp.isInitialized) {
                throw new Error('VideoScrollApp not initialized');
            }
        }

        console.log('[IRIS-Controller] VideoScrollApp ready');
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
     * Initialize controller
     * @param {Object} config - Configuration object
     * @returns {Promise} Initialization result
     */
    async initialize(config = {}) {
        console.log('[IRIS-Controller] Initializing FilterController');

        // Cache filter buttons
        const filterButtons = document.querySelectorAll('.filter-buttons button');
        filterButtons.forEach(button => {
            const dataType = button.getAttribute('data-type');
            if (dataType) {
                this.filterButtons.set(dataType, button);
            }
        });

        console.log(`[IRIS-Controller] Cached ${this.filterButtons.size} filter buttons`);
        console.log('[IRIS-Controller] FilterController initialized');
        return true;
    }

    /**
     * Cleanup controller
     * @returns {Promise} Cleanup result
     */
    async cleanup() {
        console.log('[IRIS-Controller] Cleaning up FilterController');
        this.filterButtons.clear();
        this.currentFilters = {};
        return true;
    }

    /**
     * Get controller information
     * @returns {Object} Controller information
     */
    getInfo() {
        return {
            name: this.name,
            supportedActions: this.supportedActions,
            currentFilters: this.getCurrentFilters(),
            filterInfo: this.getFilterInfo(),
            capabilities: ['apartment_filtering', 'criteria_matching', 'ui_adaptation']
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FilterController;
} else {
    window.FilterController = FilterController;
}
