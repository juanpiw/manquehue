import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../i18n/t.pipe';
import { ModalComponent, ModalConfig } from '../../shared/modal/modal.component';

interface Project {
  id: string;
  name: string;
  type: 'apartment' | 'house' | 'field';
  status: 'active' | 'completed' | 'draft';
  creationDate: string;
  lastModified: string;
  description: string;
  apartmentsCount?: number;
  floorsCount?: number;
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
  thumbnail?: string;
}

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    ModalComponent
  ],
  templateUrl: './proyectos.component.html',
  styleUrl: './proyectos.component.scss'
})
export class ProyectosComponent implements OnInit {
  
  projects: Project[] = [
    {
      id: '1',
      name: 'Residencial Las Condes',
      type: 'apartment',
      status: 'active',
      creationDate: '2024-01-15',
      lastModified: '2024-06-20',
      description: 'Proyecto residencial de lujo en Las Condes con amenities premium',
      apartmentsCount: 45,
      floorsCount: 12,
      priceRange: {
        min: 2500,
        max: 4500,
        currency: 'UF'
      },
      thumbnail: 'assets/logo1.png'
    },
    {
      id: '2',
      name: 'Casa Familiar Providencia',
      type: 'house',
      status: 'completed',
      creationDate: '2024-02-10',
      lastModified: '2024-05-15',
      description: 'Casa familiar moderna con diseño contemporáneo',
      priceRange: {
        min: 1800,
        max: 2200,
        currency: 'UF'
      },
      thumbnail: 'assets/logo1.png'
    },
    {
      id: '3',
      name: 'Cancha Deportiva Maipú',
      type: 'field',
      status: 'active',
      creationDate: '2024-03-05',
      lastModified: '2024-06-18',
      description: 'Complejo deportivo con múltiples canchas y áreas recreativas',
      thumbnail: 'assets/logo1.png'
    },
    {
      id: '4',
      name: 'Edificio Corporativo Santiago Centro',
      type: 'apartment',
      status: 'draft',
      creationDate: '2024-04-12',
      lastModified: '2024-06-10',
      description: 'Edificio corporativo con oficinas y espacios comerciales',
      apartmentsCount: 120,
      floorsCount: 25,
      priceRange: {
        min: 3000,
        max: 6000,
        currency: 'UF'
      },
      thumbnail: 'assets/logo1.png'
    },
    {
      id: '5',
      name: 'Villa Residencial Ñuñoa',
      type: 'house',
      status: 'active',
      creationDate: '2024-05-20',
      lastModified: '2024-06-22',
      description: 'Villa residencial con jardines y áreas comunes',
      priceRange: {
        min: 2000,
        max: 2800,
        currency: 'UF'
      },
      thumbnail: 'assets/logo1.png'
    },
    {
      id: '6',
      name: 'Centro Comercial Las Condes',
      type: 'field',
      status: 'completed',
      creationDate: '2024-01-08',
      lastModified: '2024-04-30',
      description: 'Centro comercial con múltiples tiendas y restaurantes',
      thumbnail: 'assets/logo1.png'
    }
  ];

  filteredProjects: Project[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  typeFilter: string = 'all';

  // Propiedades para el modal
  isModalOpen = false;
  modalConfig: ModalConfig = {
    title: 'Confirmar Eliminación',
    message: '¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    showInput: false,
    showCancel: true,
    confirmButtonType: 'danger'
  };
  projectToDelete: string | null = null;

  ngOnInit() {
    this.filteredProjects = [...this.projects];
    this.loadProjects();
  }

  loadProjects() {
    // Aquí se cargarían los proyectos desde el servicio
    console.log('Cargando proyectos...');
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.applyFilters();
  }

  onStatusFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.statusFilter = target.value;
    this.applyFilters();
  }

  onTypeFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.typeFilter = target.value;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProjects = this.projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || project.status === this.statusFilter;
      const matchesType = this.typeFilter === 'all' || project.type === this.typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }

  onPreviewProject(project: Project) {
    console.log('Previsualizando proyecto:', project.name);
    // Aquí se abriría la pestaña de live preview con el proyecto seleccionado
    this.openLivePreview(project);
  }

  onEditProject(project: Project) {
    console.log('Editando proyecto:', project.name);
    // Aquí se navegaría al editor de proyectos
  }

  onDeleteProject(project: Project) {
    this.projectToDelete = project.id;
    this.modalConfig = {
      title: 'Confirmar Eliminación',
      message: `¿Estás seguro de que quieres eliminar el proyecto "${project.name}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      showInput: false,
      showCancel: true,
      confirmButtonType: 'danger'
    };
    this.isModalOpen = true;
  }

  // Métodos para el modal
  onModalConfirm() {
    if (this.projectToDelete) {
      this.projects = this.projects.filter(p => p.id !== this.projectToDelete);
      this.applyFilters();
      console.log('Proyecto eliminado exitosamente');
    }
    this.isModalOpen = false;
    this.projectToDelete = null;
  }

  onModalCancel() {
    this.isModalOpen = false;
    this.projectToDelete = null;
  }

  onModalClose() {
    this.isModalOpen = false;
    this.projectToDelete = null;
  }

  openLivePreview(project: Project) {
    // Simular apertura de pestaña de live preview
    const previewUrl = `/preview/${project.id}`;
    window.open(previewUrl, '_blank');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'completed': return 'status-completed';
      case 'draft': return 'status-draft';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'proyectos.status_active';
      case 'completed': return 'proyectos.status_completed';
      case 'draft': return 'proyectos.status_draft';
      default: return '';
    }
  }

  getTypeText(type: string): string {
    switch (type) {
      case 'apartment': return 'proyectos.type_apartment';
      case 'house': return 'proyectos.type_house';
      case 'field': return 'proyectos.type_field';
      default: return '';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'apartment': return '🏢';
      case 'house': return '🏠';
      case 'field': return '⚽';
      default: return '📁';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatPrice(price: number, currency: string): string {
    return `${price.toLocaleString()} ${currency}`;
  }
}
