/**
 * IRIS Integration - Maintains compatibility with existing iris-bridge.js
 * Provides the same API while using the new modular system
 */
class IRISIntegration {
    constructor() {
        this.name = 'IRISIntegration';
        this.isInitialized = false;
        this.irisCore = null;
    }

    /**
     * Initialize the integration
     * @returns {Promise} Initialization result
     */
    async initialize() {
        try {
            console.log('[IRIS-Integration] Initializing integration...');

            // Wait for IRIS Core to be available
            await this.waitForIRISCore();
            
            // Initialize IRIS Core
            this.irisCore = window.IRIS;
            const initResult = await this.irisCore.initialize();
            
            if (initResult.success) {
                this.isInitialized = true;
                console.log('[IRIS-Integration] Integration initialized successfully');
                
                // Set up the legacy API
                this.setupLegacyAPI();
                
                return { success: true, message: 'IRIS Integration ready' };
            } else {
                throw new Error(initResult.error);
            }

        } catch (error) {
            console.error('[IRIS-Integration] Initialization failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Wait for IRIS Core to be available
     * @returns {Promise} Wait result
     */
    async waitForIRISCore() {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait
        
        while (!window.IRIS && attempts < maxAttempts) {
            await this.wait(100);
            attempts++;
        }
        
        if (!window.IRIS) {
            throw new Error('IRIS Core not available after 5 seconds');
        }
        
        console.log('[IRIS-Integration] IRIS Core detected');
    }

    /**
     * Set up legacy API compatibility
     */
    setupLegacyAPI() {
        console.log('[IRIS-Integration] Setting up legacy API...');

        // Create the legacy window.IR object
        window.IR = {
            // Navigation methods
            goto: async (key) => {
                return await this.irisCore.processText(`ir a ${key}`);
            },

            // Video methods
            video: async (action) => {
                return await this.irisCore.processText(`${action} video`);
            },

            play: async () => {
                return await this.irisCore.processText('reproducir video');
            },

            pause: async () => {
                return await this.irisCore.processText('pausar video');
            },

            // Scroll methods
            scrollTo: async (position) => {
                return await this.irisCore.processText(`ir a ${position}`);
            },

            // Filter methods
            detectAndNavigate: async (text) => {
                return await this.irisCore.processText(text);
            },

            showApartmentDetails: async (criteria) => {
                return await this.irisCore.processText(`mostrar detalle de ${criteria}`);
            },

            // Utility methods
            getStatus: () => {
                return this.irisCore.getStatus();
            },

            getInfo: () => {
                return this.irisCore.getInfo();
            },

            processText: async (text) => {
                return await this.irisCore.processText(text);
            },

            executeCommand: async (command) => {
                return await this.irisCore.executeCommand(command);
            }
        };

        console.log('[IRIS-Integration] Legacy API setup complete');
    }

    /**
     * Process text using the new system
     * @param {string} text - Input text
     * @returns {Promise} Processing result
     */
    async processText(text) {
        if (!this.isInitialized) {
            return { success: false, error: 'IRIS Integration not initialized' };
        }

        return await this.irisCore.processText(text);
    }

    /**
     * Execute command directly
     * @param {Object} command - Command object
     * @returns {Promise} Execution result
     */
    async executeCommand(command) {
        if (!this.isInitialized) {
            return { success: false, error: 'IRIS Integration not initialized' };
        }

        return await this.irisCore.executeCommand(command);
    }

    /**
     * Get integration status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            name: this.name,
            isInitialized: this.isInitialized,
            irisCore: this.irisCore ? this.irisCore.getStatus() : null,
            legacyAPI: !!window.IR
        };
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

// Initialize integration when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[IRIS-Integration] DOM ready, initializing integration...');
    
    const integration = new IRISIntegration();
    const result = await integration.initialize();
    
    if (result.success) {
        console.log('[IRIS-Integration] Integration ready');
        window.irisIntegration = integration;
    } else {
        console.error('[IRIS-Integration] Integration failed:', result.error);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IRISIntegration;
} else {
    window.IRISIntegration = IRISIntegration;
}
