/**
 * NaturalLanguageParser - Parses natural language commands
 * Implements the current parsing logic from iris-bridge.js
 */
class NaturalLanguageParser {
    constructor() {
        this.name = 'NaturalLanguageParser';
        this.supportedLanguages = ['es', 'en'];
    }

    /**
     * Parse natural language text into command objects
     * @param {string} text - Natural language text
     * @returns {Object} Parsed command object
     */
    parse(text) {
        if (!text || typeof text !== 'string') {
            return null;
        }

        const normalizedText = text.toLowerCase().trim();
        console.log(`[IRIS-Parser] Parsing: "${text}"`);

        // Navigation commands
        const navigationCommand = this.parseNavigation(normalizedText);
        if (navigationCommand) {
            return navigationCommand;
        }

        // Video commands
        const videoCommand = this.parseVideo(normalizedText);
        if (videoCommand) {
            return videoCommand;
        }

        // Filter commands
        const filterCommand = this.parseFilter(normalizedText);
        if (filterCommand) {
            return filterCommand;
        }

        // Scroll commands
        const scrollCommand = this.parseScroll(normalizedText);
        if (scrollCommand) {
            return scrollCommand;
        }

        // Default: unknown command
        return {
            type: 'unknown',
            originalText: text,
            confidence: 0.1
        };
    }

    /**
     * Parse navigation commands
     * @param {string} text - Normalized text
     * @returns {Object|null} Navigation command or null
     */
    parseNavigation(text) {
        const navigationPatterns = [
            { pattern: /(ir a|navegar a|mostrar|ver)\s+(apartamentos?|casas?|equipamiento)/, action: 'goto', key: 'apartments' },
            { pattern: /(ir a|navegar a|mostrar|ver)\s+(casa|casas)/, action: 'goto', key: 'houses' },
            { pattern: /(ir a|navegar a|mostrar|ver)\s+(equipamiento|equipamientos)/, action: 'goto', key: 'equipment' },
            { pattern: /(ir a|navegar a|mostrar|ver)\s+(características|features)/, action: 'goto', key: 'features' },
            { pattern: /(ir a|navegar a|mostrar|ver)\s+(inicio|home)/, action: 'goto', key: 'home' }
        ];

        for (const pattern of navigationPatterns) {
            const match = text.match(pattern.pattern);
            if (match) {
                return {
                    type: 'navigation',
                    action: pattern.action,
                    key: pattern.key,
                    originalText: text,
                    confidence: 0.9,
                    area: 'navigation'
                };
            }
        }

        return null;
    }

    /**
     * Parse video commands
     * @param {string} text - Normalized text
     * @returns {Object|null} Video command or null
     */
    parseVideo(text) {
        const videoPatterns = [
            { pattern: /(reproducir|play|iniciar)\s+(video)/, action: 'play' },
            { pattern: /(pausar|pause|detener)\s+(video)/, action: 'pause' },
            { pattern: /(detener|stop)\s+(video)/, action: 'stop' },
            { pattern: /(siguiente|next)\s+(video)/, action: 'next' },
            { pattern: /(anterior|previous)\s+(video)/, action: 'previous' }
        ];

        for (const pattern of videoPatterns) {
            const match = text.match(pattern.pattern);
            if (match) {
                return {
                    type: 'video',
                    action: pattern.action,
                    originalText: text,
                    confidence: 0.8,
                    area: 'video'
                };
            }
        }

        return null;
    }

