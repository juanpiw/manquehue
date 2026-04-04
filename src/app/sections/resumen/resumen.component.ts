import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface FeaturedProject {
  id: number;
  name: string;
  location: string;
  progress: number;
  status: 'venta' | 'construccion' | 'entrega' | 'draft';
  image: string;
  updatedAt: string;
}

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.scss'
})
export class ResumenComponent implements OnInit {
  @Output() navigate = new EventEmitter<'nuevoProyecto' | 'proyectos'>();

  currentDate = new Date();
  projectsCount = 0;
  projectsMax = 12;
  isLoading = false;
  projectsProgress = 0;

  featuredProjects: FeaturedProject[] = [];

  constructor(private http: HttpClient) {}

  goNuevo() {
    this.navigate.emit('nuevoProyecto');
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  async loadProjects(): Promise<void> {
    const token = this.getAccessToken();
    if (!token) {
      this.featuredProjects = [];
      this.projectsCount = 0;
      this.projectsProgress = 0;
      return;
    }

    this.isLoading = true;
    try {
      const response = await firstValueFrom(
        this.http.get<{ data?: Array<Record<string, unknown>> }>(
          `${this.getApiBaseUrl()}/api/dash-manquehue/projects`,
          { headers: this.buildJsonHeaders(token) }
        )
      );
      const rows = Array.isArray(response?.data) ? response.data : [];
      const mapped = await Promise.all(
        rows.slice(0, 6).map(async (row) => {
          const projectId = Number(row['id'] || 0);
          const step1Media = projectId > 0 ? await this.fetchStep1Media(projectId, token) : null;
          return this.mapProjectRow(row, step1Media);
        })
      );

      this.featuredProjects = mapped.filter((project): project is FeaturedProject => Boolean(project)).slice(0, 3);
      this.projectsCount = rows.filter((row) => String(row['status'] || 'draft') !== 'archived').length;
      this.projectsProgress = Math.round((this.projectsCount / this.projectsMax) * 100);
    } catch (error) {
      console.error('[ResumenUI] loadProjects error', error);
      this.featuredProjects = [];
      this.projectsCount = 0;
      this.projectsProgress = 0;
    } finally {
      this.isLoading = false;
    }
  }

  private async fetchStep1Media(projectId: number, token: string): Promise<Record<string, unknown> | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ data?: Record<string, unknown> | null }>(
          `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/files/step1-media`,
          { headers: this.buildJsonHeaders(token) }
        )
      );
      return response?.data || null;
    } catch (error) {
      console.warn('[ResumenUI] fetchStep1Media warning', { projectId, error });
      return null;
    }
  }

  private mapProjectRow(
    row: Record<string, unknown>,
    step1Media: Record<string, unknown> | null
  ): FeaturedProject | null {
    const id = Number(row['id'] || 0);
    if (!id) {
      return null;
    }

    return {
      id,
      name: String(row['nombre'] || 'Proyecto sin nombre'),
      location: String(row['ubicacion_texto'] || row['direccion_pin'] || 'Ubicacion pendiente'),
      progress: this.mapProjectProgress(Number(row['current_step'] || 1)),
      status: this.mapProjectStatus(String(row['status'] || 'draft'), String(row['estado_entrega'] || '')),
      image: this.resolveProjectImage(step1Media),
      updatedAt: String(row['updated_at'] || row['created_at'] || '')
    };
  }

  private mapProjectProgress(currentStep: number): number {
    const normalizedStep = Math.min(Math.max(Number(currentStep) || 1, 1), 5);
    return Math.round((normalizedStep / 5) * 100);
  }

  private mapProjectStatus(
    status: string,
    estadoEntrega: string
  ): 'venta' | 'construccion' | 'entrega' | 'draft' {
    const normalizedStatus = String(status || '').toLowerCase();
    const normalizedEntrega = String(estadoEntrega || '').toLowerCase();
    if (normalizedStatus === 'draft') return 'draft';
    if (normalizedEntrega === 'inmediata') return 'entrega';
    if (normalizedEntrega === 'pronta' || normalizedStatus === 'published') return 'venta';
    if (normalizedEntrega === 'futura' || normalizedStatus === 'scheduled') return 'construccion';
    return 'venta';
  }

  private resolveProjectImage(step1Media: Record<string, unknown> | null): string {
    const cover = step1Media?.['cover'] as Record<string, unknown> | null | undefined;
    const filePath = String(cover?.['file_path'] || '');
    if (!filePath) {
      return 'assets/logo-im-gray.png';
    }
    if (/^https?:\/\//i.test(filePath)) {
      return filePath;
    }
    const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    return `${this.getApiBaseUrl()}${normalizedPath}`;
  }

  private getApiBaseUrl(): string {
    if (typeof window === 'undefined') {
      return '';
    }
    const host = window.location.hostname.toLowerCase();
    return host === 'localhost' || host === '127.0.0.1'
      ? ''
      : 'https://www.api.thefutureagencyai.com';
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
}
