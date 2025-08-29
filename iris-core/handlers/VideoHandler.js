/**
 * VideoHandler - Handles video control commands
 * Implements video control logic from iris-bridge.js
 */
class VideoHandler {
    constructor() {
        this.name = 'VideoHandler';
        this.supportedActions = ['play', 'pause', 'stop', 'next', 'previous'];
    }

    /**
     * Handle video command
     * @param {Object} command - Video command
     * @param {Object} context - Execution context
     * @returns {Promise} Execution result
     */
    async handle(command, context = {}) {
        console.log(`[IRIS-Handler] Video: ${command.action}`);

        try {
            switch (command.action) {
                case 'play':
                    return await this.play(context);
                case 'pause':
                    return await this.pause(context);
                case 'stop':
                    return await this.stop(context);
                case 'next':
                    return await this.next(context);
                case 'previous':
                    return await this.previous(context);
                default:
                    return {
                        success: false,
                        error: `Unsupported video action: ${command.action}`
                    };
            }
        } catch (error) {
            console.error('[IRIS-Handler] Video error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Play video
     * @param {Object} context - Execution context
     * @returns {Promise} Play result
     */
    async play(context = {}) {
        console.log('[IRIS-Handler] Playing video');

        try {
            const app = await this.getAppReady();
            
            if (app.videoScrollSystem) {
                const video = app.videoScrollSystem.getCurrentVideo();
                if (video) {
                    await video.play();
                    
                    return {
                        success: true,
                        message: 'Reproduciendo video',
                        action: 'play'
                    };
                } else {
                    return {
                        success: false,
                        error: 'No video available'
                    };
                }
            } else {
                return {
                    success: false,
                    error: 'VideoScrollSystem not available'
                };
            }
        } catch (error) {
            console.error('[IRIS-Handler] Play error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Pause video
     * @param {Object} context - Execution context
     * @returns {Promise} Pause result
     */
    async pause(context = {}) {
        console.log('[IRIS-Handler] Pausing video');

        try {
            const app = await this.getAppReady();
            
            if (app.videoScrollSystem) {
                const video = app.videoScrollSystem.getCurrentVideo();
                if (video) {
                    video.pause();
                    
                    return {
                        success: true,
                        message: 'Video pausado',
                        action: 'pause'
                    };
                } else {
                    return {
                        success: false,
                        error: 'No video available'
                    };
                }
            } else {
                return {
                    success: false,
                    error: 'VideoScrollSystem not available'
                };
            }
        } catch (error) {
            console.error('[IRIS-Handler] Pause error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Stop video
     * @param {Object} context - Execution context
     * @returns {Promise} Stop result
     */
    async stop(context = {}) {
        console.log('[IRIS-Handler] Stopping video');

        try {
            const app = await this.getAppReady();
            
            if (app.videoScrollSystem) {
                const video = app.videoScrollSystem.getCurrentVideo();
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                    
                    return {
                        success: true,
                        message: 'Video detenido',
                        action: 'stop'
                    };
                } else {
                    return {
                        success: false,
                        error: 'No video available'
                    };
                }
            } else {
                return {
                    success: false,
                    error: 'VideoScrollSystem not available'
                };
            }
        } catch (error) {
            console.error('[IRIS-Handler] Stop error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Next video
     * @param {Object} context - Execution context
     * @returns {Promise} Next result
     */
    async next(context = {}) {
        console.log('[IRIS-Handler] Next video');

        try {
            const app = await this.getAppReady();
            
            if (app.videoScrollSystem) {
                const currentIndex = app.videoScrollSystem.getCurrentVideoIndex();
                const totalVideos = app.videoScrollSystem.getTotalVideos();
                
                if (currentIndex < totalVideos - 1) {
                    await app.videoScrollSystem.loadVideo(currentIndex + 1);
                    
                    return {
                        success: true,
                        message: 'Siguiente video',
                        action: 'next',
                        currentIndex: currentIndex + 1
                    };
                } else {
                    return {
                        success: false,
                        error: 'No hay más videos'
                    };
                }
            } else {
                return {
                    success: false,
                    error: 'VideoScrollSystem not available'
                };
            }
        } catch (error) {
            console.error('[IRIS-Handler] Next error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Previous video
     * @param {Object} context - Execution context
     * @returns {Promise} Previous result
     */
    async previous(context = {}) {
        console.log('[IRIS-Handler] Previous video');

        try {
            const app = await this.getAppReady();
            
            if (app.videoScrollSystem) {
                const currentIndex = app.videoScrollSystem.getCurrentVideoIndex();
                
                if (currentIndex > 0) {
                    await app.videoScrollSystem.loadVideo(currentIndex - 1);
                    
                    return {
                        success: true,
                        message: 'Video anterior',
                        action: 'previous',
                        currentIndex: currentIndex - 1
                    };
                } else {
                    return {
                        success: false,
                        error: 'No hay videos anteriores'
                    };
                }
            } else {
                return {
                    success: false,
                    error: 'VideoScrollSystem not available'
                };
            }
        } catch (error) {
            console.error('[IRIS-Handler] Previous error:', error);
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
            capabilities: ['playback_control', 'video_navigation']
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoHandler;
} else {
    window.VideoHandler = VideoHandler;
}
