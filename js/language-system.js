/**
 * Sistema de Idiomas para Mirador del Golf - Funciona Offline
 * Soporta: Español (Chile), Inglés (Australia), Inglés (USA)
 */

class LanguageSystem {
    constructor() {
        this.currentLanguage = 'es';
        this.translations = {
            'es': {
                nav: {
                    home: 'INICIO',
                    apartments: 'APARTAMENTOS',
                    features: 'CARACTERÍSTICAS',
                    contact: 'CONTACTO'
                },
                hero: {
                    title: 'Mirador del Golf',
                    subtitle: 'Exclusivas casas y departamentos en Piedra Roja'
                },
                description: {
                    text: 'Exclusivas casas y departamentos ubicados en el sector más privilegiado de Piedra Roja, dentro del Club de Golf Hacienda Chicureo Club. Diseñado para aprovechar al máximo las vistas hacia el Valle de Chicureo y el cajón cordillerano gracias a sus amplios ventanales de piso a cielo. Es un proyecto versátil, que invita a compartir y a disfrutar de sus amplios espacios integrados y amplias terrazas. El proyecto ofrece las opciones de elegir un gran jardín privado, salidas exclusivas al parque o azoteas.'
                },
                selector: {
                    apartment: 'Apartamento',
                    house: 'Casa'
                },
                stats: {
                    metro: 'Minutos del metro',
                    golf: 'Minutos del golf',
                    shopping: 'Minutos del shopping'
                },
                heroButton: 'Recorrer Proyecto',
                audioError: 'Error al cargar audio',
                // Nuevas traducciones para todas las secciones
                projectSelector: {
                    manquehue: {
                        title: 'Manquehue',
                        subtitle: 'Proyecto principal'
                    },
                    altos: {
                        title: 'Altos de Manquehue',
                        subtitle: 'Nuevo desarrollo'
                    }
                },
                statsSection: {
                    apartments: 'Apartamentos',
                    apartmentTypes: 'Tipos de Dpto',
                    soldPercentage: '% Vendidos',
                    delivery: 'Entrega'
                }
            },
            'en-us': {
                nav: {
                    home: 'HOME',
                    apartments: 'APARTMENTS',
                    features: 'FEATURES',
                    contact: 'CONTACT'
                },
                hero: {
                    title: 'Mirador del Golf',
                    subtitle: 'Exclusive houses and apartments in Piedra Roja'
                },
                description: {
                    text: 'Exclusive houses and apartments located in the most privileged sector of Piedra Roja, within the Hacienda Chicureo Golf Club. Designed to maximize the views towards the Chicureo Valley and the mountain range thanks to its floor-to-ceiling windows. It is a versatile project that invites sharing and enjoying its integrated spaces and large terraces. The project offers the option to choose a large private garden, exclusive exits to the park or rooftops.'
                },
                selector: {
                    apartment: 'Apartment',
                    house: 'House'
                },
                stats: {
                    metro: 'Minutes to metro',
                    golf: 'Minutes to golf',
                    shopping: 'Minutes to shopping'
                },
                heroButton: 'Explore Project',
                audioError: 'Error loading audio',
                // Nuevas traducciones para todas las secciones
                projectSelector: {
                    manquehue: {
                        title: 'Manquehue',
                        subtitle: 'Main project'
                    },
                    altos: {
                        title: 'Altos de Manquehue',
                        subtitle: 'New development'
                    }
                },
                statsSection: {
                    apartments: 'Apartments',
                    apartmentTypes: 'Apartment Types',
                    soldPercentage: '% Sold',
                    delivery: 'Delivery'
                }
            },
            'en-au': {
                nav: {
                    home: 'HOME',
                    apartments: 'APARTMENTS',
                    features: 'FEATURES',
                    contact: 'CONTACT'
                },
                hero: {
                    title: 'Mirador del Golf',
                    subtitle: 'Exclusive houses and apartments in Piedra Roja'
                },
                description: {
                    text: 'Exclusive houses and apartments located in the most privileged sector of Piedra Roja, within the Hacienda Chicureo Golf Club. Designed to maximise the views towards the Chicureo Valley and the mountain range thanks to its floor-to-ceiling windows. It is a versatile project that invites sharing and enjoying its integrated spaces and large terraces. The project offers the option to choose a large private garden, exclusive exits to the park or rooftops.'
                },
                selector: {
                    apartment: 'Apartment',
                    house: 'House'
                },
                stats: {
                    metro: 'Minutes to metro',
                    golf: 'Minutes to golf',
                    shopping: 'Minutes to shopping'
                },
                heroButton: 'Explore Project',
                audioError: 'Error loading audio',
                // Nuevas traducciones para todas las secciones
                projectSelector: {
                    manquehue: {
                        title: 'Manquehue',
                        subtitle: 'Main project'
                    },
                    altos: {
                        title: 'Altos de Manquehue',
                        subtitle: 'New development'
                    }
                },
                statsSection: {
                    apartments: 'Apartments',
                    apartmentTypes: 'Apartment Types',
                    soldPercentage: '% Sold',
                    delivery: 'Delivery'
                }
            }
        };
        
        this.supportedLanguages = {
            'es': { code: 'es', name: 'Español', flag: 'flag-es.svg', region: 'España' },
            'en-au': { code: 'en-au', name: 'English', flag: 'flag-au.svg', region: 'Australia' },
            'en-us': { code: 'en-us', name: 'English', flag: 'flag-us.svg', region: 'USA' }
        };
        
        this.init();
    }

