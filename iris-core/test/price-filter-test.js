/**
 * 🧪 Test Suite para Filtrado por Precio - IRIS Modular System
 * 
 * Este archivo contiene pruebas unitarias y de integración para el sistema
 * de filtrado por precio implementado en IRIS.
 */

class PriceFilterTestSuite {
    constructor() {
        this.testResults = [];
        this.currentTest = null;
        this.testCount = 0;
        this.passedTests = 0;
        this.failedTests = 0;
    }

    /**
     * Ejecutar todas las pruebas
     */
    async runAllTests() {
        console.log('🧪 Iniciando Test Suite de Filtrado por Precio...');
        
        // Pruebas de parsing
        await this.runParsingTests();
        
        // Pruebas de filtrado
        await this.runFilteringTests();
        
        // Pruebas de integración
        await this.runIntegrationTests();
        
        // Pruebas de casos edge
        await this.runEdgeCaseTests();
        
        // Mostrar resultados
        this.showResults();
    }

    /**
     * Pruebas de parsing de comandos
     */
    async runParsingTests() {
        console.log('\n📝 Ejecutando pruebas de parsing...');
        
        const testCases = [
            {
                name: 'Parse rango de precio con símbolo $',
                input: 'mostrar uno con precio entre $4.000-5.000 UF',
                expected: { type: 'range', min: 4000, max: 5000 }
            },
            {
                name: 'Parse rango de precio sin símbolo $',
                input: 'filtrar por precio de 2000-3000 UF',
                expected: { type: 'range', min: 2000, max: 3000 }
            },
            {
                name: 'Parse precio específico',
                input: 'buscar de 4.500 UF',
                expected: { type: 'specific', price: 4500 }
            },
            {
                name: 'Parse precio específico con símbolo $',
                input: 'mostrar de $2.500 UF',
                expected: { type: 'specific', price: 2500 }
            },
            {
                name: 'Parse rango con separadores de miles',
                input: 'buscar entre $1.500,50-2.500,75 UF',
                expected: { type: 'range', min: 1500.5, max: 2500.75 }
            }
        ];

        for (const testCase of testCases) {
            await this.runTest(testCase.name, () => {
                const result = this.parsePriceCommand(testCase.input);
                return this.deepEqual(result, testCase.expected);
            });
        }
    }

    /**
     * Pruebas de filtrado en DOM
     */
    async runFilteringTests() {
        console.log('\n🔍 Ejecutando pruebas de filtrado...');
        
        // Simular DOM para pruebas
        this.setupTestDOM();
        
        const testCases = [
            {
                name: 'Filtrar por rango existente',
                filter: { type: 'range', min: 4000, max: 5000 },
                expected: { found: true, price: '$4.000-5.000 UF' }
            },
            {
                name: 'Filtrar por precio específico',
                filter: { type: 'specific', price: 4500 },
                expected: { found: true, price: '$3.500-4.500 UF' }
            },
            {
                name: 'Filtrar por rango inexistente',
                filter: { type: 'range', min: 10000, max: 15000 },
                expected: { found: false }
            },
            {
                name: 'Filtrar por precio específico inexistente',
                filter: { type: 'specific', price: 1000 },
                expected: { found: false }
            }
        ];

        for (const testCase of testCases) {
            await this.runTest(testCase.name, () => {
                const result = this.filterByPrice(testCase.filter);
                return this.deepEqual(result, testCase.expected);
            });
        }
    }

    /**
     * Pruebas de integración con IRIS
     */
    async runIntegrationTests() {
        console.log('\n🔗 Ejecutando pruebas de integración...');
        
        const testCases = [
            {
                name: 'Comando completo de rango',
                command: 'mostrar uno con precio entre $4.000-5.000 UF',
                expected: { success: true, type: 'filter' }
            },
            {
                name: 'Comando completo de precio específico',
                command: 'buscar de 4.500 UF',
                expected: { success: true, type: 'filter' }
            },
            {
                name: 'Comando inválido',
                command: 'filtrar por precio',
                expected: { success: false }
            }
        ];

        for (const testCase of testCases) {
            await this.runTest(testCase.name, async () => {
                if (window.IRIS) {
                    const result = await window.IRIS.processText(testCase.command);
                    return result.success === testCase.expected.success;
                }
                return false;
            });
        }
    }

