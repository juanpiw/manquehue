/**
 * VideoScrollSystem - Sistema principal de videos por scroll
 * Maneja la carga, reproducción y transición de videos de fondo basado en el scroll
 */
class VideoScrollSystem {
    constructor() {
        this.videoElement = null;
        this.currentVideoIndex = -1;
        this.isTransitioning = false;
        this.scrollThreshold = 0.3; // 30% de la sección debe estar visible
        this.transitionDuration = 1000; // 1 segundo para transiciones
        
        // Videos disponibles con rutas correctas
        this.videos = [
            { src: 'src/assets/videos/video-0.mp4', description: 'Video 0 - Sección 1' },
            { src: 'src/assets/videos/video-1.mp4', description: 'Video 1 - Apartamentos' },
            { src: 'src/assets/videos/video-2.mp4', description: 'Video 2 - Características' },
            { src: 'src/assets/videos/video-3.mp4', description: 'Video 3 - Características' },
            { src: 'src/assets/videos/video-4.mp4', description: 'Video 4 - Equipamiento' },
            { src: 'src/assets/videos/video-5.mp4', description: 'Video 5 - Sección 1' },
            { src: 'src/assets/videos/video-6.mp4', description: 'Video 6 - Apartamentos' },
            { src: 'src/assets/videos/video-7.mp4', description: 'Video 7 - Características' },
            { src: 'src/assets/videos/video-8.mp4', description: 'Video 8 - Equipamiento' }
        ];
        
        this.availableVideoIndexes = [];
        this.lastScrollTime = 0;
        this.scrollThrottle = 100; // Throttle scroll events to 100ms
    }

    async init() {
        console.log('🎬 Initializing VideoScrollSystem...');
        
        // Get video element
        this.videoElement = document.getElementById('backgroundVideo');
        if (!this.videoElement) {
            console.error('❌ Video element not found');
            return;
        }
        console.log('✅ Video element found:', this.videoElement);
        
        // Check available videos
        await this.checkAvailableVideos();
        
        // Load first available video
        if (this.availableVideoIndexes.length > 0) {
            const firstVideoIndex = this.availableVideoIndexes[0];
            console.log(`📹 Loading first video: ${firstVideoIndex + 1}`);
            this.loadVideo(firstVideoIndex);
        } else {
            console.error('❌ No videos available to load');
            return;
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('🎬 VideoScrollSystem initialized successfully');
    }

    async checkAvailableVideos() {
        console.log('🔍 Checking available videos...');
        this.availableVideoIndexes = [];
        
        for (let i = 0; i < this.videos.length; i++) {
            const exists = await this.checkVideoExists(this.videos[i].src);
            if (exists) {
                this.availableVideoIndexes.push(i);
                console.log(`✅ Video available: ${this.videos[i].src}`);
            } else {
                console.warn(`❌ Video not found: ${this.videos[i].src}`);
            }
        }
        
        console.log(`📊 ${this.availableVideoIndexes.length}/${this.videos.length} videos available`);
    }

    async checkVideoExists(videoSrc) {
        return new Promise((resolve) => {
            console.log(`🔍 Checking video: ${videoSrc}`);
            
            const testVideo = document.createElement('video');
            testVideo.muted = true;
            testVideo.preload = 'metadata';
            testVideo.src = videoSrc;
            
            const timeout = setTimeout(() => {
                console.warn(`⏰ Timeout checking video: ${videoSrc}`);
                resolve(false);
            }, 3000);
            
            testVideo.addEventListener('loadeddata', () => {
                clearTimeout(timeout);
                console.log(`✅ Video exists: ${videoSrc}`);
                resolve(true);
            });
            
            testVideo.addEventListener('error', (e) => {
                clearTimeout(timeout);
                console.warn(`❌ Video not found: ${videoSrc}`, e);
                resolve(false);
            });
            
            testVideo.addEventListener('loadstart', () => {
                console.log(`🚀 Started loading: ${videoSrc}`);
            });
        });
    }

    setupEventListeners() {
        console.log('🎧 Setting up event listeners...');
        
        // Throttled scroll handler
        let scrollTimeout;
        const scrollHandler = () => {
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
                scrollTimeout = null;
            }, this.scrollThrottle);
        };
        
        window.addEventListener('scroll', scrollHandler);
        console.log('✅ Scroll event listener added');
        
        // Video event listeners
        this.videoElement.addEventListener('loadstart', () => {
            console.log('🚀 Video load started');
        });
        
        this.videoElement.addEventListener('canplay', () => {
            console.log('▶️ Video can play');
        });
        
        this.videoElement.addEventListener('error', (e) => {
            console.error('❌ Video error:', e);
        });
        
