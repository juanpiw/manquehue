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
            
            // Probar múltiples comandos
            const testCommands = [
                '1 dormitorio',
                'buscar departamentos',
                'limpiar filtros',
                'mostrar departamento tipo A-S-2'
            ];
            
            for (const command of testCommands) {
                console.log(`🧪 Probando comando: "${command}"`);
                const result = await this.processChatCommand(command);
                console.log(`🧪 Resultado de "${command}":`, result);
                
                // Mostrar resultado en pantalla
                this.showTestResult(result);
                
                // Esperar 2 segundos entre comandos
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        };
        
        document.body.appendChild(testButton);
        console.log('🧪 Botón de prueba agregado');
    }

    /**
     * Mostrar resultado de prueba en pantalla
     */
    showTestResult(result) {
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
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        resultDiv.innerHTML = `
            <strong>🧪 Resultado de Prueba:</strong><br>
            <strong>Éxito:</strong> ${result.success}<br>
            ${result.error ? `<strong>Error:</strong> ${result.error}<br>` : ''}
            ${result.result ? `<strong>Resultado:</strong> ${JSON.stringify(result.result, null, 2)}<br>` : ''}
            <small>Click para cerrar</small>
        `;
        
        resultDiv.onclick = () => resultDiv.remove();
        document.body.appendChild(resultDiv);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (resultDiv.parentNode) {
                resultDiv.remove();
            }
        }, 5000);
    }

    /**
     * Procesar comando del chat
     * @param {string} command - Comando recibido del chat
     * @returns {Promise<Object>} - Resultado del procesamiento
     */
    async processChatCommand(command) {
        console.log('🔄 Procesando comando del chat:', command);
        
        if (!this.isInitialized) {
            console.error('❌ IrisChatBridge no está inicializado');
            return { success: false, error: 'Bridge no inicializado' };
        }

        if (!command || typeof command !== 'string') {
            console.error('❌ Comando inválido:', command);
            return { success: false, error: 'Comando inválido' };
        }

        try {
            // PREVENIR SCROLL AUTOMÁTICO: Guardar posición actual
            const currentScrollPosition = window.scrollY;
            console.log('📍 [Bridge] Guardando posición de scroll actual:', currentScrollPosition);
            
            // Usar la arquitectura modular para procesar el comando
            const result = await this.irisCore.processText(command);
            
            console.log('✅ Comando procesado exitosamente:', result);
            
            // RESTAURAR POSICIÓN DE SCROLL: Volver a la posición original
            setTimeout(() => {
                console.log('📍 [Bridge] Restaurando posición de scroll a:', currentScrollPosition);
                window.scrollTo({
                    top: currentScrollPosition,
                    behavior: 'instant' // Sin animación para evitar saltos
                });
            }, 100);
            
            return { success: true, result: result };
            
        } catch (error) {
            console.error('❌ Error procesando comando:', error);
            return { success: false, error: error.message };
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
}

// Crear instancia global
window.irisChatBridge = new IrisChatBridge();

// Exportar para uso en consola
console.log('🌉 IrisChatBridge cargado y disponible como window.irisChatBridge');
console.log('🧪 Para probar: window.irisChatBridge.processChatCommand("1 dormitorio")');
