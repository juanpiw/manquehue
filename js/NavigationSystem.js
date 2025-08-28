/**
 * NavigationSystem - Sistema de navegación y control de secciones
 * Maneja la navegación entre secciones, indicadores de scroll y navegación por teclado
 */
class NavigationSystem {
    constructor() {
        this.currentSection = 0;
        this.sections = ['section-1', 'apartments', 'features', 'equipment'];
        this.isNavigating = false;
        this.navigationDelay = 400; // Reducido de 600ms a 400ms para mayor fluidez
        
        // Elementos de navegación
        this.navItems = [];
        this.scrollIndicator = null;
        this.scrollProgress = null;
        
        // Mejoras para scroll más suave
        this.scrollSensitivity = 0.6; // Reducido de 0.8 a 0.6 para mayor sensibilidad
        this.scrollThreshold = 0.3; // Reducido de 0.4 a 0.3 para mayor responsividad
        this.lastScrollTime = 0;
        this.scrollCooldown = 150; // Reducido de 300ms a 150ms para scroll manual más fluido
        this.isManualScroll = false; // Flag para detectar scroll manual
        
        this.init();
    }

    init() {
        console.log('🧭 Initializing NavigationSystem...');
        
        this.setupElements();
        this.setupEventListeners();
        this.updateNavigation();
        
        console.log('✅ NavigationSystem initialized');
    }

    setupElements() {
        // Navegación principal
        this.navItems = document.querySelectorAll('.nav-item');
        
        // Indicador de scroll fijo
        this.scrollIndicator = document.getElementById('scrollIndicatorFixed');
        
        // Barra de progreso de scroll
        this.scrollProgress = document.getElementById('scrollProgress');
        
        // Bullets del scroll indicator
        this.scrollDots = document.querySelectorAll('.scroll-dot');
        
        console.log(`📊 Found ${this.navItems.length} nav items`);
        console.log(`🔘 Found ${this.scrollDots.length} scroll dots`);
    }

