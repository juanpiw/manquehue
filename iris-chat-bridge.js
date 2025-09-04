/**
 * IRIS Chat Bridge
 * Bridge entre el sistema de chat de Iris y la arquitectura modular IRISCore
 * Permite procesar comandos del chat (texto y voz) usando window.IRIS.processText()
 */

class IrisChatBridge {
    constructor() {
        console.log('🔗 Inicializando IrisChatBridge...');
        this.irisCore = null;
        this.isInitialized = false;
        this.currentLang = this.detectPreferredLang();
        this.init();
    }

    /**
     * Inicializar el bridge
     */
    async init() {
        try {
            // Esperar a que window.IRIS esté disponible
            await this.waitForIRIS();
            
            this.irisCore = window.IRIS;
            this.isInitialized = true;
            
            console.log('✅ IrisChatBridge inicializado correctamente');
            console.log('🔗 Conectado con:', this.irisCore);
            
            // Configurar listeners del chat
            this.setupChatListeners();
            
        } catch (error) {
            console.error('❌ Error inicializando IrisChatBridge:', error);
        }
    }

    /**
     * Esperar a que window.IRIS esté disponible
     */
    waitForIRIS() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 segundos máximo
            
            const checkIRIS = () => {
                attempts++;
                
                if (window.IRIS) {
                    console.log('🎯 window.IRIS encontrado en intento:', attempts);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('window.IRIS no disponible después de 5 segundos'));
                } else {
                    setTimeout(checkIRIS, 100);
                }
            };
            
            checkIRIS();
        });
    }

    /**
     * Configurar listeners para mensajes del chat
     */
    setupChatListeners() {
        console.log('🎧 Configurando listeners del chat...');
        
        // El chat ya está conectado a través de irisDetectVideoCommands()
        console.log('✅ Chat conectado a través de irisDetectVideoCommands()');
        
        // Agregar listener básico para testing
        this.setupTestListener();
        
        // Agregar listener para mensajes del usuario (opcional)
        this.setupUserMessageListener();
        
        // Interceptores globales para capturar el idioma ANTES de enviar
        this.setupGlobalInputInterceptors();
    }

    /**
     * Interceptores globales para detectar idioma antes de que el chat envíe el mensaje
     */
    setupGlobalInputInterceptors() {
        // Enter en cualquier input dentro de la ventana del chat (captura)
        document.addEventListener('keydown', (ev) => {
            try {
                if (ev.key !== 'Enter') return;
                const target = ev.target;
                if (!(target instanceof HTMLElement)) return;
                if (!target.closest('.chat-window-wrapper, .chat-window, [data-testid="chat-window"]')) return;
                const val = (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) ? target.value : '';
                if (val && val.trim()) {
                    this.handleAdaptiveLanguage(val.trim());
                }
            } catch {}
        }, true);

        // Click en botones de enviar dentro del chat (captura)
        document.addEventListener('click', (ev) => {
            try {
                const el = ev.target instanceof HTMLElement ? ev.target : null;
                if (!el) return;
                const inChat = el.closest('.chat-window-wrapper, .chat-window, [data-testid="chat-window"]');
                if (!inChat) return;
                const isSend = el.matches('button[type="submit"], [data-testid="send-button"], .send-button') || (el.parentElement && el.parentElement.matches('button[type="submit"], [data-testid="send-button"], .send-button'));
                if (!isSend) return;
                const input = inChat.querySelector('input, textarea');
                const val = input && 'value' in input ? input.value : '';
                if (val && String(val).trim()) {
                    this.handleAdaptiveLanguage(String(val).trim());
                }
            } catch {}
        }, true);
    }

    /**
     * Configurar listener para mensajes del usuario
     */
                setupUserMessageListener() {
                console.log('👤 Configurando listener para mensajes del usuario...');
                
                // Observer para detectar mensajes del usuario
                const userMessageObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeType === 1) { // Element node
                                    // Buscar mensajes del usuario
                                    const userMessages = node.querySelectorAll('.chat-message-from-user .chat-message-markdown');
                                    
                                    userMessages.forEach((messageElement) => {
                                        const messageText = messageElement.textContent || messageElement.innerText;
                                        console.log('👤 [Bridge] Mensaje del usuario detectado:', messageText);
                                        
                                        // Procesar con bridge
                                        this.processChatCommand(messageText);
                                    });
                                }
                            });
                        }
                    });
                });
                
                // Observar cambios en el chat
                userMessageObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                
                // AGREGAR: Listener para el input del chat
                this.setupChatInputListener();
                
                console.log('✅ Listener para mensajes del usuario configurado');
            }

            /**
             * Configurar listener para el input del chat
             */
            setupChatInputListener() {
                console.log('⌨️ Configurando listener para input del chat...');
                
                // Buscar el input del chat
                const chatInput = document.querySelector('input[placeholder*="Pregunta"], input[placeholder*="apartamentos"], .chat-input, [data-testid="chat-input"]');
                
                if (chatInput) {
                    console.log('✅ Input del chat encontrado:', chatInput);
                    
                    // Listener para cuando se presiona Enter
                    chatInput.addEventListener('keypress', (event) => {
                        if (event.key === 'Enter') {
                            const messageText = chatInput.value.trim();
                            if (messageText) {
                                console.log('⌨️ [Bridge] Enter presionado con mensaje:', messageText);
                                // Adaptar idioma de chat según el texto escrito
                                this.handleAdaptiveLanguage(messageText);
                                
                                // Procesar inmediatamente con el bridge
                                setTimeout(() => {
                                    this.processChatCommand(messageText);
                                }, 100); // Pequeño delay para que el chat procese primero
                            }
                        }
                    });
                    
                    // Listener para el botón de enviar
                    const sendButton = chatInput.parentElement?.querySelector('button[type="submit"], .send-button, [data-testid="send-button"]');
                    if (sendButton) {
                        sendButton.addEventListener('click', () => {
                            const messageText = chatInput.value.trim();
                            if (messageText) {
                                console.log('⌨️ [Bridge] Botón enviar clickeado con mensaje:', messageText);
                                // Adaptar idioma de chat según el texto escrito
                                this.handleAdaptiveLanguage(messageText);
                                
                                // Procesar inmediatamente con el bridge
                                setTimeout(() => {
                                    this.processChatCommand(messageText);
                                }, 100);
                            }
                        });
                    }
                } else {
                    console.log('⚠️ Input del chat no encontrado, intentando método alternativo...');
                    
                    // Método alternativo: observer para detectar cuando se envía un mensaje
                    const chatObserver = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'childList') {
                                mutation.addedNodes.forEach((node) => {
                                    if (node.nodeType === 1) {
                                        // Buscar mensajes del usuario que se acaban de agregar
                                        const userMessages = node.querySelectorAll('.chat-message-from-user');
                                        userMessages.forEach((messageElement) => {
                                            const messageText = messageElement.textContent || messageElement.innerText;
                                            if (messageText && messageText.trim()) {
                                                console.log('👤 [Bridge] Mensaje detectado por observer:', messageText);
                                                this.handleAdaptiveLanguage(messageText);
                                                this.processChatCommand(messageText);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                    
                    // Observar el contenedor del chat
                    const chatContainer = document.querySelector('.chat-container, .chat-widget, [data-testid="chat-container"]');
                    if (chatContainer) {
                        chatObserver.observe(chatContainer, {
                            childList: true,
                            subtree: true
                        });
                    }
                }
                
                // AGREGAR: Listener para respuestas de Iris
                this.setupIrisResponseListener();
                
                console.log('✅ Listener para input del chat configurado');
            }

    /**
     * Configurar listener para respuestas de Iris
     */
    setupIrisResponseListener() {
        console.log('🤖 Configurando listener para respuestas de Iris...');
        
        // Observer para detectar cuando Iris responde
        const irisResponseObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            // Buscar respuestas de Iris (no del usuario)
                            const irisResponses = node.querySelectorAll('.chat-message:not(.chat-message-from-user) .chat-message-markdown, .chat-message-bot .chat-message-markdown');
                            
                            irisResponses.forEach((responseElement) => {
                                const responseText = responseElement.textContent || responseElement.innerText;
                                if (responseText && responseText.trim()) {
                                    console.log('🤖 [Bridge] Respuesta de Iris detectada:', responseText);
                                    
                                    // Adaptación simple: si el idioma actual es EN y la respuesta parece español, reemplazar por plantilla EN
                                    try {
                                        if ((this.currentLang || 'es') === 'en') {
                                            const seemsSpanish = /[¿¡áéíóúñ]|\b(apartamentos?|dormitorio|precio|superficie|mostrar|filtrar|claro|ayudarte|opciones)\b/i.test(responseText);
                                            if (seemsSpanish) {
                                                const enText = this.buildEnglishReply(this.lastCommandResult, this.lastUserText) || 'Got it. I will help you with that.';
                                                responseElement.textContent = enText;
                                            }
                                        }
                                    } catch {}
                                    
                                    // Extraer el último comando del usuario para procesarlo
                                    this.processLastUserCommand();
                                }
                            });
                        }
                    });
                }
            });
        });
        
        // Observar cambios en el chat
        irisResponseObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ Listener para respuestas de Iris configurado');
    }

    /**
     * Procesar el último comando del usuario
     */
    processLastUserCommand() {
        // Buscar el último mensaje del usuario
        const userMessages = document.querySelectorAll('.chat-message-from-user .chat-message-markdown');
        if (userMessages.length > 0) {
            const lastUserMessage = userMessages[userMessages.length - 1];
            const messageText = lastUserMessage.textContent || lastUserMessage.innerText;
            
            if (messageText && messageText.trim()) {
                console.log('🔄 [Bridge] Procesando último comando del usuario:', messageText);
                
                // Procesar con un pequeño delay para que la respuesta de Iris se complete
                setTimeout(() => {
                    this.processChatCommand(messageText);
                }, 500);
            }
        }
    }

    /**
     * Configurar listener de prueba para testing
     */
    setupTestListener() {
        console.log('🧪 Configurando listener de prueba...');
        
        // Crear un botón de prueba temporal
        const testButton = document.createElement('button');
        testButton.textContent = '🧪 Probar Bridge';
        testButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 10px 15px;
            background: #0f3460;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        `;
        
        testButton.onclick = async () => {
            console.log('🧪 Botón de prueba clickeado');
            
            // FLUJO COMPLETO: Buscar → Filtrar → Activar → Detalles → PDF → Cotizar → Cerrar → Salir Recorrido
            const testCommands = [
                'buscar departamentos',                    // 1. Mostrar todos los departamentos
                '1 dormitorio',                           // 2. Filtrar por dormitorios
                'mostrar departamento tipo A-S-2',        // 3. Activar tarjeta específica
                'me das más detalles',                    // 4. Activar botón "Detalles"
                'envía el pdf',                           // 5. Enviar PDF por email
                'cotiza el departamento',                 // 6. Cotizar modelo (abre contactModal)
                'cerrar modal',                           // 7. Cerrar contactModal
                'salir del recorrido'                     // 8. Salir del modo recorrido
            ];
            
            console.log('🔄 [Bridge] Iniciando flujo completo de prueba:');
            console.log('🔄 [Bridge] 1. Buscar departamentos');
            console.log('🔄 [Bridge] 2. Filtrar por dormitorios');
            console.log('🔄 [Bridge] 3. Activar tarjeta específica');
            console.log('🔄 [Bridge] 4. Activar botón "Detalles"');
            console.log('🔄 [Bridge] 5. Enviar PDF por email');
            console.log('🔄 [Bridge] 6. Cotizar modelo (abre contactModal)');
            console.log('🔄 [Bridge] 7. Cerrar contactModal');
            console.log('🔄 [Bridge] 8. Salir del recorrido');
            
            for (let i = 0; i < testCommands.length; i++) {
                const command = testCommands[i];
                const step = i + 1;
                
                console.log(`\n🧪 [Bridge] PASO ${step}: "${command}"`);
                console.log(`🧪 [Bridge] Procesando comando...`);
                
                const result = await this.processChatCommand(command);
                
                console.log(`✅ [Bridge] PASO ${step} completado:`);
                console.log(`   - Comando: "${command}"`);
                console.log(`   - Éxito: ${result.success}`);
                if (result.error) console.log(`   - Error: ${result.error}`);
                if (result.result) console.log(`   - Resultado: ${JSON.stringify(result.result, null, 2)}`);
                
                // Mostrar resultado en pantalla
                this.showTestResult(result, step);
                
                // Esperar 4 segundos entre comandos para ver los efectos
                console.log(`⏳ [Bridge] Esperando 4 segundos antes del siguiente paso...`);
                await new Promise(resolve => setTimeout(resolve, 4000));
            }
            
            console.log('\n🎉 [Bridge] ¡Flujo de prueba completado!');
        };
        
        document.body.appendChild(testButton);
        console.log('🧪 Botón de prueba agregado');
        
        // Agregar botón adicional para probar contactModal específicamente
        const contactTestButton = document.createElement('button');
        contactTestButton.textContent = '📞 Probar ContactModal';
        contactTestButton.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            z-index: 10000;
            padding: 10px 15px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        `;
        
        contactTestButton.onclick = async () => {
            console.log('📞 Botón de prueba contactModal clickeado');
            
            // Crear el contactModal que el usuario describió
            const contactModalHTML = `
                <div class="modal-overlay" id="contactModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;">
                    <div class="modal" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 15px; max-width: 600px; width: 90%; max-height: 90vh; overflow: hidden;">
                        <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.2);">
                            <h3 style="margin: 0; color: white; font-size: 1.5rem; font-weight: 600;">Solicitar Información - 1 Dormitorio</h3>
                            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0.5rem;">×</button>
                        </div>
                        <div class="modal-body" style="padding: 1.5rem; overflow-y: auto; max-height: 70vh;">
                            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.2); margin-bottom: 1.5rem;">
                                <h4 style="margin: 0 0 0.5rem 0; color: white; font-size: 1.2rem;">1 Dormitorio</h4>
                                <p style="margin: 0.25rem 0; color: #cccccc;"><strong>Superficie:</strong> 40-60 m²</p>
                                <p style="margin: 0.25rem 0; color: #cccccc;"><strong>Precio:</strong> $2.000-3.000 UF</p>
                            </div>
                            <form id="contactForm" style="display: flex; flex-direction: column; gap: 1rem;">
                                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                    <label style="color: white; font-weight: 600; font-size: 0.9rem;">Nombre completo *</label>
                                    <input type="text" name="name" required style="padding: 0.75rem; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; background: rgba(255, 255, 255, 0.05); color: white; font-size: 1rem;">
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                    <label style="color: white; font-weight: 600; font-size: 0.9rem;">Email *</label>
                                    <input type="email" name="email" required style="padding: 0.75rem; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; background: rgba(255, 255, 255, 0.05); color: white; font-size: 1rem;">
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                    <label style="color: white; font-weight: 600; font-size: 0.9rem;">Teléfono</label>
                                    <input type="tel" name="phone" style="padding: 0.75rem; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; background: rgba(255, 255, 255, 0.05); color: white; font-size: 1rem;">
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                    <label style="color: white; font-weight: 600; font-size: 0.9rem;">Mensaje</label>
                                    <textarea name="message" rows="4" placeholder="Cuéntanos más sobre tu interés en este apartamento..." style="padding: 0.75rem; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; background: rgba(255, 255, 255, 0.05); color: white; font-size: 1rem; resize: vertical; min-height: 100px;"></textarea>
                                </div>
                                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                                    <button type="submit" style="flex: 1; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; font-size: 1rem; background: #007bff; color: white; border: none; cursor: pointer;">Enviar Solicitud</button>
                                    <button type="button" onclick="this.closest('.modal-overlay').remove()" style="flex: 1; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; font-size: 1rem; background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.2); cursor: pointer;">Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            // Insertar el modal en el DOM
            document.body.insertAdjacentHTML('beforeend', contactModalHTML);
            console.log('📞 ContactModal creado y mostrado');
            
            // Esperar 3 segundos y luego probar cerrarlo
            setTimeout(async () => {
                console.log('📞 Probando cerrar contactModal...');
                const result = await this.processChatCommand('cerrar modal');
                console.log('📞 Resultado de cerrar contactModal:', result);
                
                // Mostrar resultado
                this.showTestResult(result, 'ContactModal Test');
            }, 3000);
        };
        
        document.body.appendChild(contactTestButton);
        console.log('📞 Botón de prueba contactModal agregado');
    }

    /**
     * Mostrar resultado de prueba en pantalla
     */
    showTestResult(result, step = null) {
        // Remover resultado anterior si existe
        const existingResult = document.getElementById('test-result');
        if (existingResult) {
            existingResult.remove();
        }
        
        const resultDiv = document.createElement('div');
        resultDiv.id = 'test-result';
        resultDiv.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            z-index: 10000;
            padding: 15px;
            background: ${result.success ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 5px;
            font-size: 12px;
            max-width: 350px;
            word-wrap: break-word;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;
        
        const stepInfo = step ? `<strong>PASO ${step}/8:</strong><br>` : '';
        const statusIcon = result.success ? '✅' : '❌';
        
        resultDiv.innerHTML = `
            <strong>🧪 Flujo de Prueba IRIS</strong><br>
            ${stepInfo}
            <strong>Estado:</strong> ${statusIcon} ${result.success ? 'Éxito' : 'Error'}<br>
            ${result.error ? `<strong>Error:</strong> ${result.error}<br>` : ''}
            ${result.result && result.result.message ? `<strong>Mensaje:</strong> ${result.result.message}<br>` : ''}
            <small>Click para cerrar</small>
        `;
        
        resultDiv.onclick = () => resultDiv.remove();
        document.body.appendChild(resultDiv);
        
        // Auto-remover después de 6 segundos
        setTimeout(() => {
            if (resultDiv.parentNode) {
                resultDiv.remove();
            }
        }, 6000);
    }

    /**
     * Procesar comando del chat
     * @param {string} command - Comando recibido del chat
     * @returns {Promise<Object>} - Resultado del procesamiento
     */
    async processChatCommand(command) {
        console.log('\n🔄 [Bridge] ==========================================');
        console.log(`🔄 [Bridge] PROCESANDO COMANDO: "${command}"`);
        console.log('🔄 [Bridge] ==========================================');
        
        if (!this.isInitialized) {
            console.error('❌ [Bridge] IrisChatBridge no está inicializado');
            return { success: false, error: 'Bridge no inicializado' };
        }

        if (!command || typeof command !== 'string') {
            console.error('❌ [Bridge] Comando inválido:', command);
            return { success: false, error: 'Comando inválido' };
        }

        try {
            // SCROLL INTELIGENTE: Detectar si necesitamos hacer scroll
            const currentScrollPosition = window.scrollY;
            const apartmentsSection = this.findApartmentsSection();
            
            console.log('📍 [Bridge] Posición actual del scroll:', currentScrollPosition);
            console.log('📍 [Bridge] Sección apartamentos encontrada:', apartmentsSection ? 'SÍ' : 'NO');
            
            // Usar la arquitectura modular para procesar el comando
            console.log('🔧 [Bridge] Enviando comando a IRIS Core...');
            const result = await this.irisCore.processText(command);
            
            // Guardar para posibles adaptaciones de idioma
            this.lastUserText = command;
            this.lastCommandResult = result;
            
            console.log('✅ [Bridge] Comando procesado exitosamente:');
            console.log('   - Resultado:', result);
            
            // DECIDIR SI HACER SCROLL basado en la posición actual
            if (apartmentsSection && this.shouldScrollToApartments(currentScrollPosition, apartmentsSection)) {
                console.log('🎯 [Bridge] Haciendo scroll inteligente a sección de apartamentos...');
                
                setTimeout(() => {
                    window.scrollTo({
                        top: apartmentsSection.top - 100, // 100px de margen
                        behavior: 'smooth' // Scroll suave
                    });
                }, 200);
            } else {
                console.log('📍 [Bridge] Manteniendo posición actual - ya estamos cerca de apartamentos');
            }
            
            console.log('✅ [Bridge] ==========================================');
            console.log(`✅ [Bridge] COMANDO COMPLETADO: "${command}"`);
            console.log('✅ [Bridge] ==========================================\n');
            
            return { success: true, result: result };
            
        } catch (error) {
            console.error('❌ [Bridge] Error procesando comando:', error);
            console.log('❌ [Bridge] ==========================================\n');
            return { success: false, error: error.message };
        }
    }

    /**
     * Encontrar la sección de apartamentos
     * @returns {Object|null} Información de la sección de apartamentos
     */
    findApartmentsSection() {
        try {
            // Buscar la sección de apartamentos por diferentes selectores
            const selectors = [
                '#apartments',
                '.apartments',
                '[data-section="apartments"]',
                'section:nth-child(2)', // Segunda sección (común)
                '.apartment-section'
            ];
            
            for (const selector of selectors) {
                const section = document.querySelector(selector);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const top = rect.top + window.scrollY;
                    const bottom = rect.bottom + window.scrollY;
                    
                    console.log(`📍 [Bridge] Sección apartamentos encontrada con selector: ${selector}`);
                    console.log(`📍 [Bridge] Top: ${top}, Bottom: ${bottom}`);
                    
                    return {
                        element: section,
                        top: top,
                        bottom: bottom,
                        height: rect.height
                    };
                }
            }
            
            console.log('⚠️ [Bridge] No se encontró sección de apartamentos');
            return null;
            
        } catch (error) {
            console.error('❌ [Bridge] Error encontrando sección de apartamentos:', error);
            return null;
        }
    }
    
    /**
     * Decidir si debemos hacer scroll a la sección de apartamentos
     * @param {number} currentPosition - Posición actual del scroll
     * @param {Object} apartmentsSection - Información de la sección de apartamentos
     * @returns {boolean} True si debemos hacer scroll
     */
    shouldScrollToApartments(currentPosition, apartmentsSection) {
        try {
            const viewportHeight = window.innerHeight;
            const sectionTop = apartmentsSection.top;
            const sectionBottom = apartmentsSection.bottom;
            
            // Calcular si la sección está visible en el viewport
            const isSectionVisible = (
                currentPosition + viewportHeight > sectionTop &&
                currentPosition < sectionBottom
            );
            
            // Calcular qué tan lejos estamos de la sección
            const distanceToSection = Math.abs(currentPosition - sectionTop);
            const isFarFromSection = distanceToSection > viewportHeight * 0.5; // Más de media pantalla
            
            console.log(`📍 [Bridge] Análisis de scroll:`);
            console.log(`📍 [Bridge] - Posición actual: ${currentPosition}`);
            console.log(`📍 [Bridge] - Top de sección: ${sectionTop}`);
            console.log(`📍 [Bridge] - Distancia a sección: ${distanceToSection}`);
            console.log(`📍 [Bridge] - ¿Sección visible? ${isSectionVisible}`);
            console.log(`📍 [Bridge] - ¿Lejos de sección? ${isFarFromSection}`);
            
            // Hacer scroll si:
            // 1. La sección NO está visible en el viewport, O
            // 2. Estamos muy lejos de la sección
            const shouldScroll = !isSectionVisible || isFarFromSection;
            
            console.log(`📍 [Bridge] ¿Hacer scroll? ${shouldScroll}`);
            return shouldScroll;
            
        } catch (error) {
            console.error('❌ [Bridge] Error analizando si hacer scroll:', error);
            return false; // Por defecto, no hacer scroll si hay error
        }
    }

    /**
     * Verificar estado del bridge
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            irisCore: !!this.irisCore,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Detect preferred UI/chat language from page
     */
    detectPreferredLang() {
        try {
            const btn = document.querySelector('.lang-btn.active');
            const params = new URLSearchParams(window.location.search);
            const stored = (localStorage.getItem('preferredLanguage') || '').toLowerCase();
            const nav = (navigator.language || 'es').toLowerCase();
            const lang = (btn?.dataset?.lang || params.get('lang') || stored || nav || 'es').toLowerCase();
            return lang.startsWith('en') ? 'en' : 'es';
        } catch { return 'es'; }
    }

    /**
     * Very lightweight language detector for a single message
     */
    detectTextLanguage(text) {
        if (!text) return this.currentLang || 'es';
        const t = String(text).toLowerCase();
        // Common English words
        const enHints = /(the|and|show|please|apartment|unit|price|between|how|much|bed(room)?s?|amenities|features|house|kitchen|bath(room)?|living|dining|office|hello|hi|send|email)/i;
        // Common Spanish words/accents
        const esHints = /(el|la|los|las|hola|por favor|departamento|apartamento|precio|dormitorio|amenidades|características|casa|cocina|baño|sala|comedor|oficina|enviar|correo|pdf|cotiza|cuánto)/i;
        if (enHints.test(t) && !esHints.test(t)) return 'en';
        if (esHints.test(t) && !enHints.test(t)) return 'es';
        // Heuristic: presence of accented characters -> Spanish
        if (/[áéíóúñ]/.test(t)) return 'es';
        return this.currentLang || 'es';
    }

    /**
     * Adapt chat language to user message language
     */
    handleAdaptiveLanguage(messageText) {
        try {
            const detected = this.detectTextLanguage(messageText);
            if (detected && detected !== this.currentLang) {
                console.log('🌐 [Bridge] Cambio de idioma detectado por mensaje. Nuevo idioma:', detected);
                this.currentLang = detected;
                // Re-crear chat con el nuevo idioma y notificar a la página
                if (typeof window.recreateIrisChat === 'function') {
                    window.recreateIrisChat(detected);
                }
                const evt = new CustomEvent('languageChanged', { detail: { lang: detected } });
                document.dispatchEvent(evt);
            }
        } catch (e) {
            console.warn('🌐 [Bridge] No se pudo adaptar el idioma:', e);
        }
    }

    /**
     * Build basic English reply templates from last command result
     */
    buildEnglishReply(result, userText) {
        try {
            if (!result || typeof result !== 'object') return '';
            const { type, action, filters, area, key } = result || {};
            if (type === 'navigation' && action === 'goto') {
                const map = { apartments: 'Showing apartments.', houses: 'Showing houses.', equipment: 'Showing amenities.', features: 'Showing features.', home: 'Going to home.' };
                return map[key] || 'Navigating to the requested section.';
            }
            if (type === 'filter') {
                if (action === 'show_all') return 'Listing all available apartments.';
                if (action === 'clear') return 'Filters cleared. Listing all apartments.';
                if (action === 'apply') {
                    const parts = [];
                    if (filters?.bedrooms) parts.push(`${filters.bedrooms} bedroom${filters.bedrooms>1?'s':''}`);
                    if (filters?.superficie) parts.push(`surface ${filters.superficie}`);
                    if (filters?.precio) parts.push(`price ${filters.precio}`);
                    return `Filtering apartments by ${parts.join(', ')}.`;
                }
            }
            if (type === 'details') return 'Here are more details about this apartment.';
            if (type === 'pdf') return 'I will send you the brochure (PDF).';
            if (type === 'quote') return 'I will prepare pricing information for this unit.';
            if (type === 'recorrido' && action === 'exit_recorrido') return 'Closing the tour and returning to the list.';
            if (type === 'video') {
                const map = { play: 'Playing the video.', pause: 'Pausing the video.', stop: 'Stopping the video.', next: 'Next video.', previous: 'Previous video.' };
                return map[action] || 'Video updated.';
            }
            return '';
        } catch { return ''; }
    }
}

// Crear instancia global
window.irisChatBridge = new IrisChatBridge();

// Exportar para uso en consola
console.log('🌉 IrisChatBridge cargado y disponible como window.irisChatBridge');
console.log('🧪 Para probar: window.irisChatBridge.processChatCommand("1 dormitorio")');
