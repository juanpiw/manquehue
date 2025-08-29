/**
 * CommandExecutor - Handles command execution with Strategy pattern
 * Manages execution strategies and command lifecycle
 */
class CommandExecutor {
    constructor() {
        this.executors = new Map();
        this.activeExecutor = null;
        this.executionHistory = [];
        this.maxHistorySize = 100;
    }

    /**
     * Register an execution strategy
     * @param {string} name - Executor name
     * @param {Object} executor - Executor implementation
     */
    registerExecutor(name, executor) {
        this.executors.set(name, executor);
        console.log(`[IRIS-Core] Executor registered: ${name}`);
    }

    /**
     * Set the active executor strategy
     * @param {string} name - Executor name to activate
     */
    setExecutor(name) {
        if (this.executors.has(name)) {
            this.activeExecutor = this.executors.get(name);
            console.log(`[IRIS-Core] Executor changed to: ${name}`);
        } else {
            console.error(`[IRIS-Core] Executor not found: ${name}`);
        }
    }

    /**
     * Get the currently active executor
     * @returns {Object} Active executor instance
     */
    getActiveExecutor() {
        return this.activeExecutor;
    }

    /**
     * Execute a command using the active executor
     * @param {Object} command - Command object to execute
     * @param {Object} context - Execution context
     * @returns {Promise} Execution result
     */
    async execute(command, context = {}) {
        if (!this.activeExecutor) {
            console.error('[IRIS-Core] No active executor set');
            return { success: false, error: 'No active executor' };
        }

        const executionId = this.generateExecutionId();
        const startTime = Date.now();

        try {
            console.log(`[IRIS-Core] Executing command: ${command.name || 'unnamed'}`);
            
            const result = await this.activeExecutor.execute(command, context);
            
            const executionTime = Date.now() - startTime;
            const executionRecord = {
                id: executionId,
                command: command,
                context: context,
                result: result,
                executionTime: executionTime,
                timestamp: new Date(),
                success: result.success !== false
            };

            this.addToHistory(executionRecord);
            
            console.log(`[IRIS-Core] Command executed successfully in ${executionTime}ms`);
            return result;

        } catch (error) {
            const executionTime = Date.now() - startTime;
            const executionRecord = {
                id: executionId,
                command: command,
                context: context,
                error: error.message,
                executionTime: executionTime,
                timestamp: new Date(),
                success: false
            };

            this.addToHistory(executionRecord);
            
            console.error('[IRIS-Core] Command execution failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Execute multiple commands in sequence
     * @param {Array} commands - Array of commands to execute
     * @param {Object} context - Execution context
     * @returns {Promise} Array of execution results
     */
    async executeBatch(commands, context = {}) {
        const results = [];
        
        for (const command of commands) {
            const result = await this.execute(command, context);
            results.push(result);
            
            // Stop execution if a command fails
            if (!result.success) {
                console.warn('[IRIS-Core] Batch execution stopped due to command failure');
                break;
            }
        }
        
        return results;
    }

    /**
     * Execute multiple commands in parallel
     * @param {Array} commands - Array of commands to execute
     * @param {Object} context - Execution context
     * @returns {Promise} Array of execution results
     */
    async executeParallel(commands, context = {}) {
        const promises = commands.map(command => this.execute(command, context));
        return Promise.all(promises);
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
     * Clear execution history
     */
    clearHistory() {
        this.executionHistory = [];
        console.log('[IRIS-Core] Execution history cleared');
    }

    /**
     * Get executor status for debugging
     * @returns {Object} Executor status information
     */
    getStatus() {
        return {
            activeExecutor: this.activeExecutor ? this.activeExecutor.constructor.name : 'None',
            availableExecutors: Array.from(this.executors.keys()),
            totalExecutors: this.executors.size,
            historySize: this.executionHistory.length,
            maxHistorySize: this.maxHistorySize
        };
    }

    /**
     * Generate unique execution ID
     * @returns {string} Unique execution ID
     */
    generateExecutionId() {
        return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Add execution record to history
     * @param {Object} record - Execution record
     */
    addToHistory(record) {
        this.executionHistory.push(record);
        
        // Maintain history size limit
        if (this.executionHistory.length > this.maxHistorySize) {
            this.executionHistory.shift();
        }
    }

    /**
     * Set maximum history size
     * @param {number} size - Maximum number of history records
     */
    setMaxHistorySize(size) {
        this.maxHistorySize = size;
        console.log(`[IRIS-Core] Max history size set to: ${size}`);
    }

    /**
     * Get execution statistics
     * @returns {Object} Execution statistics
     */
    getStatistics() {
        if (this.executionHistory.length === 0) {
            return { totalExecutions: 0, successRate: 0, averageTime: 0 };
        }

        const totalExecutions = this.executionHistory.length;
        const successfulExecutions = this.executionHistory.filter(record => record.success).length;
        const successRate = (successfulExecutions / totalExecutions) * 100;
        const averageTime = this.executionHistory.reduce((sum, record) => sum + record.executionTime, 0) / totalExecutions;

        return {
            totalExecutions,
            successfulExecutions,
            failedExecutions: totalExecutions - successfulExecutions,
            successRate: Math.round(successRate * 100) / 100,
            averageTime: Math.round(averageTime * 100) / 100
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommandExecutor;
} else {
    window.CommandExecutor = CommandExecutor;
}
