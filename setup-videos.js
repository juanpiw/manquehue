/**
 * Script para configurar la estructura de videos para apartamentos y casas
 * Copia los videos existentes a las nuevas carpetas
 */

const fs = require('fs');
const path = require('path');

// Crear directorios si no existen
const createDirectories = () => {
           const dirs = [
           'video/apartamento',
           'video/casa'
       ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✅ Created directory: ${dir}`);
        } else {
            console.log(`📁 Directory already exists: ${dir}`);
        }
    });
};

// Copiar videos existentes a las nuevas carpetas
const copyVideos = () => {
    const sourceDir = 'src/assets/videos';
           const targetDirs = ['video/apartamento', 'video/casa'];
    
    if (!fs.existsSync(sourceDir)) {
        console.log(`❌ Source directory not found: ${sourceDir}`);
        return;
    }
    
    // Leer archivos de video del directorio fuente
    const videoFiles = fs.readdirSync(sourceDir).filter(file => 
        file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.avi')
    );
    
    console.log(`📹 Found ${videoFiles.length} video files in ${sourceDir}`);
    
    // Copiar cada video a ambas carpetas
    targetDirs.forEach(targetDir => {
        videoFiles.forEach(videoFile => {
            const sourcePath = path.join(sourceDir, videoFile);
            const targetPath = path.join(targetDir, videoFile);
            
            try {
                fs.copyFileSync(sourcePath, targetPath);
                console.log(`✅ Copied ${videoFile} to ${targetDir}`);
            } catch (error) {
                console.error(`❌ Error copying ${videoFile} to ${targetDir}:`, error.message);
            }
        });
    });
};

// Crear archivo README con instrucciones
const createReadme = () => {
    const readmeContent = `# Estructura de Videos

Este directorio contiene los videos organizados por tipo de proyecto:

## Estructura
       \`\`\`
       video/
       ├── apartamento/     # Videos específicos para apartamentos
       │   ├── video-0.mp4
       │   ├── video-1.mp4
       │   └── ...
       └── casa/           # Videos específicos para casas
           ├── video-0.mp4
           ├── video-1.mp4
           └── ...
       \`\`\`

## Configuración
       Los videos se cargan dinámicamente según la selección del usuario:
       - **Apartamento**: Usa videos de \`video/apartamento/\`
       - **Casa**: Usa videos de \`video/casa/\`

## Personalización
Para personalizar los videos:
1. Reemplaza los videos en las carpetas correspondientes
2. Mantén los mismos nombres de archivo para compatibilidad
3. O actualiza el archivo \`config/project-data.json\` con las nuevas rutas

## Formatos soportados
- MP4 (recomendado)
- MOV
- AVI
`;

               fs.writeFileSync('video/README.md', readmeContent);
               console.log('✅ Created README.md in video directory');
};

// Función principal
const main = () => {
    console.log('🚀 Setting up video structure...');
    
    createDirectories();
    copyVideos();
    createReadme();
    
    console.log('✅ Video structure setup completed!');
    console.log('\n📋 Next steps:');
               console.log('1. Replace videos in video/apartamento/ with apartment-specific content');
           console.log('2. Replace videos in video/casa/ with house-specific content');
    console.log('3. Update config/project-data.json if you change video names');
};

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = { createDirectories, copyVideos, createReadme };
