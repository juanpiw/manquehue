/**
 * Auto Type Assigner - Automatically assigns apartment types to existing cards
 * This script runs automatically when the page loads
 */

class AutoTypeAssigner {
    constructor() {
        this.typeGenerator = null;
        this.init();
    }

    /**
     * Initialize the auto assigner
     */
    init() {
        console.log('🏠 Auto Type Assigner initializing...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Setup the type generator and assign types
     */
    setup() {
        // Wait a bit for other scripts to load
        setTimeout(() => {
            this.assignTypesToExistingCards();
        }, 500);
    }

    /**
     * Assign types to all existing apartment cards
     */
    assignTypesToExistingCards() {
        console.log('🏠 Auto Type Assigner: Looking for apartment cards...');
        
        const cards = document.querySelectorAll('.apartment-card');
        console.log(`🏠 Found ${cards.length} apartment cards`);
        
        if (cards.length === 0) {
            console.log('🏠 No apartment cards found, waiting for dynamic content...');
            // If no cards found, try again later (for dynamic content)
            setTimeout(() => this.assignTypesToExistingCards(), 1000);
            return;
        }

        // Initialize type generator if not available
        if (!window.apartmentTypeGenerator && window.ApartmentTypeGenerator) {
            console.log('🏠 Initializing ApartmentTypeGenerator...');
            window.apartmentTypeGenerator = new window.ApartmentTypeGenerator();
        }

        if (!window.apartmentTypeGenerator) {
            console.warn('🏠 ApartmentTypeGenerator not available');
            return;
        }

        let processedCards = 0;
        
        cards.forEach((card, index) => {
            const typeInfo = this.getTypeFromCard(card);
            if (typeInfo) {
                // Add type attributes to the card
                card.setAttribute('data-apartment-type', typeInfo.code);
                card.setAttribute('data-apartment-name', typeInfo.name);
                card.setAttribute('data-apartment-description', typeInfo.description);
                
                // Add type attributes to buttons
                const buttons = card.querySelectorAll('.watchVideoBtn, .contactModelBtn');
                buttons.forEach(button => {
                    button.setAttribute('data-apartment-type', typeInfo.code);
                    button.setAttribute('data-apartment-name', typeInfo.name);
                });

                // Add visual type indicator
                this.addTypeIndicator(card, typeInfo);
                
                console.log(`🏠 Card ${index + 1}: ${typeInfo.name} (${typeInfo.code})`);
                processedCards++;
            } else {
                console.warn(`🏠 Could not determine type for card ${index + 1}`);
            }
        });

        console.log(`🏠 Auto Type Assigner: Processed ${processedCards} cards with types`);
        
        // Dispatch event to notify other components
        this.dispatchTypesAssignedEvent(processedCards);
    }

    /**
     * Get apartment type from card using the type generator
     */
    getTypeFromCard(card) {
        try {
            // Extract information from "Recorrer" button
            const recorrerButton = card.querySelector('.watchVideoBtn');
            if (!recorrerButton) {
                return null;
            }

            const dataApartment = recorrerButton.getAttribute('data-apartment');
            const dataSuperficie = recorrerButton.getAttribute('data-superficie');
            const dataPrecio = recorrerButton.getAttribute('data-precio');

            if (!dataApartment || !dataSuperficie || !dataPrecio) {
                return null;
            }

            // Extract number of bedrooms from text
            const bedroomMatch = dataApartment.match(/(\d+)/);
            if (!bedroomMatch) {
                return null;
            }

            const bedrooms = parseInt(bedroomMatch[1]);
            const criteria = {
                bedrooms,
                superficie: dataSuperficie,
                precio: dataPrecio
            };

            return window.apartmentTypeGenerator.generateType(criteria);
        } catch (error) {
            console.error('🏠 Error getting type from card:', error);
            return null;
        }
    }

    /**
     * Add visual type indicator to card
     */
    addTypeIndicator(card, typeInfo) {
        // Remove existing indicator if any
        const existingIndicator = card.querySelector('.auto-type-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Create type indicator
        const indicator = document.createElement('div');
        indicator.className = 'auto-type-indicator';
        
        // Set colors based on bedroom type
        const colors = {
            'A': '#ff6b6b', // Red for 1 bedroom
            'B': '#4ecdc4', // Turquoise for 2 bedrooms
            'C': '#45b7d1'  // Blue for 3 bedrooms
        };
        
        const bedroomCode = typeInfo.code.split('-')[0];
        const color = colors[bedroomCode] || '#ddd';
        
        indicator.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: ${color};
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            z-index: 10;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
        `;
        
        indicator.textContent = typeInfo.name;
        
        // Make card relative positioned if not already
        if (getComputedStyle(card).position === 'static') {
            card.style.position = 'relative';
        }
        
        card.appendChild(indicator);
    }

    /**
     * Dispatch event to notify other components
     */
    dispatchTypesAssignedEvent(processedCards) {
        const event = new CustomEvent('apartmentTypesAssigned', {
            detail: {
                processedCards,
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
        console.log('🏠 Dispatched apartmentTypesAssigned event');
    }

    /**
     * Watch for new cards being added dynamically
     */
    watchForNewCards() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the added node is an apartment card
                        if (node.classList && node.classList.contains('apartment-card')) {
                            console.log('🏠 New apartment card detected, assigning type...');
                            this.assignTypesToExistingCards();
                        }
                        
                        // Check if any apartment cards were added inside the node
                        const cards = node.querySelectorAll && node.querySelectorAll('.apartment-card');
                        if (cards && cards.length > 0) {
                            console.log(`🏠 ${cards.length} new apartment cards detected, assigning types...`);
                            this.assignTypesToExistingCards();
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('🏠 Auto Type Assigner: Watching for new apartment cards');
    }
}

// Auto-initialize when loaded
if (typeof window !== 'undefined') {
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.autoTypeAssigner = new AutoTypeAssigner();
        });
    } else {
        window.autoTypeAssigner = new AutoTypeAssigner();
    }
}

console.log('🏠 Auto Type Assigner loaded. Will automatically assign types to apartment cards.');
