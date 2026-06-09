import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
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
  projects: Project[] = [];

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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    void this.loadProjects();
  }

  async loadProjects() {
    const token = this.getAccessToken();
    if (!token) {
      this.projects = [];
      this.filteredProjects = [];
      return;
    }

    try {
      const response = await firstValueFrom(
        this.http.get<{ data?: Array<Record<string, unknown>> }>(
          `${this.getApiBaseUrl()}/api/dash-manquehue/projects`,
          { headers: this.buildJsonHeaders(token) }
        )
      );
      const rows = Array.isArray(response?.data) ? response.data : [];

      const mapped = await Promise.all(
        rows.map(async (row) => {
          const id = String(row['id'] || '');
          if (!id) return null;

          const thumbnail = await this.fetchProjectCover(id, token);
          return {
            id,
            name: String(row['nombre'] || `Proyecto ${id}`),
            type: this.mapProjectType(String(row['tipo_inmueble'] || '')),
            status: this.mapProjectStatus(String(row['status'] || 'draft')),
            creationDate: String(row['created_at'] || ''),
            lastModified: String(row['updated_at'] || row['created_at'] || ''),
            description: String(row['descripcion_comercial'] || row['ubicacion_texto'] || ''),
            thumbnail
          } as Project;
        })
      );

      this.projects = mapped.filter((project): project is Project => Boolean(project));
      this.applyFilters();
    } catch (error) {
      console.error('[ProyectosUI] loadProjects error', error);
      this.projects = [];
      this.filteredProjects = [];
    }
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

  private getApiBaseUrl(): string {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname.toLowerCase();
      if (host === 'localhost' || host === '127.0.0.1') {
        return 'http://localhost:4000';
      }
    }
    return 'https://www.api.thefutureagencyai.com';
  }

  private buildJsonHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private getAccessToken(): string {
    if (typeof window === 'undefined') {
      return '';
    }
    return localStorage.getItem('imanquehue_access_token') || '';
  }

  private async fetchProjectCover(projectId: string, token: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ data?: Record<string, unknown> | null }>(
          `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/files/step1-media`,
          { headers: this.buildJsonHeaders(token) }
        )
      );
      const cover = (response?.data?.['cover'] || null) as Record<string, unknown> | null;
      const filePath = String(cover?.['file_path'] || '');
      if (!filePath) {
        return 'assets/logo1.png';
      }
      if (/^https?:\/\//i.test(filePath)) {
        return filePath;
      }
      return `${this.getApiBaseUrl()}${filePath.startsWith('/') ? filePath : `/${filePath}`}`;
    } catch (_error) {
      return 'assets/logo1.png';
    }
  }

  private mapProjectStatus(rawStatus: string): Project['status'] {
    const normalized = rawStatus.toLowerCase();
    if (normalized === 'published' || normalized === 'scheduled' || normalized === 'active') {
      return 'active';
    }
    if (normalized === 'completed') {
      return 'completed';
    }
    return 'draft';
  }

  private mapProjectType(rawType: string): Project['type'] {
    const normalized = rawType.toLowerCase();
    if (normalized.includes('casa')) {
      return 'house';
    }
    if (normalized.includes('town') || normalized.includes('campo') || normalized.includes('terreno')) {
      return 'field';
    }
    return 'apartment';
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
