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

        // Recorrido commands (check before filter commands)
        const recorridoCommand = this.parseRecorrido(normalizedText);
        if (recorridoCommand) {
            return recorridoCommand;
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
     * Parse recorrido commands
     * @param {string} text - Normalized text
     * @returns {Object|null} Recorrido command or null
     */
    parseRecorrido(text) {
        console.log(`🔍 [Parser] Iniciando parseRecorrido con texto: "${text}"`);
        
        // Procesar patrones de salir del recorrido
        const exitRecorridoPatterns = [
            { pattern: /(?:salir|salir\s+de)\s+(?:el\s+)?(?:recorrido|modo\s+recorrido)/, action: 'exit_recorrido' },
            { pattern: /(?:terminar|finalizar|acabar)\s+(?:el\s+)?(?:recorrido)/, action: 'exit_recorrido' },
            { pattern: /(?:volver|regresar)\s+(?:a\s+)?(?:la\s+)?(?:vista\s+normal|lista\s+normal)/, action: 'exit_recorrido' },
            { pattern: /(?:salir|salir\s+de)\s+(?:modo\s+recorrido)/, action: 'exit_recorrido' },
            { pattern: /(?:exit|salir)\s+(?:recorrido)/, action: 'exit_recorrido' }
        ];

        for (let i = 0; i < exitRecorridoPatterns.length; i++) {
            const pattern = exitRecorridoPatterns[i];
            const match = text.match(pattern.pattern);
            console.log(`🔍 [Parser] Patrón salir recorrido ${i + 1}: ${pattern.pattern} - Match: ${match ? 'SÍ' : 'NO'}`);
            if (match) {
                console.log(`✅ [Parser] Comando de salir recorrido detectado: ${pattern.action}`);
                // Retornar comando de salir recorrido inmediatamente
                const result = {
                    type: 'recorrido',
                    action: 'exit_recorrido',
                    originalText: text,
                    confidence: 0.9,
                    area: 'recorrido'
                };
                console.log(`✅ [Parser] Comando de salir recorrido generado:`, result);
                return result;
            }
        }

        console.log(`❌ [Parser] No se encontraron comandos de recorrido válidos`);
        return null;
    }

    /**
     * Parse filter commands
     * @param {string} text - Normalized text
     * @returns {Object|null} Filter command or null
     */
    parseFilter(text) {
        console.log(`🔍 [Parser] Iniciando parseFilter con texto: "${text}"`);
        
        // Detectar comandos de filtro por dormitorios específicamente - MEJORADOS
        const bedroomPatterns = [
            { pattern: /(?:mostrar|filtrar|buscar|ver|puedes\s+mostrar)\s+(?:un\s+)?(?:departamento|apartamento)\s+(?:de\s+)?(\d+)\s*(?:dormitorio|dormitorios|habitación|habitaciones)/, bedrooms: '$1' },
            { pattern: /(?:me\s+)?(?:puedes\s+)?(?:mostrar|filtrar|buscar|ver)\s+(?:un\s+)?(?:departamento|apartamento)\s+(?:de\s+)?(\d+)\s*(?:dormitorio|dormitorios|habitación|habitaciones)/, bedrooms: '$1' },
            { pattern: /(?:departamento|apartamento)\s+(?:de\s+)?(\d+)\s*(?:dormitorio|dormitorios|habitación|habitaciones)/, bedrooms: '$1' },
            { pattern: /(\d+)\s*(?:dormitorio|dormitorios|habitación|habitaciones)/, bedrooms: '$1' },
            { pattern: /(?:apartamento|departamento)\s+(?:de\s+)?(\d+)\s*(?:dormitorio|dormitorios)/, bedrooms: '$1' },
            // NUEVOS PATRONES PARA NÚMEROS ESCRITOS CON LETRAS
            { pattern: /(?:mostrar|filtrar|buscar|ver|puedes\s+mostrar)\s+(?:un\s+)?(?:departamento|apartamento)\s+(?:de\s+)?(uno|dos|tres)\s*(?:dormitorio|dormitorios|habitación|habitaciones)/, bedrooms: (match) => {
                const numMap = { 'uno': 1, 'dos': 2, 'tres': 3 };
                return numMap[match[1]] || 1;
            }},
            { pattern: /(?:me\s+)?(?:puedes\s+)?(?:mostrar|filtrar|buscar|ver)\s+(?:un\s+)?(?:departamento|apartamento)\s+(?:de\s+)?(uno|dos|tres)\s*(?:dormitorio|dormitorios|habitación|habitaciones)/, bedrooms: (match) => {
                const numMap = { 'uno': 1, 'dos': 2, 'tres': 3 };
                return numMap[match[1]] || 1;
            }},
            { pattern: /(?:departamento|apartamento)\s+(?:de\s+)?(uno|dos|tres)\s*(?:dormitorio|dormitorios|habitación|habitaciones)/, bedrooms: (match) => {
                const numMap = { 'uno': 1, 'dos': 2, 'tres': 3 };
                return numMap[match[1]] || 1;
            }}
        ];

        // Detectar comandos de filtro por superficie
        const surfacePatterns = [
            { pattern: /(\d+)\s*-\s*(\d+)\s*m²/, superficie: '$1-$2 m²' },
            { pattern: /(?:superficie|área)\s+(?:de\s+)?(\d+)\s*-\s*(\d+)\s*m²/, superficie: '$1-$2 m²' }
        ];

        // Detectar comandos de filtro por precio - MEJORADOS
        const pricePatterns = [
            { pattern: /(?:mostrar|filtrar|buscar|ver)\s+(?:un\s+)?(?:uno\s+)?(?:con\s+)?(?:precio|valor)\s+(?:entre\s+)?\$?([0-9.,]+)\s*-\s*\$?([0-9.,]+)\s*(?:mil\s+)?(?:uf|UF)/i, precio: '$1-$2 UF' },
            { pattern: /(?:precio|valor)\s+(?:entre\s+)?\$?([0-9.,]+)\s*-\s*\$?([0-9.,]+)\s*(?:mil\s+)?(?:uf|UF)/i, precio: '$1-$2 UF' },
            { pattern: /\$?([0-9.,]+)\s*-\s*\$?([0-9.,]+)\s*(?:mil\s+)?(?:uf|UF)/i, precio: '$1-$2 UF' },
            { pattern: /(?:buscar|mostrar|filtrar)\s+(?:de\s+)?\$?([0-9.,]+)\s*(?:mil\s+)?(?:uf|UF)/i, precio: '$1 UF' },
            { pattern: /(?:de\s+)?\$?([0-9.,]+)\s*(?:mil\s+)?(?:uf|UF)/i, precio: '$1 UF' },
            { pattern: /(?:precio|valor)\s+(?:de\s+)?\$?([0-9.,]+)\s*(?:mil\s+)?(?:uf|UF)/i, precio: '$1 UF' },
            { pattern: /\$?([0-9.,]+)\s*-\s*\$?([0-9.,]+)\s*(?:mil\s+)?(?:pesos|peso)/i, precio: '$1-$2 pesos' }
        ];

        // Detectar comandos de filtro por tipo de departamento
        const tipoDepartamentoPatterns = [
            { pattern: /(?:mostrar|filtrar|buscar|ver|activar)\s+(?:el\s+)?(?:departamento|apartamento)\s+(?:tipo\s+)?([A-Z]-[A-Z]-[0-9]+)/i, tipoDepartamento: 'Tipo $1' },
            { pattern: /(?:tipo\s+de\s+departamento|tipo\s+departamento):\s*([A-Z]-[A-Z]-[0-9]+)/i, tipoDepartamento: 'Tipo $1' },
            { pattern: /(?:tipo\s+)?([A-Z]-[A-Z]-[0-9]+)/i, tipoDepartamento: 'Tipo $1' },
            { pattern: /(?:mostrar|filtrar|buscar|ver)\s+(?:el\s+)?(?:tipo\s+)?([A-Z]-[A-Z]-[0-9]+)/i, tipoDepartamento: 'Tipo $1' }
        ];

        // Detectar comandos para mostrar detalles del departamento
        const detailsPatterns = [
            { pattern: /(?:me\s+)?(?:das|dame|muestra|muéstrame|quiero|necesito)\s+(?:más\s+)?(?:detalles?|información|datos)/, action: 'show_details' },
            { pattern: /(?:hablemos?|hablar)\s+(?:de|sobre)\s+(?:este\s+)?(?:departamento|apartamento)/, action: 'show_details' },
            { pattern: /(?:cuéntame|dime)\s+(?:más\s+)?(?:sobre|de)\s+(?:este\s+)?(?:departamento|apartamento)/, action: 'show_details' },
            { pattern: /(?:quiero|necesito)\s+(?:saber|ver|conocer)\s+(?:más\s+)?(?:sobre|de)\s+(?:este\s+)?(?:departamento|apartamento)/, action: 'show_details' },
            { pattern: /(?:muestra|muéstrame|dame)\s+(?:más\s+)?(?:información|detalles?|datos)/, action: 'show_details' },
            { pattern: /(?:detalles?|información|datos)\s+(?:del\s+)?(?:departamento|apartamento)/, action: 'show_details' }
        ];

        // Detectar comandos para enviar PDF
        const pdfPatterns = [
            { pattern: /(?:envía|enviar|mandar|manda)\s+(?:el\s+)?(?:pdf|documento)/, action: 'send_pdf' },
            { pattern: /(?:quiero|necesito)\s+(?:el\s+)?(?:pdf|documento)/, action: 'send_pdf' },
            { pattern: /(?:dame|muéstrame)\s+(?:el\s+)?(?:pdf|documento)/, action: 'send_pdf' },
            { pattern: /(?:pdf|documento)\s+(?:por\s+)?(?:email|correo)/, action: 'send_pdf' },
            { pattern: /(?:enviar|mandar)\s+(?:por\s+)?(?:email|correo)/, action: 'send_pdf' }
        ];

        // Detectar comandos para cotizar
        const quotePatterns = [
            { pattern: /(?:cotiza|cotizar|cotización|precio)\s+(?:el\s+)?(?:departamento|apartamento|modelo)/, action: 'quote_model' },
            { pattern: /(?:quiero|necesito)\s+(?:una\s+)?(?:cotización|cotiza|precio)/, action: 'quote_model' },
            { pattern: /(?:cuánto\s+)?(?:cuesta|vale|precio)\s+(?:el\s+)?(?:departamento|apartamento)/, action: 'quote_model' },
            { pattern: /(?:dame|muéstrame)\s+(?:el\s+)?(?:precio|cotización)/, action: 'quote_model' },
            { pattern: /(?:cotización|precio)\s+(?:del\s+)?(?:modelo|departamento)/, action: 'quote_model' }
        ];

        // Detectar comandos para cerrar modales
        const closeModalPatterns = [
            { pattern: /(?:cerrar|cierra|cerra)\s+(?:el\s+)?(?:modal|ventana|popup)/, action: 'close_modal' },
            { pattern: /(?:cerrar|cierra|cerra)\s+(?:detalles|información)/, action: 'close_modal' },
            { pattern: /(?:volver|regresar|retroceder)\s+(?:a\s+)?(?:la\s+)?(?:lista|vista\s+anterior)/, action: 'close_modal' },
            { pattern: /(?:salir|salir\s+de)\s+(?:detalles|información)/, action: 'close_modal' },
            { pattern: /(?:quitar|quita)\s+(?:el\s+)?(?:modal|ventana|popup)/, action: 'close_modal' },
            { pattern: /(?:ocultar|oculta)\s+(?:detalles|información)/, action: 'close_modal' },
            { pattern: /(?:cancelar|cancela)\s+(?:detalles|información)/, action: 'close_modal' },
            { pattern: /(?:no\s+quiero|no\s+necesito)\s+(?:ver\s+)?(?:detalles|información)/, action: 'close_modal' },
            { pattern: /(?:volver|regresar)\s+(?:a\s+)?(?:los\s+)?(?:departamentos|apartamentos)/, action: 'close_modal' }
        ];

        const filters = {};
        let hasFilters = false;

        console.log(`🔍 [Parser] Procesando patrones de dormitorios...`);
        // Procesar patrones de dormitorios
        for (let i = 0; i < bedroomPatterns.length; i++) {
            const pattern = bedroomPatterns[i];
            const match = text.match(pattern.pattern);
            console.log(`🔍 [Parser] Patrón dormitorio ${i + 1}: ${pattern.pattern} - Match: ${match ? 'SÍ' : 'NO'}`);
            if (match) {
                // Manejar tanto strings como funciones de mapeo
                if (typeof pattern.bedrooms === 'function') {
                    filters.bedrooms = pattern.bedrooms(match);
                } else {
                    filters.bedrooms = parseInt(match[1]);
                }
                hasFilters = true;
                console.log(`✅ [Parser] Dormitorios detectados: ${filters.bedrooms}`);
                break; // Solo tomar el primer match de dormitorios
            }
        }

        console.log(`🔍 [Parser] Procesando patrones de superficie...`);
        // Procesar patrones de superficie
        for (let i = 0; i < surfacePatterns.length; i++) {
            const pattern = surfacePatterns[i];
            const match = text.match(pattern.pattern);
            console.log(`🔍 [Parser] Patrón superficie ${i + 1}: ${pattern.pattern} - Match: ${match ? 'SÍ' : 'NO'}`);
            if (match) {
                filters.superficie = `${match[1]}-${match[2]} m²`;
                hasFilters = true;
                console.log(`✅ [Parser] Superficie detectada: ${filters.superficie}`);
            }
        }

        console.log(`🔍 [Parser] Procesando patrones de precio...`);
        // Procesar patrones de precio
        for (let i = 0; i < pricePatterns.length; i++) {
            const pattern = pricePatterns[i];
            const match = text.match(pattern.pattern);
            console.log(`🔍 [Parser] Patrón precio ${i + 1}: ${pattern.pattern} - Match: ${match ? 'SÍ' : 'NO'}`);
            if (match) {
                console.log(`🔍 [Parser] Match encontrado: ${JSON.stringify(match)}`);
                if (match.length >= 3) {
                    // Es un rango de precios
                    filters.precio = `${match[1]}-${match[2]} UF`;
                    console.log(`✅ [Parser] Rango de precio detectado: ${filters.precio}`);
                } else if (match.length >= 2) {
                    // Es un precio específico
                    filters.precio = `${match[1]} UF`;
                    console.log(`✅ [Parser] Precio específico detectado: ${filters.precio}`);
                }
                hasFilters = true;
                break; // Solo tomar el primer match de precio
            }
        }

        console.log(`🔍 [Parser] Procesando patrones de tipo de departamento...`);
        // Procesar patrones de tipo de departamento
        for (let i = 0; i < tipoDepartamentoPatterns.length; i++) {
            const pattern = tipoDepartamentoPatterns[i];
            const match = text.match(pattern.pattern);
            console.log(`🔍 [Parser] Patrón tipo departamento ${i + 1}: ${pattern.pattern} - Match: ${match ? 'SÍ' : 'NO'}`);
            if (match) {
                console.log(`🔍 [Parser] Match encontrado: ${JSON.stringify(match)}`);
                                 if (match.length >= 2) {
                     // Extraer el código del tipo de departamento
                     const tipoCode = match[1];
                     // Mantener el formato original (mayúsculas) para que coincida con las tarjetas
                     filters.tipoDepartamento = `Tipo ${tipoCode.toUpperCase()}`;
                     console.log(`✅ [Parser] Tipo de departamento detectado: ${filters.tipoDepartamento}`);
                 }
                hasFilters = true;
                break; // Solo tomar el primer match de tipo de departamento
            }
        }

        console.log(`🔍 [Parser] Procesando patrones de detalles...`);
        // Procesar patrones de detalles
        for (let i = 0; i < detailsPatterns.length; i++) {
            const pattern = detailsPatterns[i];
            const match = text.match(pattern.pattern);
            console.log(`🔍 [Parser] Patrón detalles ${i + 1}: ${pattern.pattern} - Match: ${match ? 'SÍ' : 'NO'}`);
            if (match) {
                console.log(`✅ [Parser] Comando de detalles detectado: ${pattern.action}`);
                // Retornar comando de detalles inmediatamente
                const result = {
                    type: 'details',
                    action: 'show_details',
                    originalText: text,
                    confidence: 0.9,
                    area: 'details'
                };
                console.log(`✅ [Parser] Comando de detalles generado:`, result);
                return result;
            }
        }

        // Procesar patrones de PDF
        for (let i = 0; i < pdfPatterns.length; i++) {
            const pattern = pdfPatterns[i];
            const match = text.match(pattern.pattern);
            console.log(`🔍 [Parser] Patrón PDF ${i + 1}: ${pattern.pattern} - Match: ${match ? 'SÍ' : 'NO'}`);
            if (match) {
                console.log(`✅ [Parser] Comando de PDF detectado: ${pattern.action}`);
                // Retornar comando de PDF inmediatamente
                const result = {
                    type: 'pdf',
                    action: 'send_pdf',
                    originalText: text,
                    confidence: 0.9,
                    area: 'pdf'
                };
                console.log(`✅ [Parser] Comando de PDF generado:`, result);
                return result;
            }
        }

        // Procesar patrones de cotización
        for (let i = 0; i < quotePatterns.length; i++) {
            const pattern = quotePatterns[i];
            const match = text.match(pattern.pattern);
            console.log(`🔍 [Parser] Patrón cotización ${i + 1}: ${pattern.pattern} - Match: ${match ? 'SÍ' : 'NO'}`);
            if (match) {
                console.log(`✅ [Parser] Comando de cotización detectado: ${pattern.action}`);
                // Retornar comando de cotización inmediatamente
                const result = {
                    type: 'quote',
                    action: 'quote_model',
                    originalText: text,
                    confidence: 0.9,
                    area: 'quote'
                };
                console.log(`✅ [Parser] Comando de cotización generado:`, result);
                return result;
            }
        }

        // Procesar patrones de cerrar modales
        for (let i = 0; i < closeModalPatterns.length; i++) {
            const pattern = closeModalPatterns[i];
            const match = text.match(pattern.pattern);
            console.log(`🔍 [Parser] Patrón cerrar modal ${i + 1}: ${pattern.pattern} - Match: ${match ? 'SÍ' : 'NO'}`);
            if (match) {
                console.log(`✅ [Parser] Comando de cerrar modal detectado: ${pattern.action}`);
                // Retornar comando de cerrar modal inmediatamente
                const result = {
                    type: 'modal',
                    action: 'close_modal',
                    originalText: text,
                    confidence: 0.9,
                    area: 'modal'
                };
                console.log(`✅ [Parser] Comando de cerrar modal generado:`, result);
                return result;
            }
        }

        console.log(`🔍 [Parser] Resumen de filtros encontrados:`, filters);
        console.log(`🔍 [Parser] hasFilters: ${hasFilters}`);

        // Verificar comandos especiales de filtros
        const specialFilterPatterns = [
            {
                pattern: /(buscar|mostrar|ver|filtrar)\s+(?:todos\s+)?(?:los\s+)?(?:departamentos|apartamentos)/i,
                action: 'show_all',
                confidence: 0.8
            },
            {
                pattern: /(limpiar|borrar|resetear|quitar)\s+(?:todos\s+)?(?:los\s+)?(?:filtros|filtro)/i,
                action: 'clear',
                confidence: 0.8
            },
            {
                pattern: /(buscar|mostrar|ver)\s+(?:departamentos|apartamentos)/i,
                action: 'show_all',
                confidence: 0.7
            }
        ];

        for (const specialPattern of specialFilterPatterns) {
            const match = text.match(specialPattern.pattern);
            if (match) {
                const result = {
                    type: 'filter',
                    action: specialPattern.action,
                    filters: {},
                    originalText: text,
                    confidence: specialPattern.confidence,
                    area: 'filter'
                };
                console.log(`✅ [Parser] Comando especial de filtro detectado:`, result);
                return result;
            }
        }

        if (hasFilters) {
            const result = {
                type: 'filter',
                action: 'apply',
                filters: filters,
                originalText: text,
                confidence: 0.9,
                area: 'filter'
            };
            console.log(`✅ [Parser] Comando de filtro generado:`, result);
            return result;
        }

        console.log(`❌ [Parser] No se encontraron filtros válidos`);
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
