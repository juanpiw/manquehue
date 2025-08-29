/**
 * NavigationHandler - Handles navigation commands
 * Implements navigation logic from iris-bridge.js
 */
class NavigationHandler {
    constructor() {
        this.name = 'NavigationHandler';
        this.supportedActions = ['goto'];
    }

    /**
     * Handle navigation command
     * @param {Object} command - Navigation command
     * @param {Object} context - Execution context
     * @returns {Promise} Execution result
     */
    async handle(command, context = {}) {
        console.log(`[IRIS-Handler] Navigation: ${command.action} ${command.key}`);

        try {
            switch (command.action) {
                case 'goto':
                    return await this.goto(command.key, context);
                default:
                    return {
                        success: false,
                        error: `Unsupported navigation action: ${command.action}`
                    };
            }
        } catch (error) {
            console.error('[IRIS-Handler] Navigation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Navigate to specific section
     * @param {string} key - Section key
     * @param {Object} context - Execution context
     * @returns {Promise} Navigation result
     */
    async goto(key, context = {}) {
        console.log(`[IRIS-Handler] Navigating to: ${key}`);

        try {
            // Get the VideoScrollApp instance
            const app = await this.getAppReady();
            
            // Map navigation keys to section indices
            const sectionMap = {
                'apartments': 2,
                'houses': 2,
                'equipment': 4,
                'features': 3,
                'home': 1
            };

            const sectionIndex = sectionMap[key];
            if (sectionIndex === undefined) {
                return {
                    success: false,
                    error: `Unknown section: ${key}`
                };
            }

            // Use NavigationSystem to navigate
            if (app.navigationSystem) {
                await app.navigationSystem.navigateToSection(sectionIndex);
                
                return {
                    success: true,
                    message: `Navegando a ${key}`,
                    section: key,
                    sectionIndex: sectionIndex
                };
            } else {
                return {
                    success: false,
                    error: 'NavigationSystem not available'
                };
            }

        } catch (error) {
            console.error('[IRIS-Handler] Goto error:', error);
            return {
                success: false,
                error: error.message
            };
        }
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
            capabilities: ['section_navigation', 'scroll_navigation']
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationHandler;
} else {
    window.NavigationHandler = NavigationHandler;
}
