# 💰 Implementación de Filtrado por Precio - IRIS Modular System

## 📋 Resumen Ejecutivo

Este documento describe la implementación completa del sistema de filtrado por precio para IRIS, permitiendo a los usuarios filtrar apartamentos por rangos de precio y precios específicos usando comandos de voz naturales.

## 🎯 Objetivos

- **Filtrado por Rango de Precio**: Permitir comandos como "mostrar uno con precio entre $4.000-5.000 UF"
- **Filtrado por Precio Específico**: Permitir comandos como "buscar de 4.500 UF"
- **Activación de Botón "Recorrer"**: Automáticamente activar el botón correspondiente del apartamento filtrado
- **Integración con Sistema Existente**: Mantener compatibilidad con VideoScrollApp y ComponentManager

## 🏗️ Arquitectura de la Solución

### 1. Componentes Principales

#### `FilterHandler.js` - Manejador de Filtros
```javascript
class FilterHandler extends CommandHandler {
    async execute(command) {
        // Lógica de filtrado por precio
        // Activación de botones "Recorrer"
        // Integración con VideoScrollApp
    }
}
```

#### `NaturalLanguageParser.js` - Parser de Comandos
```javascript
class NaturalLanguageParser extends CommandParser {
    parsePriceFilter(text) {
        // Extracción de rangos de precio
        // Extracción de precios específicos
        // Normalización de formatos
    }
}
```

### 2. Flujo de Procesamiento

```
Comando de Voz → NaturalLanguageParser → FilterHandler → VideoScrollApp → UI Update
```

## 🔧 Implementación Técnica

### 1. Configuración de Comandos (`commands.json`)

```json
{
  "price_filter": {
    "aliases": [
      "mostrar uno con precio entre",
      "buscar de",
      "filtrar por precio de",
      "mostrar apartamentos de precio"
    ],
    "parameters": {
      "price_range": {
        "type": "range",
        "pattern": "\\$?([0-9.,]+)-([0-9.,]+)\\s*UF",
        "required": true
      },
      "specific_price": {
        "type": "number",
        "pattern": "([0-9.,]+)\\s*UF",
        "required": false
      }
    },
    "examples": [
      "mostrar uno con precio entre $4.000-5.000 UF",
      "buscar de 4.500 UF",
      "filtrar por precio de 2000-3000 UF"
    ]
  }
}
```

### 2. Lógica de Parsing de Precios

#### Extracción de Rangos
```javascript
// Patrón: $4.000-5.000 UF o 4000-5000 UF
const rangePattern = /\$?([0-9.,]+)-([0-9.,]+)\s*UF/i;
const match = text.match(rangePattern);
if (match) {
    const minPrice = parseFloat(match[1].replace(/\./g, ''));
    const maxPrice = parseFloat(match[2].replace(/\./g, ''));
    return { type: 'range', min: minPrice, max: maxPrice };
}
```

#### Extracción de Precios Específicos
```javascript
// Patrón: 4.500 UF o $4.500 UF
const specificPattern = /\$?([0-9.,]+)\s*UF/i;
const match = text.match(specificPattern);
if (match) {
    const price = parseFloat(match[1].replace(/\./g, ''));
    return { type: 'specific', price: price };
}
```

### 3. Lógica de Filtrado en DOM

#### Búsqueda de Apartamentos por Precio
```javascript
async filterByPrice(priceFilter) {
    const apartmentCards = document.querySelectorAll('.apartment-card');
    let matchingCard = null;
    
    for (const card of apartmentCards) {
        const priceElement = card.querySelector('[data-precio]');
        if (!priceElement) continue;
        
        const priceText = priceElement.getAttribute('data-precio');
        const cardPrice = this.extractPriceFromText(priceText);
        
        if (this.matchesPriceFilter(cardPrice, priceFilter)) {
            matchingCard = card;
            break;
        }
    }
    
    return matchingCard;
}
```

#### Activación de Botón "Recorrer"
```javascript
async activateRecorrerButton(card) {
    const recorrerButton = card.querySelector('.watchVideoBtn');
    if (recorrerButton) {
        // Simular click
        recorrerButton.click();
        
        // Efectos visuales
        recorrerButton.classList.add('clicked');
        setTimeout(() => {
            recorrerButton.classList.remove('clicked');
        }, 500);
        
        return true;
    }
    return false;
}
```

## 🧪 Casos de Prueba

### 1. Comandos de Rango de Precio

| Comando | Precio Extraído | Comportamiento Esperado |
|---------|----------------|------------------------|
| "mostrar uno con precio entre $4.000-5.000 UF" | min: 4000, max: 5000 | Activar botón "Recorrer" del apartamento $4.000-5.000 UF |
| "filtrar por precio de 2000-3000 UF" | min: 2000, max: 3000 | Activar botón "Recorrer" del apartamento $2.000-3.000 UF |
| "buscar apartamentos entre $1.500-2.500 UF" | min: 1500, max: 2500 | Activar botón "Recorrer" del apartamento $1.500-2.500 UF |

### 2. Comandos de Precio Específico

| Comando | Precio Extraído | Comportamiento Esperado |
|---------|----------------|------------------------|
| "buscar de 4.500 UF" | price: 4500 | Activar botón "Recorrer" del apartamento $3.500-4.500 UF |
| "mostrar de 2500 UF" | price: 2500 | Activar botón "Recorrer" del apartamento $2.000-3.000 UF |

