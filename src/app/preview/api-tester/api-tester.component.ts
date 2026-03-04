import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
type FileMode = 'none' | 'single' | 'multiple';
type StepFilter = 'all' | '1' | '2' | '3' | '4' | '5';

interface EndpointPreset {
  id: string;
  step: StepFilter;
  label: string;
  method: HttpMethod;
  pathTemplate: string;
  bodyTemplate: string;
  fileMode: FileMode;
}

@Component({
  selector: 'app-api-tester',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './api-tester.component.html',
  styleUrl: './api-tester.component.scss'
})
export class ApiTesterComponent {
  private readonly browserHostname = typeof window !== 'undefined' ? window.location.hostname : 'ssr';

  apiBaseUrl = this.browserHostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://www.api.thefutureagencyai.com';

  token = '';
  selectedStep: StepFilter = 'all';
  selectedPresetId = 'create-project';
  method: HttpMethod = 'POST';
  path = '/api/dash-manquehue/projects';
  jsonBody = '{\n  "nombre": "Proyecto Test",\n  "direccionPin": "Av. Manquehue 1234",\n  "tipoInmueble": "departamento",\n  "estadoEntrega": "inmediata"\n}';

  projectId = '1';
  stepNumber = '1';
  typologyId = '1';
  modelCode = 'A1';
  fileId = '1';

  selectedSingleFile: File | null = null;
  selectedGalleryFiles: File[] = [];

  responseText = 'Sin respuesta todavía.';
  statusText = '';
  statusClass = '';
  loading = false;

