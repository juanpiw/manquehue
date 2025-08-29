/**
 * CommandParser - Base class for command parsing strategies
 * Implements Strategy pattern for different parsing approaches
 */
class CommandParser {
    constructor() {
        this.activeParser = null;
        this.parsers = new Map();
    }

    /**
     * Set the active parser strategy
     * @param {string} parserName - Name of the parser to activate
     */
    setParser(parserName) {
        if (this.parsers.has(parserName)) {
            this.activeParser = this.parsers.get(parserName);
            console.log(`[IRIS-Core] Parser changed to: ${parserName}`);
        } else {
            console.error(`[IRIS-Core] Parser not found: ${parserName}`);
        }
    }

    /**
     * Register a new parser strategy
     * @param {string} name - Parser name
     * @param {Object} parser - Parser implementation
     */
    registerParser(name, parser) {
        this.parsers.set(name, parser);
        console.log(`[IRIS-Core] Parser registered: ${name}`);
    }

    /**
     * Get the currently active parser
     * @returns {Object} Active parser instance
     */
    getActiveParser() {
        return this.activeParser;
    }

    /**
     * Get all registered parsers
     * @returns {Map} Map of all parsers
     */
    getParsers() {
        return this.parsers;
    }

    /**
     * Parse text using the active parser
     * @param {string} text - Text to parse
     * @returns {Object} Parsed command object
     */
    parse(text) {
        if (!this.activeParser) {
            console.error('[IRIS-Core] No active parser set');
            return null;
        }
        
        try {
            const result = this.activeParser.parse(text);
            console.log(`[IRIS-Core] Parsed command:`, result);
            return result;
        } catch (error) {
            console.error('[IRIS-Core] Parse error:', error);
            return null;
        }
    }

    /**
     * Get parser status for debugging
     * @returns {Object} Parser status information
     */
    getStatus() {
        return {
            activeParser: this.activeParser ? this.activeParser.constructor.name : 'None',
            availableParsers: Array.from(this.parsers.keys()),
            totalParsers: this.parsers.size
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommandParser;
} else {
    window.CommandParser = CommandParser;
}
