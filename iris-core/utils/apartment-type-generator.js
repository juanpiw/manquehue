/**
 * Apartment Type Generator - Generates unique identifiers for apartment combinations
 * Based on bedrooms, surface area, and price ranges
 */

class ApartmentTypeGenerator {
    constructor() {
        // Mapeo de dormitorios a códigos
        this.bedroomCodes = {
            1: 'A',
            2: 'B', 
            3: 'C'
        };

        // Mapeo de superficies a códigos
        this.surfaceCodes = {
            '40-60 m²': 'S',
            '80-100 m²': 'M',
            '120-140 m²': 'L'
        };

        // Mapeo de precios a códigos
        this.priceCodes = {
            '$1.500-2.500 UF': '1',
            '$2.000-3.000 UF': '2',
            '$3.500-4.500 UF': '3',
            '$4.000-5.000 UF': '4',
            '$5.000-6.000 UF': '5'
        };

        // Tipos predefinidos para acceso rápido
        this.predefinedTypes = {
            // 1 Dormitorio
            'A-S-1': { bedrooms: 1, superficie: '40-60 m²', precio: '$1.500-2.500 UF', name: 'Tipo A1' },
            'A-S-2': { bedrooms: 1, superficie: '40-60 m²', precio: '$2.000-3.000 UF', name: 'Tipo A2' },
            'A-S-3': { bedrooms: 1, superficie: '40-60 m²', precio: '$3.500-4.500 UF', name: 'Tipo A3' },
            'A-S-4': { bedrooms: 1, superficie: '40-60 m²', precio: '$4.000-5.000 UF', name: 'Tipo A4' },
            'A-M-2': { bedrooms: 1, superficie: '80-100 m²', precio: '$2.000-3.000 UF', name: 'Tipo A5' },
            'A-M-4': { bedrooms: 1, superficie: '80-100 m²', precio: '$4.000-5.000 UF', name: 'Tipo A6' },
            
            // 2 Dormitorios
            'B-S-2': { bedrooms: 2, superficie: '40-60 m²', precio: '$2.000-3.000 UF', name: 'Tipo B1' },
            'B-S-4': { bedrooms: 2, superficie: '40-60 m²', precio: '$4.000-5.000 UF', name: 'Tipo B2' },
            'B-M-2': { bedrooms: 2, superficie: '80-100 m²', precio: '$2.000-3.000 UF', name: 'Tipo B3' },
            'B-M-4': { bedrooms: 2, superficie: '80-100 m²', precio: '$4.000-5.000 UF', name: 'Tipo B4' },
            
            // 3 Dormitorios
            'C-S-3': { bedrooms: 3, superficie: '40-60 m²', precio: '$3.500-4.500 UF', name: 'Tipo C1' },
            'C-S-4': { bedrooms: 3, superficie: '40-60 m²', precio: '$4.000-5.000 UF', name: 'Tipo C2' },
            'C-M-4': { bedrooms: 3, superficie: '80-100 m²', precio: '$4.000-5.000 UF', name: 'Tipo C3' },
            'C-L-5': { bedrooms: 3, superficie: '120-140 m²', precio: '$5.000-6.000 UF', name: 'Tipo C4' }
        };
    }

    /**
     * Generate apartment type from criteria
     * @param {Object} criteria - Apartment criteria
     * @returns {Object} Type information
     */
    generateType(criteria) {
        const { bedrooms, superficie, precio } = criteria;
        
        // Validar que tengamos todos los datos necesarios
        if (!bedrooms || !superficie || !precio) {
            console.warn('[TypeGenerator] Missing criteria for type generation:', criteria);
            return null;
        }

        // Generar código único
        const bedroomCode = this.bedroomCodes[bedrooms];
        const surfaceCode = this.surfaceCodes[superficie];
        const priceCode = this.priceCodes[precio];

        if (!bedroomCode || !surfaceCode || !priceCode) {
            console.warn('[TypeGenerator] Invalid criteria for type generation:', { bedrooms, superficie, precio });
            return null;
        }

        const typeCode = `${bedroomCode}-${surfaceCode}-${priceCode}`;
        const predefinedType = this.predefinedTypes[typeCode];

        if (predefinedType) {
            return {
                code: typeCode,
                name: predefinedType.name,
                criteria: predefinedType,
                description: this.generateDescription(predefinedType)
            };
        } else {
            // Tipo dinámico si no está predefinido
            return {
                code: typeCode,
                name: `Tipo ${typeCode}`,
                criteria: { bedrooms, superficie, precio },
                description: this.generateDescription({ bedrooms, superficie, precio })
            };
        }
    }

    /**
     * Generate description for apartment type
     * @param {Object} criteria - Apartment criteria
     * @returns {string} Description
     */
    generateDescription(criteria) {
        const { bedrooms, superficie, precio } = criteria;
        return `${bedrooms} dormitorio${bedrooms > 1 ? 's' : ''}, ${superficie}, ${precio}`;
    }

