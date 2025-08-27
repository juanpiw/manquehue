/**
 * AnimationController - Controlador de animaciones y efectos visuales
 * Maneja animaciones de entrada, hover effects, transiciones y efectos parallax
 */
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.intersectionObserver = null;
        this.parallaxElements = [];
        this.floatingElements = [];
        
        this.init();
    }

    init() {
        console.log('🎬 Initializing AnimationController...');
        
        this.injectKeyframes();
        this.setupIntersectionObserver();
        this.setupParallaxEffects();
        this.setupFloatingAnimations();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
        
        console.log('✅ AnimationController initialized');
    }

    injectKeyframes() {
        const keyframes = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes fadeInRight {
                from {
                    opacity: 0;
                    transform: translateX(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            @keyframes slideInFromTop {
                from {
                    opacity: 0;
                    transform: translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideInFromBottom {
                from {
                    opacity: 0;
                    transform: translateY(50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes float {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-10px);
                }
            }
            
            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }
            
            @keyframes shimmer {
                0% {
                    background-position: -200px 0;
                }
                100% {
                    background-position: calc(200px + 100%) 0;
                }
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                }
                to {
                    transform: translateX(0);
                }
            }
            
            @keyframes counter {
                from {
                    content: "0";
                }
                to {
                    content: attr(data-target);
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        
        console.log('✅ Keyframes injected');
    }

    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observar elementos con clases de animación
        const animatedElements = document.querySelectorAll('[data-animation]');
        animatedElements.forEach(element => {
            this.intersectionObserver.observe(element);
        });
        
        console.log(`✅ IntersectionObserver setup for ${animatedElements.length} elements`);
    }

    setupParallaxEffects() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            this.updateParallax();
        });
        
        console.log(`✅ Parallax effects setup for ${this.parallaxElements.length} elements`);
    }

    setupFloatingAnimations() {
        this.floatingElements = document.querySelectorAll('[data-float]');
        
        this.floatingElements.forEach(element => {
            const duration = element.getAttribute('data-float-duration') || '3s';
            const delay = element.getAttribute('data-float-delay') || '0s';
            
            element.style.animation = `float ${duration} ease-in-out infinite`;
            element.style.animationDelay = delay;
        });
        
        console.log(`✅ Floating animations setup for ${this.floatingElements.length} elements`);
    }

    setupHoverEffects() {
        // Efectos hover en botones
        const buttons = document.querySelectorAll('button, .btn, .action-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.addHoverEffect(button);
            });
            
            button.addEventListener('mouseleave', () => {
                this.removeHoverEffect(button);
            });
        });
        
        // Efectos hover en tarjetas
        const cards = document.querySelectorAll('.card, .apartment-detail-card, .model-detail');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addCardHoverEffect(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeCardHoverEffect(card);
            });
        });
        
        console.log(`✅ Hover effects setup for ${buttons.length} buttons and ${cards.length} cards`);
    }

    setupLoadingAnimations() {
        // Animación de carga para imágenes
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                this.addLoadingAnimation(img);
                img.addEventListener('load', () => {
                    this.removeLoadingAnimation(img);
                });
            }
        });
        
        console.log(`✅ Loading animations setup for ${images.length} images`);
    }

    animateElement(element) {
        const animationType = element.getAttribute('data-animation');
        const duration = element.getAttribute('data-duration') || '0.6s';
        const delay = element.getAttribute('data-delay') || '0s';
        
        if (!animationType) return;
        
        // Aplicar animación
        element.style.animation = `${animationType} ${duration} ease-out ${delay} forwards`;
        element.style.opacity = '1';
        
        // Remover del observer después de animar
        this.intersectionObserver.unobserve(element);
        
        console.log(`🎬 Animated element with ${animationType}`);
    }

    updateParallax() {
        const scrollY = window.scrollY;
        
        this.parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const yPos = -(scrollY * speed);
            
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    addHoverEffect(element) {
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.2s ease';
    }

    removeHoverEffect(element) {
        element.style.transform = 'scale(1)';
    }

    addCardHoverEffect(card) {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        card.style.transition = 'all 0.3s ease';
    }

    removeCardHoverEffect(card) {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
    }

    addLoadingAnimation(img) {
        img.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
        img.style.backgroundSize = '200px 100%';
        img.style.animation = 'shimmer 1.5s infinite';
    }

    removeLoadingAnimation(img) {
        img.style.background = '';
        img.style.animation = '';
    }

    // Animaciones programáticas
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    animateProgressBar(element, target, duration = 1000) {
        element.style.width = '0%';
        element.style.transition = `width ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.width = `${target}%`;
        }, 100);
    }

    animateScrollTo(element, offset = 0) {
        const targetPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Efectos especiales
    addPulseEffect(element, duration = 1000) {
        element.style.animation = `pulse ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    addShakeEffect(element, duration = 500) {
        const keyframes = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        
        element.style.animation = `shake ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    addFadeInEffect(element, duration = 500) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 100);
    }

    addSlideInEffect(element, direction = 'left', duration = 500) {
        const startTransform = direction === 'left' ? 'translateX(-100%)' : 
                              direction === 'right' ? 'translateX(100%)' :
                              direction === 'up' ? 'translateY(-100%)' : 'translateY(100%)';
        
        element.style.transform = startTransform;
        element.style.transition = `transform ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.transform = 'translate(0, 0)';
        }, 100);
    }

    // Métodos públicos para control externo
    animateSection(sectionId, animationType = 'fadeInUp') {
        const section = document.getElementById(sectionId);
        if (section) {
            section.setAttribute('data-animation', animationType);
            this.animateElement(section);
        }
    }

    animateStats() {
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach(stat => {
            const target = parseInt(stat.textContent);
            this.animateCounter(stat, target);
        });
    }

    animateScrollProgress() {
        const progressElement = document.getElementById('scrollProgress');
        if (progressElement) {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            this.animateProgressBar(progressElement, scrollPercent);
        }
    }

    pauseAnimations() {
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }

    resumeAnimations() {
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }

    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        // Limpiar event listeners
        window.removeEventListener('scroll', this.updateParallax);
        
        console.log('🗑️ AnimationController destroyed');
    }
}

// Export for global use
window.AnimationController = AnimationController;
