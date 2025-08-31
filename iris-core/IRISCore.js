/**
 * IRISCore - Main integration class for the modular IRIS system
 * Orchestrates all components: parsers, registry, executor, and controllers
 */
class IRISCore {
    constructor(config = {}) {
        this.name = 'IRISCore';
        this.version = '2.0.0';
        this.isInitialized = false;
        
        // Core components
        this.commandParser = null;
        this.commandRegistry = null;
        this.commandExecutor = null;
        this.uiController = null;
        
        // Configuration
        this.config = {
            defaultParser: 'NaturalLanguageParser',
            confidenceThreshold: 0.7,
            enableLogging: true,
            enableDebug: false,
            ...config
        };
        
        // State
        this.handlers = new Map();
        this.controllers = new Map();
        this.executionHistory = [];
        
        console.log(`[IRIS-Core] Initializing ${this.name} v${this.version}`);
    }

    /**
     * Initialize the IRIS system
     * @returns {Promise} Initialization result
     */
    async initialize() {
        try {
            console.log('[IRIS-Core] Starting initialization...');

            // Initialize core components
            await this.initializeCoreComponents();
            
            // Register default parsers
            await this.registerDefaultParsers();
            
            // Register default handlers
            await this.registerDefaultHandlers();
            
            // Register default controllers
            await this.registerDefaultControllers();
            
            // Load configuration
            await this.loadConfiguration();
            
            // Set up command routing
            this.setupCommandRouting();
            
            this.isInitialized = true;
            console.log('[IRIS-Core] Initialization complete');
            
            return {
                success: true,
                message: 'IRIS Core initialized successfully',
                version: this.version
            };

        } catch (error) {
            console.error('[IRIS-Core] Initialization failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Initialize core components
     * @returns {Promise} Initialization result
     */
    async initializeCoreComponents() {
        console.log('[IRIS-Core] Initializing core components...');

        // Initialize CommandParser
        this.commandParser = new CommandParser();
        
        // Initialize CommandRegistry
        this.commandRegistry = new CommandRegistry();
        
        // Initialize CommandExecutor
        this.commandExecutor = new CommandExecutor();
        
        // Initialize UIController
        this.uiController = new UIController();

        console.log('[IRIS-Core] Core components initialized');
    }

    /**
     * Register default parsers
     * @returns {Promise} Registration result
     */
    async registerDefaultParsers() {
        console.log('[IRIS-Core] Registering default parsers...');

        try {
            // Register NaturalLanguageParser
            const naturalParser = new NaturalLanguageParser();
            this.commandParser.registerParser('NaturalLanguageParser', naturalParser);
            
            // Register StructuredCommandParser
            const structuredParser = new StructuredCommandParser();
            this.commandParser.registerParser('StructuredCommandParser', structuredParser);
            
            // Set default parser
            this.commandParser.setParser(this.config.defaultParser);
            
            console.log('[IRIS-Core] Default parsers registered');
        } catch (error) {
            console.error('[IRIS-Core] Parser registration failed:', error);
            throw error;
        }
    }

    /**
     * Register default handlers
     * @returns {Promise} Registration result
     */
    async registerDefaultHandlers() {
        console.log('[IRIS-Core] Registering default handlers...');

        try {
            // Register NavigationHandler
            const navigationHandler = new NavigationHandler();
            this.handlers.set('navigation', navigationHandler);
            
            // Register VideoHandler
            const videoHandler = new VideoHandler();
            this.handlers.set('video', videoHandler);
            
            // Register FilterHandler
            const filterHandler = new FilterHandler();
            this.handlers.set('filter', filterHandler);
            
            console.log('[IRIS-Core] Default handlers registered');
        } catch (error) {
            console.error('[IRIS-Core] Handler registration failed:', error);
            throw error;
        }
    }

    /**
     * Register default controllers
     * @returns {Promise} Registration result
     */
    async registerDefaultControllers() {
        console.log('[IRIS-Core] Registering default controllers...');

        try {
            // Register ScrollController
            const scrollController = new ScrollController();
            this.uiController.registerController('ScrollController', scrollController);
            this.uiController.setController('scroll', 'ScrollController');
            
            // Register VideoController
            const videoController = new VideoController();
            this.uiController.registerController('VideoController', videoController);
            this.uiController.setController('video', 'VideoController');
            
            // Register FilterController
            const filterController = new FilterController();
            this.uiController.registerController('FilterController', filterController);
            this.uiController.setController('filter', 'FilterController');
            
            console.log('[IRIS-Core] Default controllers registered');
        } catch (error) {
            console.error('[IRIS-Core] Controller registration failed:', error);
            throw error;
        }
    }

    /**
     * Load configuration from files
     * @returns {Promise} Loading result
     */
    async loadConfiguration() {
        console.log('[IRIS-Core] Loading configuration...');

        try {
            // Load commands configuration
            const commandsResponse = await fetch('iris-core/config/commands.json');
            if (commandsResponse.ok) {
                const commandsConfig = await commandsResponse.json();
                this.registerCommandsFromConfig(commandsConfig);
            }
            
            // Load UI mappings configuration
            const mappingsResponse = await fetch('iris-core/config/ui-mappings.json');
            if (mappingsResponse.ok) {
                const mappingsConfig = await mappingsResponse.json();
                this.applyUIMappings(mappingsConfig);
            }
            
            console.log('[IRIS-Core] Configuration loaded');
        } catch (error) {
            console.warn('[IRIS-Core] Configuration loading failed, using defaults:', error);
        }
    }

    /**
     * Register commands from configuration
     * @param {Object} config - Commands configuration
     */
    registerCommandsFromConfig(config) {
        if (config.commands) {
            Object.entries(config.commands).forEach(([name, commandConfig]) => {
                this.commandRegistry.register(name, {
                    name: commandConfig.name,
                    description: commandConfig.description,
                    category: commandConfig.category,
                    aliases: commandConfig.aliases || [],
                    parameters: commandConfig.parameters || [],
                    examples: commandConfig.examples || []
                }, commandConfig);
            });
        }
    }

    /**
     * Apply UI mappings from configuration
     * @param {Object} config - UI mappings configuration
     */
    applyUIMappings(config) {
        // Store UI mappings for use by controllers
        this.uiMappings = config.uiMappings || {};
    }

    /**
     * Set up command routing
     */
    setupCommandRouting() {
        // Register execution strategies
        this.commandExecutor.registerExecutor('default', {
            execute: async (command, context) => {
                return await this.routeCommand(command, context);
            }
        });
        
        this.commandExecutor.setExecutor('default');
    }

    /**
     * Route command to appropriate handler
     * @param {Object} command - Parsed command
     * @param {Object} context - Execution context
     * @returns {Promise} Execution result
     */
    async routeCommand(command, context = {}) {
        console.log(`[IRIS-Core] Routing command: ${command.type} ${command.action}`);

        try {
            switch (command.type) {
                case 'navigation':
                    return await this.handlers.get('navigation').handle(command, context);
                    
                case 'video':
                    return await this.handlers.get('video').handle(command, context);
                    
                case 'filter':
                    return await this.handlers.get('filter').handle(command, context);
                    
                case 'details':
                    return await this.handlers.get('filter').handle(command, context);
                    
                case 'pdf':
                    return await this.handlers.get('filter').handle(command, context);
                    
                case 'quote':
                    return await this.handlers.get('filter').handle(command, context);
                    
                case 'modal':
                    return await this.handlers.get('filter').handle(command, context);
                    
                case 'recorrido':
                    return await this.handlers.get('filter').handle(command, context);
                    
                case 'scroll':
                    return await this.uiController.execute(command, context);
                    
                default:
                    return {
                        success: false,
                        error: `Unknown command type: ${command.type}`
                    };
            }
        } catch (error) {
            console.error('[IRIS-Core] Command routing error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Process text input and execute commands
     * @param {string} text - Input text
     * @param {Object} context - Execution context
     * @returns {Promise} Execution result
     */
    async processText(text, context = {}) {
        console.log(`[IRIS-Core] Processing text: "${text}"`);

        try {
            // Parse the text
            const parsedCommand = this.commandParser.parse(text);
            
            if (!parsedCommand) {
                return {
                    success: false,
                    error: 'Could not parse command'
                };
            }

            // Check confidence threshold
            if (parsedCommand.confidence < this.config.confidenceThreshold) {
                return {
                    success: false,
                    error: `Low confidence (${parsedCommand.confidence}) for command: ${parsedCommand.originalText}`
                };
            }

            // Execute the command
            const result = await this.commandExecutor.execute(parsedCommand, context);
            
            // Add to history
            this.addToHistory({
                text,
                parsedCommand,
                result,
                timestamp: new Date()
            });
            
            return result;

        } catch (error) {
            console.error('[IRIS-Core] Text processing error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Execute command directly
     * @param {Object} command - Command object
     * @param {Object} context - Execution context
     * @returns {Promise} Execution result
     */
    async executeCommand(command, context = {}) {
        console.log('[IRIS-Core] Executing command directly:', command);

        try {
            const result = await this.commandExecutor.execute(command, context);
            
            // Add to history
            this.addToHistory({
                command,
                result,
                timestamp: new Date()
            });
            
            return result;

        } catch (error) {
            console.error('[IRIS-Core] Command execution error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Add execution to history
     * @param {Object} record - Execution record
     */
    addToHistory(record) {
        this.executionHistory.push(record);
        
        // Keep history size manageable
        if (this.executionHistory.length > 100) {
            this.executionHistory.shift();
        }
    }

    /**
     * Get execution history
     * @param {number} limit - Number of records to return
     * @returns {Array} Execution history
     */
    getHistory(limit = 10) {
        return this.executionHistory.slice(-limit);
    }

    /**
     * Get system status
     * @returns {Object} System status
     */
    getStatus() {
        return {
            name: this.name,
            version: this.version,
            isInitialized: this.isInitialized,
            config: this.config,
            parser: this.commandParser?.getStatus(),
            registry: this.commandRegistry?.getStatus(),
            executor: this.commandExecutor?.getStatus(),
            uiController: this.uiController?.getStatus(),
            handlers: Array.from(this.handlers.keys()),
            controllers: Array.from(this.controllers.keys()),
            historySize: this.executionHistory.length
        };
    }

    /**
     * Get system information
     * @returns {Object} System information
     */
    getInfo() {
        return {
            name: this.name,
            version: this.version,
            description: 'Modular IRIS Core System',
            capabilities: [
                'natural_language_parsing',
                'structured_command_parsing',
                'command_registry',
                'command_execution',
                'ui_control',
                'navigation',
                'video_control',
                'filtering'
            ],
            components: {
                parsers: ['NaturalLanguageParser', 'StructuredCommandParser'],
                handlers: ['NavigationHandler', 'VideoHandler', 'FilterHandler'],
                controllers: ['ScrollController', 'VideoController', 'FilterController']
            }
        };
    }

    /**
     * Cleanup the system
     * @returns {Promise} Cleanup result
     */
    async cleanup() {
        console.log('[IRIS-Core] Cleaning up...');

        try {
            // Cleanup controllers
            await this.uiController.cleanup();
            
            // Clear history
            this.executionHistory = [];
            
            // Clear handlers
            this.handlers.clear();
            
            // Clear controllers
            this.controllers.clear();
            
            this.isInitialized = false;
            
            console.log('[IRIS-Core] Cleanup complete');
            return { success: true };
        } catch (error) {
            console.error('[IRIS-Core] Cleanup error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Create global IRIS instance
window.IRIS = new IRISCore();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IRISCore;
} else {
    window.IRISCore = IRISCore;
}
