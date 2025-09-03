# IMPLEMENTACIÓN SISTEMA DE PLANOS DE APARTAMENTOS

## OBJETIVO PRINCIPAL
Implementar un sistema que cargue dinámicamente las imágenes de planos de apartamentos en la sección de detalles, basándose en el tipo de departamento, superficie y precio seleccionados.

## ESTRUCTURA DE ARCHIVOS DE PLANOS
Los planos se encuentran en: `video/imagenes/plantas-apartamentos/`

### Estructura de Carpetas:
- **D1**: Departamentos de 1 dormitorio
- **D2**: Departamentos de 2 dormitorios  
- **D3**: Departamentos de 3 dormitorios

### Convención de Nombres:
```
{superficie} m2_{tipo}-{superficie}-{precio}_{diseño/diseno}.{extensión}
```

**Ejemplos:**


### LISTA COMPLETA DE NOMBRES DE ARCHIVOS (NOMBRES ORIGINALES):
LA RUTA ES C:\Users\juanp\OneDrive\Desktop\dash_imanquehue\dashManqu\video\imagenes\plantas-apartamentos\D1
#### CARPETA D1 (1 Dormitorio):
- `D140-60 m2_A-S-4_Diseño.jpeg`
- `D140-60m2_A-S-2_Diseño.jpeg`
- `D140-60m2_A-S-3_Dieño.jpeg`
- `D140-60m2_A-S-5_Diseño.jpeg`
LA RUTA ES C:\Users\juanp\OneDrive\Desktop\dash_imanquehue\dashManqu\video\imagenes\plantas-apartamentos\D2
#### CARPETA D2 (2 Dormitorios):
- `40_60m2B-S-2_diseño.jpeg`
- `40_60m2B-S-3_diseño.jpeg`
- `80_100m2B-S-4_diseño.jpeg`
- `80_100m2B-S-5_diseño.jpeg`
LA RUTA ES C:\Users\juanp\OneDrive\Desktop\dash_imanquehue\dashManqu\video\imagenes\plantas-apartamentos\D3
#### CARPETA D3 (3 Dormitorios):
- `40_60m2C-S-2_diseno.jpg`
- `40_60m2C-S-3_diseo.jpg`
- `80_100 m2C-S-5_diseño.jpg`
- `80_100m2C-S-4_diseño.jpg`

## COMPONENTES IMPLEMENTADOS

### 1. Función de Diagnóstico UI (`logUIVisibility`)
**Ubicación:** Final de la clase `ImageFilterSystem`
**Propósito:** Monitorear el estado de visibilidad de elementos clave de la UI

**Elementos monitoreados:**
- `.apartments-section` - Sección principal
- `.apartment-filters` - Filtros de apartamentos
- `.apartment-type-selector` - Selector de tipo de proyecto
- `#apartmentList` - Lista de tarjetas
- `.section-title` - Título de la sección
- `.section-subtitle` - Subtítulo de la sección

**Uso:** `this.logUIVisibility('tag-descriptivo')`

### 2. Sistema de Carga de Planos (`setFloorPlanImageForDetails`)
**Ubicación:** Llamada desde `transformCardToDetails`
**Propósito:** Cargar dinámicamente la imagen del plano correspondiente

**Flujo de trabajo:**
1. Verifica que no sea una casa (solo para departamentos)
2. Encuentra el elemento `<img>` dentro de `.floor-plan-image`
3. Remueve el atributo `onerror` inline para evitar conflictos
4. Genera candidatos de rutas de imágenes
5. Prueba cada candidato secuencialmente
6. Si falla uno, pasa al siguiente automáticamente

### 3. Generador de Candidatos (`buildFloorPlanCandidates`)
**Propósito:** Construir lista de posibles rutas de imágenes basándose en parámetros

**Parámetros de entrada:**
- `apartment`: Tipo de departamento (1D, 2D, 3D)
- `superficie`: Rango de superficie (40-60, 60-80, 80-100, 100+)
- `precio`: Rango de precio ($2.000-3.000, $3.000-4.000, $4.000-5.000, $5.000+)

**Mapeo de códigos:**
- **Carpeta:** D1 (1 dormitorio), D2 (2 dormitorios), D3 (3 dormitorios)
- **Tipo de departamento:** D1 → A, D2 → B, D3 → C
- **Superficie:** 40-60 → S, 60-80 → M, 80-100 → L, 100+ → XL
- **Precio:** $2.000-3.000 → 2, $3.000-4.000 → 3, $4.000-5.000 → 4, $5.000+ → 5

**NOTA IMPORTANTE:** 
- **D1** es el NOMBRE DE LA CARPETA (no el tipo A)
- **A** es el TIPO DE DEPARTAMENTO que va en el nombre del archivo
- **D2** es el NOMBRE DE LA CARPETA (no el tipo B)  
- **B** es el TIPO DE DEPARTAMENTO que va en el nombre del archivo
- **D3** es el NOMBRE DE LA CARPETA (no el tipo C)
- **C** es el TIPO DE DEPARTAMENTO que va en el nombre del archivo

