import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import all preview components
import { PreviewHeaderComponent, PreviewHeaderConfig } from './components/preview-header/preview-header.component';
import { PreviewNavigationComponent, PreviewNavigationConfig, NavigationItem } from './components/preview-navigation/preview-navigation.component';
import { PreviewHeroComponent, PreviewHeroConfig } from './components/preview-hero/preview-hero.component';
import { PreviewDescriptionComponent, PreviewDescriptionConfig } from './components/preview-description/preview-description.component';
import { PreviewSelectorComponent, PreviewSelectorConfig, SelectorOption } from './components/preview-selector/preview-selector.component';
import { PreviewStatsComponent, PreviewStatsConfig, StatItem } from './components/preview-stats/preview-stats.component';
import { PreviewFooterComponent, PreviewFooterConfig } from './components/preview-footer/preview-footer.component';
import { PreviewScrollIndicatorComponent, ScrollIndicatorConfig } from './components/preview-scroll-indicator/preview-scroll-indicator.component';

// Import apartment components
import { ApartmentTypeSelectorComponent, ApartmentTypeSelectorConfig, ApartmentType } from './components/apartment-type-selector/apartment-type-selector.component';
import { ApartmentFiltersComponent, ApartmentFiltersConfig, ApartmentFilter } from './components/apartment-filters/apartment-filters.component';
import { ApartmentDetailCardComponent, ApartmentDetailCardConfig, ApartmentDetails } from './components/apartment-detail-card/apartment-detail-card.component';
import { ApartmentModelComponent, ApartmentModelConfig, ContactInfo } from './components/apartment-model/apartment-model.component';
import { ApartmentListComponent, ApartmentListConfig, ApartmentListItem } from './components/apartment-list/apartment-list.component';

// Import features components
import { ApartmentModelDetailComponent, ApartmentModelDetailConfig, ModelSpecification, FloorType, QuoteFormData, PdfFormData } from './components/apartment-model-detail/apartment-model-detail.component';
import { ApartmentGalleryComponent, ApartmentGalleryConfig, GalleryImage } from './components/apartment-gallery/apartment-gallery.component';
import { ImageCarouselComponent, ImageCarouselConfig, CarouselImage } from './components/image-carousel/image-carousel.component';
import { EquipmentSelectorComponent, EquipmentSelectorConfig, EquipmentOption } from './components/equipment-selector/equipment-selector.component';
import { ContactModalComponent, ContactModalConfig, ExecutiveContactInfo } from './components/contact-modal/contact-modal.component';
import { LocationTagComponent, LocationTagConfig } from './components/location-tag/location-tag.component';
import { Project } from './components/project-menu/project-menu.component';

import { VideoTransitionService } from './services/video-transition.service';

// Video interfaces
interface VideoSection {
  id: string;
  animationVideoSrc: string; // Video que se reproduce una vez
  restVideoSrc: string;      // Video que se queda en loop
  title?: string;
  description?: string;
  active: boolean;
  isPlayingAnimation: boolean;
  muted?: boolean;
}

interface VideoBackgroundConfig {
  sections: VideoSection[];
  currentSection: number;
  transitionDuration?: number;
  showOverlay?: boolean;
  overlayOpacity?: number;
}

@Component({
  selector: 'app-preview-demo',
  standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    PreviewHeaderComponent,
    PreviewNavigationComponent,
    PreviewHeroComponent,
    PreviewDescriptionComponent,
    PreviewSelectorComponent,
    PreviewStatsComponent,
    PreviewFooterComponent,
    PreviewScrollIndicatorComponent,
    ApartmentTypeSelectorComponent,
    ApartmentFiltersComponent,
    ApartmentDetailCardComponent,
    ApartmentModelComponent,
    ApartmentListComponent,
    ApartmentModelDetailComponent,
    ApartmentGalleryComponent,
    ImageCarouselComponent,
    EquipmentSelectorComponent,
    ContactModalComponent,
    LocationTagComponent
  ],
  templateUrl: './preview-demo.component.html',
  styleUrls: ['./preview-demo.component.scss']
})
export class PreviewDemoComponent implements OnInit, AfterViewInit {
  // Header Configuration
  headerConfig: PreviewHeaderConfig = {
    title: 'Mirador del Golf',
    showMenu: true,
    menuItems: ['HOME', 'APARTAMENTS', 'FEATURES', 'CONTACT'],
    projects: [
      { id: '1', name: 'Mirador del Golf', active: true },
      { id: '2', name: 'Torre Marina', active: false },
      { id: '3', name: 'Residencial Parque', active: false },
      { id: '4', name: 'Vista Cordillera', active: false },
      { id: '5', name: 'Urban Center', active: false }
    ]
  };

