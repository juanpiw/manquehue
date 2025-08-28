const fs = require('fs');
const path = require('path');

/**
 * Script para crear la estructura completa de imágenes para filtros de apartamentos
 * Genera carpetas organizadas por tipo, superficie y precio
 */

// Configuración de la estructura
const structure = {
    '1_dormitorio': {
        'superficie_40_60': {
            'precio_2000_3000': 2,
            'precio_3000_4000': 2,
            'precio_4000_5000': 2,
            'precio_5000_plus': 1
        },
        'superficie_60_80': {
            'precio_2000_3000': 1,
            'precio_3000_4000': 2,
            'precio_4000_5000': 2,
            'precio_5000_plus': 2
        },
        'superficie_80_100': {
            'precio_3000_4000': 1,
            'precio_4000_5000': 2,
            'precio_5000_plus': 2
        },
        'superficie_100_plus': {
            'precio_4000_5000': 1,
            'precio_5000_plus': 2
        }
    },
    '2_dormitorios': {
        'superficie_40_60': {
            'precio_2000_3000': 1,
            'precio_3000_4000': 2,
            'precio_4000_5000': 2,
            'precio_5000_plus': 1
        },
        'superficie_60_80': {
            'precio_2000_3000': 1,
            'precio_3000_4000': 2,
            'precio_4000_5000': 2,
            'precio_5000_plus': 2
        },
        'superficie_80_100': {
            'precio_2000_3000': 1,
            'precio_3000_4000': 2,
            'precio_4000_5000': 2,
            'precio_5000_plus': 2
        },
        'superficie_100_plus': {
            'precio_3000_4000': 1,
            'precio_4000_5000': 2,
            'precio_5000_plus': 2
        }
    },
    '3_dormitorios': {
        'superficie_40_60': {
            'precio_3000_4000': 1,
            'precio_4000_5000': 2,
            'precio_5000_plus': 1
        },
        'superficie_60_80': {
            'precio_3000_4000': 1,
            'precio_4000_5000': 2,
            'precio_5000_plus': 2
        },
        'superficie_80_100': {
            'precio_3000_4000': 1,
            'precio_4000_5000': 2,
            'precio_5000_plus': 2
        },
        'superficie_100_plus': {
            'precio_4000_5000': 2,
            'precio_5000_plus': 2
        }
    }
};

// Base path para las imágenes
const basePath = path.join(__dirname, 'video', 'imagenes');

// Función para crear directorio si no existe
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Creado directorio: ${dirPath}`);
    }
}

// Función para crear imagen placeholder SVG
function createPlaceholderImage(width = 300, height = 200, text = 'Imagen') {
    return `data:image/svg+xml;base64,${Buffer.from(`
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#333"/>
            <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#fff" text-anchor="middle" dy=".3em">${text}</text>
        </svg>
    `).toString('base64')}`;
}

// Función para crear archivo de imagen placeholder
function createImageFile(filePath, text) {
    const svgContent = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#333"/>
        <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#fff" text-anchor="middle" dy=".3em">${text}</text>
    </svg>`;
    
    fs.writeFileSync(filePath, svgContent);
    console.log(`🖼️  Creada imagen: ${filePath}`);
}

// Función para crear README con información de la estructura
function createReadme() {
    const readmeContent = `# Estructura de Imágenes para Filtros de Apartamentos

## 📁 Organización

Esta carpeta contiene las imágenes organizadas por filtros de apartamentos:

### 🏠 Tipos de Dormitorio
- \`1_dormitorio/\` - Apartamentos de 1 dormitorio
- \`2_dormitorios/\` - Apartamentos de 2 dormitorios
- \`3_dormitorios/\` - Apartamentos de 3 dormitorios

### 📏 Superficie
- \`superficie_40_60/\` - 40-60 m²
- \`superficie_60_80/\` - 60-80 m²
- \`superficie_80_100/\` - 80-100 m²
- \`superficie_100_plus/\` - 100+ m²

### 💰 Precio
- \`precio_2000_3000/\` - $2.000-3.000 UF
- \`precio_3000_4000/\` - $3.000-4.000 UF
- \`precio_4000_5000/\` - $4.000-5.000 UF
- \`precio_5000_plus/\` - $5.000+ UF

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

\`\`\`javascript
// Ejemplo de ruta dinámica
const imagePath = \`video/imagenes/\${tipoDormitorio}/\${superficie}/\${precio}/imagen_1.svg\`;
\`\`\`

## 🔧 Mantenimiento

- Agregar nuevas imágenes: Crear archivos en la carpeta correspondiente
- Modificar filtros: Actualizar la estructura de carpetas
- Eliminar imágenes: Remover archivos de las carpetas correspondientes

---
*Generado automáticamente por setup-images.js*
`;

    const readmePath = path.join(basePath, 'README.md');
    fs.writeFileSync(readmePath, readmeContent);
    console.log(`📖 Creado README: ${readmePath}`);
}

// Función principal para crear toda la estructura
function createImageStructure() {
    console.log('🚀 Iniciando creación de estructura de imágenes...\n');
    
    // Crear directorio base
    ensureDirectoryExists(basePath);
    
    let totalImages = 0;
    
    // Recorrer la estructura y crear carpetas e imágenes
    for (const [tipoDormitorio, superficies] of Object.entries(structure)) {
        console.log(`\n🏠 Procesando: ${tipoDormitorio}`);
        
        for (const [superficie, precios] of Object.entries(superficies)) {
            console.log(`  📏 Superficie: ${superficie}`);
            
            for (const [precio, cantidadImagenes] of Object.entries(precios)) {
                console.log(`    💰 Precio: ${precio} (${cantidadImagenes} imágenes)`);
                
                // Crear ruta completa
                const folderPath = path.join(basePath, tipoDormitorio, superficie, precio);
                ensureDirectoryExists(folderPath);
                
                // Crear imágenes
                for (let i = 1; i <= cantidadImagenes; i++) {
                    const imageName = `imagen_${i}.svg`;
                    const imagePath = path.join(folderPath, imageName);
                    const imageText = `${tipoDormitorio} - ${superficie} - ${precio} - ${i}`;
                    
                    createImageFile(imagePath, imageText);
                    totalImages++;
                }
            }
        }
    }
    
    // Crear README
    createReadme();
    
    console.log(`\n✅ ¡Estructura creada exitosamente!`);
    console.log(`📊 Total de imágenes creadas: ${totalImages}`);
    console.log(`📁 Ubicación: ${basePath}`);
    console.log(`\n🎯 Próximos pasos:`);
    console.log(`   1. Reemplazar las imágenes placeholder con fotos reales`);
    console.log(`   2. Actualizar el sistema de filtros para usar esta estructura`);
    console.log(`   3. Probar la funcionalidad de filtrado`);
}

// Ejecutar si el script se llama directamente
if (require.main === module) {
    try {
        createImageStructure();
    } catch (error) {
        console.error('❌ Error creando la estructura:', error.message);
        process.exit(1);
    }
}

module.exports = { createImageStructure, structure };