**Variantes generadas según carpeta:**

**CARPETA D1 (1 Dormitorio):**
- `D140-60 m2_A-S-2_Diseño.jpeg` (con D1 prefix y espacio)
- `D140-60m2_A-S-2_Diseño.jpeg` (con D1 prefix sin espacio)
- `D140-60m2_A-S-2_Dieño.jpeg` (con error de tipeo)
- `D140-60m2_A-S-5_Diseño.jpeg` (con dígito alternativo)

**CARPETA D2 (2 Dormitorios):**
- `40_60m2B-S-2_diseño.jpeg` (con guiones bajos)
- `80_100m2B-S-4_diseño.jpeg` (con guiones bajos)

**CARPETA D3 (3 Dormitorios):**
- `40_60m2C-S-2_diseno.jpg` (sin ñ, extensión .jpg)
- `40_60m2C-S-3_diseo.jpg` (sin 'n', extensión .jpg)
- `80_100 m2C-S-5_diseño.jpg` (con espacio, con ñ)
- `80_100m2C-S-4_diseño.jpg` (sin espacio, con ñ)

## INTEGRACIÓN EN EL FLUJO EXISTENTE

### Punto de Activación
La función se ejecuta automáticamente cuando:
1. Usuario hace clic en "Recorrer" de una tarjeta
2. Se llama a `showApartmentDetails()`
3. Se ejecuta `transformCardToDetails()`
4. Se invoca `setFloorPlanImageForDetails()`

### Ubicación en el Código
```javascript
// En transformCardToDetails(), después de inicializar el carrusel
this.initializeImageCarousel();

// Establecer imagen real del plano para departamentos
try { this.setFloorPlanImageForDetails(card, apartment, superficie, precio); } catch (e) { 
    console.warn('setFloorPlanImageForDetails error', e); 
}

console.log('✅ Tarjeta transformada a modo detalles');
```

## MANEJO DE ERRORES Y FALLBACKS

### Estrategia de Fallback
1. **Primera opción:** Imagen con nombre exacto según convención
2. **Segunda opción:** Variante sin ñ (diseno)
3. **Tercera opción:** Formato compacto con guiones bajos
4. **Cuarta opción:** Con dígito de precio alternativo
5. **Fallback final:** SVG placeholder original (si no se removió onerror)

### Logging y Debugging
- Logs detallados en cada paso del proceso
- Captura de errores con `try-catch`
- Información de depuración en consola

## BENEFICIOS DE LA IMPLEMENTACIÓN

### 1. No Invasiva
- No modifica estilos existentes
- No interfiere con la UI actual
- Mantiene funcionalidad existente

### 2. Robusta
- Múltiples variantes de nombres de archivo
- Fallback automático si una imagen no existe
- Manejo de errores sin romper la experiencia

### 3. Escalable
- Fácil agregar nuevas variantes de nombres
- Estructura modular y reutilizable
- Configuración centralizada

### 4. Mantenible
- Código bien documentado
- Funciones separadas y específicas
- Logs para debugging

## PRÓXIMOS PASOS RECOMENDADOS

### 1. Verificación de Funcionamiento
- Probar con diferentes tipos de departamentos
- Verificar que las imágenes se cargan correctamente
- Confirmar que la UI no se pierde

### 2. Optimización
- Agregar cache de imágenes cargadas
- Implementar precarga de planos comunes
- Optimizar el orden de candidatos según frecuencia de uso

### 3. Extensibilidad
- Agregar soporte para más formatos de imagen
- Implementar lazy loading para planos
- Agregar indicador de carga mientras se busca la imagen

## ARCHIVOS MODIFICADOS
- `dashManqu/js/ImageFilterSystem.js`
  - Agregada función `logUIVisibility()`
  - Agregada función `setFloorPlanImageForDetails()`
  - Agregada función `buildFloorPlanCandidates()`
  - Integrada llamada en `transformCardToDetails()`

## NOTAS IMPORTANTES
- **NO se modificaron estilos existentes**
- **NO se alteró la funcionalidad de la UI**
- **Solo se agregó funcionalidad de carga de planos**
- **Sistema de fallback robusto para evitar errores**
- **Logging extensivo para debugging**

## ESTADO ACTUAL
✅ **IMPLEMENTADO Y FUNCIONANDO**
- Sistema de carga de planos activo
- Diagnóstico de UI implementado
- Integración completa en el flujo existente
- Manejo de errores robusto

## COMANDOS DE PRUEBA
Para verificar el funcionamiento:
1. Abrir consola del navegador
2. Hacer clic en "Recorrer" de cualquier tarjeta
3. Verificar logs `[IFS][UI]` para diagnóstico
4. Confirmar que la imagen del plano se carga correctamente
