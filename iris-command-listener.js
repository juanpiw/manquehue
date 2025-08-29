// iris-command-listener.js
const WEBHOOK_URL = 'https://impactrender.app.n8n.cloud/webhook/57a76c39-7ea3-4ce2-b5f5-41c6adf02c34/chat';
const DEFAULT_LANG = 'es';

// Chat Bootstrap
async function loadChat() {
  try {
    const { createChat } = await import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js');
    const chat = createChat({
      webhookUrl: WEBHOOK_URL,
      webhookConfig: {
        method: 'POST',
        headers: {}
      },
      mode: 'window',
      chatInputKey: 'chatInput',
      chatSessionKey: 'sessionId',
      loadPreviousSession: false,
      metadata: {
        page_type: 'video_scroll_demo',
        source: 'dash_imanquehue'
      },
      showWelcomeScreen: false,
      defaultLanguage: DEFAULT_LANG,
      initialMessages: [
        "¡Hola! Soy Iris, tu asistente virtual de Mirador del Golf. Puedo ayudarte a explorar nuestros exclusivos apartamentos, mostrar las amenidades del proyecto o responder cualquier consulta sobre este desarrollo premium en Piedra Roja. ¿En qué puedo ayudarte hoy?"
      ],
      i18n: {
        es: {
          title: 'Iris - Mirador del Golf',
          subtitle: "Tu asistente virtual inmobiliario",
          footer: '',
          getStarted: 'Iniciar nueva conversación',
          inputPlaceholder: 'Pregunta sobre apartamentos, amenidades...',
        },
      },
      enableStreaming: false,
    });
    return chat;
  } catch (error) {
    console.error('[iris-cmd] Error loading n8n chat module:', error);
    // Fallback para entornos donde dynamic import no funciona
    if (typeof window.createChat === 'function') {
      console.warn('[iris-cmd] Usando window.createChat como fallback.');
      const chat = window.createChat({
        webhookUrl: WEBHOOK_URL,
        webhookConfig: {
          method: 'POST',
          headers: {}
        },
        mode: 'window',
        chatInputKey: 'chatInput',
        chatSessionKey: 'sessionId',
        loadPreviousSession: false,
        metadata: {
          page_type: 'video_scroll_demo',
          source: 'dash_imanquehue'
        },
        showWelcomeScreen: false,
        defaultLanguage: DEFAULT_LANG,
        initialMessages: [
          "¡Hola! Soy Iris, tu asistente virtual de Mirador del Golf. Puedo ayudarte a explorar nuestros exclusivos apartamentos, mostrar las amenidades del proyecto o responder cualquier consulta sobre este desarrollo premium en Piedra Roja. ¿En qué puedo ayudarte hoy?"
        ],
        i18n: {
          es: {
            title: 'Iris - Mirador del Golf',
            subtitle: "Tu asistente virtual inmobiliario",
            footer: '',
            getStarted: 'Iniciar nueva conversación',
            inputPlaceholder: 'Pregunta sobre apartamentos, amenidades...',
          },
        },
        enableStreaming: false,
      });
      return chat;
    }
    throw new Error('n8n chat not available.');
  }
}

// Command Parsing and Routing
function parseCmdTokens(message) {
  const cmdRegex = /\[\[cmd\s+([^\]]+)\]\]/g;
  const commands = [];
  let match;

  while ((match = cmdRegex.exec(message)) !== null) {
    const cmdString = match[1];
    const params = {};
    
    // Parse key=value pairs with better handling
    const paramRegex = /(\w+)=([^\s]+)/g;
    let paramMatch;
    
    while ((paramMatch = paramRegex.exec(cmdString)) !== null) {
      const key = paramMatch[1];
      let value = paramMatch[2];
      
      // Handle quoted values
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // Convert numeric values
      if (!isNaN(value) && value !== '') {
        value = parseFloat(value);
      }
      
      params[key] = value;
    }
    
    commands.push(params);
  }
  
  return commands;
}