### 3. Casos Edge

| Comando | Comportamiento Esperado |
|---------|------------------------|
| "mostrar uno con precio entre $10.000-15.000 UF" | No encontrar coincidencias, mensaje de error |
| "buscar de 1000 UF" | No encontrar coincidencias, mensaje de error |
| "filtrar por precio" | Error: parámetros insuficientes |

## 🔄 Integración con Sistema Existente

### 1. VideoScrollApp Integration
```javascript
// Navegación a sección de apartamentos
await window.videoScrollApp.navigationSystem.navigateToSection('apartments');

// Aplicación de filtros
await window.videoScrollApp.componentManager.applyFilter({
    type: 'price',
    filter: priceFilter
});
```

### 2. ComponentManager Integration
```javascript
// Notificación de filtro aplicado
await window.videoScrollApp.componentManager.applyFilter({
    type: 'price_filter',
    data: {
        priceRange: priceFilter,
        matchingApartment: apartmentInfo
    }
});
```

## 📊 Métricas y Monitoreo

### 1. Logs de Actividad
```javascript
console.log(`[IRIS Price Filter] Command: "${command}"`);
console.log(`[IRIS Price Filter] Extracted price: ${JSON.stringify(priceFilter)}`);
console.log(`[IRIS Price Filter] Matching apartment found: ${matchingCard ? 'Yes' : 'No'}`);
console.log(`[IRIS Price Filter] Button activated: ${buttonActivated ? 'Yes' : 'No'}`);
```

### 2. Métricas de Rendimiento
- Tiempo de procesamiento del comando
- Tiempo de búsqueda en DOM
- Tiempo de activación del botón
- Tasa de éxito de filtrado

## 🚀 Optimizaciones Implementadas

### 1. Caché de Elementos DOM
```javascript
// Cache de elementos frecuentemente accedidos
this.domCache = {
    apartmentCards: null,
    lastUpdate: 0
};

getApartmentCards() {
    const now = Date.now();
    if (!this.domCache.apartmentCards || (now - this.domCache.lastUpdate) > 5000) {
        this.domCache.apartmentCards = document.querySelectorAll('.apartment-card');
        this.domCache.lastUpdate = now;
    }
    return this.domCache.apartmentCards;
}
```

### 2. Parsing Optimizado
```javascript
// Compilación de regex para mejor rendimiento
static PRICE_PATTERNS = {
    range: new RegExp(/\\$?([0-9.,]+)-([0-9.,]+)\\s*UF/i),
    specific: new RegExp(/\\$?([0-9.,]+)\\s*UF/i)
};
```

## 🔧 Configuración y Personalización

### 1. Variables de Configuración
```javascript
const PRICE_FILTER_CONFIG = {
    // Tolerancia para precios específicos (±10%)
    tolerance: 0.1,
    
    // Formato de moneda
    currency: 'UF',
    
    // Separadores de miles
    thousandSeparator: '.',
    
    // Tiempo de espera para efectos visuales
    animationDuration: 500
};
```

### 2. Personalización de Comandos
```javascript
// Agregar nuevos aliases
commands.price_filter.aliases.push(
    'encontrar de precio',
    'mostrar de valor'
);

// Agregar nuevos patrones
commands.price_filter.parameters.price_range.patterns.push(
    '([0-9.,]+)\\s*a\\s*([0-9.,]+)\\s*UF'
);
```

## 🐛 Troubleshooting

### 1. Problemas Comunes

#### No se encuentran apartamentos
- Verificar que los elementos tengan el atributo `data-precio`
- Verificar el formato del precio en el DOM
- Revisar logs de parsing

#### Botón "Recorrer" no se activa
- Verificar que el botón tenga la clase `watchVideoBtn`
- Verificar que el elemento sea clickeable
- Revisar eventos de JavaScript

#### Parsing incorrecto de precios
- Verificar patrones regex
- Verificar formato de entrada
- Revisar normalización de números

### 2. Debugging
```javascript
// Habilitar modo debug
window.IRIS_DEBUG = true;

// Ver logs detallados
console.log('[IRIS Debug] Price parsing:', priceFilter);
console.log('[IRIS Debug] DOM elements:', apartmentCards);
console.log('[IRIS Debug] Matching result:', matchingCard);
```

## 📈 Roadmap Futuro

### 1. Mejoras Planificadas
- [ ] Filtrado por múltiples rangos de precio
- [ ] Filtrado combinado (precio + dormitorios)
- [ ] Historial de filtros aplicados
- [ ] Sugerencias de precios basadas en datos

### 2. Nuevas Funcionalidades
- [ ] Comparación de precios
- [ ] Alertas de precio
- [ ] Filtrado por tendencias de precio
- [ ] Exportación de resultados filtrados

## 📚 Referencias

- [Documentación IRIS Core](./iris-core-overview.md)
- [Guía de Comandos](./commands-guide.md)
- [Arquitectura Modular](./modular-architecture.md)
- [VideoScrollApp Integration](./video-scroll-integration.md)

---

**Versión**: 1.0.0  
**Fecha**: Diciembre 2024  
**Autor**: IRIS Development Team