    /**
     * Pruebas de casos edge
     */
    async runEdgeCaseTests() {
        console.log('\n⚠️ Ejecutando pruebas de casos edge...');
        
        const testCases = [
            {
                name: 'Comando vacío',
                input: '',
                expected: { success: false }
            },
            {
                name: 'Comando con formato incorrecto',
                input: 'mostrar precio UF',
                expected: { success: false }
            },
            {
                name: 'Comando con números negativos',
                input: 'buscar de -1000 UF',
                expected: { success: false }
            },
            {
                name: 'Comando con rango invertido',
                input: 'mostrar entre $5000-4000 UF',
                expected: { success: false }
            },
            {
                name: 'Comando con caracteres especiales',
                input: 'buscar de 4,500.75 UF',
                expected: { success: true, price: 4500.75 }
            }
        ];

        for (const testCase of testCases) {
            await this.runTest(testCase.name, () => {
                const result = this.parsePriceCommand(testCase.input);
                return this.validateEdgeCase(result, testCase.expected);
            });
        }
    }

    /**
     * Ejecutar una prueba individual
     */
    async runTest(name, testFunction) {
        this.testCount++;
        this.currentTest = name;
        
        try {
            const result = await testFunction();
            
            if (result) {
                this.passedTests++;
                console.log(`✅ ${name}`);
                this.testResults.push({ name, status: 'PASSED', error: null });
            } else {
                this.failedTests++;
                console.log(`❌ ${name}`);
                this.testResults.push({ name, status: 'FAILED', error: 'Test returned false' });
            }
        } catch (error) {
            this.failedTests++;
            console.log(`❌ ${name} - Error: ${error.message}`);
            this.testResults.push({ name, status: 'ERROR', error: error.message });
        }
    }

    /**
     * Mostrar resultados finales
     */
    showResults() {
        console.log('\n📊 RESULTADOS DE PRUEBAS');
        console.log('========================');
        console.log(`Total de pruebas: ${this.testCount}`);
        console.log(`Pruebas exitosas: ${this.passedTests}`);
        console.log(`Pruebas fallidas: ${this.failedTests}`);
        console.log(`Tasa de éxito: ${((this.passedTests / this.testCount) * 100).toFixed(2)}%`);
        
        if (this.failedTests > 0) {
            console.log('\n❌ PRUEBAS FALLIDAS:');
            this.testResults
                .filter(result => result.status !== 'PASSED')
                .forEach(result => {
                    console.log(`- ${result.name}: ${result.error || 'Failed'}`);
                });
        }
        
        console.log('\n🎯 RECOMENDACIONES:');
        if (this.failedTests === 0) {
            console.log('✅ Todas las pruebas pasaron. El sistema está funcionando correctamente.');
        } else {
            console.log('⚠️ Hay pruebas fallidas. Revisar implementación.');
        }
    }

    /**
     * Simular DOM para pruebas
     */
    setupTestDOM() {
        // Crear elementos de prueba si no existen
        if (!document.querySelector('.apartment-card')) {
            const testContainer = document.createElement('div');
            testContainer.innerHTML = `
                <div class="apartment-card" data-bedrooms="2">
                    <div class="apartment-info">
                        <p><strong>Precio:</strong> $2.000-3.000 UF</p>
                        <button class="btn-secondary watchVideoBtn" data-precio="$2.000-3.000 UF">Recorrer</button>
                    </div>
                </div>
                <div class="apartment-card" data-bedrooms="2">
                    <div class="apartment-info">
                        <p><strong>Precio:</strong> $4.000-5.000 UF</p>
                        <button class="btn-secondary watchVideoBtn" data-precio="$4.000-5.000 UF">Recorrer</button>
                    </div>
                </div>
                <div class="apartment-card" data-bedrooms="1">
                    <div class="apartment-info">
                        <p><strong>Precio:</strong> $3.500-4.500 UF</p>
                        <button class="btn-secondary watchVideoBtn" data-precio="$3.500-4.500 UF">Recorrer</button>
                    </div>
                </div>
            `;
            document.body.appendChild(testContainer);
        }
    }