async function routeCommand(cmd) {
  if (!window.IR) {
    console.error('[iris-cmd] IR API not available');
    return false;
  }

  const { action, key, percent, section } = cmd;
  
  try {
    switch (action) {
      case 'goto':
        if (!key) {
          console.warn('[iris-cmd] goto requires key parameter');
          return false;
        }
        return await window.IR.goto(key);
        
      case 'video':
        if (!key) {
          console.warn('[iris-cmd] video requires key parameter');
          return false;
        }
        return await window.IR.video(key);
        
      case 'play':
        return await window.IR.play();
        
      case 'pause':
        return await window.IR.pause();
        
      case 'scroll':
        const scrollPercent = percent ? parseFloat(percent) : 50;
        return await window.IR.scrollTo(scrollPercent);
        
      case 'next':
        return await window.IR.next();
        
      case 'prev':
        return await window.IR.prev();
        
      case 'state':
        const state = await window.IR.state();
        console.log('[iris-cmd] Current state:', state);
        return true;
        
      case 'help':
        showHelpMessage();
        return true;
        
      case 'reset':
        return await window.IR.reset();
        
      case 'modal':
        if (!key) {
          console.warn('[iris-cmd] modal requires key parameter');
          return false;
        }
        const modalAction = cmd.action2 || 'open';
        return await window.IR.modal(modalAction, key);
        
      case 'form':
        if (!key) {
          console.warn('[iris-cmd] form requires key parameter');
          return false;
        }
        const formAction = cmd.action2 || 'fill';
        const formData = cmd.data ? JSON.parse(cmd.data) : {};
        return await window.IR.form(formAction, key, formData);
        
             case 'track':
         if (!key) {
           console.warn('[iris-cmd] track requires key parameter');
           return false;
         }
         const trackData = cmd.data ? JSON.parse(cmd.data) : {};
         return await window.IR.track(key, trackData);
         
               case 'detect':
          if (!key) {
            console.warn('[iris-cmd] detect requires key parameter (text to analyze)');
            return false;
          }
          const result = await window.IR.detectAndNavigate(key);
          console.log('[iris-cmd] Detection result:', result);
          return result.success;
          
        case 'clear':
          if (key === 'filters') {
            return await window.IR.clearFilters();
          }
          console.warn('[iris-cmd] clear requires key=filters parameter');
          return false;
         
       case 'setSectionVideos':
        // This would need a proper payload structure
        console.log('[iris-cmd] setSectionVideos not implemented yet');
        return false;
        
      default:
        console.warn(`[iris-cmd] Unknown action: ${action}`);
        return false;
    }
  } catch (error) {
    console.error('[iris-cmd] Command execution error:', error);
    return false;
  }
}

// Helper function to show help message
function showHelpMessage() {
  const helpText = `
🎮 **Comandos disponibles:**

**Navegación:**
• \`[[cmd action=goto key=section-1]]\` - Ir a sección
• \`[[cmd action=goto key=apartments]]\` - Ir a apartamentos
• \`[[cmd action=goto key=features]]\` - Ir a características
• \`[[cmd action=goto key=equipment]]\` - Ir a equipamiento
• \`[[cmd action=next]]\` - Siguiente sección
• \`[[cmd action=prev]]\` - Sección anterior

**Video:**
• \`[[cmd action=video key=apartamento]]\` - Mostrar apartamentos
• \`[[cmd action=video key=casa]]\` - Mostrar casas
• \`[[cmd action=video key=amenities]]\` - Mostrar amenidades
• \`[[cmd action=play]]\` - Reproducir video
• \`[[cmd action=pause]]\` - Pausar video

**Scroll:**
• \`[[cmd action=scroll percent=50]]\` - Scroll al 50%
• \`[[cmd action=scroll percent=0]]\` - Ir al inicio
• \`[[cmd action=scroll percent=100]]\` - Ir al final

**Modales y Formularios:**
• \`[[cmd action=modal key=project]]\` - Abrir modal de proyecto
• \`[[cmd action=modal key=contact]]\` - Abrir modal de contacto
• \`[[cmd action=form key=project action2=fill data='{"name":"Juan","email":"juan@test.com"}']]\` - Llenar formulario
• \`[[cmd action=form key=project action2=submit]]\` - Enviar formulario

**Detección Automática:**
• \`[[cmd action=detect key="me gustaría ver la cocina"]]\` - Detectar área y navegar automáticamente
• \`[[cmd action=detect key="muéstrame los apartamentos"]]\` - Detectar tipo de propiedad
• \`[[cmd action=detect key="apartamento de 2 dormitorios"]]\` - Filtrar apartamentos automáticamente
• \`[[cmd action=clear key=filters]]\` - Limpiar filtros aplicados

**Analytics:**
• \`[[cmd action=track key=button_click data='{"category":"engagement"}']]\` - Trackear evento

**Otros:**
• \`[[cmd action=state]]\` - Ver estado actual
• \`[[cmd action=reset]]\` - Resetear a inicio
• \`[[cmd action=help]]\` - Mostrar esta ayuda
  `;
  
  console.log('[iris-cmd] Help:', helpText);
  
  // También mostrar en el chat si es posible
  const chatInput = document.querySelector('.chat-input');
  if (chatInput) {
    chatInput.value = helpText;
    chatInput.focus();
  }
}

