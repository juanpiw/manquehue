/**
 * UIController - Base class for UI control using Adapter pattern
 * Provides unified interface for different UI control strategies
 */
class UIController {
    constructor() {
        this.controllers = new Map();
        this.activeControllers = new Map();
        this.uiElements = new Map();
        this.eventListeners = new Map();
    }

    /**
     * Register a UI controller
     * @param {string} name - Controller name
     * @param {Object} controller - Controller implementation
     */
    registerController(name, controller) {
        this.controllers.set(name, controller);
        console.log(`[IRIS-Core] UI Controller registered: ${name}`);
    }

    /**
     * Set active controller for a specific UI area
     * @param {string} area - UI area (e.g., 'scroll', 'video', 'filter')
     * @param {string} controllerName - Controller name to activate
     */
    setController(area, controllerName) {
        if (this.controllers.has(controllerName)) {
            this.activeControllers.set(area, this.controllers.get(controllerName));
            console.log(`[IRIS-Core] UI Controller set for ${area}: ${controllerName}`);
        } else {
            console.error(`[IRIS-Core] UI Controller not found: ${controllerName}`);
        }
    }

    /**
     * Get active controller for a specific area
     * @param {string} area - UI area
     * @returns {Object} Active controller instance
     */
    getController(area) {
        return this.activeControllers.get(area);
    }

    /**
     * Execute UI command using appropriate controller
     * @param {Object} command - UI command object
     * @param {Object} context - Execution context
     * @returns {Promise} Execution result
     */
    async execute(command, context = {}) {
        const area = command.area || 'general';
        const controller = this.getController(area);

        if (!controller) {
            console.error(`[IRIS-Core] No controller found for area: ${area}`);
            return { success: false, error: `No controller for area: ${area}` };
        }

        try {
            console.log(`[IRIS-Core] Executing UI command for ${area}:`, command);
            const result = await controller.execute(command, context);
            console.log(`[IRIS-Core] UI command executed successfully for ${area}`);
            return result;
        } catch (error) {
            console.error(`[IRIS-Core] UI command failed for ${area}:`, error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Register UI element for tracking
     * @param {string} id - Element ID
     * @param {HTMLElement} element - DOM element
     * @param {Object} metadata - Element metadata
     */
    registerElement(id, element, metadata = {}) {
        this.uiElements.set(id, {
            element,
            metadata: {
                id,
                tagName: element.tagName,
                className: element.className,
                ...metadata
            }
        });
        console.log(`[IRIS-Core] UI Element registered: ${id}`);
    }

    /**
     * Get registered UI element
     * @param {string} id - Element ID
     * @returns {Object} Element data
     */
    getElement(id) {
        return this.uiElements.get(id);
    }

    /**
     * Get all registered UI elements
     * @returns {Map} Map of all UI elements
     */
    getElements() {
        return this.uiElements;
    }

    /**
     * Add event listener to UI element
     * @param {string} elementId - Element ID
     * @param {string} eventType - Event type
     * @param {Function} handler - Event handler
     */
    addEventListener(elementId, eventType, handler) {
        const elementData = this.getElement(elementId);
        if (!elementData) {
            console.error(`[IRIS-Core] Element not found: ${elementId}`);
            return;
        }

        const key = `${elementId}_${eventType}`;
        this.eventListeners.set(key, handler);
        elementData.element.addEventListener(eventType, handler);
        console.log(`[IRIS-Core] Event listener added: ${key}`);
    }

    /**
     * Remove event listener from UI element
     * @param {string} elementId - Element ID
     * @param {string} eventType - Event type
     */
    removeEventListener(elementId, eventType) {
        const key = `${elementId}_${eventType}`;
        const handler = this.eventListeners.get(key);
        
        if (handler) {
            const elementData = this.getElement(elementId);
            if (elementData) {
                elementData.element.removeEventListener(eventType, handler);
            }
            this.eventListeners.delete(key);
            console.log(`[IRIS-Core] Event listener removed: ${key}`);
        }
    }

    /**
     * Update UI element state
     * @param {string} elementId - Element ID
     * @param {Object} updates - State updates
     */
    updateElement(elementId, updates) {
        const elementData = this.getElement(elementId);
        if (!elementData) {
            console.error(`[IRIS-Core] Element not found for update: ${elementId}`);
            return;
        }

        const element = elementData.element;
        
        // Update element properties
        if (updates.textContent !== undefined) {
            element.textContent = updates.textContent;
        }
        
        if (updates.innerHTML !== undefined) {
            element.innerHTML = updates.innerHTML;
        }
        
        if (updates.className !== undefined) {
            element.className = updates.className;
        }
        
        if (updates.style !== undefined) {
            Object.assign(element.style, updates.style);
        }
        
        if (updates.attributes !== undefined) {
            Object.entries(updates.attributes).forEach(([attr, value]) => {
                element.setAttribute(attr, value);
            });
        }

        // Update metadata
        Object.assign(elementData.metadata, updates.metadata || {});
        
        console.log(`[IRIS-Core] Element updated: ${elementId}`);
    }

    /**
     * Get UI controller status for debugging
     * @returns {Object} Controller status information
     */
    getStatus() {
        return {
            totalControllers: this.controllers.size,
            activeControllers: Object.fromEntries(this.activeControllers),
            registeredElements: this.uiElements.size,
            eventListeners: this.eventListeners.size,
            availableControllers: Array.from(this.controllers.keys())
        };
    }

    /**
     * Initialize UI controllers
     * @param {Object} config - Configuration object
     */
    async initialize(config = {}) {
        console.log('[IRIS-Core] Initializing UI Controllers...');
        
        // Initialize all registered controllers
        for (const [name, controller] of this.controllers) {
            if (typeof controller.initialize === 'function') {
                try {
                    await controller.initialize(config);
                    console.log(`[IRIS-Core] Controller initialized: ${name}`);
                } catch (error) {
                    console.error(`[IRIS-Core] Failed to initialize controller ${name}:`, error);
                }
            }
        }
        
        console.log('[IRIS-Core] UI Controllers initialization complete');
    }

    /**
     * Cleanup UI controllers
     */
    async cleanup() {
        console.log('[IRIS-Core] Cleaning up UI Controllers...');
        
        // Remove all event listeners
        for (const [key, handler] of this.eventListeners) {
            const [elementId, eventType] = key.split('_');
            const elementData = this.getElement(elementId);
            if (elementData) {
                elementData.element.removeEventListener(eventType, handler);
            }
        }
        
        this.eventListeners.clear();
        this.uiElements.clear();
        
        // Cleanup all controllers
        for (const [name, controller] of this.controllers) {
            if (typeof controller.cleanup === 'function') {
                try {
                    await controller.cleanup();
                    console.log(`[IRIS-Core] Controller cleaned up: ${name}`);
                } catch (error) {
                    console.error(`[IRIS-Core] Failed to cleanup controller ${name}:`, error);
                }
            }
        }
        
        console.log('[IRIS-Core] UI Controllers cleanup complete');
    }

    /**
     * Get all active controllers
     * @returns {Map} Map of active controllers
     */
    getActiveControllers() {
        return this.activeControllers;
    }

    /**
     * Get all registered controllers
     * @returns {Map} Map of all controllers
     */
    getControllers() {
        return this.controllers;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIController;
} else {
    window.UIController = UIController;
}