        console.log('✅ All event listeners set up');
    }

    handleScroll() {
        if (this.isTransitioning) {
            console.log(`⏳ Skipping scroll - transition in progress`);
            return;
        }
        
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollProgress = scrollPosition / (documentHeight - windowHeight);
        
        console.log(`📜 Scroll: ${scrollPosition}px / ${documentHeight - windowHeight}px = ${(scrollProgress * 100).toFixed(1)}%`);
        
        const currentSection = this.getCurrentSection(scrollPosition);
        const videoIndex = this.selectVideoForSection(currentSection);
        
        console.log(`🎬 Current video: ${this.currentVideoIndex + 1}, Selected video: ${videoIndex + 1}`);
        if (videoIndex !== -1 && videoIndex !== this.currentVideoIndex) {
            console.log(`🔄 Switching to video ${videoIndex + 1} for section: ${currentSection}`);
            this.switchVideo(videoIndex);
        } else {
            console.log(`⏸️ No video change needed`);
        }
    }

    getCurrentSection(scrollPosition) {
        const sections = ['section-1', 'apartments', 'features', 'equipment'];
        const windowHeight = window.innerHeight;
        
        console.log(`🔍 Checking scroll position: ${scrollPosition}px`);
        
        for (let i = 0; i < sections.length; i++) {
            const section = document.getElementById(sections[i]);
            if (!section) {
                console.warn(`⚠️ Section not found: ${sections[i]}`);
                continue;
            }
            
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Verificar si la sección está visible con el umbral
            const threshold = sectionHeight * this.scrollThreshold;
            const visibleTop = sectionTop + threshold;
            const visibleBottom = sectionBottom - threshold;
            
            console.log(`📏 Section ${sections[i]}: top=${sectionTop}, bottom=${sectionBottom}, visible=${visibleTop}-${visibleBottom}`);
            
            if (scrollPosition >= visibleTop && scrollPosition < visibleBottom) {
                console.log(`✅ Current section: ${sections[i]}`);
                return sections[i];
            }
        }
        
        console.log(`🔄 Default section: section-1`);
        return 'section-1'; // Default
    }

    selectVideoForSection(sectionId) {
        console.log(`🎯 Selecting video for section: ${sectionId}`);
        
        // Mapeo de secciones a videos
        const sectionVideos = {
            'section-1': [0, 5], // video-0.mp4, video-5.mp4
            'apartments': [1, 6], // video-1.mp4, video-6.mp4
            'features': [3, 7],   // video-3.mp4, video-7.mp4
            'equipment': [4, 8]   // video-4.mp4, video-8.mp4
        };
        
        const sectionVideoIndexes = sectionVideos[sectionId] || [0];
        console.log(`📹 Found ${sectionVideoIndexes.length} videos for section ${sectionId}:`, sectionVideoIndexes);
        
        // Filtrar solo videos disponibles
        const availableSectionVideos = sectionVideoIndexes.filter(videoIndex => {
            const isAvailable = this.availableVideoIndexes && this.availableVideoIndexes.includes(videoIndex);
            console.log(`🔍 Video ${this.videos[videoIndex].src}: available=${isAvailable}`);
            return isAvailable;
        });
        
        console.log(`✅ Available videos for ${sectionId}:`, availableSectionVideos.length);
        
        if (availableSectionVideos.length === 0) {
            console.warn(`⚠️ No available videos for section ${sectionId}, using first available`);
            return this.availableVideoIndexes.length > 0 ? this.availableVideoIndexes[0] : -1;
        }
        
        // Seleccionar video aleatoriamente de los disponibles
        const randomIndex = Math.floor(Math.random() * availableSectionVideos.length);
        const selectedVideoIndex = availableSectionVideos[randomIndex];
        const selectedVideo = this.videos[selectedVideoIndex];
        
        console.log(`🎲 Selected video for ${sectionId}: ${selectedVideo.description} (${selectedVideo.src}) at index ${selectedVideoIndex}`);
        return selectedVideoIndex;
    }

    switchVideo(videoIndex) {
        if (this.isTransitioning) {
            console.log('⏳ Already transitioning, skipping');
            return;
        }
        
        this.isTransitioning = true;
        console.log(`🔄 Starting transition to video ${videoIndex + 1}`);
        
        // Fade out current video
        this.videoElement.style.opacity = '0';
        
        setTimeout(() => {
            this.loadVideo(videoIndex);
            this.videoElement.style.opacity = '1';
            this.isTransitioning = false;
            console.log(`✅ Transition to video ${videoIndex + 1} completed`);
        }, this.transitionDuration);
    }

    loadVideo(videoIndex) {
        if (videoIndex < 0 || videoIndex >= this.videos.length) {
            console.error(`❌ Invalid video index: ${videoIndex}`);
            return;
        }
        
        const video = this.videos[videoIndex];
        console.log(`📹 Loading video: ${video.description} (${video.src})`);
        
        // Check if video exists before loading
        if (!this.availableVideoIndexes.includes(videoIndex)) {
            console.error(`❌ Video not available: ${video.src}`);
            return;
        }
        
        this.videoElement.src = video.src;
        this.currentVideoIndex = videoIndex;
        
        // Play video
        this.videoElement.play().catch(error => {
            console.error('❌ Error playing video:', error);
        });
    }

    getCurrentVideoInfo() {
        return {
            index: this.currentVideoIndex,
            src: this.currentVideoIndex >= 0 ? this.videos[this.currentVideoIndex].src : null,
            description: this.currentVideoIndex >= 0 ? this.videos[this.currentVideoIndex].description : null,
            isPlaying: !this.videoElement.paused,
            isTransitioning: this.isTransitioning
        };
    }

    pause() {
        if (this.videoElement) {
            this.videoElement.pause();
        }
    }

    play() {
        if (this.videoElement) {
            this.videoElement.play().catch(error => {
                console.error('❌ Error playing video:', error);
            });
        }
    }
}

// Export for global use
window.VideoScrollSystem = VideoScrollSystem;
