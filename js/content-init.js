/**
 * content-init.js - Inicialización simple del ContentManager
 */

// Función para inicializar el ContentManager de manera simple
function initializeContentManager() {
    console.log('📋 ContentManager: Inicializando de manera simple...');
    
    try {
        // Crear instancia del ContentManager si no existe
        if (!window.contentManager) {
            window.contentManager = new ContentManager();
            console.log('✅ ContentManager: Nueva instancia creada');
        } else {
            console.log('✅ ContentManager: Usando instancia existente');
        }
        
        // Verificar que se inicializó correctamente
        setTimeout(() => {
            if (window.contentManager && window.contentManager.isInitialized) {
                console.log('✅ ContentManager: Inicialización completada');
                
                // Mostrar información de debug
                window.contentManager.debugInfo();
                
                // Verificar que el contenido se cargó correctamente
                const currentData = window.contentManager.getCurrentData();
                if (currentData) {
                    console.log('📊 ContentManager: Datos cargados correctamente');
                    console.log('📝 Título:', currentData.title);
                    console.log('📝 Descripción:', currentData.description ? currentData.description.substring(0, 100) + '...' : 'No disponible');
                }
            } else {
                console.warn('⚠️ ContentManager: No se pudo verificar la inicialización');
            }
        }, 2000);
        
    } catch (error) {
        console.error('❌ ContentManager: Error en inicialización:', error);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('📋 ContentManager: DOM listo, inicializando...');
    
    // Esperar un poco para que otros scripts se carguen
    setTimeout(() => {
        initializeContentManager();
    }, 1000);
});

// También inicializar cuando la página esté completamente cargada
window.addEventListener('load', () => {
    console.log('📋 ContentManager: Página cargada completamente');
    
    // Si no se ha inicializado aún, hacerlo ahora
    if (!window.contentManager) {
        setTimeout(() => {
            initializeContentManager();
        }, 500);
    }
});
