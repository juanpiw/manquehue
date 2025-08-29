# 🏠 Guía de Filtrado por Dormitorios - IRIS Modular System

## 📋 Descripción

El sistema IRIS Modular ahora incluye funcionalidad avanzada para filtrar departamentos por número de dormitorios mediante comandos de voz naturales. Esta funcionalidad permite a los usuarios activar filtros específicos simplemente hablando.

## 🎯 Comandos Soportados

### Comandos de Filtrado por Dormitorios

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `mostrar departamento de X dormitorio(s)` | Mostrar departamentos con X dormitorios | "mostrar departamento de 1 dormitorio" |
| `filtrar por X dormitorio(s)` | Filtrar por X dormitorios | "filtrar por 2 dormitorios" |
| `buscar apartamento de X dormitorio(s)` | Buscar apartamentos con X dormitorios | "buscar apartamento de 3 dormitorios" |
| `ver departamento de X dormitorio(s)` | Ver departamentos con X dormitorios | "ver departamento de 1 dormitorio" |

### Comandos de Limpieza

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `limpiar filtros` | Limpiar todos los filtros aplicados | "limpiar filtros" |
| `quitar filtros` | Quitar filtros activos | "quitar filtros" |
| `mostrar todos` | Mostrar todos los departamentos | "mostrar todos" |

## 🔧 Funcionamiento Técnico

### 1. Parsing de Comandos

El `NaturalLanguageParser` detecta patrones específicos en el texto:

```javascript
// Patrones de dormitorios
const bedroomPatterns = [
    { pattern: /(?:mostrar|filtrar|buscar|ver)\s+(?:un\s+)?(?:departamento|apartamento)\s+(?:de\s+)?(\d+)\s*(?:dormitorio|dormitorios|habitación|habitaciones)/, bedrooms: '$1' },
    { pattern: /(\d+)\s*(?:dormitorio|dormitorios|habitación|habitaciones)/, bedrooms: '$1' },
    { pattern: /(?:apartamento|departamento)\s+(?:de\s+)?(\d+)\s*(?:dormitorio|dormitorios)/, bedrooms: '$1' }
];
```

### 2. Activación de Filtros

El `FilterHandler` activa automáticamente los botones correspondientes:

```javascript
// Mapeo de dormitorios a data-type
const bedroomMapping = {
    1: '1d',
    2: '2d', 
    3: '3d'
};

// Activación del botón
const targetButton = typeSelector.querySelector(`[data-type="${targetType}"]`);
if (targetButton) {
    targetButton.classList.add('active');
    targetButton.click(); // Simular click
}
```

### 3. Estructura HTML Requerida

El sistema espera encontrar esta estructura HTML:

```html
<div class="apartment-type-selector">
    <button class="type-btn active" data-type="all">Todos</button>
    <button class="type-btn" data-type="1d">1 Dormitorio</button>
    <button class="type-btn" data-type="2d">2 Dormitorios</button>
    <button class="type-btn" data-type="3d">3 Dormitorios</button>
</div>
```

## 🚀 Implementación

### 1. Carga del Sistema

```html
<!-- Incluir el sistema modular -->
<script src="iris-core/iris-loader.js"></script>
```

### 2. Uso Básico

```javascript
// Procesar comando de voz
const result = await window.IRIS.processText('mostrar departamento de 2 dormitorios');

// Verificar resultado
if (result.success) {
    console.log('Filtro aplicado:', result.command.filters);
}
```

### 3. Uso Avanzado

```javascript
// Ejecutar comando directo
const command = {
    type: 'filter',
    action: 'apply',
    filters: { bedrooms: 2 }
};

const result = await window.IRIS.executeCommand(command);
```

## 🧪 Testing

### Archivo de Pruebas

Abrir `test-bedroom-filter.html` para probar la funcionalidad:

```bash
# Abrir en navegador
open test-bedroom-filter.html
```

### Comandos de Testing

```javascript
// Test de comandos específicos
await window.IRIS.processText('mostrar departamento de 1 dormitorio');
await window.IRIS.processText('filtrar por 2 dormitorios');
await window.IRIS.processText('buscar apartamento de 3 dormitorios');
await window.IRIS.processText('limpiar filtros');
```

