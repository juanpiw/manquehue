/**
 * ScrollController - Controls scroll behavior using Adapter pattern
 * Adapts scroll commands to the actual UI scrolling system
 */
class ScrollController {
    constructor() {
        this.name = 'ScrollController';
        this.supportedActions = ['scrollTo', 'up', 'down'];
        this.scrollBehavior = 'smooth';
        this.scrollDuration = 1000;
    }

    /**
     * Execute scroll command
     * @param {Object} command - Scroll command
     * @param {Object} context - Execution context
     * @returns {Promise} Execution result
     */
    async execute(command, context = {}) {
        console.log(`[IRIS-Controller] Scroll: ${command.action}`, command);

        try {
            switch (command.action) {
                case 'scrollTo':
                    return await this.scrollTo(command.position || command.direction, context);
                case 'up':
                    return await this.scrollUp(context);
                case 'down':
                    return await this.scrollDown(context);
                default:
                    return {
                        success: false,
                        error: `Unsupported scroll action: ${command.action}`
                    };
            }
        } catch (error) {
            console.error('[IRIS-Controller] Scroll error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Scroll to specific position
     * @param {string} position - Scroll position
     * @param {Object} context - Execution context
     * @returns {Promise} Scroll result
     */
    async scrollTo(position, context = {}) {
        console.log(`[IRIS-Controller] Scrolling to: ${position}`);

        try {
            let targetPosition = 0;

            switch (position) {
                case 'top':
                    targetPosition = 0;
                    break;
                case 'bottom':
                    targetPosition = document.documentElement.scrollHeight - window.innerHeight;
                    break;
                case 'apartments':
                    targetPosition = this.getSectionPosition('apartments');
                    break;
                case 'houses':
                    targetPosition = this.getSectionPosition('houses');
                    break;
                case 'equipment':
                    targetPosition = this.getSectionPosition('equipment');
                    break;
                case 'features':
                    targetPosition = this.getSectionPosition('features');
                    break;
                default:
                    // Try to parse as number
                    const parsed = parseInt(position);
                    if (!isNaN(parsed)) {
                        targetPosition = parsed;
                    } else {
                        return {
                            success: false,
                            error: `Unknown scroll position: ${position}`
                        };
                    }
            }

            await this.performScroll(targetPosition);
            
            return {
                success: true,
                message: `Desplazando a ${position}`,
                position: targetPosition
            };

        } catch (error) {
            console.error('[IRIS-Controller] ScrollTo error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Scroll up
     * @param {Object} context - Execution context
     * @returns {Promise} Scroll result
     */
    async scrollUp(context = {}) {
        console.log('[IRIS-Controller] Scrolling up');

        try {
            const currentPosition = window.pageYOffset;
            const targetPosition = Math.max(0, currentPosition - window.innerHeight);
            
            await this.performScroll(targetPosition);
            
            return {
                success: true,
                message: 'Desplazando hacia arriba',
                position: targetPosition
            };

        } catch (error) {
            console.error('[IRIS-Controller] ScrollUp error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Scroll down
     * @param {Object} context - Execution context
     * @returns {Promise} Scroll result
     */
    async scrollDown(context = {}) {
        console.log('[IRIS-Controller] Scrolling down');

        try {
            const currentPosition = window.pageYOffset;
            const maxPosition = document.documentElement.scrollHeight - window.innerHeight;
            const targetPosition = Math.min(maxPosition, currentPosition + window.innerHeight);
            
            await this.performScroll(targetPosition);
            
            return {
                success: true,
                message: 'Desplazando hacia abajo',
                position: targetPosition
            };

        } catch (error) {
            console.error('[IRIS-Controller] ScrollDown error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Perform the actual scroll
     * @param {number} targetPosition - Target scroll position
     * @returns {Promise} Scroll completion
     */
    async performScroll(targetPosition) {
        return new Promise((resolve, reject) => {
            try {
                // Use smooth scrolling if supported
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: this.scrollBehavior
                    });
                    
                    // Wait for scroll to complete
                    setTimeout(resolve, this.scrollDuration);
                } else {
                    // Fallback for older browsers
                    window.scrollTo(0, targetPosition);
                    setTimeout(resolve, 100);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Get section position by name
     * @param {string} sectionName - Section name
     * @returns {number} Section position
     */
    getSectionPosition(sectionName) {
        const sectionMap = {
            'apartments': 2,
            'houses': 2,
            'equipment': 4,
            'features': 3
        };

        const sectionIndex = sectionMap[sectionName];
        if (sectionIndex === undefined) {
            return 0;
        }

        // Get section element
        const sections = document.querySelectorAll('[data-section]');
        if (sections[sectionIndex - 1]) {
            return sections[sectionIndex - 1].offsetTop;
        }

        // Fallback: estimate position based on section index
        return sectionIndex * window.innerHeight;
    }

    /**
     * Get current scroll position
     * @returns {number} Current scroll position
     */
    getCurrentPosition() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }

    /**
     * Get scroll information
     * @returns {Object} Scroll information
     */
    getScrollInfo() {
        const currentPosition = this.getCurrentPosition();
        const maxPosition = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = maxPosition > 0 ? (currentPosition / maxPosition) * 100 : 0;

        return {
            currentPosition,
            maxPosition,
            percentage: Math.round(percentage),
            windowHeight: window.innerHeight,
            documentHeight: document.documentElement.scrollHeight
        };
    }

    /**
     * Initialize controller
     * @param {Object} config - Configuration object
     * @returns {Promise} Initialization result
     */
    async initialize(config = {}) {
        console.log('[IRIS-Controller] Initializing ScrollController');

        // Apply configuration
        if (config.scrollBehavior) {
            this.scrollBehavior = config.scrollBehavior;
        }
        if (config.scrollDuration) {
            this.scrollDuration = config.scrollDuration;
        }

        console.log('[IRIS-Controller] ScrollController initialized');
        return true;
    }

    /**
     * Cleanup controller
     * @returns {Promise} Cleanup result
     */
    async cleanup() {
        console.log('[IRIS-Controller] Cleaning up ScrollController');
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
            scrollBehavior: this.scrollBehavior,
            scrollDuration: this.scrollDuration,
            capabilities: ['smooth_scrolling', 'section_navigation', 'position_tracking']
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollController;
} else {
    window.ScrollController = ScrollController;
}
