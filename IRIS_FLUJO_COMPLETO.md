# Flujo Completo de Iris - Filtros y Navegación de Apartamentos

## 🎯 Objetivo
Crear un sistema completo donde Iris pueda:
1. **Filtrar apartamentos** usando los filtros existentes de la UI
2. **Mostrar las tarjetas filtradas** 
3. **Activar el modo recorrido** automáticamente
4. **Navegar entre apartamentos** y acceder a detalles
5. **Controlar la reproducción de videos**

## 🔄 Flujo Completo

### 1. Detección de Filtros
Cuando el usuario dice algo como:
- "muéstrame apartamentos de 2 dormitorios"
- "quiero un dpto de 3 ambientes hasta 4000 UF"
- "apartamento de 70 m2"

**Iris detecta:**
- Número de dormitorios
- Rango de precio
- Superficie
- Otros filtros específicos

### 2. Activación de Filtros Existentes
```javascript
// Activa los botones de dormitorios existentes
const bedroomButtons = document.querySelectorAll('.type-btn');
// Configura filtros de superficie y precio
const surfaceFilter = document.getElementById('surfaceFilter');
const priceFilter = document.getElementById('priceFilter');
// Ejecuta la búsqueda usando el botón existente
const searchButton = document.getElementById('searchButton');
```

### 3. Activación Automática del Modo Recorrido
Después de aplicar filtros:
- Se muestran las tarjetas filtradas
- Se activa automáticamente el modo recorrido en la primera tarjeta
- Se muestran los controles de recorrido con información específica

### 4. Controles de Recorrido
Los controles muestran:
```html
<div id="recorridoControls" class="recorrido-controls">
    <div class="recorrido-info">
        <h3>2 Dormitorios</h3>
        <p>80-100 m² • $4.000-5.000 UF</p>
    </div>
    <div class="recorrido-actions">
        <button onclick="exitRecorridoMode()">Salir del Recorrido</button>
        <button onclick="showApartmentDetails()">Detalles</button>
        <button onclick="toggleVideoPlayback()">Pausar/Reproducir</button>
    </div>
</div>
```

## 🎮 Comandos de Navegación

### Comandos Detectados por Iris:

| Comando | Función | Ejemplo |
|---------|---------|---------|
| **Filtros** | Aplicar filtros y activar recorrido | "2 dormitorios", "hasta 4000 UF" |
| **Detalles** | Mostrar información detallada | "detalles", "más información" |
| **Siguiente** | Navegar al siguiente apartamento | "siguiente", "próximo" |
| **Anterior** | Navegar al apartamento anterior | "anterior", "atrás" |
| **Salir** | Salir del modo recorrido | "salir", "volver" |
| **Video** | Controlar reproducción | "pausar", "reproducir" |

## 🔧 Funciones Principales

### `filterApartments(filters)`
- Navega a la sección de apartamentos
- Activa los filtros existentes
- Ejecuta la búsqueda
- Activa automáticamente el modo recorrido

### `activateRecorridoMode(card, filters)`
- Simula click en la tarjeta
- Verifica que los controles estén visibles
- Actualiza la información en los controles

### `showApartmentDetails()`
- Busca y hace click en el botón "Detalles"
- Muestra información detallada del apartamento

### `nextApartment()` / `prevApartment()`
- Encuentra todas las tarjetas visibles
- Navega entre ellas de forma circular
- Actualiza los controles con nueva información

### `exitRecorridoMode()`
- Busca y hace click en "Salir del Recorrido"
- Vuelve al modo normal de filtros

### `toggleVideoPlayback()`
- Alterna entre pausar y reproducir el video
- Actualiza el texto del botón

## 🎯 Ejemplos de Uso

### Escenario 1: Filtrado Inicial
```
Usuario: "muéstrame apartamentos de 2 dormitorios"
Iris: 
1. Detecta filtro: bedrooms = 2
2. Navega a sección apartamentos
3. Activa botón "2 Dormitorios"
4. Ejecuta búsqueda
5. Activa modo recorrido automáticamente
6. Muestra controles con información específica
```

### Escenario 2: Navegación
```
Usuario: "siguiente apartamento"
Iris:
1. Detecta comando: nextApartment
2. Encuentra tarjeta activa actual
3. Navega a la siguiente tarjeta visible
4. Actualiza controles con nueva información
```

### Escenario 3: Detalles
```
Usuario: "muéstrame los detalles"
Iris:
1. Detecta comando: showDetails
2. Hace click en botón "Detalles"
3. Muestra información detallada del apartamento
```

## 🚀 Beneficios del Sistema

1. **Integración Natural**: Usa la UI existente sin crear elementos nuevos
2. **Navegación Intuitiva**: Comandos de voz naturales
3. **Flujo Automático**: Activa modo recorrido automáticamente
4. **Control Completo**: Permite navegar, ver detalles y controlar videos
5. **Experiencia Fluida**: Transiciones suaves entre estados

## 🔍 Detección Inteligente

El sistema detecta automáticamente:
- **Filtros específicos**: dormitorios, precio, superficie
- **Comandos de navegación**: siguiente, anterior, salir
- **Comandos de control**: detalles, pausar, reproducir
- **Contexto**: Mantiene estado entre comandos

## 📱 Compatibilidad

- ✅ Funciona con la UI existente
- ✅ No requiere cambios en el HTML
- ✅ Compatible con todos los navegadores
- ✅ Responsive design
- ✅ Accesibilidad mejorada

---

**Resultado**: Un sistema completo donde Iris puede controlar toda la experiencia de filtrado y navegación de apartamentos de forma natural e intuitiva. 🎉