    setupEventListeners() {
        // Click en elementos de navegación
        this.navItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection(index);
            });
        });

        // Click en bullets del scroll indicator
        this.scrollDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.navigateToSection(index);
            });
        });

        // Navegación por teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Navegación por rueda del mouse
        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            if (wheelTimeout) return;
            
            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    this.navigateToNextSection();
                } else {
                    this.navigateToPreviousSection();
                }
                wheelTimeout = null;
            }, 150);
        }, { passive: true });

        // Scroll event para actualizar navegación
        window.addEventListener('scroll', () => {
            this.updateNavigationFromScroll();
        });

        console.log('✅ Navigation event listeners set up');
    }

    handleKeyboardNavigation(e) {
        if (this.isNavigating) return;

        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                this.navigateToNextSection();
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.navigateToPreviousSection();
                break;
            case 'Home':
                e.preventDefault();
                this.navigateToSection(0);
                break;
            case 'End':
                e.preventDefault();
                this.navigateToSection(this.sections.length - 1);
                break;
            case ' ':
                e.preventDefault();
                this.toggleVideoPlayback();
                break;
            case 'Escape':
                this.closeModals();
                break;
        }
    }

    navigateToSection(sectionIndex) {
        if (this.isNavigating || sectionIndex < 0 || sectionIndex >= this.sections.length) {
            return;
        }

        this.isNavigating = true;
        this.currentSection = sectionIndex;

        const targetSection = document.getElementById(this.sections[sectionIndex]);
        if (!targetSection) {
            console.error(`❌ Section not found: ${this.sections[sectionIndex]}`);
            this.isNavigating = false;
            return;
        }

        console.log(`🧭 Navigating to section ${sectionIndex + 1}: ${this.sections[sectionIndex]}`);

        // Scroll suave a la sección
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Actualizar navegación después del scroll
        setTimeout(() => {
            this.updateNavigation();
            this.isNavigating = false;
        }, this.navigationDelay);
    }

    navigateToNextSection() {
        const nextSection = Math.min(this.currentSection + 1, this.sections.length - 1);
        this.navigateToSection(nextSection);
    }

    navigateToPreviousSection() {
        const prevSection = Math.max(this.currentSection - 1, 0);
        this.navigateToSection(prevSection);
    }

    updateNavigationFromScroll() {
        if (this.isNavigating) return;

        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Determinar sección actual basada en scroll
        for (let i = 0; i < this.sections.length; i++) {
            const section = document.getElementById(this.sections[i]);
            if (!section) continue;

            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;

            // Verificar si la sección está visible
            if (scrollPosition >= sectionTop - windowHeight * 0.3 && 
                scrollPosition < sectionBottom - windowHeight * 0.3) {
                if (this.currentSection !== i) {
                    this.currentSection = i;
                    this.updateNavigation();
                }
                break;
            }
        }

        // Actualizar barra de progreso
        this.updateScrollProgress();
    }

    updateNavigation() {
        // Actualizar elementos de navegación
        this.navItems.forEach((item, index) => {
            if (index === this.currentSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Actualizar bullets del scroll indicator
        this.scrollDots.forEach((dot, index) => {
            if (index === this.currentSection) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Actualizar indicador de scroll fijo
        if (this.scrollIndicator) {
            const dots = this.scrollIndicator.querySelectorAll('.indicator-dot');
            dots.forEach((dot, index) => {
                if (index === this.currentSection) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Actualizar underline de navegación
        this.updateNavigationUnderline();
    }

    updateNavigationUnderline() {
        const underline = document.querySelector('.nav-underline');
        if (!underline || this.navItems.length === 0) return;

        const activeItem = this.navItems[this.currentSection];
        if (!activeItem) return;

        const itemRect = activeItem.getBoundingClientRect();
        const navRect = activeItem.closest('.nav-list').getBoundingClientRect();

        underline.style.left = `${itemRect.left - navRect.left}px`;
        underline.style.width = `${itemRect.width}px`;
    }

    updateScrollProgress() {
        if (!this.scrollProgress) return;

        const scrollPosition = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const maxScroll = documentHeight - windowHeight;
        
        const progress = maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;
        this.scrollProgress.style.height = `${progress}%`;
    }

    toggleVideoPlayback() {
        const videoElement = document.getElementById('backgroundVideo');
        if (!videoElement) return;

        if (videoElement.paused) {
            videoElement.play().catch(e => console.warn('Play prevented:', e));
        } else {
            videoElement.pause();
        }
    }

    closeModals() {
        const modals = document.querySelectorAll('.contact-modal, .apartment-model-container');
        modals.forEach(modal => {
            if (modal.classList.contains('active') || modal.style.display === 'block') {
                modal.classList.remove('active');
                modal.style.display = 'none';
            }
        });
    }

    // Métodos públicos para control externo
    getCurrentSection() {
        return this.currentSection;
    }

    getCurrentSectionId() {
        return this.sections[this.currentSection];
    }

    getTotalSections() {
        return this.sections.length;
    }

    isAtFirstSection() {
        return this.currentSection === 0;
    }

    isAtLastSection() {
        return this.currentSection === this.sections.length - 1;
    }

    // Método para debug - mostrar información de secciones
    debugSections() {
        console.log('🔍 NavigationSystem Debug Info:');
        console.log(`📊 Total sections: ${this.sections.length}`);
        console.log(`📍 Current section: ${this.currentSection + 1} (${this.sections[this.currentSection]})`);
        console.log(`🔘 Scroll dots found: ${this.scrollDots.length}`);
        console.log(`🧭 Nav items found: ${this.navItems.length}`);
        
        this.sections.forEach((sectionId, index) => {
            const element = document.getElementById(sectionId);
            const exists = element ? '✅' : '❌';
            console.log(`${exists} Section ${index + 1}: ${sectionId} ${element ? '(found)' : '(not found)'}`);
        });
    }
}

// Export for global use
window.NavigationSystem = NavigationSystem;
