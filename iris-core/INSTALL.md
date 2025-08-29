# 🚀 IRIS Modular System - Instalación Rápida

## 📋 Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desarrollo)
- Acceso a los archivos del dashboard de Manquehue

## ⚡ Instalación en 3 Pasos

### Paso 1: Copiar Archivos

Copiar la carpeta `iris-core/` al directorio raíz del dashboard:

```bash
# Desde el directorio del dashboard
cp -r iris-core/ ./
```

### Paso 2: Incluir en HTML

Agregar el siguiente script en el `<head>` o antes del cierre de `</body>` del archivo principal:

```html
<!-- Cargar el sistema modular IRIS -->
<script src="iris-core/iris-loader.js"></script>
```

### Paso 3: Verificar Instalación

Abrir la consola del navegador y ejecutar:

```javascript
// Verificar que el sistema está cargado
if (window.IRIS) {
    console.log('✅ IRIS Modular System cargado correctamente');
    console.log('Estado:', window.IRIS.getStatus());
} else {
    console.error('❌ IRIS Modular System no está disponible');
}
```

## 🧪 Testing Rápido

### Opción 1: Archivo de Pruebas

Abrir `test-iris-modular.html` en el navegador para una interfaz visual completa de testing.

### Opción 2: Consola del Navegador

```javascript
// Test básico
window.IRIS.test();

// Test de comando específico
await window.IRIS.processText('ir a apartamentos');

// Test de API legacy
await window.IR.goto('apartments');
```

## 🔧 Configuración Inicial

### 1. Configurar Comandos

Editar `iris-core/config/commands.json` para personalizar comandos:

```json
{
  "commands": {
    "goto": {
      "aliases": ["navegar", "ir", "mostrar"],
      "parameters": [
        {
          "name": "key",
          "values": ["apartments", "houses", "equipment"]
        }
      ]
    }
  }
}
```

### 2. Configurar Mapeos UI

Editar `iris-core/config/ui-mappings.json` para mapear comandos a elementos UI:

```json
{
  "uiMappings": {
    "navigation": {
      "apartments": {
        "selector": "[data-section='apartments']",
        "scrollTarget": "apartments"
      }
    }
  }
}
```

## 🔄 Migración desde Sistema Anterior

### Compatibilidad Automática

El sistema mantiene **100% compatibilidad** con el código existente:

```javascript
// Código existente sigue funcionando
await window.IR.goto('apartments');
await window.IR.video('play');
await window.IR.scrollTo('top');
```

### Nuevas Funcionalidades Disponibles

```javascript
// Nueva API modular
await window.IRIS.processText('ir a apartamentos');

// Comandos estructurados
await window.IRIS.executeCommand({
    type: 'navigation',
    action: 'goto',
    key: 'apartments'
});
```

## 🚨 Solución de Problemas

### Error: "IRIS not defined"

```javascript
// Verificar que el script se cargó correctamente
console.log('Scripts cargados:', document.scripts);

// Verificar ruta del archivo
console.log('Ruta actual:', window.location.href);
```

### Error: "Loader failed"

```javascript
// Verificar que todos los archivos están presentes
fetch('iris-core/iris-loader.js')
    .then(response => console.log('Loader:', response.status))
    .catch(error => console.error('Error cargando loader:', error));
```

### Error: "Components not loaded"

```javascript
// Verificar estado del cargador
if (window.irisLoader) {
    console.log('Estado del cargador:', window.irisLoader.getStatus());
} else {
    console.error('Cargador no disponible');
}
```

## 📊 Verificación de Instalación

### Checklist de Verificación

- [ ] Archivos copiados correctamente
- [ ] Script incluido en HTML
- [ ] `window.IRIS` está disponible
- [ ] `window.IR` (API legacy) funciona
- [ ] Comandos básicos funcionan
- [ ] Sistema de logs funciona
- [ ] Configuración se carga correctamente

### Comandos de Verificación

```javascript
// Verificación completa
const verification = {
    irisAvailable: !!window.IRIS,
    legacyAvailable: !!window.IR,
    loaderAvailable: !!window.irisLoader,
    status: window.IRIS ? window.IRIS.getStatus() : null,
    info: window.IRIS ? window.IRIS.getInfo() : null
};

console.log('Verificación:', verification);
```

## 🎯 Próximos Pasos

### 1. Personalización

- Configurar comandos específicos del proyecto
- Ajustar mapeos de UI según la estructura actual
- Personalizar parsers según necesidades

### 2. Integración

- Integrar con sistema de chat existente
- Conectar con sistema de eventos
- Configurar logging externo

### 3. Optimización

- Ajustar configuraciones según uso real
- Optimizar parsers para comandos más comunes
- Refinar mapeos de UI según feedback

## 📞 Soporte

### Documentación Completa

- **README.md**: Documentación técnica detallada
- **IRIS_MODULAR_SUMMARY.md**: Resumen ejecutivo
- **PLAN_PRUEBAS_IRIS_REFINADO.txt**: Plan de pruebas

### Comandos de Ayuda

```javascript
// Obtener información del sistema
window.IRIS.getInfo();

// Obtener estado detallado
window.IRIS.getStatus();

// Obtener logs del sistema
window.IRIS.getLogs();

// Obtener historial de comandos
window.IRIS.getHistory(10);
```

---

**✅ Instalación Completada**  
**Versión**: 2.0.0  
**Compatibilidad**: 100% con sistema existente
