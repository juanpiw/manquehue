/**
 * IRIS Loader - Loads all modular IRIS components in the correct order
 * Ensures proper initialization and dependency management
 */
class IRISLoader {
    constructor() {
        this.name = 'IRISLoader';
        this.loadedComponents = new Set();
        this.loadOrder = [
            // Core components (must be loaded first)
            'iris-core/core/CommandParser.js',
            'iris-core/core/CommandRegistry.js',
            'iris-core/core/CommandExecutor.js',
            'iris-core/core/UIController.js',
            
            // Parsers
            'iris-core/parsers/NaturalLanguageParser.js',
            'iris-core/parsers/StructuredCommandParser.js',
            
            // Handlers
            'iris-core/handlers/NavigationHandler.js',
            'iris-core/handlers/VideoHandler.js',
            'iris-core/handlers/FilterHandler.js',
            
            // Controllers
            'iris-core/controllers/ScrollController.js',
            'iris-core/controllers/VideoController.js',
            'iris-core/controllers/FilterController.js',
            
            // Main system
            'iris-core/IRISCore.js',
            
            // Integration layer
            'iris-core/iris-integration.js'
        ];
    }

    /**
     * Load all IRIS components
     * @returns {Promise} Loading result
     */
    async loadAll() {
        try {
            console.log('[IRIS-Loader] Starting to load IRIS components...');

            for (const component of this.loadOrder) {
                await this.loadComponent(component);
            }

            console.log('[IRIS-Loader] All components loaded successfully');
            return { success: true, message: 'All IRIS components loaded' };

        } catch (error) {
            console.error('[IRIS-Loader] Loading failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Load a single component
     * @param {string} componentPath - Path to component file
     * @returns {Promise} Loading result
     */
    async loadComponent(componentPath) {
        try {
            console.log(`[IRIS-Loader] Loading component: ${componentPath}`);

            // Create script element
            const script = document.createElement('script');
            script.src = componentPath;
            script.type = 'text/javascript';

            // Wait for script to load
            await this.loadScript(script);

            this.loadedComponents.add(componentPath);
            console.log(`[IRIS-Loader] Component loaded: ${componentPath}`);

        } catch (error) {
            console.error(`[IRIS-Loader] Failed to load component ${componentPath}:`, error);
            throw error;
        }
    }

    /**
     * Load a script element
     * @param {HTMLScriptElement} script - Script element to load
     * @returns {Promise} Loading result
     */
    loadScript(script) {
        return new Promise((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${script.src}`));
            
            document.head.appendChild(script);
        });
    }

    /**
     * Check if all components are loaded
     * @returns {boolean} True if all loaded
     */
    areAllComponentsLoaded() {
        return this.loadedComponents.size === this.loadOrder.length;
    }

    /**
     * Get loading status
     * @returns {Object} Loading status
     */
    getStatus() {
        return {
            name: this.name,
            totalComponents: this.loadOrder.length,
            loadedComponents: this.loadedComponents.size,
            allLoaded: this.areAllComponentsLoaded(),
            loadedList: Array.from(this.loadedComponents)
        };
    }

    /**
     * Wait for all components to be loaded
     * @returns {Promise} Wait result
     */
    async waitForAllComponents() {
        let attempts = 0;
        const maxAttempts = 100; // 10 seconds max wait

        while (!this.areAllComponentsLoaded() && attempts < maxAttempts) {
            await this.wait(100);
            attempts++;
        }

        if (!this.areAllComponentsLoaded()) {
            throw new Error('Not all components loaded after 10 seconds');
        }

        console.log('[IRIS-Loader] All components confirmed loaded');
    }

    /**
     * Wait utility function
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise} Promise that resolves after ms
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Auto-load when this script is loaded
(async () => {
    console.log('[IRIS-Loader] Auto-loading IRIS components...');
    
    const loader = new IRISLoader();
    const result = await loader.loadAll();
    
    if (result.success) {
        console.log('[IRIS-Loader] Auto-loading complete');
        window.irisLoader = loader;
    } else {
        console.error('[IRIS-Loader] Auto-loading failed:', result.error);
    }
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IRISLoader;
} else {
    window.IRISLoader = IRISLoader;
}