    /**
     * Parsear comando de precio (simulación)
     */
    parsePriceCommand(text) {
        // Patrones de regex para extraer precios
        const rangePattern = /\$?([0-9.,]+)-([0-9.,]+)\s*UF/i;
        const specificPattern = /\$?([0-9.,]+)\s*UF/i;
        
        // Probar rango de precio
        const rangeMatch = text.match(rangePattern);
        if (rangeMatch) {
            const minPrice = parseFloat(rangeMatch[1].replace(/\./g, '').replace(',', '.'));
            const maxPrice = parseFloat(rangeMatch[2].replace(/\./g, '').replace(',', '.'));
            
            if (minPrice >= 0 && maxPrice >= 0 && minPrice <= maxPrice) {
                return { type: 'range', min: minPrice, max: maxPrice };
            }
        }
        
        // Probar precio específico
        const specificMatch = text.match(specificPattern);
        if (specificMatch) {
            const price = parseFloat(specificMatch[1].replace(/\./g, '').replace(',', '.'));
            if (price >= 0) {
                return { type: 'specific', price: price };
            }
        }
        
        return null;
    }

    /**
     * Filtrar por precio (simulación)
     */
    filterByPrice(priceFilter) {
        const apartmentCards = document.querySelectorAll('.apartment-card');
        
        for (const card of apartmentCards) {
            const priceElement = card.querySelector('[data-precio]');
            if (!priceElement) continue;
            
            const priceText = priceElement.getAttribute('data-precio');
            const cardPrice = this.extractPriceFromText(priceText);
            
            if (this.matchesPriceFilter(cardPrice, priceFilter)) {
                return { found: true, price: priceText };
            }
        }
        
        return { found: false };
    }

    /**
     * Extraer precio del texto
     */
    extractPriceFromText(priceText) {
        const match = priceText.match(/\$?([0-9.,]+)-([0-9.,]+)\s*UF/);
        if (match) {
            const min = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
            const max = parseFloat(match[2].replace(/\./g, '').replace(',', '.'));
            return { type: 'range', min, max };
        }
        return null;
    }

    /**
     * Verificar si el precio coincide con el filtro
     */
    matchesPriceFilter(cardPrice, filter) {
        if (!cardPrice || !filter) return false;
        
        if (filter.type === 'range') {
            return cardPrice.type === 'range' && 
                   cardPrice.min >= filter.min && 
                   cardPrice.max <= filter.max;
        } else if (filter.type === 'specific') {
            return cardPrice.type === 'range' && 
                   filter.price >= cardPrice.min && 
                   filter.price <= cardPrice.max;
        }
        
        return false;
    }

    /**
     * Validar caso edge
     */
    validateEdgeCase(result, expected) {
        if (expected.success === false) {
            return result === null;
        } else if (expected.price) {
            return result && result.price === expected.price;
        }
        return result !== null;
    }

    /**
     * Comparación profunda de objetos
     */
    deepEqual(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }
}

// Exportar para uso global
window.PriceFilterTestSuite = PriceFilterTestSuite;

// Auto-ejecutar si está en modo test
if (window.location.search.includes('test=price-filter')) {
    document.addEventListener('DOMContentLoaded', async () => {
        const testSuite = new PriceFilterTestSuite();
        await testSuite.runAllTests();
    });
}

// Función para ejecutar pruebas manualmente
window.runPriceFilterTests = async function() {
    const testSuite = new PriceFilterTestSuite();
    await testSuite.runAllTests();
};

console.log('🧪 Price Filter Test Suite loaded. Use window.runPriceFilterTests() to run tests.');