  // Navigation Configuration
  navigationConfig: PreviewNavigationConfig = {
    items: [
      { label: 'HOME', active: true },
      { label: 'APARTAMENTS', active: false },
      { label: 'FEATURES', active: false },
      { label: 'CONTACT', active: false }
    ],
    centered: true,
    showUnderline: true
  };

  // Hero Configuration
  heroConfig: PreviewHeroConfig = {
    title: 'Mirador del Golf',
    size: 'large',
    centered: true,
    showDivider: false
  };

  // Description Configuration
  descriptionConfig: PreviewDescriptionConfig = {
    text: 'Exclusivas casas y departamentos ubicados en el sector más privilegiado de Piedra Roja, dentro del Club de Golf Hacienda Chicureo Club. Diseñado para aprovechar al máximo las vistas hacia el Valle de Chicureo y el cajón cordillerano gracias a sus amplios ventanales de piso a cielo. Es un proyecto versátil, que invita a compartir y a disfrutar de sus amplios espacios integrados y amplias terrazas. El proyecto ofrece las opciones de elegir un gran jardín privado, salidas exclusivas al parque o azoteas.',
    maxWidth: '800px',
    centered: true,
    showBackground: false,
    padding: 'medium',
    audio: {
      src: 'assets/audio/project-description.mp3', // Ruta del archivo de audio
      autoplay: false,
      loop: false,
      preload: 'metadata'
    }
  };

  // Selector Configuration
  selectorConfig: PreviewSelectorConfig = {
    type: 'radio',
    options: [
      { label: 'Apartamento', value: 'apartamento' },
      { label: 'Casa', value: 'casa' }
    ],
    selectedValue: 'apartamento',
    layout: 'horizontal',
    size: 'medium'
  };

  // Stats Configuration
  statsConfig: PreviewStatsConfig = {
    items: [
      { value: '8', label: 'Minutos del metro' },
      { value: '8', label: 'Minutos del metro' },
      { value: '8', label: 'Minutos del metro' }
    ],
    layout: 'horizontal',
    size: 'medium',
    showDividers: true,
    centered: true
  };

  // Footer Configuration
  footerConfig: PreviewFooterConfig = {
    address: 'Av amaerica 334 Las condes',
    buttonText: 'Recorrer',
    showDivider: true,
    layout: 'horizontal'
  };

  // Scroll Indicator Configuration
  scrollConfig: ScrollIndicatorConfig = {
    totalSections: 4,
    currentSection: 1,
    position: 'right',
    size: 'medium',
    showLabels: false,
    sections: [
      { id: 1, label: 'HOME', elementId: 'home' },
      { id: 2, label: 'APARTAMENTS', elementId: 'apartments' },
      { id: 3, label: 'FEATURES', elementId: 'features' },
      { id: 4, label: 'EQUIPMENT', elementId: 'equipment' }
    ]
  };

  // Apartment Type Selector Configuration
  apartmentTypeConfig: ApartmentTypeSelectorConfig = {
    title: 'Tipo de apartamento',
    types: [
      { id: '1', label: 'Tipo A', active: true },
      { id: '2', label: 'Tipo B', active: false },
      { id: '3', label: 'Tipo C', active: false },
      { id: '4', label: 'Tipo D', active: false },
      { id: '5', label: 'Tipo E', active: false }
    ]
  };

  // Apartment Filters Configuration
  apartmentFiltersConfig: ApartmentFiltersConfig = {
    filters: [
      { label: 'Piso', value: '12', type: 'number' },
      { label: 'N° Habitaciones', value: '2', type: 'number' },
      { label: 'Horientacion', value: 'Oriente', type: 'select', options: ['Oriente', 'Poniente', 'Norte', 'Sur'] },
      { label: 'Baños', value: '2', type: 'number' },
      { label: 'Terrazas', value: '0', type: 'number' }
    ]
  };

