# Sistema de Videos por Scroll

## Descripción
Este sistema permite que los videos de fondo cambien automáticamente según la sección que el usuario esté viendo al hacer scroll. Cada sección está marcada con comentarios HTML específicos y tiene videos asociados.

## Cómo Funciona

### 1. Detección de Secciones
El sistema detecta las secciones basándose en comentarios HTML específicos:
- `<!-- Section 1: Hero Section -->` → HOME
- `<!-- Section 2: Apartments Section -->` → APARTAMENTS  
- `<!-- Section 3: Features Section -->` → FEATURES
- `<!-- Section 4: Equipment Section -->` → CONTACT

### 2. Lógica de Detección por Scroll
- **Umbral de detección**: 40% del viewport
- **Centro del viewport**: 30% desde la parte superior
- **Cálculo de área visible**: Determina qué sección tiene más área visible
- **Distancia al centro**: Prioriza la sección más cercana al centro del viewport

### 3. Videos por Sección
Cada sección tiene dos videos:
- **Video de animación**: Se reproduce una vez al entrar a la sección
- **Video de reposo**: Se reproduce en loop después de la animación

| Sección | Video Animación | Video Reposo |
|---------|----------------|--------------|
| HOME | video-1.mp4 | video-0.mp4 |
| APARTAMENTS | video-4.mp4 | video-3.mp4 |
| FEATURES | video-8.mp4 | video-7.mp4 |
| CONTACT | video-5.mp4 | video-6.mp4 |

### 4. Eventos de Scroll
- **Scroll activo**: Detección inmediata al comenzar el scroll
- **Scroll final**: Detección después de 100ms de inactividad
- **Resize**: Recalculación de posiciones al cambiar el tamaño de ventana

## Configuración

### Archivos de Video
Los videos deben estar en `assets/videos/`:
```
assets/videos/
├── video-0.mp4  (HOME - reposo)
├── video-1.mp4  (HOME - animación)
├── video-3.mp4  (APARTAMENTS - reposo)
├── video-4.mp4  (APARTAMENTS - animación)
├── video-5.mp4  (CONTACT - animación)
├── video-6.mp4  (CONTACT - reposo)
├── video-7.mp4  (FEATURES - reposo)
└── video-8.mp4  (FEATURES - animación)
```

### Estructura HTML Requerida
```html
<!-- Section 1: Hero Section -->
<section id="section-1" class="section-1">
  <!-- Contenido de la sección -->
</section>

<!-- Section 2: Apartments Section -->
<section id="apartments" class="apartments-section">
  <!-- Contenido de la sección -->
</section>

<!-- Section 3: Features Section -->
<section id="features" class="features-section">
  <!-- Contenido de la sección -->
</section>

<!-- Section 4: Equipment Section -->
<section id="equipment" class="equipment-section">
  <!-- Contenido de la sección -->
</section>
```

## Funcionalidades

### Navegación por Menú
- Al hacer clic en el menú de navegación, se reproduce el video correspondiente
- Scroll automático a la sección seleccionada
- Actualización del estado activo en la navegación

### Indicador de Scroll
- Muestra la sección actual
- Permite navegación directa a secciones
- Se actualiza automáticamente con el scroll

### Manejo de Errores
- Fallback automático a video de reposo si falla la animación
- Logs detallados en modo desarrollo
- Detección automática de secciones faltantes

## Debug y Logs

En modo desarrollo (localhost), el sistema muestra logs detallados:
- Posición de scroll y viewport
- Área visible de cada sección
- Distancia al centro del viewport
- Cambios de sección detectados

## Optimizaciones

- **Debounce**: Evita detecciones excesivas durante scroll rápido
- **Passive listeners**: Mejora el rendimiento del scroll
- **Preload metadata**: Carga rápida de videos
- **Fallback videos**: Garantiza reproducción continua

## Compatibilidad

- Funciona con navegación por menú
- Compatible con scroll manual
- Responsive a cambios de tamaño de ventana
- Manejo de errores robusto
