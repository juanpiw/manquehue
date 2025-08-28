/**
 * ScrollCoordinator - Coordinador de sistemas de scroll (Versión Ligera)
 * Maneja la coordinación básica entre sistemas sin interferir con scroll manual
 */
class ScrollCoordinator {
    constructor() {
        this.isNavigating = false;
        this.navigationSystem = null;
        this.videoScrollSystem = null;
        this.animationController = null;
        
        // Configuración mínima para no interferir con scroll manual
        this.scrollCooldown = 200; // Reducido para mayor responsividad
        this.lastScrollTime = 0;
        
        this.init();
    }

    init() {
        console.log('🎯 Initializing ScrollCoordinator (Light)...');
        
        // Esperar a que todos los sistemas estén disponibles
        this.waitForSystems();
        
        console.log('✅ ScrollCoordinator initialized');
    }

    waitForSystems() {
        const checkSystems = () => {
            if (window.NavigationSystem && window.VideoScrollSystem && window.AnimationController) {
                this.setupCoordination();
            } else {
                setTimeout(checkSystems, 100);
            }
        };
        
        checkSystems();
    }

    setupCoordination() {
        console.log('🔗 Setting up light scroll coordination...');
        
        // Obtener referencias a los sistemas
        this.navigationSystem = window.navigationSystem;
        this.videoScrollSystem = window.videoScrollSystem;
        this.animationController = window.animationController;
        
        if (!this.navigationSystem || !this.videoScrollSystem || !this.animationController) {
            console.warn('⚠️ Some systems not available for coordination');
            return;
        }
        
        // Coordinación mínima - solo para navegación programática
        this.coordinateNavigation();
        
        console.log('✅ Light scroll coordination set up');
    }

    coordinateNavigation() {
        // Coordinación mínima solo para navegación programática
        if (this.navigationSystem) {
            const originalNavigateToSection = this.navigationSystem.navigateToSection.bind(this.navigationSystem);
            
            this.navigationSystem.navigateToSection = (sectionIndex) => {
                const now = Date.now();
                if (now - this.lastScrollTime < this.scrollCooldown) {
                    return; // Solo bloquear navegaciones muy rápidas
                }
                
                this.lastScrollTime = now;
                this.isNavigating = true;
                
                // Ejecutar navegación original
                originalNavigateToSection(sectionIndex);
                
                // Reanudar sistemas después de navegación
                setTimeout(() => {
                    this.isNavigating = false;
                }, this.navigationSystem.navigationDelay + 100);
            };
        }
    }

    // Métodos públicos para control externo
    isCurrentlyNavigating() {
        return this.isNavigating;
    }

    getScrollProgress() {
        const scrollPosition = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const maxScroll = documentHeight - windowHeight;
        
        return maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;
    }

    // Método para debug
    debugCoordination() {
        console.log('🎯 ScrollCoordinator Debug Info:');
        console.log(`📊 Navigation System: ${this.navigationSystem ? '✅' : '❌'}`);
        console.log(`🎬 Video Scroll System: ${this.videoScrollSystem ? '✅' : '❌'}`);
        console.log(`🎨 Animation Controller: ${this.animationController ? '✅' : '❌'}`);
        console.log(`🧭 Currently Navigating: ${this.isNavigating}`);
        console.log(`📈 Scroll Progress: ${this.getScrollProgress().toFixed(1)}%`);
    }
}

// Export for global use
window.ScrollCoordinator = ScrollCoordinator;
