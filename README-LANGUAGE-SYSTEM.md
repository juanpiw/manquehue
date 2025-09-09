# 🌍 Sistema Multilingüe - Mirador del Golf

Sistema completo de cambio de idiomas para la landing page, con soporte para **Español (Chile)**, **Inglés (Australia)** e **Inglés (USA)**.

## ✨ Características

- **Detección automática** del idioma del navegador
- **Language switcher** con banderas de países
- **Persistencia** de preferencias del usuario
- **URL parameters** para compartir enlaces en idioma específico
- **Responsive** y accesible
- **Fácil personalización** y escalabilidad

## 🚀 Instalación

### 1. Archivos Requeridos

```
dashManqu/
├── assets/icons/
│   ├── flag-cl.svg      # Bandera de Chile
│   ├── flag-au.svg      # Bandera de Australia
│   └── flag-us.svg      # Bandera de USA
├── translations/
│   ├── es.json          # Traducciones en español
│   ├── en-au.json       # Traducciones en inglés australiano
│   └── en-us.json       # Traducciones en inglés americano
├── css/
│   └── language-switcher.css
├── js/
│   ├── language-config.js
│   └── language-system.js
└── video-scroll-demo.html
```

### 2. Integración en HTML

```html
<!-- En el <head> -->
<link rel="stylesheet" href="css/language-switcher.css">

<!-- Antes del cierre de </body> -->
<script src="js/language-config.js"></script>
<script src="js/language-system.js"></script>
```

## 🎯 Uso

### Detección Automática

El sistema detecta automáticamente el idioma del navegador:

- **`es-CL`** o **`es`** → Español (Chile)
- **`en-AU`** → Inglés (Australia)  
- **`en-GB`** → Inglés (Australia) - Mapeado automáticamente
- **`en`** → Inglés (USA)
- **Otros** → Español (Chile) por defecto

### Cambio Manual

Los usuarios pueden cambiar el idioma haciendo clic en las banderas del language switcher ubicado en la navegación.

### URL Parameters

Compartir enlaces en idioma específico:

```
https://tudominio.com/?lang=en-au  # Inglés australiano
https://tudominio.com/?lang=en-us  # Inglés americano
https://tudominio.com/?lang=es     # Español
```

## ⚙️ Configuración

### Personalizar Idiomas

Edita `js/language-config.js`:

```javascript
window.LanguageConfig.languages = {
    'es': {
        code: 'es',
        name: 'Español',
        flag: 'flag-cl.svg',
        region: 'Chile',
        locale: 'es-CL'
    },
    // Agregar más idiomas aquí
    'pt-br': {
        code: 'pt-br',
        name: 'Português',
        flag: 'flag-br.svg',
        region: 'Brasil',
        locale: 'pt-BR'
    }
};
```

### Personalizar Traducciones

Edita los archivos JSON en `translations/`:

```json
{
  "nav": {
    "home": "INICIO",
    "apartments": "APARTAMENTOS",
    "features": "CARACTERÍSTICAS",
    "contact": "CONTACTO"
  },
  "hero": {
    "title": "Mirador del Golf",
    "subtitle": "Exclusivas casas y departamentos en Piedra Roja"
  }
}
```

### Personalizar Selectores

```javascript
window.LanguageConfig.selectors = {
    navigation: '.nav-link',
    hero: {
        title: '.hero-title, h1',
        subtitle: '.hero-subtitle, .hero p'
    }
    // ... más selectores
};
```

## 🔧 API del Sistema

### Métodos Disponibles

```javascript
// Obtener idioma actual
const currentLang = window.languageSystem.getCurrentLanguage();

// Cambiar idioma programáticamente
window.languageSystem.changeLanguage('en-au');

// Obtener idiomas soportados
const languages = window.languageSystem.getSupportedLanguages();
```

### Eventos

```javascript
// Escuchar cambios de idioma
window.addEventListener('languageChanged', (event) => {
    console.log('Idioma cambiado a:', event.detail.language);
});

// Escuchar detección de idioma
window.addEventListener('languageDetected', (event) => {
    console.log('Idioma detectado:', event.detail.language);
});
```

## 📱 Responsive Design

El language switcher se adapta automáticamente a diferentes tamaños de pantalla:

- **Desktop**: Banderas con texto completo
- **Tablet**: Banderas con códigos de idioma
- **Mobile**: Banderas compactas

## ♿ Accesibilidad

- **ARIA labels** para lectores de pantalla
- **Navegación por teclado** completa
- **Contraste alto** automático
- **Focus states** visibles

## 🌐 Agregar Nuevos Idiomas

### 1. Crear Bandera

```svg
<!-- assets/icons/flag-br.svg -->
<svg width="24" height="16" viewBox="0 0 24 16">
    <!-- Bandera de Brasil -->
</svg>
```

### 2. Agregar Configuración

```javascript
// js/language-config.js
'pt-br': {
    code: 'pt-br',
    name: 'Português',
    flag: 'flag-br.svg',
    region: 'Brasil',
    locale: 'pt-BR'
}
```

### 3. Crear Traducciones

```json
// translations/pt-br.json
{
  "nav": {
    "home": "INÍCIO",
    "apartments": "APARTAMENTOS"
  }
}
```

## 🐛 Troubleshooting

### Problemas Comunes

1. **Traducciones no se cargan**
   - Verificar rutas de archivos JSON
   - Revisar consola del navegador

2. **Language switcher no aparece**
   - Verificar que el CSS esté cargado
   - Revisar selectores en la configuración

3. **Cambios de idioma no funcionan**
   - Verificar que el JavaScript esté cargado
   - Revisar estructura HTML

### Debug Mode

Activar modo debug en `js/language-config.js`:

```javascript
window.LanguageConfig.debug = true;
```

## 📞 Soporte

Para soporte técnico o preguntas sobre el sistema multilingüe, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ para Mirador del Golf**





