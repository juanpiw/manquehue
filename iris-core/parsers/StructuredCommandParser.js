/**
 * StructuredCommandParser - Parses structured command formats
 * Handles JSON, XML, or specific syntax formats
 */
class StructuredCommandParser {
    constructor() {
        this.name = 'StructuredCommandParser';
        this.supportedFormats = ['json', 'xml', 'structured'];
    }

    /**
     * Parse structured text into command objects
     * @param {string} text - Structured text
     * @returns {Object} Parsed command object
     */
    parse(text) {
        if (!text || typeof text !== 'string') {
            return null;
        }

        const trimmedText = text.trim();
        console.log(`[IRIS-Parser] Parsing structured: "${text}"`);

        // Try JSON format first
        const jsonCommand = this.parseJSON(trimmedText);
        if (jsonCommand) {
            return jsonCommand;
        }

        // Try XML format
        const xmlCommand = this.parseXML(trimmedText);
        if (xmlCommand) {
            return xmlCommand;
        }

        // Try structured format (key=value pairs)
        const structuredCommand = this.parseStructured(trimmedText);
        if (structuredCommand) {
            return structuredCommand;
        }

        // Default: unknown format
        return {
            type: 'unknown',
            originalText: text,
            confidence: 0.1,
            error: 'Unsupported structured format'
        };
    }

    /**
     * Parse JSON format commands
     * @param {string} text - JSON text
     * @returns {Object|null} Parsed command or null
     */
    parseJSON(text) {
        try {
            // Check if it looks like JSON
            if (!text.startsWith('{') && !text.startsWith('[')) {
                return null;
            }

            const parsed = JSON.parse(text);
            
            // Validate command structure
            if (typeof parsed === 'object' && parsed !== null) {
                return {
                    type: parsed.type || 'command',
                    action: parsed.action,
                    parameters: parsed.parameters || {},
                    originalText: text,
                    confidence: 0.95,
                    format: 'json',
                    area: parsed.area || 'general'
                };
            }
        } catch (error) {
            console.log(`[IRIS-Parser] JSON parse failed: ${error.message}`);
        }

        return null;
    }

    /**
     * Parse XML format commands
     * @param {string} text - XML text
     * @returns {Object|null} Parsed command or null
     */
    parseXML(text) {
        try {
            // Check if it looks like XML
            if (!text.startsWith('<') || !text.includes('>')) {
                return null;
            }

            // Simple XML parsing (for basic command structures)
            const commandMatch = text.match(/<command\s+type="([^"]+)"\s+action="([^"]+)"/);
            if (commandMatch) {
                const type = commandMatch[1];
                const action = commandMatch[2];
                
                // Extract parameters
                const parameters = {};
                const paramMatches = text.match(/<param\s+name="([^"]+)"\s+value="([^"]+)"/g);
                if (paramMatches) {
                    paramMatches.forEach(param => {
                        const paramMatch = param.match(/name="([^"]+)"\s+value="([^"]+)"/);
                        if (paramMatch) {
                            parameters[paramMatch[1]] = paramMatch[2];
                        }
                    });
                }

                return {
                    type: type,
                    action: action,
                    parameters: parameters,
                    originalText: text,
                    confidence: 0.9,
                    format: 'xml',
                    area: parameters.area || 'general'
                };
            }
        } catch (error) {
            console.log(`[IRIS-Parser] XML parse failed: ${error.message}`);
        }

        return null;
    }

    /**
     * Parse structured format (key=value pairs)
     * @param {string} text - Structured text
     * @returns {Object|null} Parsed command or null
     */
    parseStructured(text) {
        // Check for structured format patterns
        const structuredPatterns = [
            // [[cmd action=goto key=features]]
            /\[\[cmd\s+action=([^\s]+)\s+key=([^\]]+)\]\]/,
            // action=goto key=features
            /action=([^\s]+)\s+key=([^\s]+)/,
            // type:navigation action:goto key:features
            /type:([^\s]+)\s+action:([^\s]+)\s+key:([^\s]+)/
        ];

        for (const pattern of structuredPatterns) {
            const match = text.match(pattern);
            if (match) {
                const parameters = {};
                
                // Extract all key=value pairs
                const keyValueMatches = text.match(/(\w+)=([^\s\]]+)/g);
                if (keyValueMatches) {
                    keyValueMatches.forEach(kv => {
                        const [key, value] = kv.split('=');
                        parameters[key] = value;
                    });
                }

                return {
                    type: parameters.type || 'command',
                    action: parameters.action,
                    key: parameters.key,
                    parameters: parameters,
                    originalText: text,
                    confidence: 0.85,
                    format: 'structured',
                    area: parameters.area || 'general'
                };
            }
        }

        return null;
    }

    /**
     * Validate command structure
     * @param {Object} command - Command object to validate
     * @returns {boolean} True if valid
     */
    validateCommand(command) {
        if (!command || typeof command !== 'object') {
            return false;
        }

        // Check required fields
        if (!command.type || !command.action) {
            return false;
        }

        // Validate type
        const validTypes = ['navigation', 'video', 'filter', 'scroll', 'command'];
        if (!validTypes.includes(command.type)) {
            return false;
        }

        // Validate action based on type
        switch (command.type) {
            case 'navigation':
                const validNavActions = ['goto'];
                return validNavActions.includes(command.action);
            case 'video':
                const validVideoActions = ['play', 'pause', 'stop', 'next', 'previous'];
                return validVideoActions.includes(command.action);
            case 'filter':
                const validFilterActions = ['apply', 'clear', 'toggle'];
                return validFilterActions.includes(command.action);
            case 'scroll':
                const validScrollActions = ['scrollTo', 'up', 'down'];
                return validScrollActions.includes(command.action);
            default:
                return true;
        }
    }

    /**
     * Serialize command to JSON
     * @param {Object} command - Command object
     * @returns {string} JSON string
     */
    serializeToJSON(command) {
        try {
            return JSON.stringify(command, null, 2);
        } catch (error) {
            console.error('[IRIS-Parser] Serialization failed:', error);
            return null;
        }
    }

    /**
     * Serialize command to XML
     * @param {Object} command - Command object
     * @returns {string} XML string
     */
    serializeToXML(command) {
        try {
            let xml = `<command type="${command.type}" action="${command.action}"`;
            
            // Add parameters as attributes
            if (command.parameters) {
                Object.entries(command.parameters).forEach(([key, value]) => {
                    xml += ` ${key}="${value}"`;
                });
            }
            
            xml += ' />';
            return xml;
        } catch (error) {
            console.error('[IRIS-Parser] XML serialization failed:', error);
            return null;
        }
    }

    /**
     * Serialize command to structured format
     * @param {Object} command - Command object
     * @returns {string} Structured string
     */
    serializeToStructured(command) {
        try {
            let structured = `[[cmd action=${command.action}`;
            
            if (command.key) {
                structured += ` key=${command.key}`;
            }
            
            if (command.parameters) {
                Object.entries(command.parameters).forEach(([key, value]) => {
                    structured += ` ${key}=${value}`;
                });
            }
            
            structured += ']]';
            return structured;
        } catch (error) {
            console.error('[IRIS-Parser] Structured serialization failed:', error);
            return null;
        }
    }

    /**
     * Get parser information
     * @returns {Object} Parser information
     */
    getInfo() {
        return {
            name: this.name,
            supportedFormats: this.supportedFormats,
            capabilities: ['json', 'xml', 'structured']
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StructuredCommandParser;
} else {
    window.StructuredCommandParser = StructuredCommandParser;
}
