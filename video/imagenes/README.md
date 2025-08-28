# Estructura de Imágenes para Filtros de Apartamentos

## 📁 Organización

Esta carpeta contiene las imágenes organizadas por filtros de apartamentos:

### 🏠 Tipos de Dormitorio
- `1_dormitorio/` - Apartamentos de 1 dormitorio
- `2_dormitorios/` - Apartamentos de 2 dormitorios
- `3_dormitorios/` - Apartamentos de 3 dormitorios

### 📏 Superficie
- `superficie_40_60/` - 40-60 m²
- `superficie_60_80/` - 60-80 m²
- `superficie_80_100/` - 80-100 m²
- `superficie_100_plus/` - 100+ m²

### 💰 Precio
- `precio_2000_3000/` - $2.000-3.000 UF
- `precio_3000_4000/` - $3.000-4.000 UF
- `precio_4000_5000/` - $4.000-5.000 UF
- `precio_5000_plus/` - $5.000+ UF

## 🔄 Combinaciones Disponibles

### 1 Dormitorio
- 40-60m² + $2.000-3.000 UF (2 imágenes)
- 40-60m² + $3.000-4.000 UF (2 imágenes)
- 40-60m² + $4.000-5.000 UF (2 imágenes)
- 40-60m² + $5.000+ UF (1 imagen)
- 60-80m² + $2.000-3.000 UF (1 imagen)
- 60-80m² + $3.000-4.000 UF (2 imágenes)
- 60-80m² + $4.000-5.000 UF (2 imágenes)
- 60-80m² + $5.000+ UF (2 imágenes)
- 80-100m² + $3.000-4.000 UF (1 imagen)
- 80-100m² + $4.000-5.000 UF (2 imágenes)
- 80-100m² + $5.000+ UF (2 imágenes)
- 100+m² + $4.000-5.000 UF (1 imagen)
- 100+m² + $5.000+ UF (2 imágenes)

### 2 Dormitorios
- 40-60m² + $3.000-4.000 UF (1 imagen)
- 40-60m² + $4.000-5.000 UF (2 imágenes)
- 40-60m² + $5.000+ UF (1 imagen)
- 60-80m² + $2.000-3.000 UF (1 imagen)
- 60-80m² + $3.000-4.000 UF (2 imágenes)
- 60-80m² + $4.000-5.000 UF (2 imágenes)
- 60-80m² + $5.000+ UF (2 imágenes)
- 80-100m² + $3.000-4.000 UF (2 imágenes)
- 80-100m² + $4.000-5.000 UF (2 imágenes)
- 80-100m² + $5.000+ UF (2 imágenes)
- 100+m² + $4.000-5.000 UF (2 imágenes)
- 100+m² + $5.000+ UF (2 imágenes)

### 3 Dormitorios
- 60-80m² + $4.000-5.000 UF (1 imagen)
- 60-80m² + $5.000+ UF (2 imágenes)
- 80-100m² + $3.000-4.000 UF (1 imagen)
- 80-100m² + $4.000-5.000 UF (2 imágenes)
- 80-100m² + $5.000+ UF (2 imágenes)
- 100+m² + $4.000-5.000 UF (2 imágenes)
- 100+m² + $5.000+ UF (2 imágenes)

## 📝 Uso

Las imágenes están organizadas para ser cargadas dinámicamente según los filtros seleccionados:

```javascript
// Ejemplo de ruta dinámica
const imagePath = `video/imagenes/${tipoDormitorio}/${superficie}/${precio}/imagen_1.svg`;
```

## 🔧 Mantenimiento

- Agregar nuevas imágenes: Crear archivos en la carpeta correspondiente
- Modificar filtros: Actualizar la estructura de carpetas
- Eliminar imágenes: Remover archivos de las carpetas correspondientes

---
*Generado automáticamente por setup-images.js*
