/**
 * main.js - Archivo principal que coordina todo el sistema
 * Inicializa y coordina VideoScrollSystem, NavigationSystem, ComponentManager y AnimationController
 */
class VideoScrollApp {
    constructor() {
        this.videoSystem = null;
        this.navigationSystem = null;
        this.componentManager = null;
        this.animationController = null;
        this.contentManager = null;
        
        this.isInitialized = false;
        this.initPromise = null;
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Video Scroll Application...');
        
        try {
            // Inicializar sistemas en orden
            await this.initializeVideoSystem();
            await this.initializeNavigationSystem();
            await this.initializeComponentManager();
            await this.initializeAnimationController();
            await this.initializeImageFilterSystem();
            await this.initializeContentManager();
            
            // Configurar integración entre sistemas
            this.setupSystemIntegration();
            
            // Configurar event listeners globales
            this.setupGlobalEventListeners();
            
            this.isInitialized = true;
            console.log('✅ Video Scroll Application initialized successfully');
            
            // Emitir evento de inicialización completa
            this.emitEvent('app:initialized');
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.handleInitializationError(error);
        }
    }

    async initializeVideoSystem() {
        console.log('🎬 Initializing VideoScrollSystem...');
        
        try {
            this.videoSystem = new VideoScrollSystem();
            await this.videoSystem.init();
            
            console.log('✅ VideoScrollSystem initialized');
            this.emitEvent('system:video:initialized');
            
        } catch (error) {
            console.error('❌ Error initializing VideoScrollSystem:', error);
            throw error;
        }
    }

    async initializeNavigationSystem() {
        console.log('🧭 Initializing NavigationSystem...');
        
        try {
            this.navigationSystem = new NavigationSystem();
            
            // Debug: mostrar información de secciones
            setTimeout(() => {
                this.navigationSystem.debugSections();
            }, 1000);
            
            console.log('✅ NavigationSystem initialized');
            this.emitEvent('system:navigation:initialized');
            
        } catch (error) {
            console.error('❌ Error initializing NavigationSystem:', error);
            throw error;
        }
    }

    async initializeComponentManager() {
        console.log('🎛️ Initializing ComponentManager...');
        
        try {
            this.componentManager = new ComponentManager();
            
            console.log('✅ ComponentManager initialized');
            this.emitEvent('system:components:initialized');
            
        } catch (error) {
            console.error('❌ Error initializing ComponentManager:', error);
            throw error;
        }
    }

    async initializeAnimationController() {
        console.log('🎬 Initializing AnimationController...');
        
        try {
            this.animationController = new AnimationController();
            
            // Exponer globalmente para acceso directo
            window.animationController = this.animationController;
            
            console.log('✅ AnimationController initialized and exposed globally');
            this.emitEvent('system:animations:initialized');
            
        } catch (error) {
            console.error('❌ Error initializing AnimationController:', error);
            throw error;
        }
    }

    async initializeImageFilterSystem() {
        console.log('🖼️ Initializing ImageFilterSystem...');
        
        try {
            // Verificar si ya existe una instancia global
            if (window.imageFilterSystem) {
                this.imageFilterSystem = window.imageFilterSystem;
                console.log('🖼️ Using existing ImageFilterSystem instance');
            } else {
                this.imageFilterSystem = new ImageFilterSystem();
                // Inicializar instancia global para acceso directo
                window.imageFilterSystem = this.imageFilterSystem;
                console.log('🖼️ Created new ImageFilterSystem instance');
            }
            
            console.log('✅ ImageFilterSystem initialized');
            this.emitEvent('system:imageFilter:initialized');
            
        } catch (error) {
            console.error('❌ Error initializing ImageFilterSystem:', error);
            throw error;
        }
    }