  readonly presets: EndpointPreset[] = [
    { id: 'create-project', step: '1', label: 'Crear proyecto', method: 'POST', pathTemplate: '/api/dash-manquehue/projects', bodyTemplate: '{\n  "nombre": "Proyecto Test",\n  "direccionPin": "Av. Manquehue 1234",\n  "tipoInmueble": "departamento",\n  "estadoEntrega": "inmediata"\n}', fileMode: 'none' },
    { id: 'list-projects', step: '1', label: 'Listar proyectos', method: 'GET', pathTemplate: '/api/dash-manquehue/projects', bodyTemplate: '', fileMode: 'none' },
    { id: 'get-project', step: '1', label: 'Detalle proyecto', method: 'GET', pathTemplate: '/api/dash-manquehue/projects/:projectId', bodyTemplate: '', fileMode: 'none' },
    { id: 'update-project', step: '1', label: 'Actualizar proyecto base', method: 'PATCH', pathTemplate: '/api/dash-manquehue/projects/:projectId', bodyTemplate: '{\n  "nombre": "Proyecto Test Editado"\n}', fileMode: 'none' },
    { id: 'save-step', step: '1', label: 'Guardar payload de paso', method: 'PATCH', pathTemplate: '/api/dash-manquehue/projects/:projectId/step/:stepNumber', bodyTemplate: '{\n  "stepPayload": "demo"\n}', fileMode: 'none' },

    { id: 'get-config', step: '2', label: 'Obtener config', method: 'GET', pathTemplate: '/api/dash-manquehue/projects/:projectId/config', bodyTemplate: '', fileMode: 'none' },
    { id: 'update-config', step: '2', label: 'Actualizar config', method: 'PATCH', pathTemplate: '/api/dash-manquehue/projects/:projectId/config', bodyTemplate: '{\n  "unidadesTotales": 100,\n  "petFriendly": true\n}', fileMode: 'none' },
    { id: 'get-typologies', step: '2', label: 'Listar tipologías', method: 'GET', pathTemplate: '/api/dash-manquehue/projects/:projectId/typologies', bodyTemplate: '', fileMode: 'none' },
    { id: 'upsert-typologies', step: '2', label: 'Guardar tipologías', method: 'PUT', pathTemplate: '/api/dash-manquehue/projects/:projectId/typologies', bodyTemplate: '{\n  "typologies": [\n    {\n      "typologyCode": "2D2B",\n      "dormitorios": 2,\n      "banos": 2,\n      "models": [\n        { "modelCode": "A1", "modelLabel": "Modelo A1" }\n      ]\n    }\n  ]\n}', fileMode: 'none' },
    { id: 'amenities-catalog', step: '2', label: 'Amenities catálogo', method: 'GET', pathTemplate: '/api/dash-manquehue/projects/amenities/catalog', bodyTemplate: '', fileMode: 'none' },
    { id: 'create-amenity', step: '2', label: 'Crear amenity', method: 'POST', pathTemplate: '/api/dash-manquehue/projects/amenities/catalog', bodyTemplate: '{\n  "label": "Piscina panorámica"\n}', fileMode: 'none' },

    { id: 'upload-masterplan', step: '3', label: 'Upload masterplan', method: 'POST', pathTemplate: '/api/dash-manquehue/projects/:projectId/files/masterplan', bodyTemplate: '', fileMode: 'single' },
    { id: 'upload-brochure', step: '3', label: 'Upload brochure', method: 'POST', pathTemplate: '/api/dash-manquehue/projects/:projectId/files/brochure', bodyTemplate: '', fileMode: 'single' },
    { id: 'upload-legal', step: '3', label: 'Upload legal', method: 'POST', pathTemplate: '/api/dash-manquehue/projects/:projectId/files/legal', bodyTemplate: '', fileMode: 'single' },
    { id: 'list-docs', step: '3', label: 'Listar documentos', method: 'GET', pathTemplate: '/api/dash-manquehue/projects/:projectId/files/documents', bodyTemplate: '', fileMode: 'none' },
    { id: 'upload-gallery', step: '3', label: 'Upload galería', method: 'POST', pathTemplate: '/api/dash-manquehue/projects/:projectId/files/gallery', bodyTemplate: '', fileMode: 'multiple' },
    { id: 'list-gallery', step: '3', label: 'Listar galería', method: 'GET', pathTemplate: '/api/dash-manquehue/projects/:projectId/files/gallery', bodyTemplate: '', fileMode: 'none' },

    { id: 'get-content', step: '4', label: 'Obtener contenido', method: 'GET', pathTemplate: '/api/dash-manquehue/projects/:projectId/content', bodyTemplate: '', fileMode: 'none' },
    { id: 'update-content', step: '4', label: 'Guardar contenido', method: 'PATCH', pathTemplate: '/api/dash-manquehue/projects/:projectId/content', bodyTemplate: '{\n  "headlinePrincipal": "Nuevo headline",\n  "narrativaComercial": "Texto comercial",\n  "ctaPrincipal": "Cotizar"\n}', fileMode: 'none' },
    { id: 'update-diffs', step: '4', label: 'Guardar diferenciadores', method: 'PUT', pathTemplate: '/api/dash-manquehue/projects/:projectId/differentiators', bodyTemplate: '{\n  "items": [\n    { "text": "Cerca de Metro" },\n    { "text": "Vista al parque" }\n  ]\n}', fileMode: 'none' },
    { id: 'hero-preview', step: '4', label: 'Hero preview', method: 'GET', pathTemplate: '/api/dash-manquehue/projects/:projectId/hero-preview', bodyTemplate: '', fileMode: 'none' },

    { id: 'publish-summary', step: '5', label: 'Resumen publicación', method: 'GET', pathTemplate: '/api/dash-manquehue/projects/:projectId/publish-summary', bodyTemplate: '', fileMode: 'none' },
    { id: 'publish-config', step: '5', label: 'Actualizar publish config', method: 'PATCH', pathTemplate: '/api/dash-manquehue/projects/:projectId/publish-config', bodyTemplate: '{\n  "automationEnabled": true,\n  "publicationMode": "scheduled"\n}', fileMode: 'none' },
    { id: 'branches', step: '5', label: 'Listar sucursales', method: 'GET', pathTemplate: '/api/dash-manquehue/projects/branches', bodyTemplate: '', fileMode: 'none' },
    { id: 'publish-now', step: '5', label: 'Publicar ahora', method: 'POST', pathTemplate: '/api/dash-manquehue/projects/:projectId/publish', bodyTemplate: '', fileMode: 'none' },
    { id: 'schedule-publish', step: '5', label: 'Agendar publicación', method: 'POST', pathTemplate: '/api/dash-manquehue/projects/:projectId/schedule-publish', bodyTemplate: '{\n  "scheduledPublishAt": "2026-12-20T12:30:00.000Z",\n  "branchId": 1\n}', fileMode: 'none' },
    { id: 'publications', step: '5', label: 'Historial publicaciones', method: 'GET', pathTemplate: '/api/dash-manquehue/projects/:projectId/publications', bodyTemplate: '', fileMode: 'none' }
  ];

  constructor(private readonly router: Router) {}

  get filteredPresets(): EndpointPreset[] {
    if (this.selectedStep === 'all') {
      return this.presets;
    }
    return this.presets.filter((preset) => preset.step === this.selectedStep);
  }

  get selectedPreset(): EndpointPreset | undefined {
    return this.presets.find((preset) => preset.id === this.selectedPresetId);
  }

  onStepChange(step: StepFilter): void {
    this.selectedStep = step;
    const currentVisible = this.filteredPresets.some((preset) => preset.id === this.selectedPresetId);
    if (!currentVisible && this.filteredPresets.length > 0) {
      this.applyPreset(this.filteredPresets[0].id);
    }
  }