  // Apartment Detail Card Configuration
  apartmentDetailConfig: ApartmentDetailCardConfig = {
    details: {
      superficie: {
        interior: '135 M2',
        terraza: '32 M2',
        total: '173 M2'
      },
      orientacion: 'Oriente',
      banos: 2,
      habitaciones: 2,
      piso: 2
    }
  };

  // Apartment Model Configuration
  apartmentModelConfig: ApartmentModelConfig = {
    title: 'Modelo 135,2',
    floorPlanImage: '',
    contact: {
      name: 'Carmen Geissbuhler',
      email: 'carmen@example.com',
      phone: '+56 9 1234 5678'
    }
  };

  // Apartment List Configuration
  apartmentListConfig: ApartmentListConfig = {
    items: [
      { id: '1', title: 'Apartamento 1', selected: true },
      { id: '2', title: 'Apartamento 2', selected: false },
      { id: '3', title: 'Apartamento 3', selected: false },
      { id: '4', title: 'Apartamento 4', selected: false }
    ]
  };

  // Features Section - Model Detail Configuration
  modelDetailConfig: ApartmentModelDetailConfig = {
    title: 'Modelo 135,2',
    specifications: [
      { label: '2 Habitacion', value: '55,43 M2 Area' },
      { label: '12m2 Valcon', value: '4 Área' },
      { label: 'Horientacion', value: 'Norte' }
    ],
    floorTypes: [
      { id: '1', label: 'Tipo A', active: true },
      { id: '2', label: 'Tipo B', active: false },
      { id: '3', label: 'Tipo C', active: false }
    ],
    showFloorPlan: true,
    useRealImage: false, // Set to true when you have real images
    floorPlanImage: 'assets/images/floor-plan-135-2.jpg' // Path to your real image
  };

  // Features Section - Gallery Configuration
  galleryConfig: ApartmentGalleryConfig = {
    images: [
      { id: '1', src: '', alt: 'Vista 1', active: false },
      { id: '2', src: '', alt: 'Vista 2', active: true },
      { id: '3', src: '', alt: 'Vista 3', active: false }
    ],
    showNavigation: true,
    showScrollIndicator: true
  };

  // Image Carousel Configuration
  carouselConfig: ImageCarouselConfig = {
    images: [
      { id: '1', src: 'assets/images/deco2r.PNG', alt: 'Imagen 1', active: true },
      { id: '2', src: 'assets/images/decor.PNG', alt: 'Imagen 2', active: false },
      { id: '3', src: 'assets/images/unnamed.jpg', alt: 'Imagen 3', active: false },
      { id: '4', src: 'assets/images/unnamed (1).jpg', alt: 'Imagen 4', active: false },
      { id: '5', src: 'assets/images/unnamed (3).jpg', alt: 'Imagen 5', active: false }
    ],
    showNavigation: true,
    showPreviewThumbnails: true,
    autoPlay: false
  };

     // Equipment Selector Configuration
   equipmentConfig: EquipmentSelectorConfig = {
     title: 'Equipamiento',
     description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes.',
     options: [
       { id: '1', label: 'Sala de juegos', selected: false },
       { id: '2', label: 'Quinchos', selected: false },
       { id: '3', label: 'Gimnasio', selected: false }
     ],
     showScrollbar: true,
     showQuoteButton: true,
     quoteButtonText: 'Cotizar proyecto'
   };

     // Contact Modal Configuration
  contactModalConfig: ContactModalConfig = {
    executiveInfo: {
      name: 'Nombre',
      email: 'mail@ejecutivo.cl',
      phone: '+569 458221458'
    },
    showWhatsApp: true,
    showEmail: true,
    contactButtonText: 'Contactarme',
    privacyPolicyText: 'Politicas de privacidad'
  };

  // Location Tag Configuration
  locationTagConfig: LocationTagConfig = {
    city: 'Piedra Roja',
    address: 'Club de Golf Hacienda Chicureo',
    showIcon: true,
    size: 'medium'
  };

     // Contact Modal State
  isContactModalOpen = false;
  
  // Apartment Model Visibility State
  isApartmentModelVisible = false;
  
  // Apartment Container Animation State
  isApartmentContainerAnimated = false;