    init() {
        console.log('Sistema de idiomas inicializando...');
        this.detectLanguage();
        this.setupLanguageSwitcher();
        this.applyLanguage(this.currentLanguage);
        try {
            const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
            const all = Array.isArray(navigator.languages) ? navigator.languages.join(',') : 'n/a';
            console.log('[LangSys] Browser:', navLang, 'all=', all, 'current=', this.currentLanguage);
            const doubleClickLang = (langCode, tag) => {
                const clickFn = (label) => {
                    const btn = document.querySelector(`.lang-btn[data-lang="${langCode}"]`);
                    console.log(`[LangSys] ${langCode} btn present?`, !!btn, 'label=', label);
                    if (btn) {
                        console.log('[LangSys] Auto-click', langCode, label);
                        btn.click();
                    }
                };
                // doble click inmediato
                clickFn(`#1 ${tag}`);
                setTimeout(() => clickFn(`#2 ${tag}`), 80);
                // doble click después del load
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        clickFn(`#3 after load ${tag}`);
                        setTimeout(() => clickFn(`#4 after load ${tag}`), 80);
                    }, 0);
                });
            };

            if (navLang.startsWith('en')) {
                doubleClickLang('en-us', '(en)');
            } else if (navLang.startsWith('es')) {
                doubleClickLang('es', '(es)');
            }
        } catch (e) {
            console.warn('[LangSys] Auto-en click failed', e);
        }
        // Re-aplicar idioma al final de la carga para evitar "rebote" por otros scripts
        try {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    console.log('[LangSys] Re-applying language after load to prevent fallback:', this.currentLanguage);
                    this.applyLanguage(this.currentLanguage);
                }, 0);
            });
        } catch {}

        console.log('Sistema de idiomas listo');
    }

    detectLanguage() {
        // Verificar localStorage primero
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && this.supportedLanguages[savedLang]) {
            this.currentLanguage = savedLang;
            return;
        }

        // Verificar parámetro de URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.supportedLanguages[urlLang]) {
            this.currentLanguage = urlLang;
            return;
        }

        // Detectar idioma del navegador
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('en-AU')) {
            this.currentLanguage = 'en-au';
        } else if (browserLang.startsWith('en')) {
            this.currentLanguage = 'en-us';
        } else {
            this.currentLanguage = 'es'; // Por defecto español
        }
    }

    setupLanguageSwitcher() {
        console.log('Configurando selector de idiomas...');
        const navContainer = document.querySelector('.preview-navigation.centered');
        console.log('Contenedor de navegación encontrado:', navContainer);
        
        if (!navContainer) {
            console.warn('Contenedor de navegación no encontrado');
            return;
        }

        // Crear selector de idiomas
        const langSwitcher = document.createElement('div');
        langSwitcher.className = 'nav-lang-switcher';
        langSwitcher.innerHTML = this.createLanguageSwitcherHTML();
        console.log('HTML del selector de idiomas creado');

        // Insertar después de nav-underline
        const innerNavContainer = navContainer.querySelector('.nav-container');
        if (innerNavContainer) {
            const navUnderline = innerNavContainer.querySelector('.nav-underline');
            if (navUnderline) {
                innerNavContainer.insertBefore(langSwitcher, navUnderline.nextSibling);
                console.log('Selector de idiomas insertado después de nav-underline');
            } else {
                innerNavContainer.appendChild(langSwitcher);
                console.log('Selector de idiomas agregado al final del contenedor interno');
            }
        } else {
            navContainer.appendChild(langSwitcher);
            console.log('Selector de idiomas agregado al contenedor externo');
        }

        // Agregar eventos
        this.addLanguageSwitcherEvents();
        console.log('Configuración del selector de idiomas completa');
    }

    createLanguageSwitcherHTML() {
        return `
            <div class="language-switcher">
                ${Object.entries(this.supportedLanguages).map(([code, lang]) => `
                    <button 
                        class="lang-btn ${code === this.currentLanguage ? 'active' : ''}" 
                        data-lang="${code}"
                        title="${lang.name} (${lang.region})"
                    >
                        <img src="assets/icons/${lang.flag}" alt="${lang.name}" class="flag-icon">
                        <span class="lang-code">${code === 'es' ? 'ES' : code.toUpperCase()}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    addLanguageSwitcherEvents() {
        const langButtons = document.querySelectorAll('.lang-btn');
        console.log('Botones de idioma encontrados:', langButtons.length);
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                console.log('Botón de idioma clickeado:', lang);
                this.changeLanguage(lang);
            });
        });
    }

    changeLanguage(langCode) {
        if (!this.supportedLanguages[langCode]) return;

        console.log('Cambiando idioma a:', langCode);
        this.currentLanguage = langCode;
        localStorage.setItem('preferred-language', langCode);

        // Actualizar estado activo en el selector
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === langCode);
        });

        // Aplicar nuevo idioma
        this.applyLanguage(langCode);

        // Actualizar URL sin recargar
        const url = new URL(window.location);
        url.searchParams.set('lang', langCode);
        window.history.replaceState({}, '', url);
    }

    applyLanguage(langCode) {
        const translations = this.translations[langCode];
        if (!translations) {
            console.warn('No se encontraron traducciones para:', langCode);
            return;
        }

        console.log('Aplicando idioma:', langCode);

        // Traducir navegación
        this.translateNavigation(translations.nav);
        
        // Traducir contenido
        this.translateContent(translations);
        
        // Actualizar idioma del documento
        document.documentElement.lang = langCode;
        
        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: langCode } 
        }));
    }

    translateNavigation(navTranslations) {
        if (!navTranslations) return;

        const navItems = document.querySelectorAll('.nav-link');
        navItems.forEach((item, index) => {
            const keys = ['home', 'apartments', 'features', 'contact'];
            if (keys[index] && navTranslations[keys[index]]) {
                item.textContent = navTranslations[keys[index]];
            }
        });
    }

    translateContent(translations) {
        // Traducir título del héroe
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && translations.hero?.title) {
            heroTitle.textContent = translations.hero.title;
        }

        // Traducir descripción
        const descriptionText = document.querySelector('.description-text');
        if (descriptionText && translations.description?.text) {
            descriptionText.textContent = translations.description.text;
        }

        // Traducir selector (Apartamento/Casa)
        const selectorOptions = document.querySelectorAll('.radio-label[data-lang-key]');
        if (selectorOptions.length > 0 && translations.selector) {
            selectorOptions.forEach((option) => {
                const langKey = option.getAttribute('data-lang-key');
                if (langKey && translations.selector[langKey]) {
                    option.textContent = translations.selector[langKey];
                }
            });
        }

        // Traducir botón del héroe
        const heroButton = document.querySelector('.hero-recorrer-btn');
        if (heroButton && translations.heroButton) {
            heroButton.textContent = translations.heroButton;
        }

        // Traducir etiquetas de estadísticas del héroe
        const statLabels = document.querySelectorAll('.stat-label');
        if (statLabels.length > 0 && translations.stats) {
            statLabels.forEach((label, index) => {
                const keys = ['metro', 'golf', 'shopping'];
                if (keys[index] && translations.stats[keys[index]]) {
                    label.textContent = translations.stats[keys[index]];
                }
            });
        }

        // Traducir mensaje de error de audio
        const audioStatus = document.querySelector('.audio-status');
        if (audioStatus && translations.audioError) {
            audioStatus.textContent = translations.audioError;
        }

        // NUEVO: Traducir selector de proyectos (Manquehue/Altos)
        this.translateProjectSelector(translations.projectSelector);

        // NUEVO: Traducir sección de estadísticas
        this.translateStatsSection(translations.statsSection);
    }

    translateProjectSelector(projectTranslations) {
        if (!projectTranslations) return;

        // Traducir Manquehue
        const manquehueTitle = document.querySelector('[data-project="manquehue"] h3');
        const manquehueSubtitle = document.querySelector('[data-project="manquehue"] p');
        if (manquehueTitle && projectTranslations.manquehue?.title) {
            manquehueTitle.textContent = projectTranslations.manquehue.title;
        }
        if (manquehueSubtitle && projectTranslations.manquehue?.subtitle) {
            manquehueSubtitle.textContent = projectTranslations.manquehue.subtitle;
        }

        // Traducir Altos de Manquehue
        const altosTitle = document.querySelector('[data-project="altos"] h3');
        const altosSubtitle = document.querySelector('[data-project="altos"] p');
        if (altosTitle && projectTranslations.altos?.title) {
            altosTitle.textContent = projectTranslations.altos.title;
        }
        if (altosSubtitle && projectTranslations.altos?.subtitle) {
            altosSubtitle.textContent = projectTranslations.altos.subtitle;
        }
    }

    translateStatsSection(statsTranslations) {
        if (!statsTranslations) return;

        // Buscar todas las etiquetas de estadísticas en la sección de stats
        const statsLabels = document.querySelectorAll('.stats-section .stat-label');
        if (statsLabels.length > 0) {
            statsLabels.forEach((label) => {
                const text = label.textContent.trim();
                
                // Mapear texto español a traducciones
                if (text === 'Apartamentos' && statsTranslations.apartments) {
                    label.textContent = statsTranslations.apartments;
                } else if (text === 'Tipos de Dpto' && statsTranslations.apartmentTypes) {
                    label.textContent = statsTranslations.apartmentTypes;
                } else if (text === '% Vendidos' && statsTranslations.soldPercentage) {
                    label.textContent = statsTranslations.soldPercentage;
                } else if (text === 'Entrega' && statsTranslations.delivery) {
                    label.textContent = statsTranslations.delivery;
                }
            });
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return this.supportedLanguages;
    }
}

// Inicializar sistema de idiomas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando sistema de idiomas...');
    window.languageSystem = new LanguageSystem();
});

// Exportar para uso en otros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSystem;
}
