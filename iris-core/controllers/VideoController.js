/**
 * VideoController - Controls video behavior using Adapter pattern
 * Adapts video commands to the actual video system
 */
class VideoController {
    constructor() {
        this.name = 'VideoController';
        this.supportedActions = ['play', 'pause', 'stop', 'next', 'previous'];
        this.videoElement = null;
        this.currentVideoIndex = 0;
        this.videoList = [];
    }

    /**
     * Execute video command
     * @param {Object} command - Video command
     * @param {Object} context - Execution context
     * @returns {Promise} Execution result
     */
    async execute(command, context = {}) {
        console.log(`[IRIS-Controller] Video: ${command.action}`, command);

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
            console.error('[IRIS-Controller] Video error:', error);
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
        console.log('[IRIS-Controller] Playing video');

        try {
            const video = this.getVideoElement();
            if (!video) {
                return {
                    success: false,
                    error: 'Video element not found'
                };
            }

            await video.play();
            
            return {
                success: true,
                message: 'Reproduciendo video',
                action: 'play',
                currentTime: video.currentTime,
                duration: video.duration
            };

        } catch (error) {
            console.error('[IRIS-Controller] Play error:', error);
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
        console.log('[IRIS-Controller] Pausing video');

        try {
            const video = this.getVideoElement();
            if (!video) {
                return {
                    success: false,
                    error: 'Video element not found'
                };
            }

            video.pause();
            
            return {
                success: true,
                message: 'Video pausado',
                action: 'pause',
                currentTime: video.currentTime,
                duration: video.duration
            };

        } catch (error) {
            console.error('[IRIS-Controller] Pause error:', error);
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
        console.log('[IRIS-Controller] Stopping video');

        try {
            const video = this.getVideoElement();
            if (!video) {
                return {
                    success: false,
                    error: 'Video element not found'
                };
            }

            video.pause();
            video.currentTime = 0;
            
            return {
                success: true,
                message: 'Video detenido',
                action: 'stop',
                currentTime: 0,
                duration: video.duration
            };

        } catch (error) {
            console.error('[IRIS-Controller] Stop error:', error);
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
        console.log('[IRIS-Controller] Next video');

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
                        currentIndex: currentIndex + 1,
                        totalVideos: totalVideos
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
            console.error('[IRIS-Controller] Next error:', error);
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
        console.log('[IRIS-Controller] Previous video');

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
                        currentIndex: currentIndex - 1,
                        totalVideos: app.videoScrollSystem.getTotalVideos()
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
            console.error('[IRIS-Controller] Previous error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get video element
     * @returns {HTMLVideoElement|null} Video element
     */
    getVideoElement() {
        if (!this.videoElement) {
            this.videoElement = document.querySelector('#backgroundVideo');
        }
        return this.videoElement;
    }

    /**
     * Get video information
     * @returns {Object} Video information
     */
    getVideoInfo() {
        const video = this.getVideoElement();
        if (!video) {
            return null;
        }

        return {
            currentTime: video.currentTime,
            duration: video.duration,
            paused: video.paused,
            ended: video.ended,
            readyState: video.readyState,
            networkState: video.networkState,
            src: video.src,
            volume: video.volume,
            muted: video.muted
        };
    }

    /**
     * Set video volume
     * @param {number} volume - Volume level (0-1)
     * @returns {Promise} Set volume result
     */
    async setVolume(volume) {
        console.log(`[IRIS-Controller] Setting volume to: ${volume}`);

        try {
            const video = this.getVideoElement();
            if (!video) {
                return {
                    success: false,
                    error: 'Video element not found'
                };
            }

            video.volume = Math.max(0, Math.min(1, volume));
            
            return {
                success: true,
                message: `Volumen establecido en ${Math.round(volume * 100)}%`,
                volume: video.volume
            };

        } catch (error) {
            console.error('[IRIS-Controller] Set volume error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Mute/unmute video
     * @param {boolean} muted - Mute state
     * @returns {Promise} Mute result
     */
    async setMuted(muted) {
        console.log(`[IRIS-Controller] Setting muted to: ${muted}`);

        try {
            const video = this.getVideoElement();
            if (!video) {
                return {
                    success: false,
                    error: 'Video element not found'
                };
            }

            video.muted = muted;
            
            return {
                success: true,
                message: muted ? 'Video silenciado' : 'Video con sonido',
                muted: video.muted
            };

        } catch (error) {
            console.error('[IRIS-Controller] Set muted error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Seek to specific time
     * @param {number} time - Time in seconds
     * @returns {Promise} Seek result
     */
    async seekTo(time) {
        console.log(`[IRIS-Controller] Seeking to: ${time}s`);

        try {
            const video = this.getVideoElement();
            if (!video) {
                return {
                    success: false,
                    error: 'Video element not found'
                };
            }

            video.currentTime = Math.max(0, Math.min(time, video.duration));
            
            return {
                success: true,
                message: `Avanzando a ${Math.round(time)}s`,
                currentTime: video.currentTime
            };

        } catch (error) {
            console.error('[IRIS-Controller] Seek error:', error);
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
            console.log('[IRIS-Controller] Waiting for VideoScrollApp to initialize...');
            let initAttempts = 0;
            while (!window.videoScrollApp.isInitialized && initAttempts < 50) {
                await this.wait(100);
                initAttempts++;
            }
            if (!window.videoScrollApp.isInitialized) {
                throw new Error('VideoScrollApp not initialized');
            }
        }

        console.log('[IRIS-Controller] VideoScrollApp ready');
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
     * Initialize controller
     * @param {Object} config - Configuration object
     * @returns {Promise} Initialization result
     */
    async initialize(config = {}) {
        console.log('[IRIS-Controller] Initializing VideoController');

        // Get video element
        this.videoElement = this.getVideoElement();
        if (!this.videoElement) {
            console.warn('[IRIS-Controller] Video element not found during initialization');
        }

        console.log('[IRIS-Controller] VideoController initialized');
        return true;
    }

    /**
     * Cleanup controller
     * @returns {Promise} Cleanup result
     */
    async cleanup() {
        console.log('[IRIS-Controller] Cleaning up VideoController');
        this.videoElement = null;
        return true;
    }

    /**
     * Get controller information
     * @returns {Object} Controller information
     */
    getInfo() {
        const videoInfo = this.getVideoInfo();
        return {
            name: this.name,
            supportedActions: this.supportedActions,
            videoElement: !!this.videoElement,
            videoInfo: videoInfo,
            capabilities: ['playback_control', 'volume_control', 'time_seeking']
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoController;
} else {
    window.VideoController = VideoController;
}
