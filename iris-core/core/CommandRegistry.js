/**
 * CommandRegistry - Registry pattern for managing commands
 * Handles command registration, metadata, and lifecycle
 */
class CommandRegistry {
    constructor() {
        this.commands = new Map();
        this.metadata = new Map();
        this.aliases = new Map();
    }

    /**
     * Register a new command
     * @param {string} name - Command name
     * @param {Object} command - Command implementation
     * @param {Object} metadata - Command metadata
     */
    register(name, command, metadata = {}) {
        if (this.commands.has(name)) {
            console.warn(`[IRIS-Core] Command ${name} already exists, overwriting`);
        }

        this.commands.set(name, command);
        this.metadata.set(name, {
            name,
            description: metadata.description || 'No description',
            category: metadata.category || 'general',
            aliases: metadata.aliases || [],
            parameters: metadata.parameters || [],
            createdAt: new Date(),
            lastModified: new Date(),
            ...metadata
        });

        // Register aliases
        if (metadata.aliases) {
            metadata.aliases.forEach(alias => {
                this.aliases.set(alias, name);
            });
        }

        console.log(`[IRIS-Core] Command registered: ${name}`);
    }

    /**
     * Unregister a command
     * @param {string} name - Command name to unregister
     */
    unregister(name) {
        if (this.commands.has(name)) {
            const metadata = this.metadata.get(name);
            
            // Remove aliases
            if (metadata && metadata.aliases) {
                metadata.aliases.forEach(alias => {
                    this.aliases.delete(alias);
                });
            }

            this.commands.delete(name);
            this.metadata.delete(name);
            console.log(`[IRIS-Core] Command unregistered: ${name}`);
        } else {
            console.warn(`[IRIS-Core] Command not found for unregister: ${name}`);
        }
    }

    /**
     * Get a command by name or alias
     * @param {string} name - Command name or alias
     * @returns {Object} Command implementation
     */
    get(name) {
        // Check if it's an alias
        const actualName = this.aliases.get(name) || name;
        return this.commands.get(actualName);
    }

    /**
     * Get command metadata
     * @param {string} name - Command name
     * @returns {Object} Command metadata
     */
    getMetadata(name) {
        const actualName = this.aliases.get(name) || name;
        return this.metadata.get(actualName);
    }

    /**
     * Get all registered commands
     * @returns {Map} Map of all commands
     */
    getCommands() {
        return this.commands;
    }

    /**
     * Get all command metadata
     * @returns {Map} Map of all metadata
     */
    getAllMetadata() {
        return this.metadata;
    }

    /**
     * Check if command exists
     * @param {string} name - Command name or alias
     * @returns {boolean} True if command exists
     */
    has(name) {
        const actualName = this.aliases.get(name) || name;
        return this.commands.has(actualName);
    }

    /**
     * Get commands by category
     * @param {string} category - Category to filter by
     * @returns {Array} Array of command names in category
     */
    getByCategory(category) {
        const commands = [];
        for (const [name, metadata] of this.metadata) {
            if (metadata.category === category) {
                commands.push(name);
            }
        }
        return commands;
    }

    /**
     * Search commands by description
     * @param {string} searchTerm - Term to search for
     * @returns {Array} Array of matching command names
     */
    search(searchTerm) {
        const matches = [];
        const term = searchTerm.toLowerCase();
        
        for (const [name, metadata] of this.metadata) {
            if (metadata.description.toLowerCase().includes(term) ||
                name.toLowerCase().includes(term) ||
                metadata.aliases.some(alias => alias.toLowerCase().includes(term))) {
                matches.push(name);
            }
        }
        
        return matches;
    }

    /**
     * Get registry status for debugging
     * @returns {Object} Registry status information
     */
    getStatus() {
        return {
            totalCommands: this.commands.size,
            totalAliases: this.aliases.size,
            categories: this.getCategories(),
            commands: Array.from(this.commands.keys())
        };
    }

    /**
     * Get all categories
     * @returns {Array} Array of unique categories
     */
    getCategories() {
        const categories = new Set();
        for (const metadata of this.metadata.values()) {
            categories.add(metadata.category);
        }
        return Array.from(categories);
    }

    /**
     * Clear all commands
     */
    clear() {
        this.commands.clear();
        this.metadata.clear();
        this.aliases.clear();
        console.log('[IRIS-Core] Command registry cleared');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommandRegistry;
} else {
    window.CommandRegistry = CommandRegistry;
}
