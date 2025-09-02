/**
 * Language System Configuration
 * Easy to customize settings for the language switcher
 */

window.LanguageConfig = {
    // Default language when no preference is detected
    defaultLanguage: 'es',
    
    // Supported languages configuration
    languages: {
        'es': {
            code: 'es',
            name: 'Español',
            flag: 'flag-cl.svg',
            region: 'Chile',
            locale: 'es-CL'
        },
        'en-au': {
            code: 'en-au',
            name: 'English',
            flag: 'flag-au.svg',
            region: 'Australia',
            locale: 'en-AU'
        },
        'en-us': {
            code: 'en-us',
            name: 'English',
            flag: 'flag-us.svg',
            region: 'USA',
            locale: 'en-US'
        }
    },
    
    // Language detection priority
    detectionPriority: [
        'localStorage',    // User's saved preference
        'urlParameter',    // URL ?lang= parameter
        'browserLanguage', // Browser language
        'default'          // Fallback to default
    ],
    
    // URL parameter name for language
    urlParameterName: 'lang',
    
    // LocalStorage key for language preference
    localStorageKey: 'preferred-language',
    
    // Auto-detect browser language mapping
    browserLanguageMapping: {
        'en-AU': 'en-au',
        'en-GB': 'en-au', // Map British English to Australian
        'en': 'en-us',    // Map generic English to US
        'es-CL': 'es',    // Map Chilean Spanish to Spanish
        'es': 'es'        // Map generic Spanish to Spanish
    },
    
    // Animation settings
    animations: {
        enabled: true,
        duration: 200,
        easing: 'ease'
    },
    
    // Debug mode
    debug: false,
    
    // Callback functions
    callbacks: {
        onLanguageChange: null,    // Called when language changes
        onLanguageDetected: null,  // Called when language is detected
        onTranslationLoaded: null, // Called when translations are loaded
        onError: null             // Called when an error occurs
    },
    
    // Custom selectors for translation
    selectors: {
        navigation: '.nav-link',
        hero: {
            title: '.hero-title, h1',
            subtitle: '.hero-subtitle, .hero p'
        },
        description: '.description-text, .description p',
        selector: '.selector-option',
        stats: '.stat-label',
        footer: {
            address: '.footer-address, .address',
            button: '.footer-button, .cta-button'
        }
    },
    
    // Translation file paths
    translationPaths: {
        'es': 'translations/es.json',
        'en-au': 'translations/en-au.json',
        'en-us': 'translations/en-us.json'
    },
    
    // Fallback language if translation fails
    fallbackLanguage: 'es',
    
    // Persist language preference
    persistPreference: true,
    
    // Update URL when language changes
    updateURL: true,
    
    // Show loading indicator during language change
    showLoadingIndicator: true,
    
    // Loading indicator settings
    loadingIndicator: {
        selector: '.language-loading',
        text: 'Cambiando idioma...',
        duration: 500
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.LanguageConfig;
}

