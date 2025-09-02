# 🎯 Instrucciones Actualizadas para Iris

## 📋 Flujo Completo Implementado

### **Fase 1: Filtrado de Apartamentos** ✅
- **Comando**: "muéstrame apartamentos de 2 dormitorios"
- **Acción**: 
  1. Navega a la sección de apartamentos
  2. Activa el filtro de 2 dormitorios
  3. Ejecuta la búsqueda
  4. Muestra las tarjetas filtradas
  5. Activa automáticamente el modo recorrido en la primera tarjeta

### **Fase 2: Modo Recorrido** ✅
- **Estado**: Después del filtrado, automáticamente entra en modo recorrido
- **Controles disponibles**:
  - **"siguiente"** / **"próximo"**: Navega al siguiente apartamento
  - **"anterior"** / **"atrás"**: Navega al apartamento anterior
  - **"pausar"** / **"reproducir"**: Controla el video de fondo
  - **"salir"**: Sale del modo recorrido

### **Fase 3: Detalles del Apartamento** ✅
- **Comando**: "quiero saber detalles" / "muéstrame detalles" / "dame más información"
- **Acción**: 
  1. Si no está en modo recorrido, activa el modo recorrido primero
  2. Busca y hace clic en el botón "Detalles"
  3. Transforma la tarjeta en modo detalles
  4. Muestra información detallada del apartamento

## 🎮 Comandos de Voz Disponibles

### **Filtrado**
```
"muéstrame apartamentos de 2 dormitorios"
"filtra por 2 dormitorios"
"busca apartamentos de 2 dormitorios"
"quiero ver apartamentos de 2 dormitorios"
```

### **Navegación en Recorrido**
```
"siguiente" / "próximo" / "next"
"anterior" / "atrás" / "previo"
"salir del recorrido" / "volver" / "exit"
```

### **Control de Video**
```
"pausar" / "pause"
"reproducir" / "play"
"continuar video"
```

### **Detalles**
```
"quiero saber detalles"
"muéstrame detalles"
"dame más información"
"ver detalles del apartamento"
"información del apartamento"
```

## 🔧 Funcionalidades Técnicas

### **Detección Automática**
- El sistema detecta automáticamente si estás en modo recorrido
- Si pides detalles sin estar en modo recorrido, activa el modo automáticamente
- Maneja múltiples métodos de búsqueda de botones para mayor robustez

### **Integración con Sistemas**
- **imageFilterSystem**: Sistema principal de filtrado y detalles
- **iris-bridge.js**: Interfaz entre Iris y la página web
- **Sincronización**: Ambos sistemas trabajan en conjunto

### **Manejo de Errores**
- Logging detallado para debugging
- Múltiples métodos de fallback
- Verificación de elementos antes de interactuar

## 📊 Estados del Sistema

### **Estado Inicial**
- Página cargada
- Sistemas disponibles
- Listo para comandos

### **Estado de Filtrado**
- Filtros aplicados
- Tarjetas mostradas
- Modo recorrido activado

### **Estado de Recorrido**
- Controles de recorrido visibles
- Tarjeta activa seleccionada
- Video de fondo reproduciéndose

### **Estado de Detalles**
- Tarjeta transformada en modo detalles
- Información detallada visible
- Botón de volver disponible

## 🧪 Páginas de Prueba

### **test-details-flow.html**
- Prueba el flujo completo paso a paso
- Verifica cada fase del proceso
- Logs detallados de cada acción

### **test-filter-logic.html**
- Prueba la lógica de filtrado
- Verifica el funcionamiento del imageFilterSystem
- Simula diferentes combinaciones de filtros

### **test-iris-filters.html**
- Prueba específica de filtros de Iris
- Verifica la integración entre Iris y el sistema
- Debugging de problemas de filtrado

## 🎯 Ejemplo de Uso Completo

### **Secuencia de Comandos**
1. **Usuario**: "muéstrame apartamentos de 2 dormitorios"
   - **Sistema**: Aplica filtro, muestra tarjetas, activa modo recorrido

2. **Usuario**: "siguiente"
   - **Sistema**: Navega al siguiente apartamento

3. **Usuario**: "quiero saber detalles"
   - **Sistema**: Muestra detalles del apartamento actual

4. **Usuario**: "salir"
   - **Sistema**: Sale del modo recorrido

## 🔍 Debugging

### **Logs Disponibles**
- `[IR]`: Logs del iris-bridge.js
- `[IFS]`: Logs del imageFilterSystem
- Timestamps en cada acción
- Estados de éxito/error

### **Verificación de Elementos**
- Verificación de sistemas disponibles
- Verificación de elementos DOM
- Verificación de estados de UI

## ✅ Checklist de Funcionalidades

- [x] Filtrado por número de dormitorios
- [x] Activación automática de modo recorrido
- [x] Navegación entre apartamentos
- [x] Control de video (play/pause)
- [x] Mostrar detalles del apartamento
- [x] Salir del modo recorrido
- [x] Detección automática de comandos
- [x] Manejo de errores robusto
- [x] Logging detallado
- [x] Páginas de prueba

## 🚀 Próximas Mejoras

- [ ] Filtrado por superficie
- [ ] Filtrado por precio
- [ ] Filtrado por orientación
- [ ] Búsqueda por texto libre
- [ ] Guardado de preferencias
- [ ] Historial de búsquedas