    async initializeContentManager() {
        console.log('📋 Initializing ContentManager...');
        
        try {
            // Solo crear ContentManager si no existe ya
            if (!window.contentManager) {
                this.contentManager = new ContentManager();
                window.contentManager = this.contentManager;
            } else {
                this.contentManager = window.contentManager;
                console.log('📋 Using existing ContentManager instance');
            }
            
            // Debug: mostrar información de contenido
            setTimeout(() => {
                this.contentManager.debugInfo();
            }, 1000);
            
            console.log('✅ ContentManager initialized');
            this.emitEvent('system:content:initialized');
            
        } catch (error) {
            console.error('❌ Error initializing ContentManager:', error);
            throw error;
        }
    }

    setupSystemIntegration() {
        console.log('🔗 Setting up system integration...');
        
        // Integración entre VideoSystem y NavigationSystem
        if (this.videoSystem && this.navigationSystem) {
            // Cuando cambia la sección, actualizar el video
            this.navigationSystem.onSectionChange = (sectionId) => {
                console.log(`🔄 Section changed to: ${sectionId}`);
                this.emitEvent('section:changed', { sectionId });
            };
        }
        
        // Integración entre ComponentManager y AnimationController
        if (this.componentManager && this.animationController) {
            // Animar componentes cuando se activan
            this.componentManager.onComponentActivate = (componentName) => {
                console.log(`🎬 Component activated: ${componentName}`);
                this.animationController.animateSection(componentName);
            };
        }
        
        // Integración entre todos los sistemas
        this.setupCrossSystemEvents();
        
        console.log('✅ System integration setup complete');
    }

    setupCrossSystemEvents() {
        // Evento de cambio de sección
        this.on('section:changed', (data) => {
            // Animar la nueva sección
            if (this.animationController) {
                this.animationController.animateSection(data.sectionId, 'fadeInUp');
            }
            
            // Actualizar navegación
            if (this.navigationSystem) {
                this.navigationSystem.updateNavigation();
            }
        });
        
        // Evento de scroll
        this.on('scroll:update', (data) => {
            // Actualizar indicadores de scroll
            if (this.navigationSystem) {
                this.navigationSystem.updateScrollProgress();
            }
            
            // Animar elementos en vista
            if (this.animationController) {
                this.animationController.animateScrollProgress();
            }
        });
        
        // Evento de modal abierto
        this.on('modal:opened', (data) => {
            // Pausar videos si es necesario
            if (this.videoSystem && data.pauseVideo) {
                this.videoSystem.pause();
            }
            
            // Pausar animaciones
            if (this.animationController) {
                this.animationController.pauseAnimations();
            }
        });
        
        // Evento de modal cerrado
        this.on('modal:closed', (data) => {
            // Reanudar videos si es necesario
            if (this.videoSystem && data.resumeVideo) {
                this.videoSystem.play();
            }
            
            // Reanudar animaciones
            if (this.animationController) {
                this.animationController.resumeAnimations();
            }
        });
    }