// Message Observer
function attachMessageObserver(targetNode) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Look for chat messages
            const messages = node.querySelectorAll('.chat-message-markdown, .chat-message-text');
            
                         messages.forEach((messageElement) => {
               const messageText = messageElement.textContent || messageElement.innerText;
               if (messageText) {
                 // Primero buscar comandos explícitos
                 const commands = parseCmdTokens(messageText);
                 
                 if (commands.length > 0) {
                   // Procesar comandos explícitos
                   commands.forEach(async (cmd) => {
                     console.log('[iris-cmd] Processing explicit command:', cmd);
                     
                     // Show visual feedback
                     showCommandFeedback(cmd, 'processing');
                     
                     const success = await routeCommand(cmd);
                     console.log(`[iris-cmd] Command ${success ? 'executed' : 'failed'}:`, cmd);
                     
                     // Show result feedback
                     showCommandFeedback(cmd, success ? 'success' : 'error');
                   });
                                    } else {
                     // Si no hay comandos explícitos, intentar detección automática
                     console.log('[iris-cmd] No explicit commands found, trying auto-detection...');
                     
                     // Solo detectar si el mensaje parece ser del usuario (no del bot)
                     const isUserMessage = messageElement.closest('.chat-message-user') || 
                                         !messageElement.closest('.chat-message-bot');
                     
                     if (isUserMessage && messageText.length > 10) {
                       // Usar Promise para manejar async/await
                       window.IR.detectAndNavigate(messageText).then(detectionResult => {
                         if (detectionResult.success) {
                           console.log('[iris-cmd] Auto-detection successful:', detectionResult);
                           showCommandFeedback({ action: 'detect', key: 'auto' }, 'success');
                         }
                       }).catch(error => {
                         console.log('[iris-cmd] Auto-detection failed:', error);
                       });
                     }
                   }
               }
             });
          }
        });
      }
    });
  });

  observer.observe(targetNode, {
    childList: true,
    subtree: true
  });

  console.log('[iris-cmd] Message observer attached');
}

// Initialization
(function initIrisListener() {
  // Load chat styles
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
  document.head.appendChild(link);

  // Initialize chat and attach observer
  loadChat().then(chatInstance => {
    console.log('[iris-cmd] n8n chat widget initialized.', chatInstance);
    
    // Wait for chat to be fully loaded
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-window-wrapper') || document.body;
      attachMessageObserver(chatContainer);
    }, 2000);
    
  }).catch(error => {
    console.error('[iris-cmd] Failed to initialize n8n chat:', error);
  });

  // Helper function for console testing
  window.irisTest = (cmdString) => {
    const commands = parseCmdTokens(cmdString);
    commands.forEach(async (cmd) => {
      console.log('[iris-cmd] Testing command:', cmd);
      const success = await routeCommand(cmd);
      console.log(`[iris-cmd] Test ${success ? 'passed' : 'failed'}:`, cmd);
    });
  };

  console.info('[iris-cmd] Listener activo. Usa irisTest("[[cmd action=goto key=features]]") para probar.');
})();

// Visual feedback for commands
function showCommandFeedback(cmd, status) {
  const { action, key } = cmd;
  
  // Create or get feedback element
  let feedbackEl = document.getElementById('iris-command-feedback');
  if (!feedbackEl) {
    feedbackEl = document.createElement('div');
    feedbackEl.id = 'iris-command-feedback';
    feedbackEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 10px;
      color: white;
      font-weight: 600;
      z-index: 10004;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(feedbackEl);
  }
  
  // Set content and style based on status
  let text, bgColor, icon;
  
  switch (status) {
    case 'processing':
      text = `🔄 Ejecutando: ${action} ${key || ''}`;
      bgColor = 'linear-gradient(135deg, #FFA500, #FF8C00)';
      icon = '🔄';
      break;
    case 'success':
      text = `✅ Completado: ${action} ${key || ''}`;
      bgColor = 'linear-gradient(135deg, #28a745, #20c997)';
      icon = '✅';
      break;
    case 'error':
      text = `❌ Error: ${action} ${key || ''}`;
      bgColor = 'linear-gradient(135deg, #dc3545, #c82333)';
      icon = '❌';
      break;
  }
  
  feedbackEl.innerHTML = `${icon} ${text}`;
  feedbackEl.style.background = bgColor;
  feedbackEl.style.transform = 'translateX(0)';
  
  // Auto-hide after delay
  setTimeout(() => {
    feedbackEl.style.transform = 'translateX(100%)';
  }, status === 'processing' ? 2000 : 3000);
}