  applyPreset(id: string): void {
    const preset = this.presets.find((item) => item.id === id);
    if (!preset) return;
    this.selectedPresetId = preset.id;
    this.method = preset.method;
    this.path = preset.pathTemplate;
    this.jsonBody = preset.bodyTemplate;
    this.selectedSingleFile = null;
    this.selectedGalleryFiles = [];
  }

  onSingleFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedSingleFile = file;
  }

  onGalleryFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedGalleryFiles = input.files ? Array.from(input.files) : [];
  }

  buildPath(): string {
    return this.path
      .replace(':projectId', this.projectId)
      .replace(':stepNumber', this.stepNumber)
      .replace(':typologyId', this.typologyId)
      .replace(':modelCode', this.modelCode)
      .replace(':fileId', this.fileId);
  }

  async send(): Promise<void> {
    this.loading = true;
    this.statusClass = '';
    this.statusText = 'Enviando...';

    const finalPath = this.buildPath();
    const url = `${this.apiBaseUrl.replace(/\/$/, '')}${finalPath}`;
    const headers: Record<string, string> = {};
    if (this.token.trim()) {
      headers['Authorization'] = `Bearer ${this.token.trim()}`;
    }

    const options: RequestInit = {
      method: this.method,
      headers
    };

    try {
      const mode = this.selectedPreset?.fileMode ?? 'none';

      if (mode === 'single' || mode === 'multiple') {
        const formData = new FormData();
        if (mode === 'single') {
          if (!this.selectedSingleFile) {
            this.statusClass = 'err';
            this.statusText = 'Debes seleccionar un archivo';
            this.loading = false;
            return;
          }
          formData.append('file', this.selectedSingleFile);
        } else {
          if (this.selectedGalleryFiles.length === 0) {
            this.statusClass = 'err';
            this.statusText = 'Debes seleccionar archivos para galería';
            this.loading = false;
            return;
          }
          this.selectedGalleryFiles.forEach((file) => formData.append('files', file));
        }
        options.body = formData;
      } else if (this.method !== 'GET' && this.method !== 'DELETE') {
        const bodyTrimmed = this.jsonBody.trim();
        if (bodyTrimmed) {
          const parsed = JSON.parse(bodyTrimmed) as unknown;
          options.body = JSON.stringify(parsed);
          headers['Content-Type'] = 'application/json';
        }
      }

      const started = performance.now();
      const response = await fetch(url, options);
      const elapsedMs = Math.round(performance.now() - started);
      const text = await response.text();
      let prettyText = text;
      try {
        const parsed = JSON.parse(text) as unknown;
        prettyText = JSON.stringify(parsed, null, 2);
      } catch {
        // ignore if response is not json
      }

      this.responseText = [
        `${this.method} ${url}`,
        '',
        `Status: ${response.status} ${response.statusText} (${elapsedMs} ms)`,
        '',
        prettyText
      ].join('\n');

      this.statusClass = response.ok ? 'ok' : 'err';
      this.statusText = response.ok ? 'Request OK' : 'Request con error HTTP';
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.responseText = message;
      this.statusClass = 'err';
      this.statusText = 'Error de red o de ejecución';
    } finally {
      this.loading = false;
    }
  }

  async copyCurl(): Promise<void> {
    const finalPath = this.buildPath();
    const url = `${this.apiBaseUrl.replace(/\/$/, '')}${finalPath}`;

    let command = `curl -X ${this.method} "${url}"`;
    if (this.token.trim()) {
      command += ` -H "Authorization: Bearer ${this.token.trim()}"`;
    }

    const mode = this.selectedPreset?.fileMode ?? 'none';
    if (mode === 'single') {
      command += ' -F "file=@/ruta/archivo.ext"';
    } else if (mode === 'multiple') {
      command += ' -F "files=@/ruta/archivo1.jpg" -F "files=@/ruta/archivo2.jpg"';
    } else if (this.method !== 'GET' && this.method !== 'DELETE' && this.jsonBody.trim()) {
      command += ` -H "Content-Type: application/json" -d '${this.jsonBody.replace(/'/g, "\\'")}'`;
    }

    try {
      await navigator.clipboard.writeText(command);
      this.statusClass = 'ok';
      this.statusText = 'cURL copiado';
    } catch {
      this.statusClass = 'err';
      this.statusText = 'No se pudo copiar cURL';
    }
  }

  clearResponse(): void {
    this.responseText = 'Sin respuesta todavía.';
    this.statusText = '';
    this.statusClass = '';
  }

  goBackToPreview(): void {
    this.router.navigateByUrl('/preview/live');
  }
}