    setupGlobalEventListeners() {
        console.log('🌐 Setting up global event listeners...');
        
        // Manejo de visibilidad de página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handlePageHidden();
            } else {
                this.handlePageVisible();
            }
        });
        
        // Manejo de redimensionamiento
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
        
        // Manejo de errores globales
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event.error);
        });
        
        // Manejo de teclas globales
        document.addEventListener('keydown', (event) => {
            this.handleGlobalKeydown(event);
        });
        
        console.log('✅ Global event listeners setup complete');
        
        // Setup para animación de sección de apartamentos
        this.setupApartmentsSectionAnimation();
        
        // Setup para animación de sección hero
        this.setupPreviewHeroAnimation();
    }

    setupApartmentsSectionAnimation() {
        // Crear Intersection Observer específico para la sección de apartamentos
        const apartmentsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger la animación wow
                    if (this.animationController) {
                        this.animationController.animateApartmentsSection();
                    }
                    
                    // Remover el observer después de activar la animación
                    apartmentsObserver.unobserve(entry.target);
                    
                    console.log('🎬 Apartments section entered viewport - triggering wow animation');
                }
            });
        }, {
            threshold: 0.3, // Trigger cuando 30% de la sección sea visible
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Observar la sección de apartamentos
        const apartmentsSection = document.getElementById('apartments');
        if (apartmentsSection) {
            apartmentsObserver.observe(apartmentsSection);
            console.log('✅ Apartments section animation observer setup');
        }
    }

    setupPreviewHeroAnimation() {
        console.log('🎬 Setting up preview hero animation observer...');
        
        // Crear Intersection Observer específico para la sección hero
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger la animación wow
                    if (this.animationController) {
                        this.animationController.animatePreviewHero();
                    }
                    
                    // Remover el observer después de activar la animación
                    heroObserver.unobserve(entry.target);
                    
                    console.log('🎬 Preview hero section entered viewport - triggering wow animation');
                }
            });
        }, {
            threshold: 0.1, // Trigger cuando 10% de la sección sea visible
            rootMargin: '-50px 0px -50px 0px'
        });
        
        // Observar la sección hero (intentar múltiples selectores)
        let previewHero = document.querySelector('.preview-hero');
        if (!previewHero) {
            previewHero = document.querySelector('#section-1 .preview-hero');
        }
        if (!previewHero) {
            previewHero = document.querySelector('section .preview-hero');
        }
        
        if (previewHero) {
            heroObserver.observe(previewHero);
            console.log('✅ Preview hero section animation observer setup');
        } else {
            console.log('⚠️ Preview hero section not found for animation observer');
        }
    }

    handlePageHidden() {
        console.log('👁️ Page hidden');
        
        // Pausar video
        if (this.videoSystem) {
            this.videoSystem.pause();
        }
        
        // Pausar animaciones
        if (this.animationController) {
            this.animationController.pauseAnimations();
        }
        
        this.emitEvent('page:hidden');
    }

    handlePageVisible() {
        console.log('👁️ Page visible');
        
        // Reanudar video
        if (this.videoSystem) {
            this.videoSystem.play();
        }
        
        // Reanudar animaciones
        if (this.animationController) {
            this.animationController.resumeAnimations();
        }
        
        this.emitEvent('page:visible');
    }

    handleResize() {
        console.log('📏 Window resized');
        
        // Actualizar navegación
        if (this.navigationSystem) {
            this.navigationSystem.updateNavigation();
        }
        
        // Actualizar animaciones
        if (this.animationController) {
            this.animationController.updateParallax();
        }
        
        this.emitEvent('window:resized');
    }

    handleGlobalError(error) {
        console.error('❌ Global error:', error);
        
        // Intentar recuperar el sistema
        this.handleSystemRecovery();
        
        this.emitEvent('error:global', { error });
    }

    handleGlobalKeydown(event) {
        // Atajos de teclado globales
        switch (event.key) {
            case 'F1':
                event.preventDefault();
                this.showDebugInfo();
                break;
            case 'F2':
                event.preventDefault();
                this.toggleDebugMode();
                break;
            case 'F5':
                event.preventDefault();
                this.refreshSystem();
                break;
        }
    }

    handleSystemRecovery() {
        console.log('🔄 Attempting system recovery...');
        
        try {
            // Reinicializar sistemas críticos
            if (this.videoSystem) {
                this.videoSystem.init();
            }
            
            if (this.navigationSystem) {
                this.navigationSystem.updateNavigation();
            }
            
            console.log('✅ System recovery completed');
            
        } catch (error) {
            console.error('❌ System recovery failed:', error);
        }
    }

    showDebugInfo() {
        const debugInfo = {
            videoSystem: this.videoSystem ? this.videoSystem.getCurrentVideoInfo() : null,
            navigationSystem: this.navigationSystem ? {
                currentSection: this.navigationSystem.getCurrentSection(),
                totalSections: this.navigationSystem.getTotalSections()
            } : null,
            componentManager: this.componentManager ? {
                activeModals: this.componentManager.getActiveModals().length
            } : null,
            animationController: this.animationController ? 'Active' : null
        };
        
        console.log('🐛 Debug Info:', debugInfo);
        
        // Mostrar en pantalla si está en modo debug
        if (this.debugMode) {
            this.showDebugOverlay(debugInfo);
        }
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        console.log(`🐛 Debug mode: ${this.debugMode ? 'ON' : 'OFF'}`);
        
        if (this.debugMode) {
            this.enableDebugMode();
        } else {
            this.disableDebugMode();
        }
    }

    enableDebugMode() {
        // Agregar estilos de debug
        const debugStyles = `
            .debug-overlay {
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10000;
                max-width: 300px;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = debugStyles;
        document.head.appendChild(style);
        
        // Crear overlay de debug
        this.debugOverlay = document.createElement('div');
        this.debugOverlay.className = 'debug-overlay';
        document.body.appendChild(this.debugOverlay);
        
        // Actualizar info cada segundo
        this.debugInterval = setInterval(() => {
            this.showDebugInfo();
        }, 1000);
    }

    disableDebugMode() {
        if (this.debugOverlay) {
            this.debugOverlay.remove();
            this.debugOverlay = null;
        }
        
        if (this.debugInterval) {
            clearInterval(this.debugInterval);
            this.debugInterval = null;
        }
    }

    showDebugOverlay(info) {
        if (!this.debugOverlay) return;
        
        this.debugOverlay.innerHTML = `
            <strong>Debug Info</strong><br>
            Video: ${info.videoSystem ? info.videoSystem.index + 1 : 'N/A'}<br>
            Section: ${info.navigationSystem ? info.navigationSystem.currentSection + 1 : 'N/A'}<br>
            Modals: ${info.componentManager ? info.componentManager.activeModals : 'N/A'}<br>
            Animations: ${info.animationController ? 'Active' : 'N/A'}
        `;
    }

    refreshSystem() {
        console.log('🔄 Refreshing system...');
        
        // Reinicializar todos los sistemas
        this.init();
    }

    // Sistema de eventos
    events = {};

    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    off(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
        }
    }

    emitEvent(eventName, data = {}) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event handler for ${eventName}:`, error);
                }
            });
        }
    }

    // Métodos públicos para control externo
    getSystemStatus() {
        return {
            isInitialized: this.isInitialized,
            videoSystem: !!this.videoSystem,
            navigationSystem: !!this.navigationSystem,
            componentManager: !!this.componentManager,
            animationController: !!this.animationController,
            imageFilterSystem: !!this.imageFilterSystem
        };
    }

    getVideoInfo() {
        return this.videoSystem ? this.videoSystem.getCurrentVideoInfo() : null;
    }

    getNavigationInfo() {
        return this.navigationSystem ? {
            currentSection: this.navigationSystem.getCurrentSection(),
            currentSectionId: this.navigationSystem.getCurrentSectionId(),
            totalSections: this.navigationSystem.getTotalSections()
        } : null;
    }

    navigateToSection(sectionIndex) {
        if (this.navigationSystem) {
            this.navigationSystem.navigateToSection(sectionIndex);
        }
    }

    pauseVideo() {
        if (this.videoSystem) {
            this.videoSystem.pause();
        }
    }

    playVideo() {
        if (this.videoSystem) {
            this.videoSystem.play();
        }
    }

    closeAllModals() {
        if (this.componentManager) {
            this.componentManager.closeAllModals();
        }
    }

    destroy() {
        console.log('🗑️ Destroying Video Scroll Application...');
        
        // Destruir sistemas
        if (this.animationController) {
            this.animationController.destroy();
        }
        
        // Limpiar event listeners
        this.events = {};
        
        // Limpiar debug
        this.disableDebugMode();
        
        console.log('✅ Video Scroll Application destroyed');
    }
}

// Inicialización automática cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded - Starting Video Scroll Application');
    
    // Crear instancia global de la aplicación
    window.videoScrollApp = new VideoScrollApp();
    
    // Exponer métodos útiles globalmente
    window.VideoScrollApp = VideoScrollApp;
});

// Manejo de errores no capturados
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled promise rejection:', event.reason);
});

// Export for global use
window.VideoScrollApp = VideoScrollApp;