  // Video Background Configuration
  videoConfig: VideoBackgroundConfig = {
    sections: [
      {
        id: 'home',
        animationVideoSrc: 'assets/videos/video-1.mp4', // Video inicial que se reproduce una vez
        restVideoSrc: 'assets/videos/video-0.mp4',      // Video de reposo en loop
        title: 'Bosques de Lo Curro',
        description: 'Un lugar tranquilo en un gran vecindario. Disfruta de la naturaleza ilimitada y los encantos de la vida en la ciudad.',
        active: true,
        isPlayingAnimation: true, // Comienza reproduciendo la animación
        muted: true
      },
      {
        id: 'apartments',
        animationVideoSrc: 'assets/videos/video-4.mp4', // Video de animación para apartamentos
        restVideoSrc: 'assets/videos/video-3.mp4',      // Video de reposo para apartamentos
        title: 'Apartamentos',
        description: 'Descubre nuestros exclusivos apartamentos con las mejores vistas.',
        active: false,
        isPlayingAnimation: false,
        muted: true
      },
      {
        id: 'features',
        animationVideoSrc: 'assets/videos/video-8.mp4', // Video de animación para features
        restVideoSrc: 'assets/videos/video-7.mp4',      // Video de reposo para features
        title: 'Características',
        description: 'Explora las características únicas de nuestro proyecto.',
        active: false,
        isPlayingAnimation: false,
        muted: true
      },
      {
        id: 'contact',
        animationVideoSrc: 'assets/videos/video-5.mp4', // Video de animación para contacto
        restVideoSrc: 'assets/videos/video-6.mp4',      // Video de reposo para contacto
        title: 'Contacto',
        description: 'Contáctanos para más información sobre nuestro proyecto.',
        active: false,
        isPlayingAnimation: false,
        muted: true
      }
    ],
    currentSection: 0,
    transitionDuration: 1000,
    showOverlay: true,
    overlayOpacity: 0.3
  };

  // Video reference
  @ViewChild('backgroundVideo', { static: false }) backgroundVideoRef!: ElementRef<HTMLVideoElement>;

  constructor(private videoTransitionService: VideoTransitionService) {}

  ngOnInit(): void {
    this.initializeVideoSystem();
  }

  ngAfterViewInit(): void {
    console.log(`🎬 ngAfterViewInit called`);
    
    // Verificar si el elemento de video existe
    if (this.backgroundVideoRef && this.backgroundVideoRef.nativeElement) {
      console.log(`✅ Video element found`);
      // Start the initial video sequence
      this.startInitialVideoSequence();
    } else {
      console.error(`❌ Video element not found`);
    }
    
    // Add scroll listener for automatic video changes
    this.setupScrollListener();
    
    // Initial scroll position check
    setTimeout(() => {
      this.showScrollPosition();
    }, 500);
    
    // Detectar secciones automáticamente después de que el DOM esté listo
    setTimeout(() => {
      this.autoDetectSections();
    }, 1000);
  }

  private autoDetectSections(): void {
    // Buscar comentarios de sección en el DOM
    const sectionComments = [
      'Section 1: Hero Section',
      'Section 2: Apartments Section', 
      'Section 3: Features Section',
      'Section 4: Equipment Section'
    ];
    
    // Verificar que todas las secciones estén presentes
    sectionComments.forEach((comment, index) => {
      const sectionId = this.getSectionIdByComment(comment);
      const section = document.getElementById(sectionId);
      if (!section) {
        console.warn(`⚠ Section not found: ${comment} (${sectionId})`);
      }
    });
  }

  private getSectionIdByComment(comment: string): string {
    switch (comment) {
      case 'Section 1: Hero Section':
        return 'section-1';
      case 'Section 2: Apartments Section':
        return 'apartments';
      case 'Section 3: Features Section':
        return 'features';
      case 'Section 4: Equipment Section':
        return 'equipment';
      default:
        return '';
    }
  }

  private initializeVideoSystem(): void {
    // Inicializar el sistema de videos
    // La primera sección (HOME) comienza reproduciendo la animación
    this.videoConfig.sections[0].active = true;
    this.videoConfig.sections[0].isPlayingAnimation = true;
    this.videoConfig.currentSection = 0;
    
    // Las demás secciones están inactivas
    for (let i = 1; i < this.videoConfig.sections.length; i++) {
      this.videoConfig.sections[i].active = false;
      this.videoConfig.sections[i].isPlayingAnimation = false;
    }
  }