    /**
     * Parse filter commands
     * @param {string} text - Normalized text
     * @returns {Object|null} Filter command or null
     */
    parseFilter(text) {
        // Detectar comandos de filtro por dormitorios específicamente
        const bedroomPatterns = [
            { pattern: /(?:mostrar|filtrar|buscar|ver)\s+(?:un\s+)?(?:departamento|apartamento)\s+(?:de\s+)?(\d+)\s*(?:dormitorio|dormitorios|habitación|habitaciones)/, bedrooms: '$1' },
            { pattern: /(\d+)\s*(?:dormitorio|dormitorios|habitación|habitaciones)/, bedrooms: '$1' },
            { pattern: /(?:apartamento|departamento)\s+(?:de\s+)?(\d+)\s*(?:dormitorio|dormitorios)/, bedrooms: '$1' }
        ];

        // Detectar comandos de filtro por superficie
        const surfacePatterns = [
            { pattern: /(\d+)\s*-\s*(\d+)\s*m²/, superficie: '$1-$2 m²' },
            { pattern: /(?:superficie|área)\s+(?:de\s+)?(\d+)\s*-\s*(\d+)\s*m²/, superficie: '$1-$2 m²' }
        ];

        // Detectar comandos de filtro por precio
        const pricePatterns = [
            { pattern: /(\d+)\s*-\s*(\d+)\s*(?:mil\s+)?(?:uf|UF)/, precio: '$1-$2 UF' },
            { pattern: /(?:precio|valor)\s+(?:de\s+)?(\d+)\s*-\s*(\d+)\s*(?:mil\s+)?(?:uf|UF)/, precio: '$1-$2 UF' },
            { pattern: /(\d+)\s*-\s*(\d+)\s*(?:mil\s+)?(?:pesos|peso)/, precio: '$1-$2 pesos' }
        ];

        const filters = {};
        let hasFilters = false;

        // Procesar patrones de dormitorios
        for (const pattern of bedroomPatterns) {
            const match = text.match(pattern.pattern);
            if (match) {
                filters.bedrooms = parseInt(match[1]);
                hasFilters = true;
                break; // Solo tomar el primer match de dormitorios
            }
        }

        // Procesar patrones de superficie
        for (const pattern of surfacePatterns) {
            const match = text.match(pattern.pattern);
            if (match) {
                filters.superficie = `${match[1]}-${match[2]} m²`;
                hasFilters = true;
            }
        }

        // Procesar patrones de precio
        for (const pattern of pricePatterns) {
            const match = text.match(pattern.pattern);
            if (match) {
                filters.precio = `${match[1]}-${match[2]} UF`;
                hasFilters = true;
            }
        }

        if (hasFilters) {
            return {
                type: 'filter',
                action: 'apply',
                filters: filters,
                originalText: text,
                confidence: 0.9,
                area: 'filter'
            };
        }

        return null;
    }

    /**
     * Parse scroll commands
     * @param {string} text - Normalized text
     * @returns {Object|null} Scroll command or null
     */
    parseScroll(text) {
        const scrollPatterns = [
            { pattern: /(subir|arriba|up)/, direction: 'up' },
            { pattern: /(bajar|abajo|down)/, direction: 'down' },
            { pattern: /(scroll\s+to|ir\s+a)\s+(inicio|top)/, position: 'top' },
            { pattern: /(scroll\s+to|ir\s+a)\s+(final|bottom)/, position: 'bottom' }
        ];

        for (const pattern of scrollPatterns) {
            const match = text.match(pattern.pattern);
            if (match) {
                return {
                    type: 'scroll',
                    action: 'scrollTo',
                    direction: pattern.direction || null,
                    position: pattern.position || null,
                    originalText: text,
                    confidence: 0.7,
                    area: 'scroll'
                };
            }
        }

        return null;
    }

    /**
     * Extract apartment criteria from text
     * @param {string} text - Text to analyze
     * @returns {Object} Extracted criteria
     */
    extractApartmentCriteria(text) {
        const criteria = {};
        const normalizedText = text.toLowerCase();

        // Extract bedrooms
        const bedroomMatch = normalizedText.match(/(\d+)\s*dormitorio/);
        if (bedroomMatch) {
            criteria.dormitorios = bedroomMatch[1];
        }

        // Extract surface area
        const surfaceMatch = normalizedText.match(/(\d+)\s*-\s*(\d+)\s*m²/);
        if (surfaceMatch) {
            criteria.superficie = `${surfaceMatch[1]}-${surfaceMatch[2]} m²`;
        }

        // Extract price
        const priceMatch = normalizedText.match(/(\d+)\s*-\s*(\d+)\s*(uf|pesos)/);
        if (priceMatch) {
            criteria.precio = `${priceMatch[1]}-${priceMatch[2]} ${priceMatch[3]}`;
        }

        return criteria;
    }

    /**
     * Get parser information
     * @returns {Object} Parser information
     */
    getInfo() {
        return {
            name: this.name,
            supportedLanguages: this.supportedLanguages,
            capabilities: ['navigation', 'video', 'filter', 'scroll']
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NaturalLanguageParser;
} else {
    window.NaturalLanguageParser = NaturalLanguageParser;
}
