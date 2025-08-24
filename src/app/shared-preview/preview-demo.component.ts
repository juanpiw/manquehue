import { Component } from '@angular/core';
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
import { ApartmentModelDetailComponent, ApartmentModelDetailConfig, ModelSpecification, FloorType } from './components/apartment-model-detail/apartment-model-detail.component';
import { ApartmentGalleryComponent, ApartmentGalleryConfig, GalleryImage } from './components/apartment-gallery/apartment-gallery.component';

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
    ApartmentGalleryComponent
  ],
  templateUrl: './preview-demo.component.html',
  styleUrls: ['./preview-demo.component.scss']
})
export class PreviewDemoComponent {
  // Header Configuration
  headerConfig: PreviewHeaderConfig = {
    title: 'Mirador del Golf',
    showMenu: true,
    menuItems: ['HOME', 'APARTAMENTS', 'FEATURES', 'CONTACT']
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
    padding: 'medium'
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
    showLabels: false
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

  // Event Handlers
  onMenuToggle(): void {
    console.log('Menu toggled');
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

  onApartmentModelViewClick(): void {
    console.log('Apartment model view clicked');
  }

  onApartmentModelContactClick(type: string): void {
    console.log('Apartment model contact clicked:', type);
  }

  onApartmentListItemClick(itemId: string): void {
    console.log('Apartment list item clicked:', itemId);
    this.apartmentListConfig.items.forEach(item => {
      item.selected = item.id === itemId;
    });
  }

  // Features Event Handlers
  onFloorTypeChange(typeId: string): void {
    console.log('Floor type changed:', typeId);
    this.modelDetailConfig.floorTypes.forEach(type => {
      type.active = type.id === typeId;
    });
  }

  onSendPdf(): void {
    console.log('Send PDF clicked');
  }

  onQuoteModel(): void {
    console.log('Quote model clicked');
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
}