    /**
     * Get apartment type from DOM element
     * @param {HTMLElement} card - Apartment card element
     * @returns {Object|null} Type information
     */
    getTypeFromCard(card) {
        try {
            // Extraer información del botón "Recorrer"
            const recorrerButton = card.querySelector('.watchVideoBtn');
            if (!recorrerButton) {
                console.warn('[TypeGenerator] No recorrer button found in card');
                return null;
            }

            const dataApartment = recorrerButton.getAttribute('data-apartment');
            const dataSuperficie = recorrerButton.getAttribute('data-superficie');
            const dataPrecio = recorrerButton.getAttribute('data-precio');

            if (!dataApartment || !dataSuperficie || !dataPrecio) {
                console.warn('[TypeGenerator] Missing data attributes in card');
                return null;
            }

            // Extraer número de dormitorios del texto
            const bedroomMatch = dataApartment.match(/(\d+)/);
            if (!bedroomMatch) {
                console.warn('[TypeGenerator] Could not extract bedrooms from:', dataApartment);
                return null;
            }

            const bedrooms = parseInt(bedroomMatch[1]);
            const criteria = {
                bedrooms,
                superficie: dataSuperficie,
                precio: dataPrecio
            };

            return this.generateType(criteria);
        } catch (error) {
            console.error('[TypeGenerator] Error getting type from card:', error);
            return null;
        }
    }

    /**
     * Add type attributes to all apartment cards
     */
    addTypesToCards() {
        console.log('[TypeGenerator] Adding types to apartment cards...');
        
        const cards = document.querySelectorAll('.apartment-card');
        let processedCards = 0;

        cards.forEach((card, index) => {
            const typeInfo = this.getTypeFromCard(card);
            if (typeInfo) {
                // Agregar atributos de tipo a la tarjeta
                card.setAttribute('data-apartment-type', typeInfo.code);
                card.setAttribute('data-apartment-name', typeInfo.name);
                card.setAttribute('data-apartment-description', typeInfo.description);
                
                // Agregar atributos de tipo a los botones
                const buttons = card.querySelectorAll('.watchVideoBtn, .contactModelBtn');
                buttons.forEach(button => {
                    button.setAttribute('data-apartment-type', typeInfo.code);
                    button.setAttribute('data-apartment-name', typeInfo.name);
                });

                console.log(`[TypeGenerator] Card ${index + 1}: ${typeInfo.name} (${typeInfo.code})`);
                processedCards++;
            } else {
                console.warn(`[TypeGenerator] Could not determine type for card ${index + 1}`);
            }
        });

        console.log(`[TypeGenerator] Processed ${processedCards} cards with types`);
        return processedCards;
    }

    /**
     * Find cards by type criteria
     * @param {Object} criteria - Search criteria
     * @returns {Array} Matching cards
     */
    findCardsByType(criteria) {
        const typeInfo = this.generateType(criteria);
        if (!typeInfo) {
            console.warn('[TypeGenerator] Could not generate type for criteria:', criteria);
            return [];
        }

        const cards = document.querySelectorAll(`[data-apartment-type="${typeInfo.code}"]`);
        console.log(`[TypeGenerator] Found ${cards.length} cards of type ${typeInfo.name}`);
        return Array.from(cards);
    }

    /**
     * Get all available types
     * @returns {Array} All type information
     */
    getAllTypes() {
        return Object.entries(this.predefinedTypes).map(([code, criteria]) => ({
            code,
            name: this.generateType(criteria).name,
            criteria,
            description: this.generateDescription(criteria)
        }));
    }

    /**
     * Get type by code
     * @param {string} code - Type code
     * @returns {Object|null} Type information
     */
    getTypeByCode(code) {
        const criteria = this.predefinedTypes[code];
        if (criteria) {
            return this.generateType(criteria);
        }
        return null;
    }

    /**
     * Get type by name
     * @param {string} name - Type name
     * @returns {Object|null} Type information
     */
    getTypeByName(name) {
        for (const [code, criteria] of Object.entries(this.predefinedTypes)) {
            const typeInfo = this.generateType(criteria);
            if (typeInfo.name === name) {
                return typeInfo;
            }
        }
        return null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApartmentTypeGenerator;
} else {
    window.ApartmentTypeGenerator = ApartmentTypeGenerator;
}

// Auto-initialize when loaded
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        if (window.apartmentTypeGenerator) {
            console.log('[TypeGenerator] Auto-adding types to cards...');
            window.apartmentTypeGenerator.addTypesToCards();
        }
    });
}

console.log('🏠 Apartment Type Generator loaded. Use window.apartmentTypeGenerator to access.');
