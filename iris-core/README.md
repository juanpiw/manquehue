# 🧠 IRIS Modular System v2.0.0

## 📋 Descripción General

IRIS Modular System es una arquitectura de sistema de comandos de voz modular y extensible para el dashboard de Manquehue. El sistema implementa patrones de diseño avanzados para proporcionar máxima flexibilidad, mantenibilidad y escalabilidad.

## 🏗️ Arquitectura

### Patrones de Diseño Implementados

1. **Strategy Pattern** - Para diferentes estrategias de parsing y ejecución
2. **Registry Pattern** - Para gestión centralizada de comandos y componentes
3. **Adapter Pattern** - Para adaptar comandos a diferentes sistemas UI
4. **Observer Pattern** - Para notificaciones y eventos del sistema
5. **Command Pattern** - Para encapsular solicitudes como objetos

### Estructura de Directorios

```
iris-core/
├── core/                    # Componentes core del sistema
│   ├── CommandParser.js     # Parser base con Strategy pattern
│   ├── CommandRegistry.js   # Registro de comandos
│   ├── CommandExecutor.js   # Ejecutor de comandos
│   └── UIController.js      # Controlador UI base
├── parsers/                 # Estrategias de parsing
│   ├── NaturalLanguageParser.js    # Parsing de lenguaje natural
│   └── StructuredCommandParser.js  # Parsing de comandos estructurados
├── handlers/                # Manejadores de comandos específicos
│   ├── NavigationHandler.js # Navegación
│   ├── VideoHandler.js      # Control de video
│   └── FilterHandler.js     # Filtros
├── controllers/             # Controladores UI específicos
│   ├── ScrollController.js  # Control de scroll
│   ├── VideoController.js   # Control de video
│   └── FilterController.js  # Control de filtros
├── config/                  # Configuración del sistema
│   ├── commands.json        # Definición de comandos
│   └── ui-mappings.json     # Mapeos UI
├── IRISCore.js              # Clase principal del sistema
├── iris-loader.js           # Cargador dinámico de componentes
└── README.md               # Esta documentación
```

## 🚀 Instalación y Uso

### 1. Carga del Sistema

```html
<!-- Cargar el sistema modular -->
<script src="iris-core/iris-loader.js"></script>
```

### 2. Inicialización Automática

El sistema se inicializa automáticamente al cargar `iris-loader.js`:

```javascript
// El sistema está disponible como window.IRIS
if (window.IRIS) {
    console.log('IRIS Core inicializado:', window.IRIS.getStatus());
}
```

### 3. API Principal

#### Procesar Texto Natural

```javascript
// Procesar comando en lenguaje natural
const result = await window.IRIS.processText('ir a apartamentos');
console.log(result);
// Output: { success: true, command: { type: 'navigation', action: 'goto', key: 'apartments' } }
```

#### Ejecutar Comando Directo

```javascript
// Ejecutar comando estructurado
const command = {
    type: 'navigation',
    action: 'goto',
    key: 'apartments'
};
const result = await window.IRIS.executeCommand(command);
```

#### API Legacy Compatible

```javascript
// La API legacy sigue funcionando
await window.IR.goto('apartments');
await window.IR.video('play');
await window.IR.scrollTo('top');
```

## 🔧 Puntos de Cambio (Change Points)

### 1. Cambiar Parser

```javascript
// Cambiar a parser estructurado
window.IRIS.commandParser.setParser('StructuredCommandParser');

// Registrar nuevo parser personalizado
const customParser = {
    name: 'CustomParser',
    parse: (text) => { /* lógica personalizada */ }
};
window.IRIS.commandParser.registerParser('CustomParser', customParser);
```

### 2. Registrar Nuevos Comandos

```javascript
// Registrar comando personalizado
window.IRIS.commandRegistry.register('customCommand', {
    execute: async (params) => { /* lógica del comando */ }
}, {
    description: 'Comando personalizado',
    category: 'custom',
    aliases: ['custom', 'personalizado']
});
```

### 3. Cambiar Controllers

```javascript
// Cambiar controller para área específica
window.IRIS.uiController.setController('scroll', 'CustomScrollController');

// Registrar nuevo controller
const customController = {
    name: 'CustomScrollController',
    execute: async (command) => { /* lógica personalizada */ }
};
window.IRIS.uiController.registerController('CustomScrollController', customController);
```

### 4. Cambiar Handlers

```javascript
// Los handlers se registran automáticamente al cargar
// Para agregar nuevos handlers, crear archivo en handlers/ y será cargado automáticamente
```

## 📝 Configuración

### commands.json

Define todos los comandos disponibles:

```json
{
  "commands": {
    "goto": {
      "name": "goto",
      "description": "Navigate to a specific section",
      "category": "navigation",
      "aliases": ["navegar", "ir", "mostrar"],
      "parameters": [
        {
          "name": "key",
          "type": "string",
          "required": true,
          "description": "Target section key"
        }
      ]
    }
  }
}
```

### ui-mappings.json

Mapea comandos lógicos a elementos UI específicos:

```json
{
  "uiMappings": {
    "navigation": {
      "apartments": {
        "selector": "[data-section='apartments']",
        "scrollTarget": "apartments",
        "videoSection": "apartments"
      }
    }
  }
}
```

## 🧪 Testing

### Archivo de Pruebas

```html
<!-- Abrir test-iris-modular.html en el navegador -->
```

### Comandos de Testing

```javascript
// Test básico del sistema
window.IRIS.test();

// Test de parser específico
window.IRIS.commandParser.test('ir a apartamentos');

// Test de comando específico
window.IRIS.commandRegistry.test('goto');
```

## 🔍 Debugging

### Logs del Sistema

```javascript
// Habilitar logs detallados
window.IRIS.setLogLevel('debug');

// Obtener logs
const logs = window.IRIS.getLogs();
console.log(logs);
```

### Estado del Sistema

```javascript
// Obtener estado completo
const status = window.IRIS.getStatus();
console.log(status);

// Obtener información del sistema
const info = window.IRIS.getInfo();
console.log(info);
```

## 📊 Métricas de Éxito

### Indicadores de Rendimiento

- **Tiempo de respuesta**: < 100ms para comandos simples
- **Precisión de parsing**: > 95% para comandos estándar
- **Compatibilidad**: 100% con API legacy
- **Extensibilidad**: Nuevos comandos sin modificar código existente

### Métricas de Uso

```javascript
// Obtener métricas de uso
const metrics = window.IRIS.getMetrics();
console.log(metrics);
// Output: { totalCommands: 150, successRate: 0.98, avgResponseTime: 85 }
```

## 🔄 Migración desde v1.0

### Cambios Automáticos

1. **API Legacy**: Mantiene 100% compatibilidad
2. **Carga**: Automática, no requiere cambios en código existente
3. **Configuración**: Migración automática de configuraciones existentes

### Cambios Opcionales

```javascript
// Usar nueva API (opcional)
// Antes: window.IR.goto('apartments')
// Ahora: window.IRIS.processText('ir a apartamentos')

// Usar comandos estructurados (opcional)
await window.IRIS.executeCommand({
    type: 'navigation',
    action: 'goto',
    key: 'apartments'
});
```

## 🚀 Extensibilidad

### Crear Nuevo Parser

```javascript
// Crear archivo: parsers/CustomParser.js
class CustomParser {
    constructor() {
        this.name = 'CustomParser';
    }
    
    parse(text) {
        // Lógica de parsing personalizada
        return { type: 'custom', action: 'execute', data: text };
    }
}

// El parser se registra automáticamente al cargar
```

### Crear Nuevo Handler

```javascript
// Crear archivo: handlers/CustomHandler.js
class CustomHandler {
    constructor() {
        this.name = 'CustomHandler';
        this.supportedActions = ['custom'];
    }
    
    async handle(command, context = {}) {
        // Lógica del handler
        return { success: true, result: 'Custom action executed' };
    }
}

// El handler se registra automáticamente al cargar
```

### Crear Nuevo Controller

```javascript
// Crear archivo: controllers/CustomController.js
class CustomController {
    constructor() {
        this.name = 'CustomController';
        this.supportedActions = ['custom'];
    }
    
    async execute(command, context = {}) {
        // Lógica del controller
        return { success: true, result: 'Custom UI action executed' };
    }
}

// El controller se registra automáticamente al cargar
```

## 📚 Referencias

### Patrones de Diseño

- **Strategy Pattern**: [Wikipedia](https://en.wikipedia.org/wiki/Strategy_pattern)
- **Registry Pattern**: [Wikipedia](https://en.wikipedia.org/wiki/Service_locator_pattern)
- **Adapter Pattern**: [Wikipedia](https://en.wikipedia.org/wiki/Adapter_pattern)
- **Observer Pattern**: [Wikipedia](https://en.wikipedia.org/wiki/Observer_pattern)
- **Command Pattern**: [Wikipedia](https://en.wikipedia.org/wiki/Command_pattern)

### Documentación Técnica

- **API Reference**: Ver comentarios en código fuente
- **Configuration Guide**: Ver archivos en `config/`
- **Testing Guide**: Ver `test-iris-modular.html`

## 🤝 Contribución

### Guías de Desarrollo

1. **Nuevos Componentes**: Crear en directorio correspondiente
2. **Configuración**: Actualizar archivos JSON en `config/`
3. **Testing**: Agregar tests en `test-iris-modular.html`
4. **Documentación**: Actualizar este README

### Estándares de Código

- **ES6+**: Usar sintaxis moderna de JavaScript
- **JSDoc**: Documentar todas las funciones públicas
- **Error Handling**: Manejar errores apropiadamente
- **Logging**: Usar sistema de logs integrado

## 📄 Licencia

Este proyecto es parte del dashboard de Manquehue y está sujeto a los términos de licencia del proyecto principal.

---

**Versión**: 2.0.0  
**Última actualización**: Diciembre 2024  
**Autor**: Equipo de Desarrollo Manquehue
