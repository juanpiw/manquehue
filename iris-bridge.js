// iris-bridge.js
(() => {
  const SECTIONS = ['section-1', 'apartments', 'features', 'equipment'];
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  async function getAppReady() {
    let attempts = 0;
    while (!window.videoScrollApp && attempts < 50) {
      await wait(100);
      attempts++;
    }
    if (!window.videoScrollApp) {
      throw new Error('VideoScrollApp not available after 5 seconds');
    }
    return window.videoScrollApp;
  }

  function sectionIndexFromKey(key) {
    const index = SECTIONS.indexOf(key);
    return index >= 0 ? index + 1 : -1;
  }

  function videoPathFromKey(key) {
    const videoMap = {
      'apartamento': 'video/apartamento/video-0.mp4',
      'casa': 'video/casa/video-0.mp4',
      'amenities': 'video/equipamiento/picisna.mp4',
      'security': 'video/equipamiento/kincho.mp4',
      'technology': 'video/equipamiento/gym.mp4'
    };
    return videoMap[key] || null;
  }

  // Detección inteligente de áreas mencionadas en el texto
  function detectAreasFromText(text) {
    const areas = [];
    const lowerText = text.toLowerCase();
    
    // Mapeo de palabras clave a áreas
    const areaKeywords = {
      'cocina': 'cocina',
      'kitchen': 'cocina',
      'sala': 'sala',
      'living': 'sala',
      'dormitorio': 'dormitorio',
      'bedroom': 'dormitorio',
      'baño': 'baño',
      'bathroom': 'baño',
      'exterior': 'exterior',
      'terraza': 'exterior',
      'comedor': 'comedor',
      'dining': 'comedor',
      'oficina': 'oficina',
      'office': 'oficina',
      'apartamento': 'apartamento',
      'apartment': 'apartamento',
      'casa': 'casa',
      'house': 'casa',
      'condominio': 'apartamento',
      'condo': 'apartamento',
      'amenities': 'amenities',
      'amenidades': 'amenities',
      'equipamiento': 'equipment',
      'equipment': 'equipment',
      'seguridad': 'security',
      'security': 'security',
      'tecnología': 'technology',
      'technology': 'technology'
    };
    
    // Buscar palabras clave en el texto
    for (const [keyword, area] of Object.entries(areaKeywords)) {
      if (lowerText.includes(keyword)) {
        areas.push(area);
      }
    }
    
    return [...new Set(areas)]; // Eliminar duplicados
  }

  // Detección inteligente de filtros de apartamentos
  function detectApartmentFilters(text) {
    const filters = {};
    const lowerText = text.toLowerCase();
    
    // Detectar número de dormitorios
    const bedroomPatterns = [
      /(\d+)\s*dormitorio/i,
      /(\d+)\s*bedroom/i,
      /(\d+)\s*dpto/i,
      /(\d+)\s*ambiente/i,
      /dormitorio\s*(\d+)/i,
      /bedroom\s*(\d+)/i
    ];
    
    for (const pattern of bedroomPatterns) {
      const match = lowerText.match(pattern);
      if (match) {
        filters.bedrooms = parseInt(match[1]);
        break;
      }
    }
    
    // Detectar rango de precios
    const pricePatterns = [
      /(\d+(?:\.\d+)?)\s*millones/i,
      /(\d+(?:\.\d+)?)\s*mil/i,
      /precio\s*(\d+(?:\.\d+)?)/i,
      /valor\s*(\d+(?:\.\d+)?)/i
    ];
    
    for (const pattern of pricePatterns) {
      const match = lowerText.match(pattern);
      if (match) {
        filters.price = parseFloat(match[1]);
        break;
      }
    }
    
    // Detectar metros cuadrados
    const sizePatterns = [
      /(\d+)\s*m2/i,
      /(\d+)\s*metros/i,
      /(\d+)\s*metros cuadrados/i,
      /tamaño\s*(\d+)/i,
      /superficie\s*(\d+)/i
    ];
    
    for (const pattern of sizePatterns) {
      const match = lowerText.match(pattern);
      if (match) {
        filters.size = parseInt(match[1]);
        break;
      }
    }
    
    // Detectar orientación
    const orientationPatterns = {
      'norte': 'norte',
      'north': 'norte',
      'sur': 'sur',
      'south': 'sur',
      'este': 'este',
      'east': 'este',
      'oeste': 'oeste',
      'west': 'oeste'
    };
    
    for (const [keyword, orientation] of Object.entries(orientationPatterns)) {
      if (lowerText.includes(keyword)) {
        filters.orientation = orientation;
        break;
      }
    }
    
    // Detectar tipo de vista
    const viewPatterns = {
      'golf': 'golf',
      'mar': 'mar',
      'ciudad': 'ciudad',
      'city': 'ciudad',
      'montaña': 'montaña',
      'mountain': 'montaña',
      'parque': 'parque',
      'park': 'parque'
    };
    
    for (const [keyword, view] of Object.entries(viewPatterns)) {
      if (lowerText.includes(keyword)) {
        filters.view = view;
        break;
      }
    }
    
    return filters;
  }

  // Variable global para controlar el scroll automático
  let disableAutoScroll = true;

  window.IR = {
    async goto(sectionKey) {
      try {
        const app = await getAppReady();
        const sectionIndex = sectionIndexFromKey(sectionKey);
        
        if (sectionIndex === -1) {
          console.warn(`[IR] Sección no válida: ${sectionKey}`);
          return false;
        }

        console.log(`[IR] Navegando a sección ${sectionIndex}: ${sectionKey}`);
        
        // Deshabilitar scroll automático temporalmente
        if (disableAutoScroll) {
          const originalScrollBehavior = document.documentElement.style.scrollBehavior;
          document.documentElement.style.scrollBehavior = 'auto';
          
          await app.navigationSystem.navigateToSection(sectionIndex);
          
          // Restaurar comportamiento de scroll
          setTimeout(() => {
            document.documentElement.style.scrollBehavior = originalScrollBehavior;
          }, 100);
        } else {
          await app.navigationSystem.navigateToSection(sectionIndex);
        }
        
        return true;
      } catch (error) {
        console.error('[IR] Error en goto:', error);
        return false;
      }
    },

    async video(key) {
      try {
        const app = await getAppReady();
        const videoPath = videoPathFromKey(key);
        
        if (!videoPath) {
          console.warn(`[IR] Video no válido: ${key}`);
          return false;
        }

        console.log(`[IR] Cambiando video a: ${videoPath}`);
        await app.videoSystem.loadVideo(videoPath);
        return true;
      } catch (error) {
        console.error('[IR] Error en video:', error);
        return false;
      }
    },

    async play() {
      try {
        const app = await getAppReady();
        const video = document.getElementById('backgroundVideo');
        
        if (video) {
          await video.play();
          console.log('[IR] Video reproducido');
          return true;
        }
        return false;
      } catch (error) {
        console.error('[IR] Error en play:', error);
        return false;
      }
    },

    async pause() {
      try {
        const app = await getAppReady();
        const video = document.getElementById('backgroundVideo');
        
        if (video) {
          video.pause();
          console.log('[IR] Video pausado');
          return true;
        }
        return false;
      } catch (error) {
        console.error('[IR] Error en pause:', error);
        return false;
      }
    },

    async next() {
      try {
        const app = await getAppReady();
        const currentSection = app.navigationSystem.getCurrentSection();
        const currentIndex = SECTIONS.indexOf(currentSection);
        const nextIndex = (currentIndex + 1) % SECTIONS.length;
        
        console.log(`[IR] Siguiente sección: ${SECTIONS[nextIndex]}`);
        await app.navigationSystem.navigateToSection(nextIndex + 1);
        return true;
      } catch (error) {
        console.error('[IR] Error en next:', error);
        return false;
      }
    },

    async prev() {
      try {
        const app = await getAppReady();
        const currentSection = app.navigationSystem.getCurrentSection();
        const currentIndex = SECTIONS.indexOf(currentSection);
        const prevIndex = currentIndex <= 0 ? SECTIONS.length - 1 : currentIndex - 1;
        
        console.log(`[IR] Sección anterior: ${SECTIONS[prevIndex]}`);
        await app.navigationSystem.navigateToSection(prevIndex + 1);
        return true;
      } catch (error) {
        console.error('[IR] Error en prev:', error);
        return false;
      }
    },

    async scrollTo(percent) {
      try {
        const app = await getAppReady();
        const clampedPercent = clamp(percent, 0, 100);
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = (clampedPercent / 100) * scrollHeight;
        
        console.log(`[IR] Scroll a ${clampedPercent}% (${targetScroll}px)`);
        
        // Solo hacer scroll si es explícitamente solicitado
        if (percent !== undefined && percent !== null) {
          window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
        }
        return true;
      } catch (error) {
        console.error('[IR] Error en scrollTo:', error);
        return false;
      }
    },

    async reset() {
      try {
        const app = await getAppReady();
        console.log('[IR] Reseteando a estado inicial');
        
        // Ir a la primera sección
        await app.navigationSystem.navigateToSection(1);
        
        // Resetear video
        const video = document.getElementById('backgroundVideo');
        if (video) {
          video.src = 'video/apartamento/video-0.mp4';
          video.load();
          video.play().catch(e => console.log('Video autoplay prevented:', e));
        }
        
        // Solo hacer scroll al inicio si es explícitamente solicitado
        // window.scrollTo({ top: 0, behavior: 'smooth' });
        
        return true;
      } catch (error) {
        console.error('[IR] Error en reset:', error);
        return false;
      }
    },

    async setSectionVideos(map) {
      try {
        const app = await getAppReady();
        console.log('[IR] Actualizando mapeo de videos:', map);
        
        // Aquí podrías actualizar el mapeo de videos si es necesario
        // Por ahora solo registramos la acción
        return true;
      } catch (error) {
        console.error('[IR] Error en setSectionVideos:', error);
        return false;
      }
    },

    async modal(action, key) {
      try {
        console.log(`[IR] Control de modal: ${action} ${key}`);
        
        switch (action) {
          case 'open':
            switch (key) {
              case 'contact':
                openProjectModal();
                return true;
              case 'project':
                openProjectModal();
                return true;
              default:
                console.warn(`[IR] Modal no reconocido: ${key}`);
                return false;
            }
            
          case 'close':
            closeProjectModal();
            return true;
            
          default:
            console.warn(`[IR] Acción de modal no válida: ${action}`);
            return false;
        }
      } catch (error) {
        console.error('[IR] Error en modal:', error);
        return false;
      }
    },

    async form(action, key, data) {
      try {
        console.log(`[IR] Control de formulario: ${action} ${key}`);
        
        switch (action) {
          case 'fill':
            return await fillForm(key, data);
          case 'submit':
            return await submitForm(key);
          case 'clear':
            return await clearForm(key);
          default:
            console.warn(`[IR] Acción de formulario no válida: ${action}`);
            return false;
        }
      } catch (error) {
        console.error('[IR] Error en form:', error);
        return false;
      }
    },

    async track(event, data) {
      try {
        console.log(`[IR] Tracking evento: ${event}`, data);
        
        if (typeof gtag !== 'undefined') {
          gtag('event', event, data);
          return true;
        } else {
          console.warn('[IR] Google Analytics no disponible');
          return false;
        }
      } catch (error) {
        console.error('[IR] Error en track:', error);
        return false;
      }
    },

    // Control de scroll automático
    setAutoScroll(enabled) {
      disableAutoScroll = !enabled;
      console.log(`[IR] Scroll automático ${enabled ? 'habilitado' : 'deshabilitado'}`);
      return true;
    },

    getAutoScrollStatus() {
      return !disableAutoScroll;
    },

    // Función para extraer criterios específicos de apartamento del texto
    extractApartmentCriteria(text) {
      const criteria = {};
      const lowerText = text.toLowerCase();
      
      // Detectar superficie específica - Patrón más flexible
      const surfacePatterns = [
        /(?:superficie|área|m²)\s*:\s*(\d+)-(\d+)\s*m²/i,
        /(\d+)-(\d+)\s*m²/i,  // Patrón simple: "40-60 m²"
        /(\d+)\s*-\s*(\d+)\s*metros/i,  // "40-60 metros"
        /(\d+)\s*-\s*(\d+)\s*metros cuadrados/i  // "40-60 metros cuadrados"
      ];
      
      for (const pattern of surfacePatterns) {
        const surfaceMatch = lowerText.match(pattern);
        if (surfaceMatch) {
          criteria.superficie = `${surfaceMatch[1]}-${surfaceMatch[2]} m²`;
          console.log(`[IR] ✅ Superficie detectada: ${criteria.superficie}`);
          break;
        }
      }
      
      // Detectar precio específico - Patrón más flexible
      const pricePatterns = [
        /(?:precio|valor)\s*:\s*\$(\d+\.?\d*)-(\d+\.?\d*)\s*uf/i,
        /\$(\d+\.?\d*)-(\d+\.?\d*)\s*uf/i,  // Patrón simple: "$2.000-3.000 UF"
        /(\d+\.?\d*)-(\d+\.?\d*)\s*mil\s*uf/i,  // "2.000-3.000 mil UF"
        /(\d+\.?\d*)-(\d+\.?\d*)\s*uf/i  // "2.000-3.000 UF"
      ];
      
      for (const pattern of pricePatterns) {
        const priceMatch = lowerText.match(pattern);
        if (priceMatch) {
          criteria.precio = `$${priceMatch[1]}-${priceMatch[2]} UF`;
          console.log(`[IR] ✅ Precio detectado: ${criteria.precio}`);
          break;
        }
      }
      
      // Detectar dormitorios específicos - Patrón más flexible
      const bedroomPatterns = [
        /(?:dormitorios|habitaciones)\s*:\s*(\d+)/i,
        /(\d+)\s*dormitorio/i,  // "2 dormitorio"
        /(\d+)\s*dormitorios/i,  // "2 dormitorios"
        /(\d+)\s*habitación/i,  // "2 habitación"
        /(\d+)\s*habitaciones/i  // "2 habitaciones"
      ];
      
      for (const pattern of bedroomPatterns) {
        const bedroomMatch = lowerText.match(pattern);
        if (bedroomMatch) {
          criteria.dormitorios = bedroomMatch[1];
          console.log(`[IR] ✅ Dormitorios detectados: ${criteria.dormitorios}`);
          break;
        }
      }
      
      // Si encontramos al menos superficie o precio o dormitorios, consideramos que hay criterios específicos
      if (criteria.superficie || criteria.precio || criteria.dormitorios) {
        console.log(`[IR] ✅ Criterios extraídos:`, criteria);
        return criteria;
      }
      
      console.log(`[IR] ❌ No se detectaron criterios específicos en: "${text}"`);
      return null;
    },

    async detectAndNavigate(text) {
      try {
        console.log(`[IR] Analizando texto para detección automática: "${text}"`);
        
        const lowerText = text.toLowerCase();
        
        // Detectar comandos específicos de control con criterios específicos
        if (lowerText.includes('detalles') || lowerText.includes('más información') || lowerText.includes('ver detalles')) {
          console.log('[IR] Comando detectado: Mostrar detalles');
          
          // Intentar extraer criterios específicos del apartamento
          const apartmentCriteria = this.extractApartmentCriteria(text);
          
          if (apartmentCriteria) {
            console.log('[IR] Criterios específicos detectados:', apartmentCriteria);
            const result = await this.showApartmentDetails(apartmentCriteria);
            return {
              success: result,
              command: 'showDetails',
              message: `Mostrando detalles del apartamento: ${apartmentCriteria.superficie} ${apartmentCriteria.precio}`,
              criteria: apartmentCriteria
            };
          } else {
            const result = await this.showApartmentDetails();
            return {
              success: result,
              command: 'showDetails',
              message: 'Mostrando detalles del apartamento'
            };
          }
        }
        
        if (lowerText.includes('siguiente') || lowerText.includes('próximo') || lowerText.includes('next')) {
          console.log('[IR] Comando detectado: Siguiente apartamento');
          const result = await this.nextApartment();
          return {
            success: result,
            command: 'nextApartment',
            message: 'Navegando al siguiente apartamento'
          };
        }
        
        if (lowerText.includes('anterior') || lowerText.includes('previo') || lowerText.includes('atrás')) {
          console.log('[IR] Comando detectado: Apartamento anterior');
          const result = await this.prevApartment();
          return {
            success: result,
            command: 'prevApartment',
            message: 'Navegando al apartamento anterior'
          };
        }
        
        if (lowerText.includes('salir') || lowerText.includes('volver') || lowerText.includes('exit')) {
          console.log('[IR] Comando detectado: Salir del recorrido');
          const result = await this.exitRecorridoMode();
          return {
            success: result,
            command: 'exitRecorrido',
            message: 'Saliendo del modo recorrido'
          };
        }
        
        if (lowerText.includes('pausar') || lowerText.includes('reproducir') || lowerText.includes('play') || lowerText.includes('pause')) {
          console.log('[IR] Comando detectado: Alternar video');
          const result = await this.toggleVideoPlayback();
          return {
            success: result,
            command: 'toggleVideo',
            message: 'Alternando reproducción del video'
          };
        }
        
        const detectedAreas = detectAreasFromText(text);
        const detectedFilters = detectApartmentFilters(text);
        
        console.log(`[IR] Áreas detectadas:`, detectedAreas);
        console.log(`[IR] Filtros detectados:`, detectedFilters);
        
        // Si hay filtros de apartamento, aplicar filtrado
        if (Object.keys(detectedFilters).length > 0) {
          console.log('[IR] Aplicando filtros de apartamento');
          const filterResult = await this.filterApartments(detectedFilters);
          return {
            success: filterResult.success,
            areas: detectedAreas,
            filters: detectedFilters,
            filterResult: filterResult
          };
        }
        
        if (detectedAreas.length === 0) {
          console.log('[IR] No se detectaron áreas específicas');
          return { success: false, areas: [] };
        }
        
        // Priorizar áreas según importancia
        const priorityAreas = ['apartamento', 'casa', 'amenities', 'equipment', 'security', 'technology'];
        const sortedAreas = detectedAreas.sort((a, b) => {
          const aIndex = priorityAreas.indexOf(a);
          const bIndex = priorityAreas.indexOf(b);
          return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
        });
        
        const primaryArea = sortedAreas[0];
        console.log(`[IR] Área principal seleccionada: ${primaryArea}`);
        
        // Navegar a la sección correspondiente
        let navigationSuccess = false;
        
        switch (primaryArea) {
          case 'apartamento':
            navigationSuccess = await this.goto('apartments');
            break;
          case 'casa':
            navigationSuccess = await this.goto('apartments');
            break;
          case 'amenities':
          case 'equipment':
          case 'security':
          case 'technology':
            navigationSuccess = await this.goto('equipment');
            break;
          default:
            // Para áreas específicas como cocina, sala, etc., cambiar video
            const videoPath = videoPathFromKey(primaryArea);
            if (videoPath) {
              navigationSuccess = await this.video(primaryArea);
            }
        }
        
        return {
          success: navigationSuccess,
          areas: detectedAreas,
          primaryArea: primaryArea,
          navigationSuccess: navigationSuccess
        };
        
      } catch (error) {
        console.error('[IR] Error en detectAndNavigate:', error);
        return { success: false, error: error.message };
      }
    },

    async filterApartments(filters) {
      try {
        console.log(`[IR] Aplicando filtros de apartamento:`, filters);
        
        // Navegar a la sección de apartamentos primero
        const navigationSuccess = await this.goto('apartments');
        console.log('[IR] Navegación a apartamentos:', navigationSuccess);
        
        // Esperar un momento para que la navegación se complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar que estamos en la sección correcta
        const apartmentsSection = document.getElementById('apartments');
        if (!apartmentsSection) {
          console.warn('[IR] No se encontró la sección de apartamentos');
          return { success: false, error: 'Sección de apartamentos no encontrada' };
        }
        
        console.log('[IR] Sección de apartamentos encontrada, activando filtros...');
        
        // Activar los filtros existentes de la UI
        await this.activateExistingFilters(filters);
        
        // Mostrar la lista de apartamentos si está oculta
        const apartmentList = document.getElementById('apartmentList');
        const initialMessage = document.getElementById('initialMessage');
        
        if (apartmentList && initialMessage) {
          apartmentList.style.display = 'grid';
          initialMessage.style.display = 'none';
          console.log('[IR] Lista de apartamentos mostrada');
        }
        
        // Ejecutar la búsqueda usando el botón existente
        const searchButton = document.getElementById('searchButton');
        if (searchButton) {
          console.log('[IR] Ejecutando búsqueda con filtros existentes');
          searchButton.click();
          
          // Esperar a que se muestren las tarjetas
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Si hay tarjetas visibles, activar el modo recorrido en la primera
          const apartmentCards = document.querySelectorAll('.apartment-card');
          const visibleCards = Array.from(apartmentCards).filter(card => 
            card.style.display !== 'none' && card.style.opacity !== '0'
          );
          
          console.log(`[IR] Tarjetas encontradas: ${apartmentCards.length}, visibles: ${visibleCards.length}`);
          
          if (visibleCards.length > 0) {
            console.log(`[IR] ${visibleCards.length} tarjetas visibles, activando modo recorrido`);
            await this.activateRecorridoMode(visibleCards[0], filters);
          } else {
            console.warn('[IR] No hay tarjetas visibles después del filtro');
          }
        } else {
          console.warn('[IR] No se encontró el botón de búsqueda');
        }
        
        return {
          success: true,
          filters: filters,
          message: 'Filtros aplicados y modo recorrido activado'
        };
        
      } catch (error) {
        console.error('[IR] Error en filterApartments:', error);
        return { success: false, error: error.message };
      }
    },

    async activateExistingFilters(filters) {
      try {
        console.log('[IR] Activando filtros existentes:', filters);
        
        // Verificar que el sistema imageFilterSystem esté disponible
        if (!window.imageFilterSystem) {
          console.error('[IR] ❌ imageFilterSystem no disponible');
          return false;
        }
        
        // Mapear los filtros de Iris a los filtros del sistema
        const systemFilters = {};
        
        // Activar filtro de dormitorios si existe
        if (filters.bedrooms) {
          const bedroomButtons = document.querySelectorAll('.type-btn');
          let filterActivated = false;
          
          console.log(`[IR] Buscando botón para ${filters.bedrooms} dormitorios en ${bedroomButtons.length} botones`);
          
          bedroomButtons.forEach((btn, index) => {
            btn.classList.remove('active');
            const btnText = btn.textContent.toLowerCase();
            const dataType = btn.getAttribute('data-type');
            
            console.log(`[IR] Botón ${index + 1}: "${btnText}" (data-type: "${dataType}")`);
            
            // Buscar por texto del botón o por data-type
            if ((btnText.includes(filters.bedrooms.toString()) && btnText.includes('dormitorio')) ||
                (dataType && dataType.includes(filters.bedrooms.toString()))) {
              btn.classList.add('active');
              console.log(`[IR] ✅ Activado filtro de ${filters.bedrooms} dormitorios: "${btnText}"`);
              filterActivated = true;
              
              // Mapear al formato del sistema
              systemFilters.tipo = dataType || `${filters.bedrooms}d`;
            }
          });
          
          if (!filterActivated) {
            console.warn(`[IR] ❌ No se encontró botón para ${filters.bedrooms} dormitorios`);
            // Intentar activar el botón "Todos" como fallback
            const allButton = document.querySelector('.type-btn[data-type="all"]');
            if (allButton) {
              allButton.classList.add('active');
              console.log('[IR] Activado botón "Todos" como fallback');
              systemFilters.tipo = 'all';
            }
          }
        }
        
        // Activar filtro de superficie si existe
        if (filters.size) {
          const surfaceFilter = document.getElementById('surfaceFilter');
          if (surfaceFilter) {
            // Determinar el rango de superficie basado en el tamaño solicitado
            let selectedRange = '';
            if (filters.size <= 60) {
              selectedRange = '40-60';
            } else if (filters.size <= 100) {
              selectedRange = '80-100';
            }
            
            if (selectedRange) {
              surfaceFilter.value = selectedRange;
              console.log(`[IR] ✅ Activado filtro de superficie: ${selectedRange} m²`);
              systemFilters.superficie = selectedRange;
            }
          } else {
            console.warn('[IR] ❌ No se encontró el filtro de superficie');
          }
        }
        
        // Activar filtro de precio si existe
        if (filters.price) {
          const priceFilter = document.getElementById('priceFilter');
          if (priceFilter) {
            // Determinar el rango de precio basado en el precio solicitado
            let selectedRange = '';
            if (filters.price <= 3000) {
              selectedRange = '2000-3000';
            } else if (filters.price <= 5000) {
              selectedRange = '4000-5000';
            }
            
            if (selectedRange) {
              priceFilter.value = selectedRange;
              console.log(`[IR] ✅ Activado filtro de precio: $${selectedRange} UF`);
              systemFilters.precio = selectedRange;
            }
          } else {
            console.warn('[IR] ❌ No se encontró el filtro de precio');
          }
        }
        
        // Mostrar la lista de apartamentos si está oculta
        const apartmentList = document.getElementById('apartmentList');
        const initialMessage = document.getElementById('initialMessage');
        
        if (apartmentList && initialMessage) {
          apartmentList.style.display = 'grid';
          initialMessage.style.display = 'none';
          console.log('[IR] ✅ Lista de apartamentos mostrada');
        } else {
          console.warn('[IR] ❌ No se encontraron elementos de lista de apartamentos');
        }
        
        // Aplicar filtros usando el sistema imageFilterSystem
        console.log('[IR] ✅ Aplicando filtros al sistema:', systemFilters);
        try {
          // Usar el método setFilters del sistema
          if (window.imageFilterSystem.setFilters) {
            window.imageFilterSystem.setFilters(systemFilters);
            console.log('[IR] ✅ Filtros aplicados usando setFilters');
          } else if (window.imageFilterSystem.applyFilters) {
            // Si no hay setFilters, usar applyFilters
            window.imageFilterSystem.applyFilters();
            console.log('[IR] ✅ Filtros aplicados usando applyFilters');
          } else {
            console.warn('[IR] ❌ No se encontró método para aplicar filtros');
          }
        } catch (error) {
          console.error('[IR] ❌ Error aplicando filtros:', error);
        }
        
        return true;
        
      } catch (error) {
        console.error('[IR] Error activando filtros existentes:', error);
        return false;
      }
    },

    async clearFilters() {
      try {
        console.log('[IR] Limpiando filtros');
        
        // Usar el botón "Limpiar Filtros" existente
        const clearFiltersButton = document.getElementById('clearFilters');
        if (clearFiltersButton) {
          console.log('[IR] Usando botón "Limpiar Filtros" existente');
          clearFiltersButton.click();
        } else {
          console.warn('[IR] No se encontró el botón "Limpiar Filtros"');
          
          // Fallback: limpiar manualmente los filtros
          const surfaceFilter = document.getElementById('surfaceFilter');
          const priceFilter = document.getElementById('priceFilter');
          const bedroomButtons = document.querySelectorAll('.type-btn');
          
          if (surfaceFilter) surfaceFilter.value = '';
          if (priceFilter) priceFilter.value = '';
          bedroomButtons.forEach(btn => btn.classList.remove('active'));
          
          // Activar "Todos" por defecto
          const allButton = document.querySelector('.type-btn[data-type="all"]');
          if (allButton) allButton.classList.add('active');
        }
        
        // Ocultar notificación si existe
        const notification = document.getElementById('iris-filter-notification');
        if (notification) {
          notification.remove();
        }
        
        console.log('[IR] Filtros limpiados');
        
        return true;
        
      } catch (error) {
        console.error('[IR] Error en clearFilters:', error);
        return false;
      }
    },

    async state() {
      try {
        const app = await getAppReady();
        const video = document.getElementById('backgroundVideo');
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        return {
          section: app.navigationSystem.getCurrentSection() || 'unknown',
          scroll: clamp(scrollPercent, 0, 100),
          video: {
            src: video ? video.src : null,
            playing: video ? !video.paused : false,
            currentTime: video ? video.currentTime : 0,
            duration: video ? video.duration : 0
          }
        };
      } catch (error) {
        console.error('[IR] Error en state:', error);
        return { error: error.message };
      }
    },

    async activateRecorridoMode(card, filters) {
      try {
        console.log('[IR] Activando modo recorrido para tarjeta:', card);
        
        // Extraer información de la tarjeta antes del click
        const apartmentTitle = card.querySelector('h3')?.textContent || 'Apartamento';
        const superficieText = card.querySelector('p:nth-child(2)')?.textContent || '';
        const precioText = card.querySelector('p:nth-child(3)')?.textContent || '';
        
        console.log('[IR] Información de la tarjeta:', { apartmentTitle, superficieText, precioText });
        
        // Simular click en la tarjeta para activar modo recorrido
        card.click();
        
        // Esperar a que se active el modo recorrido
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar que los controles de recorrido estén visibles
        const recorridoControls = document.getElementById('recorridoControls');
        if (recorridoControls) {
          console.log('[IR] Modo recorrido activado exitosamente');
          
          // Actualizar los controles con la información correcta
          this.updateRecorridoControls(apartmentTitle, superficieText, precioText);
          
          // Agregar clase activa a la tarjeta
          card.classList.add('recorrido-active');
          
          return true;
        } else {
          console.warn('[IR] No se encontraron los controles de recorrido, intentando método alternativo');
          
          // Método alternativo: buscar si hay algún sistema de recorrido activo
          const isRecorridoActive = document.body.classList.contains('recorrido-mode') || 
                                   document.querySelector('.recorrido-controls') ||
                                   document.querySelector('.apartment-card.recorrido-active');
          
          if (isRecorridoActive) {
            console.log('[IR] Modo recorrido detectado por método alternativo');
            card.classList.add('recorrido-active');
            return true;
          } else {
            console.warn('[IR] No se pudo activar el modo recorrido');
            return false;
          }
        }
        
      } catch (error) {
        console.error('[IR] Error activando modo recorrido:', error);
        return false;
      }
    },

    updateRecorridoControls(apartment, superficie, precio) {
      try {
        const controls = document.getElementById('recorridoControls');
        if (controls) {
          const infoTitle = controls.querySelector('.recorrido-info h3');
          const infoText = controls.querySelector('.recorrido-info p');
          
          if (infoTitle) infoTitle.textContent = apartment;
          if (infoText) infoText.textContent = `${superficie} • ${precio}`;
          
          console.log('[IR] Controles de recorrido actualizados:', { apartment, superficie, precio });
        }
      } catch (error) {
        console.error('[IR] Error actualizando controles de recorrido:', error);
      }
    },

    async showApartmentDetails(criteria = null) {
      try {
        console.log('[IR] Mostrando detalles del apartamento', criteria ? `con criterios: ${JSON.stringify(criteria)}` : '');
        
        // Si hay criterios específicos, buscar el apartamento que coincida
        if (criteria) {
          console.log('[IR] Buscando apartamento específico con criterios:', criteria);
          const targetCard = this.findApartmentByCriteria(criteria);
          
          if (targetCard) {
            console.log('[IR] ✅ Apartamento encontrado, activando modo recorrido');
            await this.activateRecorridoMode(targetCard, {});
            
            // Esperar un momento para que se active el modo recorrido
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Ahora mostrar detalles
            return await this.triggerDetailsButton();
          } else {
            console.warn('[IR] ❌ No se encontró apartamento que coincida con los criterios');
            return false;
          }
        }
        
        // Verificar si estamos en modo recorrido
        const recorridoControls = document.getElementById('recorridoControls');
        const isInRecorridoMode = recorridoControls && recorridoControls.style.display !== 'none';
        
        if (isInRecorridoMode) {
          console.log('[IR] Estamos en modo recorrido, buscando botón de detalles...');
          return await this.triggerDetailsButton();
        }
        
        // Método 4: Si no estamos en modo recorrido, activar modo recorrido primero
        console.log('[IR] No estamos en modo recorrido, activando modo recorrido...');
        
        // Buscar la primera tarjeta visible de apartamentos filtrados
        const apartmentCards = document.querySelectorAll('.apartment-card');
        const visibleCards = Array.from(apartmentCards).filter(card => 
          card.style.display !== 'none' && 
          card.style.opacity !== '0' &&
          card.offsetParent !== null
        );
        
        if (visibleCards.length === 0) {
          console.warn('[IR] ❌ No hay tarjetas de apartamentos visibles');
          return false;
        }
        
        console.log(`[IR] Encontradas ${visibleCards.length} tarjetas visibles, activando modo recorrido en la primera`);
        
        // Activar modo recorrido en la primera tarjeta visible
        const firstCard = visibleCards[0];
        await this.activateRecorridoMode(firstCard, {});
        
        // Esperar un momento para que se active el modo recorrido
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Ahora intentar mostrar detalles
        return await this.triggerDetailsButton();
        
      } catch (error) {
        console.error('[IR] Error mostrando detalles:', error);
        return false;
      }
    },

    // Función para encontrar un apartamento específico basado en criterios
    findApartmentByCriteria(criteria) {
      try {
        console.log('[IR] Buscando apartamento con criterios:', criteria);
        
        const apartmentCards = document.querySelectorAll('.apartment-card');
        const visibleCards = Array.from(apartmentCards).filter(card => 
          card.style.display !== 'none' && 
          card.style.opacity !== '0' &&
          card.offsetParent !== null
        );
        
        console.log(`[IR] Analizando ${visibleCards.length} tarjetas visibles`);
        
        for (const card of visibleCards) {
          const cardInfo = this.extractCardInfo(card);
          console.log('[IR] Tarjeta:', cardInfo);
          
          // Verificar si la tarjeta coincide con los criterios
          if (this.matchesCriteria(cardInfo, criteria)) {
            console.log('[IR] ✅ Tarjeta encontrada que coincide con criterios:', cardInfo);
            return card;
          }
        }
        
        console.warn('[IR] ❌ No se encontró tarjeta que coincida con los criterios');
        return null;
        
      } catch (error) {
        console.error('[IR] Error buscando apartamento por criterios:', error);
        return null;
      }
    },

    // Función para extraer información de una tarjeta de apartamento
    extractCardInfo(card) {
      try {
        const title = card.querySelector('h3')?.textContent?.trim() || '';
        const paragraphs = card.querySelectorAll('p');
        
        let superficie = '';
        let precio = '';
        let dormitorios = '';
        
        // Extraer información de los párrafos
        for (const p of paragraphs) {
          const text = p.textContent?.trim() || '';
          
          // Detectar superficie
          if (text.includes('m²') || text.includes('metros')) {
            superficie = text;
          }
          // Detectar precio
          else if (text.includes('$') || text.includes('UF')) {
            precio = text;
          }
          // Detectar dormitorios
          else if (text.includes('dormitorio') || text.includes('habitación')) {
            dormitorios = text;
          }
        }
        
        return {
          title,
          superficie,
          precio,
          dormitorios
        };
        
      } catch (error) {
        console.error('[IR] Error extrayendo información de tarjeta:', error);
        return {};
      }
    },

    // Función para verificar si una tarjeta coincide con los criterios
    matchesCriteria(cardInfo, criteria) {
      try {
        console.log('[IR] Comparando tarjeta:', cardInfo, 'con criterios:', criteria);
        
        // Verificar superficie
        if (criteria.superficie && cardInfo.superficie) {
          const cardSuperficie = cardInfo.superficie.toLowerCase();
          const criteriaSuperficie = criteria.superficie.toLowerCase();
          
          // Extraer números de superficie para comparación más precisa
          const cardMatch = cardSuperficie.match(/(\d+)-(\d+)/);
          const criteriaMatch = criteriaSuperficie.match(/(\d+)-(\d+)/);
          
          if (cardMatch && criteriaMatch) {
            const cardMin = parseInt(cardMatch[1]);
            const cardMax = parseInt(cardMatch[2]);
            const criteriaMin = parseInt(criteriaMatch[1]);
            const criteriaMax = parseInt(criteriaMatch[2]);
            
            // Verificar si hay superposición en los rangos
            if (cardMin <= criteriaMax && cardMax >= criteriaMin) {
              console.log(`[IR] ✅ Superficie coincide: ${cardMin}-${cardMax} vs ${criteriaMin}-${criteriaMax}`);
            } else {
              console.log(`[IR] ❌ No coincide superficie: ${cardMin}-${cardMax} vs ${criteriaMin}-${criteriaMax}`);
              return false;
            }
          } else {
            // Fallback: comparación simple
            if (!cardSuperficie.includes(criteriaSuperficie.replace(' m²', ''))) {
              console.log('[IR] ❌ No coincide superficie (fallback):', cardSuperficie, 'vs', criteriaSuperficie);
              return false;
            }
          }
        }
        
        // Verificar precio
        if (criteria.precio && cardInfo.precio) {
          const cardPrecio = cardInfo.precio.toLowerCase();
          const criteriaPrecio = criteria.precio.toLowerCase();
          
          // Extraer números de precio para comparación más precisa
          const cardMatch = cardPrecio.match(/(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)/);
          const criteriaMatch = criteriaPrecio.match(/(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)/);
          
          if (cardMatch && criteriaMatch) {
            const cardMin = parseFloat(cardMatch[1]);
            const cardMax = parseFloat(cardMatch[2]);
            const criteriaMin = parseFloat(criteriaMatch[1]);
            const criteriaMax = parseFloat(criteriaMatch[2]);
            
            // Verificar si hay superposición en los rangos
            if (cardMin <= criteriaMax && cardMax >= criteriaMin) {
              console.log(`[IR] ✅ Precio coincide: ${cardMin}-${cardMax} vs ${criteriaMin}-${criteriaMax}`);
            } else {
              console.log(`[IR] ❌ No coincide precio: ${cardMin}-${cardMax} vs ${criteriaMin}-${criteriaMax}`);
              return false;
            }
          } else {
            // Fallback: comparación simple
            if (!cardPrecio.includes(criteriaPrecio.replace('$', '').replace(' uf', ''))) {
              console.log('[IR] ❌ No coincide precio (fallback):', cardPrecio, 'vs', criteriaPrecio);
              return false;
            }
          }
        }
        
        // Verificar dormitorios
        if (criteria.dormitorios && cardInfo.dormitorios) {
          const cardDormitorios = cardInfo.dormitorios.toLowerCase();
          const criteriaDormitorios = criteria.dormitorios;
          
          // Extraer número de dormitorios
          const cardMatch = cardDormitorios.match(/(\d+)/);
          const criteriaMatch = criteriaDormitorios.match(/(\d+)/);
          
          if (cardMatch && criteriaMatch) {
            const cardNum = parseInt(cardMatch[1]);
            const criteriaNum = parseInt(criteriaMatch[1]);
            
            if (cardNum === criteriaNum) {
              console.log(`[IR] ✅ Dormitorios coinciden: ${cardNum} vs ${criteriaNum}`);
            } else {
              console.log(`[IR] ❌ No coinciden dormitorios: ${cardNum} vs ${criteriaNum}`);
              return false;
            }
          } else {
            // Fallback: comparación simple
            if (!cardDormitorios.includes(criteriaDormitorios)) {
              console.log('[IR] ❌ No coincide dormitorios (fallback):', cardDormitorios, 'vs', criteriaDormitorios);
              return false;
            }
          }
        }
        
        console.log('[IR] ✅ Tarjeta coincide con todos los criterios');
        return true;
        
      } catch (error) {
        console.error('[IR] Error comparando criterios:', error);
        return false;
      }
    },

    // Función para activar el botón de detalles
    async triggerDetailsButton() {
      try {
        // Método 1: Buscar el botón "Detalles" en los controles de recorrido
        const detailsButton = document.querySelector('#recorridoControls .btn-secondary[onclick*="showApartmentDetails"]');
        if (detailsButton) {
          detailsButton.click();
          console.log('[IR] ✅ Botón de detalles clickeado (método 1)');
          return true;
        }
        
        // Método 2: Buscar cualquier botón que contenga "Detalles" en el texto
        const allButtons = document.querySelectorAll('button');
        const detailsBtn = Array.from(allButtons).find(btn => 
          btn.textContent.toLowerCase().includes('detalles') || 
          btn.textContent.toLowerCase().includes('details')
        );
        
        if (detailsBtn) {
          detailsBtn.click();
          console.log('[IR] ✅ Botón de detalles encontrado y clickeado (método 2)');
          return true;
        }
        
        // Método 3: Buscar por onclick que contenga "showApartmentDetails"
        const onclickButtons = document.querySelectorAll('button[onclick*="showApartmentDetails"]');
        if (onclickButtons.length > 0) {
          onclickButtons[0].click();
          console.log('[IR] ✅ Botón de detalles encontrado por onclick (método 3)');
          return true;
        }
        
        // Método 4: Usar el sistema imageFilterSystem directamente
        if (window.imageFilterSystem && window.imageFilterSystem.showApartmentDetails) {
          console.log('[IR] Usando imageFilterSystem.showApartmentDetails directamente');
          const currentCard = document.querySelector('.apartment-card.recorrido-active');
          if (currentCard) {
            const title = currentCard.querySelector('h3')?.textContent || 'Apartamento';
            const superficie = currentCard.querySelector('p:nth-child(2)')?.textContent || '';
            const precio = currentCard.querySelector('p:nth-child(3)')?.textContent || '';
            
            console.log('[IR] Llamando showApartmentDetails con:', { title, superficie, precio });
            window.imageFilterSystem.showApartmentDetails(title, superficie, precio);
            return true;
          }
        }
        
        console.warn('[IR] ❌ No se encontró ningún método para mostrar detalles');
        return false;
        
      } catch (error) {
        console.error('[IR] Error activando botón de detalles:', error);
        return false;
      }
    },

    async nextApartment() {
      try {
        console.log('[IR] Navegando al siguiente apartamento');
        
        // Primero verificar si estamos en modo recorrido
        const recorridoControls = document.getElementById('recorridoControls');
        if (!recorridoControls) {
          console.warn('[IR] No estamos en modo recorrido, activando filtros primero');
          // Si no estamos en modo recorrido, activar filtros básicos
          await this.filterApartments({ bedrooms: 2 });
          return true;
        }
        
        // Buscar todas las tarjetas visibles
        const apartmentCards = document.querySelectorAll('.apartment-card');
        const visibleCards = Array.from(apartmentCards).filter(card => 
          card.style.display !== 'none' && 
          card.style.opacity !== '0' &&
          card.offsetParent !== null // Verificar que esté realmente visible
        );
        
        console.log(`[IR] Tarjetas visibles encontradas: ${visibleCards.length}`);
        
        if (visibleCards.length === 0) {
          console.warn('[IR] No hay tarjetas visibles');
          return false;
        }
        
        // Encontrar la tarjeta activa actual
        const activeCard = document.querySelector('.apartment-card.recorrido-active');
        let currentIndex = -1;
        
        if (activeCard) {
          currentIndex = visibleCards.indexOf(activeCard);
          console.log(`[IR] Tarjeta activa encontrada en índice: ${currentIndex}`);
        } else {
          console.log('[IR] No hay tarjeta activa, empezando desde la primera');
        }
        
        // Calcular el índice del siguiente apartamento
        const nextIndex = (currentIndex + 1) % visibleCards.length;
        const nextCard = visibleCards[nextIndex];
        
        console.log(`[IR] Navegando a tarjeta ${nextIndex + 1} de ${visibleCards.length}`);
        
        // Extraer información de la tarjeta para actualizar controles
        const apartmentTitle = nextCard.querySelector('h3')?.textContent || 'Apartamento';
        const superficieText = nextCard.querySelector('p:nth-child(2)')?.textContent || '';
        const precioText = nextCard.querySelector('p:nth-child(3)')?.textContent || '';
        
        // Simular click en la siguiente tarjeta
        nextCard.click();
        
        // Esperar un momento para que se procese el click
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Actualizar los controles con la nueva información
        this.updateRecorridoControls(apartmentTitle, superficieText, precioText);
        
        console.log(`[IR] Navegado exitosamente al apartamento: ${apartmentTitle}`);
        return true;
        
      } catch (error) {
        console.error('[IR] Error navegando al siguiente apartamento:', error);
        return false;
      }
    },

    async prevApartment() {
      try {
        console.log('[IR] Navegando al apartamento anterior');
        
        // Primero verificar si estamos en modo recorrido
        const recorridoControls = document.getElementById('recorridoControls');
        if (!recorridoControls) {
          console.warn('[IR] No estamos en modo recorrido, activando filtros primero');
          // Si no estamos en modo recorrido, activar filtros básicos
          await this.filterApartments({ bedrooms: 2 });
          return true;
        }
        
        // Buscar todas las tarjetas visibles
        const apartmentCards = document.querySelectorAll('.apartment-card');
        const visibleCards = Array.from(apartmentCards).filter(card => 
          card.style.display !== 'none' && 
          card.style.opacity !== '0' &&
          card.offsetParent !== null // Verificar que esté realmente visible
        );
        
        console.log(`[IR] Tarjetas visibles encontradas: ${visibleCards.length}`);
        
        if (visibleCards.length === 0) {
          console.warn('[IR] No hay tarjetas visibles');
          return false;
        }
        
        // Encontrar la tarjeta activa actual
        const activeCard = document.querySelector('.apartment-card.recorrido-active');
        let currentIndex = -1;
        
        if (activeCard) {
          currentIndex = visibleCards.indexOf(activeCard);
          console.log(`[IR] Tarjeta activa encontrada en índice: ${currentIndex}`);
        } else {
          console.log('[IR] No hay tarjeta activa, empezando desde la última');
        }
        
        // Calcular el índice del apartamento anterior
        const prevIndex = currentIndex <= 0 ? visibleCards.length - 1 : currentIndex - 1;
        const prevCard = visibleCards[prevIndex];
        
        console.log(`[IR] Navegando a tarjeta ${prevIndex + 1} de ${visibleCards.length}`);
        
        // Extraer información de la tarjeta para actualizar controles
        const apartmentTitle = prevCard.querySelector('h3')?.textContent || 'Apartamento';
        const superficieText = prevCard.querySelector('p:nth-child(2)')?.textContent || '';
        const precioText = prevCard.querySelector('p:nth-child(3)')?.textContent || '';
        
        // Simular click en la tarjeta anterior
        prevCard.click();
        
        // Esperar un momento para que se procese el click
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Actualizar los controles con la nueva información
        this.updateRecorridoControls(apartmentTitle, superficieText, precioText);
        
        console.log(`[IR] Navegado exitosamente al apartamento: ${apartmentTitle}`);
        return true;
        
      } catch (error) {
        console.error('[IR] Error navegando al apartamento anterior:', error);
        return false;
      }
    },

    async exitRecorridoMode() {
      try {
        console.log('[IR] Saliendo del modo recorrido');
        
        // Buscar el botón "Salir del Recorrido"
        const exitButton = document.querySelector('#recorridoControls .btn-secondary[onclick*="exitRecorridoMode"]');
        if (exitButton) {
          exitButton.click();
          console.log('[IR] Botón de salir clickeado');
          return true;
        } else {
          console.warn('[IR] No se encontró el botón de salir');
          return false;
        }
      } catch (error) {
        console.error('[IR] Error saliendo del modo recorrido:', error);
        return false;
      }
    },

    async toggleVideoPlayback() {
      try {
        console.log('[IR] Alternando reproducción del video');
        
        // Buscar el botón de play/pause
        const playButton = document.querySelector('#recorridoControls .btn-primary[onclick*="toggleVideoPlayback"]');
        if (playButton) {
          playButton.click();
          console.log('[IR] Botón de play/pause clickeado');
          return true;
        } else {
          console.warn('[IR] No se encontró el botón de play/pause');
          return false;
        }
      } catch (error) {
        console.error('[IR] Error alternando reproducción:', error);
        return false;
      }
    }
  };

  console.info('[IR] API pública cargada.');
})();