### Verificación Visual

1. **Selector de Tipo**: Los botones deben cambiar de estado activo
2. **Lista de Apartamentos**: Solo deben mostrarse los apartamentos correspondientes
3. **Logs**: Verificar que los comandos se procesen correctamente

## 🔍 Debugging

### Logs del Sistema

```javascript
// Habilitar logs detallados
window.IRIS.setLogLevel('debug');

// Ver logs de filtrado
console.log(window.IRIS.getLogs());
```

### Verificación de Estado

```javascript
// Verificar estado del filtro
const status = window.IRIS.getStatus();
console.log('Filter status:', status);

// Verificar botones activos
const activeButton = document.querySelector('.type-btn.active');
console.log('Active button:', activeButton?.getAttribute('data-type'));
```

### Problemas Comunes

#### 1. Selector No Encontrado

```javascript
// Verificar que existe el selector
const selector = document.querySelector('.apartment-type-selector');
if (!selector) {
    console.error('Selector de tipo no encontrado');
}
```

#### 2. Botón No Encontrado

```javascript
// Verificar que existe el botón específico
const button = document.querySelector('[data-type="1d"]');
if (!button) {
    console.error('Botón para 1 dormitorio no encontrado');
}
```

#### 3. Filtro No Se Aplica

```javascript
// Verificar que el comando se procesó correctamente
const result = await window.IRIS.processText('mostrar departamento de 1 dormitorio');
console.log('Command result:', result);

// Verificar que el handler se ejecutó
if (result.success && result.command.type === 'filter') {
    console.log('Filter command processed successfully');
}
```

## 📊 Métricas de Rendimiento

### Indicadores de Éxito

- **Tiempo de respuesta**: < 200ms para comandos de filtrado
- **Precisión de parsing**: > 95% para comandos estándar
- **Activación de botones**: 100% de éxito
- **Filtrado visual**: Actualización inmediata de la lista

### Monitoreo

```javascript
// Obtener métricas de uso
const metrics = window.IRIS.getMetrics();
console.log('Filter metrics:', metrics);

// Obtener historial de comandos
const history = window.IRIS.getHistory(10);
console.log('Command history:', history);
```

## 🔄 Integración con Sistema Existente

### Compatibilidad

El sistema mantiene 100% compatibilidad con el código existente:

```javascript
// Código existente sigue funcionando
document.querySelector('[data-type="1d"]').click();

// Nuevas funcionalidades disponibles
await window.IRIS.processText('mostrar departamento de 1 dormitorio');
```

### Migración

No se requieren cambios en el código existente. La funcionalidad se activa automáticamente al cargar el sistema modular.

## 🎯 Casos de Uso

### 1. Usuario Busca Apartamento Específico

```
Usuario: "Muéstrame departamentos de 2 dormitorios"
IRIS: Activa filtro de 2 dormitorios
Resultado: Solo se muestran apartamentos de 2 dormitorios
```

### 2. Usuario Cambia de Criterio

```
Usuario: "Ahora quiero ver de 1 dormitorio"
IRIS: Cambia filtro a 1 dormitorio
Resultado: Se muestran solo apartamentos de 1 dormitorio
```

### 3. Usuario Limpia Filtros

```
Usuario: "Muéstrame todos los departamentos"
IRIS: Limpia filtros activos
Resultado: Se muestran todos los apartamentos
```

## 📚 Referencias

### Archivos Relacionados

- `iris-core/parsers/NaturalLanguageParser.js` - Parser de comandos
- `iris-core/handlers/FilterHandler.js` - Handler de filtros
- `iris-core/config/commands.json` - Configuración de comandos
- `test-bedroom-filter.html` - Archivo de pruebas

### API Reference

- `window.IRIS.processText()` - Procesar texto natural
- `window.IRIS.executeCommand()` - Ejecutar comando estructurado
- `window.IRIS.getStatus()` - Obtener estado del sistema
- `window.IRIS.getLogs()` - Obtener logs del sistema

---

**Versión**: 2.0.0  
**Última actualización**: Diciembre 2024  
**Compatibilidad**: 100% con sistema existente
