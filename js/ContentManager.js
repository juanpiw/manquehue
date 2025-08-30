/**
 * ContentManager - Sistema de gestión de contenido dinámico
 * Maneja el cambio de contenido entre apartamentos y casas
 */
class ContentManager {
    constructor() {
        this.currentType = 'apartamento'; // Por defecto
        this.projectData = null;
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        console.log('📋 Initializing ContentManager...');
        
        try {
            await this.loadProjectData();
            this.setupEventListeners();
            this.updateContent();
            
            this.isInitialized = true;
            console.log('✅ ContentManager initialized');
            
        } catch (error) {
            console.error('❌ Error initializing ContentManager:', error);
        }
    }

    async loadProjectData() {
        try {
            console.log('📋 Attempting to load project data from config/project-data.json...');
            const response = await fetch('config/project-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.projectData = await response.json();
            console.log('📊 Project data loaded successfully from JSON file');
            console.log('📋 Available project types:', Object.keys(this.projectData));
        } catch (error) {
            console.error('❌ Error loading project data from JSON, using fallback data:', error);
            // Fallback: usar datos por defecto
            this.projectData = {
                apartamento: {
                    title: "Mirador del Golf - Apartamentos",
                    description: "Exclusivas casas y departamentos ubicados en el sector más privilegiado de Piedra Roja, dentro del Club de Golf Hacienda Chicureo Club. Diseñado para aprovechar al máximo las vistas hacia el Valle de Chicureo y el cajón cordillerano gracias a sus amplios ventanales de piso a cielo. Es un proyecto versátil, que invita a compartir y a disfrutar de sus amplios espacios integrados y amplias terrazas. El proyecto ofrece las opciones de elegir un gran jardín privado, salidas exclusivas al parque o azoteas.",
                    videos: {
                        "section-1": ["video/apartamento/video-0.mp4"],
                        "apartments": ["video/apartamento/video-1.mp4"],
                        "features": ["video/apartamento/video-3.mp4"],
                        "equipment": ["video/apartamento/video-4.mp4"]
                    },
                    stats: [
                        { value: "8", label: "Minutos del metro" },
                        { value: "12", label: "Minutos del centro" },
                        { value: "5", label: "Minutos del mall" }
                    ],
                    features: [
                        { icon: "🏠", title: "Diseño", description: "Arquitectura moderna" }
                    ],
                    apartments: [
                        { type: "1 Dormitorio", surface: "45-65 m²", price: "2.500-3.200 UF" }
                    ],
                    equipment: {
                        amenities: ["Piscina", "Gimnasio"],
                        security: ["Control de acceso"],
                        technology: ["Fibra óptica"]
                    }
                },
                casa: {
                    title: "Mirador del Golf - Casas",
                    description: "En el corazón de Piedra Roja, dentro del prestigioso Club de Golf Hacienda Chicureo, nace un proyecto residencial que combina diseño, naturaleza y sofisticación. Cada casa y departamento ha sido pensado para abrirse hacia el paisaje, con ventanales de piso a cielo que enmarcan las vistas al Valle de Chicureo y la majestuosidad cordillerana.",
                    videos: {
                        "section-1": ["video/casa/video-0.mp4"],
                        "apartments": ["video/casa/video-1.mp4"],
                        "features": ["video/casa/video-3.mp4"],
                        "equipment": ["video/casa/video-4.mp4"]
                    },
                    stats: [
                        { value: "10", label: "Minutos del metro" },
                        { value: "15", label: "Minutos del centro" },
                        { value: "8", label: "Minutos del mall" }
                    ],
                    features: [
                        { icon: "🏡", title: "Diseño", description: "Arquitectura moderna" }
                    ],
                    apartments: [
                        { type: "Casa 2 Dormitorios", surface: "120-150 m²", price: "5.500-6.800 UF" }
                    ],
                    equipment: {
                        amenities: ["Piscina privada", "Gimnasio privado"],
                        security: ["Control de acceso"],
                        technology: ["Fibra óptica"]
                    }
                }
            };
            console.log('📊 Fallback project data loaded');
        }
    }

    setupEventListeners() {
        // Event listeners para los radio buttons del selector
        const radioOptions = document.querySelectorAll('.radio-option');
        radioOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const label = option.querySelector('.radio-label').textContent.toLowerCase();
                console.log(`🎯 Radio button clicked: ${label}`);
                this.switchProjectType(label);
            });
        });

        console.log('✅ ContentManager event listeners set up');
    }

    async switchProjectType(type) {
        if (type === this.currentType) return;
        
        console.log(`🔄 Switching project type from ${this.currentType} to ${type}`);
        
        this.currentType = type;
        await this.updateContent();
        
        // Emitir evento para que otros sistemas se actualicen
        this.emitEvent('projectType:changed', { type: this.currentType });
    }

    async updateContent() {
        if (!this.projectData || !this.projectData[this.currentType]) {
            console.error('❌ No project data available for:', this.currentType);
            return;
        }

        const data = this.projectData[this.currentType];
        console.log(`📊 Data for ${this.currentType}:`, data);
        
        // Actualizar UI del selector
        this.updateSelectorUI();
        
        // Actualizar título principal
        this.updateTitle(data.title);
        
        // Actualizar descripción
        this.updateDescription(data.description);
        
        // Actualizar estadísticas
        this.updateStats(data.stats);
        
        // Actualizar características
        this.updateFeatures(data.features);
        
        // Actualizar apartamentos/casas
        this.updateApartments(data.apartments);
        
        // Actualizar equipamiento
        this.updateEquipment(data.equipment);
        
        // Actualizar videos (notificar al VideoScrollSystem)
        await this.updateVideos(data.videos);
        
        console.log(`✅ Content updated for ${this.currentType}`);
    }

    updateTitle(title) {
        const titleElement = document.querySelector('.hero-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    updateDescription(description) {
        const descElement = document.querySelector('.description-text');
        if (descElement) {
            descElement.textContent = description;
        }
    }

    updateSelectorUI() {
        // Actualizar la selección visual de los radio buttons
        const radioOptions = document.querySelectorAll('.radio-option');
        radioOptions.forEach(option => {
            const label = option.querySelector('.radio-label').textContent.toLowerCase();
            const radioCircle = option.querySelector('.radio-circle');
            
            if (label === this.currentType) {
                option.classList.add('selected');
                if (radioCircle) {
                    radioCircle.innerHTML = '<div class="radio-inner"></div>';
                }
            } else {
                option.classList.remove('selected');
                if (radioCircle) {
                    radioCircle.innerHTML = '';
                }
            }
        });
        
        console.log(`🎨 Selector UI updated for: ${this.currentType}`);
    }

    updateStats(stats) {
        const statsContainer = document.querySelector('.stats-list');
        if (!statsContainer) return;

        statsContainer.innerHTML = '';
        
        stats.forEach((stat, index) => {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            
            const isLast = index === stats.length - 1;
            
            statItem.innerHTML = `
                <div class="stat-content">
                    <div class="stat-value text-heading-2 text-bold" style="color: white;">${stat.value}</div>
                    <div class="stat-label text-body text-medium" style="color: white;">${stat.label}</div>
                </div>
                ${!isLast ? '<div class="stat-divider"></div>' : ''}
            `;
            
            statsContainer.appendChild(statItem);
        });
    }

    updateFeatures(features) {
        const featuresGrid = document.querySelector('.features-grid');
        if (!featuresGrid) return;

        featuresGrid.innerHTML = '';
        
        // Verificar que features existe y es un array
        if (!features || !Array.isArray(features)) {
            console.warn('⚠️ Features data is not available or not an array:', features);
            return;
        }
        
        features.forEach(feature => {
            const featureCard = document.createElement('div');
            featureCard.className = 'feature-card';
            
            featureCard.innerHTML = `
                <div class="feature-icon">${feature.icon || '🏠'}</div>
                <h3>${feature.title || 'Característica'}</h3>
                <p>${feature.description || 'Descripción no disponible'}</p>
            `;
            
            featuresGrid.appendChild(featureCard);
        });
    }

    updateApartments(apartments) {
        const apartmentList = document.getElementById('apartmentList');
        if (!apartmentList) return;

        apartmentList.innerHTML = '';
        
        // Verificar que apartments existe y es un array
        if (!apartments || !Array.isArray(apartments)) {
            console.warn('⚠️ Apartments data is not available or not an array:', apartments);
            return;
        }
        
        apartments.forEach(apartment => {
            const apartmentCard = document.createElement('div');
            apartmentCard.className = 'apartment-card';
            
            apartmentCard.innerHTML = `
                <div class="apartment-image">
                    <img src="${apartment.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiAxPC90ZXh0Pjwvc3ZnPg=='}" alt="${apartment.type || 'Apartamento'}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiAxPC90ZXh0Pjwvc3ZnPg=='">
                </div>
                <div class="apartment-info">
                    <h3>${apartment.type || 'Apartamento'}</h3>
                    <p><strong>Superficie:</strong> ${apartment.surface || 'No especificada'}</p>
                    <p><strong>Precio:</strong> ${apartment.price || 'Consultar'}</p>
                    <p><strong>Tipo de Departamento:</strong> ${this.getTipoDepartamentoFromApartmentData(apartment)}</p>
                    <button class="btn-primary contactModelBtn">Solicitar Información</button>
                </div>
            `;
            
            apartmentList.appendChild(apartmentCard);
        });
    }

    updateEquipment(equipment) {
        // Verificar que equipment existe
        if (!equipment) {
            console.warn('⚠️ Equipment data is not available:', equipment);
            return;
        }
        
        // Actualizar categorías de equipamiento
        const categories = ['amenities', 'security', 'technology'];
        
        categories.forEach(category => {
            const categoryElement = document.querySelector(`[data-category="${category}"]`);
            if (!categoryElement) return;
            
            const listElement = categoryElement.querySelector('.equipment-list');
            if (!listElement) return;
            
            listElement.innerHTML = '';
            
            // Verificar que la categoría existe y es un array
            if (!equipment[category] || !Array.isArray(equipment[category])) {
                console.warn(`⚠️ Equipment category '${category}' is not available or not an array:`, equipment[category]);
                return;
            }
            
            equipment[category].forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = item;
                listElement.appendChild(listItem);
            });
        });
    }

    async updateVideos(videos) {
        console.log(`📹 Updating videos for ${this.currentType}:`, videos);
        
        // Notificar al VideoScrollSystem sobre el cambio de videos
        if (window.videoScrollApp && window.videoScrollApp.videoSystem) {
            console.log('🔄 Notifying VideoScrollSystem about video change');
            await window.videoScrollApp.videoSystem.updateVideoPaths(videos);
            console.log('✅ VideoScrollSystem updated successfully');
        } else {
            console.warn('⚠️ VideoScrollSystem not available');
        }
    }

    // Métodos públicos
    getCurrentType() {
        return this.currentType;
    }

    getCurrentData() {
        return this.projectData ? this.projectData[this.currentType] : null;
    }

    getVideoPaths(section) {
        const data = this.getCurrentData();
        return data && data.videos ? data.videos[section] : [];
    }
    
    getTipoDepartamentoFromApartmentData(apartment) {
        // Generar tipo de departamento basado en los datos del apartamento
        let tipoCode = 'X';
        let superficieCode = 'X';
        let precioCode = 'X';
        
        // Mapear tipo (dormitorios)
        if (apartment.type) {
            const dormitoriosMatch = apartment.type.match(/(\d+)/);
            if (dormitoriosMatch) {
                const dormitorios = parseInt(dormitoriosMatch[1]);
                if (dormitorios === 1) tipoCode = 'A';
                else if (dormitorios === 2) tipoCode = 'B';
                else if (dormitorios === 3) tipoCode = 'C';
            }
        }
        
        // Mapear superficie
        if (apartment.surface) {
            const superficieMatch = apartment.surface.match(/(\d+)-(\d+)/);
            if (superficieMatch) {
                const min = parseInt(superficieMatch[1]);
                const max = parseInt(superficieMatch[2]);
                if (min >= 40 && max <= 60) superficieCode = 'S';
                else if (min >= 60 && max <= 80) superficieCode = 'M';
                else if (min >= 80 && max <= 100) superficieCode = 'L';
                else if (min >= 100) superficieCode = 'XL';
            }
        }
        
        // Mapear precio
        if (apartment.price) {
            const precioMatch = apartment.price.match(/\$(\d+\.\d+)-(\d+\.\d+)/);
            if (precioMatch) {
                const min = parseInt(precioMatch[1]);
                if (min >= 2000 && min < 3000) precioCode = '2';
                else if (min >= 3000 && min < 4000) precioCode = '3';
                else if (min >= 4000 && min < 5000) precioCode = '4';
                else if (min >= 5000) precioCode = '5';
            }
        }
        
        return `Tipo ${tipoCode}-${superficieCode}-${precioCode}`;
    }

    // Sistema de eventos
    events = {};

    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    off(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
        }
    }

    emitEvent(eventName, data = {}) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event handler for ${eventName}:`, error);
                }
            });
        }
    }

    // Método para debug
    debugInfo() {
        console.log('🔍 ContentManager Debug Info:');
        console.log(`📊 Current type: ${this.currentType}`);
        console.log(`📋 Project data loaded: ${!!this.projectData}`);
        console.log(`✅ Initialized: ${this.isInitialized}`);
        
        if (this.projectData && this.projectData[this.currentType]) {
            const data = this.projectData[this.currentType];
            console.log(`📹 Videos available:`, Object.keys(data.videos || {}));
            console.log(`📊 Stats count: ${(data.stats || []).length}`);
            console.log(`🏠 Features count: ${(data.features || []).length}`);
        }
    }
}

// Export for global use
window.ContentManager = ContentManager;