  // Event Handlers
  onMenuToggle(): void {
    console.log('Menu toggled');
  }

  onProjectSelect(project: Project): void {
    console.log('Project selected:', project);
    
    // Update active project
    this.headerConfig.projects?.forEach(p => {
      p.active = p.id === project.id;
    });
    
    // Update header title
    this.headerConfig.title = project.name;
    
    // Here you would typically load the project data from API
    // For now, we'll just log the selection
    console.log(`Switching to project: ${project.name}`);
  }

  onLogoClick(): void {
    console.log('Logo clicked');
  }

  onNavigationItemClick(item: NavigationItem): void {
    console.log('Navigation item clicked:', item);
    // Update active state
    this.navigationConfig.items.forEach(navItem => {
      navItem.active = navItem.label === item.label;
    });

    // Handle video background change
    this.changeVideoBackground(item.label);

    // Handle navigation to specific sections
    if (item.label === 'APARTAMENTS') {
      const apartmentsSection = document.getElementById('apartments');
      if (apartmentsSection) {
        apartmentsSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    } else if (item.label === 'FEATURES') {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    } else if (item.label === 'HOME') {
      // Scroll to top for HOME
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  }

  private changeVideoBackground(section: string): void {
    console.log(`🎬 CHANGE VIDEO CALLED: ${section}`);
    
    // Evitar cambiar el video si ya está reproduciendo la misma sección
    const currentSectionLabel = this.getCurrentSectionLabel();
    console.log(`🔍 Current section label: "${currentSectionLabel}", New section: "${section}"`);
    
    if (currentSectionLabel === section) {
      console.log(`⏭️ Already playing ${section}, skipping...`);
      return;
    }
    
    // Actualizar el estado de las secciones
    this.updateVideoSectionStates(section);
    
    switch (section) {
      case 'HOME':
        console.log(`🎬 Playing HOME videos: video-1.mp4 → video-0.mp4`);
        // Play video-1.mp4 then video-0.mp4
        this.playVideo('assets/videos/video-1.mp4', () => {
          this.playVideo('assets/videos/video-0.mp4', null, true);
        });
        break;
      case 'APARTAMENTS':
        console.log(`🎬 Playing APARTAMENTS videos: video-4.mp4 → video-3.mp4`);
        // Play video-4.mp4 then video-3.mp4
        this.playVideo('assets/videos/video-4.mp4', () => {
          this.playVideo('assets/videos/video-3.mp4', null, true);
        });
        break;
      case 'FEATURES':
        console.log(`🎬 Playing FEATURES videos: video-8.mp4 → video-7.mp4`);
        // Play video-8.mp4 then video-7.mp4
        this.playVideo('assets/videos/video-8.mp4', () => {
          this.playVideo('assets/videos/video-7.mp4', null, true);
        });
        break;
      case 'CONTACT':
        console.log(`🎬 Playing CONTACT videos: video-5.mp4 → video-6.mp4`);
        // Play video-5.mp4 then video-6.mp4
        this.playVideo('assets/videos/video-5.mp4', () => {
          this.playVideo('assets/videos/video-6.mp4', null, true);
        });
        break;
      default:
        console.log(`🎬 Playing DEFAULT videos: video-1.mp4 → video-0.mp4`);
        // Default to HOME
        this.playVideo('assets/videos/video-1.mp4', () => {
          this.playVideo('assets/videos/video-0.mp4', null, true);
        });
    }
  }

  private getCurrentSectionLabel(): string {
    const sections = ['HOME', 'APARTAMENTS', 'FEATURES', 'CONTACT'];
    const currentLabel = sections[this.videoConfig.currentSection] || 'HOME';
    console.log(`🔍 getCurrentSectionLabel: index=${this.videoConfig.currentSection}, label="${currentLabel}"`);
    return currentLabel;
  }

  private updateVideoSectionStates(activeSection: string): void {
    const sections = ['HOME', 'APARTAMENTS', 'FEATURES', 'CONTACT'];
    const activeIndex = sections.indexOf(activeSection);
    
    if (activeIndex !== -1) {
      // Actualizar el estado de todas las secciones
      this.videoConfig.sections.forEach((section, index) => {
        section.active = index === activeIndex;
        section.isPlayingAnimation = index === activeIndex;
      });
      
      this.videoConfig.currentSection = activeIndex;
    }
  }

  private playAnimationVideo(sectionIndex: number): void {
    // El video de animación se reproducirá automáticamente
    // Cuando termine, se llamará onAnimationVideoEnded
  }

  private startInitialVideoSequence(): void {
    console.log(`🎬 STARTING INITIAL VIDEO SEQUENCE`);
    // Start with video-1.mp4 (animation)
    setTimeout(() => {
      this.playVideo('assets/videos/video-1.mp4', () => {
        // When video-1 ends, switch to video-0.mp4 (rest)
        this.playVideo('assets/videos/video-0.mp4', null, true); // true = loop
      });
    }, 100);
  }

  private playVideo(src: string, onEnded?: (() => void) | null, loop: boolean = false): void {
    console.log(`🎥 PLAY VIDEO: ${src} (loop: ${loop})`);
    
    if (this.backgroundVideoRef && this.backgroundVideoRef.nativeElement) {
      const videoElement = this.backgroundVideoRef.nativeElement;
      
      // Limpiar eventos anteriores
      videoElement.onended = null;
      videoElement.onerror = null;
      
      // Configurar el video
      videoElement.src = src;
      videoElement.loop = loop;
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.preload = 'metadata';
      
      // Configurar eventos
      if (onEnded) {
        videoElement.onended = onEnded;
      }
      
      videoElement.onerror = (error) => {
        console.error('Error playing video:', error);
        // Fallback: intentar reproducir el video de reposo
        if (!loop) {
          this.playVideo('assets/videos/video-0.mp4', null, true);
        }
      };
      
      // Intentar reproducir el video
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing video:', error);
          // Fallback: intentar reproducir el video de reposo
          if (!loop) {
            this.playVideo('assets/videos/video-0.mp4', null, true);
          }
        });
      }
    } else {
      console.error('Video element not found');
    }
  }

  private setupScrollListener(): void {
    console.log(`🎧 SETTING UP SCROLL LISTENER`);
    
    // Escuchar scroll constantemente sin debounce
    window.addEventListener('scroll', () => {
      console.log(`📜 SCROLL DETECTED!`);
      this.showScrollPosition();
    }, { passive: false }); // Cambiado a false para asegurar que se ejecute
    
    // También escuchar en resize
    window.addEventListener('resize', () => {
      console.log(`📐 RESIZE DETECTED!`);
      this.showScrollPosition();
    }, { passive: false });
    
    // Escuchar también en wheel events
    window.addEventListener('wheel', () => {
      console.log(`🎡 WHEEL DETECTED!`);
      this.showScrollPosition();
    }, { passive: false });
    
    console.log(`✅ SCROLL LISTENER SETUP COMPLETE`);
  }

  private showScrollPosition(): void {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPercentage = (scrollY / (documentHeight - windowHeight)) * 100;
    
    console.log(`📍 SCROLL POSITION: ${scrollY}px (${scrollPercentage.toFixed(1)}%)`);
    console.log(`🎬 Current video section: ${this.videoConfig.currentSection}`);
    
    // Mostrar información de cada sección
    const sections = [
      { id: 'section-1', label: 'HOME' },
      { id: 'apartments', label: 'APARTAMENTS' },
      { id: 'features', label: 'FEATURES' },
      { id: 'equipment', label: 'CONTACT' }
    ];
    
    let currentSection = 'NONE';
    
    sections.forEach((section, index) => {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const elementBottom = elementTop + rect.height;
        
        // Verificar si estamos en esta sección
        const isInSection = scrollY >= elementTop - windowHeight * 0.3 && scrollY < elementBottom - windowHeight * 0.3;
        
        if (isInSection) {
          currentSection = section.label;
        }
        
        console.log(`📏 ${section.label}: Top=${elementTop}, Bottom=${elementBottom}, InSection=${isInSection}`);
        
        // Si estamos en esta sección y no es la actual, cambiar video
        if (isInSection && this.videoConfig.currentSection !== index) {
          console.log(`🎯 CHANGING TO ${section.label} SECTION!`);
          console.log(`🔍 Current section index: ${this.videoConfig.currentSection}, New section index: ${index}`);
          this.changeVideoBackground(section.label);
          this.videoConfig.currentSection = index;
          this.updateNavigationActiveState(section.label);
          
          // Activar animación del contenedor de apartamentos
          if (section.label === 'APARTAMENTS' && !this.isApartmentContainerAnimated) {
            this.triggerApartmentContainerAnimation();
          }
          
          // Resetear animación si salimos de la sección de apartamentos
          if (this.videoConfig.currentSection !== 1 && this.isApartmentContainerAnimated) {
            this.resetApartmentContainerAnimation();
          }
        } else if (isInSection) {
          console.log(`⏭️ Already in ${section.label} section (index: ${index}, current: ${this.videoConfig.currentSection})`);
          
          // Activar animación del contenedor de apartamentos si estamos en la sección
          if (section.label === 'APARTAMENTS' && !this.isApartmentContainerAnimated) {
            this.triggerApartmentContainerAnimation();
          }
        }
      }
    });
    
    console.log(`🎯 CURRENT SECTION: ${currentSection}`);
  }





  private updateNavigationActiveState(activeLabel: string): void {
    // Update navigation items active state
    this.navigationConfig.items.forEach(item => {
      item.active = item.label === activeLabel;
    });

    // Update scroll indicator current section
    const sectionIndex = this.navigationConfig.items.findIndex(item => item.label === activeLabel);
    if (sectionIndex !== -1) {
      this.scrollConfig.currentSection = sectionIndex;
    }
  }

  onAnimationVideoEnded(sectionIndex: number): void {
    console.log(`Animation video ended for section ${sectionIndex}`);
    
    // Cambiar al video de reposo
    this.videoConfig.sections[sectionIndex].isPlayingAnimation = false;
    
    // El video de reposo comenzará a reproducirse automáticamente
  }

  onSelectorChange(value: string): void {
    console.log('Selector changed:', value);
    this.selectorConfig.selectedValue = value;
  }

  onFooterButtonClick(): void {
    console.log('Footer button clicked');
  }

  onSectionChange(section: number): void {
    console.log('Section changed:', section);
    this.scrollConfig.currentSection = section;
  }

  onSectionNavigate(sectionData: {id: number, label: string, elementId?: string}): void {
    console.log('Section navigate:', sectionData);
    
    // Update current section
    this.scrollConfig.currentSection = sectionData.id;
    
    // Handle video background change
    this.changeVideoBackground(sectionData.label);
    
    // Navigate to specific section based on label
    switch (sectionData.label) {
      case 'HOME':
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        });
        // Forzar activación del scroll después de navegar a HOME
        setTimeout(() => {
          this.showScrollPosition();
        }, 300);
        break;
      case 'APARTAMENTS':
        this.navigateToSection('apartments', 300);
        break;
      case 'FEATURES':
        this.navigateToSection('features', 300);
        break;
      case 'EQUIPMENT':
        this.navigateToSection('equipment', 300);
        break;
    }
  }

  // Función para activar la animación del contenedor de apartamentos
  private triggerApartmentContainerAnimation(): void {
    console.log('🎬 Triggering apartment container animation');
    this.isApartmentContainerAnimated = true;
    
    // Pequeño delay para asegurar que la animación se ejecute después del cambio de sección
    setTimeout(() => {
      const apartmentContainer = document.querySelector('.apartments-container');
      if (apartmentContainer) {
        apartmentContainer.classList.add('animate-in');
        console.log('✅ Apartment container animation triggered');
      }
    }, 100);
  }

  // Función para resetear la animación del contenedor de apartamentos
  private resetApartmentContainerAnimation(): void {
    console.log('🔄 Resetting apartment container animation');
    this.isApartmentContainerAnimated = false;
    
    const apartmentContainer = document.querySelector('.apartments-container');
    if (apartmentContainer) {
      apartmentContainer.classList.remove('animate-in');
      console.log('✅ Apartment container animation reset');
    }
  }

  // Apartment Event Handlers
  onApartmentTypeChange(typeId: string): void {
    console.log('Apartment type changed:', typeId);
    this.apartmentTypeConfig.types.forEach(type => {
      type.active = type.id === typeId;
    });
  }

  onFilterChange(filter: {label: string, value: string}): void {
    console.log('Filter changed:', filter);
  }

  onApartmentDetailClick(): void {
    console.log('Apartment detail card clicked');
  }



  onApartmentModelContactClick(type: string): void {
    console.log('Apartment model contact clicked:', type);
    this.isContactModalOpen = true;
  }

  onApartmentModelClose(): void {
    console.log('Apartment model close clicked');
    this.isApartmentModelVisible = false;
  }

  onApartmentModelViewClick(): void {
    console.log('Apartment model view clicked - navigating to features section');
    this.navigateToSection('features');
  }

  onBackToApartments(): void {
    console.log('Back to apartments clicked - navigating to apartments section');
    this.navigateToSection('apartments');
  }

  // Método para navegación programática que activa el sistema de scroll
  private navigateToSection(sectionId: string, delay: number = 500): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      
      setTimeout(() => {
        console.log(`🔄 Forcing scroll activation for ${sectionId} section`);
        this.showScrollPosition();
        
        // Activar animaciones específicas según la sección
        if (sectionId === 'apartments' && !this.isApartmentContainerAnimated) {
          this.triggerApartmentContainerAnimation();
        }
      }, delay);
    }
  }

  onApartmentListItemClick(itemId: string): void {
    console.log('Apartment list item clicked:', itemId);
    
    // Actualizar la selección en la lista
    this.apartmentListConfig.items.forEach(item => {
      item.selected = item.id === itemId;
    });
    
    // Actualizar el título del modelo de apartamento
    const selectedItem = this.apartmentListConfig.items.find(item => item.id === itemId);
    if (selectedItem) {
      this.apartmentModelConfig.title = selectedItem.title;
      console.log('Updated apartment model title to:', selectedItem.title);
      
      // Mostrar el modelo de apartamento con animación
      this.isApartmentModelVisible = true;
    }
  }

  // Features Event Handlers
  onFloorTypeChange(typeId: string): void {
    console.log('Floor type changed:', typeId);
    this.modelDetailConfig.floorTypes.forEach(type => {
      type.active = type.id === typeId;
    });
  }

  onSendPdf(formData: PdfFormData): void {
    console.log('Send PDF clicked with data:', formData);
    // Aquí puedes agregar la lógica para enviar el PDF
    // Por ejemplo, llamar a un servicio, mostrar confirmación, etc.
  }

  onQuoteModel(formData: QuoteFormData): void {
    console.log('Quote model submitted:', formData);
    // Aquí puedes agregar la lógica para procesar la cotización
    // Por ejemplo, enviar a un servicio, mostrar confirmación, etc.
  }

  onGalleryImageChange(imageId: string): void {
    console.log('Gallery image changed:', imageId);
    this.galleryConfig.images.forEach(image => {
      image.active = image.id === imageId;
    });
  }

  onGalleryPrevious(): void {
    console.log('Gallery previous clicked');
  }

  onGalleryNext(): void {
    console.log('Gallery next clicked');
  }

  // Carousel Event Handlers
  onCarouselImageChange(imageId: string): void {
    console.log('Carousel image changed:', imageId);
    this.carouselConfig.images.forEach(image => {
      image.active = image.id === imageId;
    });
  }

  onCarouselPrevious(): void {
    console.log('Carousel previous clicked');
    const currentIndex = this.carouselConfig.images.findIndex(img => img.active);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : this.carouselConfig.images.length - 1;
    
    this.carouselConfig.images.forEach((image, index) => {
      image.active = index === previousIndex;
    });
  }

  onCarouselNext(): void {
    console.log('Carousel next clicked');
    const currentIndex = this.carouselConfig.images.findIndex(img => img.active);
    const nextIndex = currentIndex < this.carouselConfig.images.length - 1 ? currentIndex + 1 : 0;
    
    this.carouselConfig.images.forEach((image, index) => {
      image.active = index === nextIndex;
    });
  }

  // Equipment Event Handlers
  onEquipmentOptionChange(optionId: string): void {
    console.log('Equipment option changed:', optionId);
    this.equipmentConfig.options.forEach(option => {
      option.selected = option.id === optionId;
    });
  }

     onEquipmentQuoteClick(): void {
     console.log('Equipment quote clicked');
     this.isContactModalOpen = true;
   }

   // Contact Modal Event Handlers
   onContactModalClose(): void {
     console.log('Contact modal closed');
     this.isContactModalOpen = false;
   }

   onContactSubmit(data: {type: string, data: any}): void {
     console.log('Contact submitted:', data);
     this.isContactModalOpen = false;
   }

     onContactMethodChange(method: string): void {
    console.log('Contact method changed:', method);
  }


}