// Helper functions for form control
async function fillForm(formKey, data) {
  try {
    switch (formKey) {
      case 'project':
        const projectName = document.getElementById('projectName');
        const projectEmail = document.getElementById('projectEmail');
        
        if (projectName && data.name) projectName.value = data.name;
        if (projectEmail && data.email) projectEmail.value = data.email;
        
        console.log('[IR] Formulario de proyecto llenado');
        return true;
        
      case 'contact':
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const message = document.getElementById('message');
        
        if (name && data.name) name.value = data.name;
        if (email && data.email) email.value = data.email;
        if (phone && data.phone) phone.value = data.phone;
        if (message && data.message) message.value = data.message;
        
        console.log('[IR] Formulario de contacto llenado');
        return true;
        
      default:
        console.warn(`[IR] Formulario no reconocido: ${formKey}`);
        return false;
    }
  } catch (error) {
    console.error('[IR] Error llenando formulario:', error);
    return false;
  }
}

async function submitForm(formKey) {
  try {
    switch (formKey) {
      case 'project':
        const projectForm = document.getElementById('projectForm');
        if (projectForm) {
          projectForm.dispatchEvent(new Event('submit', { bubbles: true }));
          console.log('[IR] Formulario de proyecto enviado');
          return true;
        }
        break;
        
      case 'contact':
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
          contactForm.dispatchEvent(new Event('submit', { bubbles: true }));
          console.log('[IR] Formulario de contacto enviado');
          return true;
        }
        break;
        
      default:
        console.warn(`[IR] Formulario no reconocido: ${formKey}`);
        return false;
    }
  } catch (error) {
    console.error('[IR] Error enviando formulario:', error);
    return false;
  }
}

async function clearForm(formKey) {
  try {
    switch (formKey) {
      case 'project':
        const projectForm = document.getElementById('projectForm');
        if (projectForm) {
          projectForm.reset();
          console.log('[IR] Formulario de proyecto limpiado');
          return true;
        }
        break;
        
      case 'contact':
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
          contactForm.reset();
          console.log('[IR] Formulario de contacto limpiado');
          return true;
        }
        break;
        
      default:
        console.warn(`[IR] Formulario no reconocido: ${formKey}`);
        return false;
    }
  } catch (error) {
    console.error('[IR] Error limpiando formulario:', error);
    return false;
  }
}
