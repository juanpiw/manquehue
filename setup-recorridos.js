const fs = require('fs');
const path = require('path');

/**
 * Script para crear la estructura de videos de recorrido
 * Cada combinación de tipo, superficie y precio tendrá su propio video
 */

const recorridoStructure = {
    '1d': {
        'superficie_40_60': {
            'precio_2000_3000': 'recorrido_1d_40_60_2000_3000.mp4',
            'precio_3000_4000': 'recorrido_1d_40_60_3000_4000.mp4',
            'precio_4000_5000': 'recorrido_1d_40_60_4000_5000.mp4',
            'precio_5000_plus': 'recorrido_1d_40_60_5000_plus.mp4'
        },
        'superficie_60_80': {
            'precio_2000_3000': 'recorrido_1d_60_80_2000_3000.mp4',
            'precio_3000_4000': 'recorrido_1d_60_80_3000_4000.mp4',
            'precio_4000_5000': 'recorrido_1d_60_80_4000_5000.mp4',
            'precio_5000_plus': 'recorrido_1d_60_80_5000_plus.mp4'
        },
        'superficie_80_100': {
            'precio_3000_4000': 'recorrido_1d_80_100_3000_4000.mp4',
            'precio_4000_5000': 'recorrido_1d_80_100_4000_5000.mp4',
            'precio_5000_plus': 'recorrido_1d_80_100_5000_plus.mp4'
        },
        'superficie_100_plus': {
            'precio_4000_5000': 'recorrido_1d_100_plus_4000_5000.mp4',
            'precio_5000_plus': 'recorrido_1d_100_plus_5000_plus.mp4'
        }
    },
    '2d': {
        'superficie_40_60': {
            'precio_2000_3000': 'recorrido_2d_40_60_2000_3000.mp4',
            'precio_3000_4000': 'recorrido_2d_40_60_3000_4000.mp4',
            'precio_4000_5000': 'recorrido_2d_40_60_4000_5000.mp4',
            'precio_5000_plus': 'recorrido_2d_40_60_5000_plus.mp4'
        },
        'superficie_60_80': {
            'precio_2000_3000': 'recorrido_2d_60_80_2000_3000.mp4',
            'precio_3000_4000': 'recorrido_2d_60_80_3000_4000.mp4',
            'precio_4000_5000': 'recorrido_2d_60_80_4000_5000.mp4',
            'precio_5000_plus': 'recorrido_2d_60_80_5000_plus.mp4'
        },
        'superficie_80_100': {
            'precio_2000_3000': 'recorrido_2d_80_100_2000_3000.mp4',
            'precio_3000_4000': 'recorrido_2d_80_100_3000_4000.mp4',
            'precio_4000_5000': 'recorrido_2d_80_100_4000_5000.mp4',
            'precio_5000_plus': 'recorrido_2d_80_100_5000_plus.mp4'
        },
        'superficie_100_plus': {
            'precio_3000_4000': 'recorrido_2d_100_plus_3000_4000.mp4',
            'precio_4000_5000': 'recorrido_2d_100_plus_4000_5000.mp4',
            'precio_5000_plus': 'recorrido_2d_100_plus_5000_plus.mp4'
        }
    },
    '3d': {
        'superficie_40_60': {
            'precio_3000_4000': 'recorrido_3d_40_60_3000_4000.mp4',
            'precio_4000_5000': 'recorrido_3d_40_60_4000_5000.mp4',
            'precio_5000_plus': 'recorrido_3d_40_60_5000_plus.mp4'
        },
        'superficie_60_80': {
            'precio_3000_4000': 'recorrido_3d_60_80_3000_4000.mp4',
            'precio_4000_5000': 'recorrido_3d_60_80_4000_5000.mp4',
            'precio_5000_plus': 'recorrido_3d_60_80_5000_plus.mp4'
        },
        'superficie_80_100': {
            'precio_3000_4000': 'recorrido_3d_80_100_3000_4000.mp4',
            'precio_4000_5000': 'recorrido_3d_80_100_4000_5000.mp4',
            'precio_5000_plus': 'recorrido_3d_80_100_5000_plus.mp4'
        },
        'superficie_100_plus': {
            'precio_4000_5000': 'recorrido_3d_100_plus_4000_5000.mp4',
            'precio_5000_plus': 'recorrido_3d_100_plus_5000_plus.mp4'
        }
    }
};

function createRecorridoStructure() {
    const baseDir = path.join(__dirname, 'video', 'recorridos');
    
    // Crear directorio base si no existe
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
    }
    
    let totalVideos = 0;
    const videoList = [];
    
    // Generar estructura y lista de videos
    Object.entries(recorridoStructure).forEach(([tipo, superficies]) => {
        Object.entries(superficies).forEach(([superficie, precios]) => {
            Object.entries(precios).forEach(([precio, videoName]) => {
                const videoPath = path.join(baseDir, videoName);
                videoList.push({
                    path: videoPath,
                    name: videoName,
                    tipo,
                    superficie,
                    precio,
                    relativePath: `video/recorridos/${videoName}`
                });
                totalVideos++;
            });
        });
    });
    
    // Crear README con instrucciones
    const readmeContent = `# Videos de Recorrido - Manquehue

Esta carpeta contiene los videos de recorrido virtual para cada combinación de apartamento.

## Estructura de Nombres

Los videos siguen el patrón: \`recorrido_{tipo}_{superficie}_{precio}.mp4\`

### Tipos de Dormitorio:
- \`1d\`: 1 Dormitorio
- \`2d\`: 2 Dormitorios  
- \`3d\`: 3 Dormitorios

### Superficies:
- \`40_60\`: 40-60 m²
- \`60_80\`: 60-80 m²
- \`80_100\`: 80-100 m²
- \`100_plus\`: 100+ m²

### Precios:
- \`2000_3000\`: $2.000-3.000 UF
- \`3000_4000\`: $3.000-4.000 UF
- \`4000_5000\`: $4.000-5.000 UF
- \`5000_plus\`: $5.000+ UF

## Videos Requeridos (${totalVideos} total)

${videoList.map(video => `- \`${video.name}\` - ${video.tipo} | ${video.superficie} | ${video.precio}`).join('\n')}

## Instrucciones

1. Coloca los videos MP4 en esta carpeta con los nombres exactos listados arriba
2. Los videos deben tener una duración recomendada de 30-60 segundos
3. Resolución recomendada: 1920x1080 (Full HD)
4. Formato: MP4 con codec H.264

## Notas

- Si un video no existe, el sistema usará un video por defecto
- Los videos se reproducirán automáticamente cuando se active el modo "Recorrer"
- Se pueden usar videos temporales mientras se preparan los videos finales
`;

    fs.writeFileSync(path.join(baseDir, 'README.md'), readmeContent);
    
    // Crear archivo JSON con la estructura para el sistema
    const structureData = {
        totalVideos,
        videos: videoList,
        structure: recorridoStructure
    };
    
    fs.writeFileSync(path.join(baseDir, 'structure.json'), JSON.stringify(structureData, null, 2));
    
    console.log('✅ Estructura de videos de recorrido creada');
    console.log(`📁 Directorio: ${baseDir}`);
    console.log(`📊 Total de videos requeridos: ${totalVideos}`);
    console.log('📝 README.md creado con instrucciones');
    console.log('📄 structure.json creado para el sistema');
    console.log('\n🎬 Videos requeridos:');
    videoList.forEach(video => {
        console.log(`   - ${video.name}`);
    });
}

// Ejecutar si se llama directamente
if (require.main === module) {
    createRecorridoStructure();
}

module.exports = { createRecorridoStructure, recorridoStructure };
