import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface SimpleStep {
  id: number;
  label: string;
}

interface PropertyIcon {
  viewBox: string;
  paths: string[];
}

interface PropertyType {
  id: string;
  label: string;
  icon: PropertyIcon;
}

type MediaAssetKey = 'masterPlan' | 'brochure' | 'legalDocs';
type SavedProjectItem = {
  id: number;
  nombre: string;
  status: string;
  updatedAt: string | null;
};
type AmenityOption = {
  id: string;
  label: string;
  selected: boolean;
  amenityId?: number | null;
};
type TypologyMediaType = 'image' | 'video';
type TypologyMediaInfo = {
  fileId: number | null;
  url: string;
  name: string;
  mimeType: string;
  type: TypologyMediaType;
};
type TypologyOption = {
  id: string;
  label: string;
  selected: boolean;
  media?: TypologyMediaInfo | null;
  pendingFile?: File | null;
  pendingPreviewUrl?: string | null;
  pendingMediaType?: TypologyMediaType | null;
  removeMedia?: boolean;
  blueprint?: TypologyMediaInfo | null;
  pendingBlueprintFile?: File | null;
  pendingBlueprintPreviewUrl?: string | null;
  removeBlueprint?: boolean;
};

@Component({
  selector: 'app-nuevo-proyecto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-proyecto.component.html',
  styleUrl: './nuevo-proyecto.component.scss'
})
export class NuevoProyectoComponent implements OnDestroy {
  readonly steps: SimpleStep[] = [
    { id: 1, label: 'Información' },
    { id: 2, label: 'Configuración' },
    { id: 3, label: 'Archivos' },
    { id: 4, label: 'Contenido' },
    { id: 5, label: 'Publicación' }
  ];

  readonly propertyTypes: PropertyType[] = [
    {
      id: 'apartment',
      label: 'Departamento',
      icon: {
        viewBox: '0 0 24 24',
        paths: [
          'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18',
          'M6 13h12',
          'M10 9h0.01',
          'M14 9h0.01',
          'M10 17h0.01',
          'M14 17h0.01',
          'M4 22h16'
        ]
      }
    },
    {
      id: 'house',
      label: 'Casa',
      icon: {
        viewBox: '0 0 24 24',
        paths: [
          'M3 10L12 3l9 7',
          'M5 10v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10',
          'M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6'
        ]
      }
    },
    {
      id: 'field',
      label: 'Townhouses',
      icon: {
        viewBox: '0 0 24 24',
        paths: [
          'M4 20s3-3 8-3 8 3 8 3',
          'M12 4v13',
          'M12 4C12 4 9 7.5 9 11a3 3 0 0 0 6 0c0-3.5-3-7-3-7z'
        ]
      }
    }
  ];

  readonly orientationOptions = ['Norte', 'Sur', 'Oriente', 'Poniente'];
  readonly deliveryOptions = [
    { id: 'inmediata', label: 'Entrega inmediata' },
    { id: 'pronta', label: 'Pronta' },
    { id: 'futura', label: 'Futura' }
  ];
  readonly typologyOptions: TypologyOption[] = [
    { id: '1d1b', label: '1D / 1B', selected: false },
    { id: '2d1b', label: '2D / 1B', selected: true },
    { id: '2d2b', label: '2D / 2B', selected: true },
    { id: '3d2b', label: '3D / 2B', selected: false },
    { id: '3d3b', label: '3D / 3B', selected: false },
    { id: '4d3b', label: '4D / 3B', selected: false },
    { id: '4d4b', label: '4D / 4B', selected: false },
    { id: '4d5b', label: '4D / 5B', selected: false }
  ];
  modelAssociations = [
    { typology: '2D / 2B', model: 'Azotea' },
    { typology: '3D / 3B', model: 'Jardín' }
  ];
  amenityOptions: AmenityOption[] = [
    { id: 'cowork', label: 'Cowork panorámico', selected: true },
    { id: 'gourmet', label: 'Salón gourmet', selected: true },
    { id: 'gym', label: 'Gimnasio', selected: true },
    { id: 'petSpa', label: 'Pet spa', selected: false },
    { id: 'pool', label: 'Piscina climatizada', selected: true },
    { id: 'quincho', label: 'Quincho', selected: false },
    { id: 'bike', label: 'Bicicleteros', selected: false },
    { id: 'pump', label: 'Circuito pump track', selected: false },
    { id: 'kids', label: 'Juegos infantiles', selected: false },
    { id: 'ecommerce', label: 'Recepción e-commerce', selected: false },
    { id: 'kidsRoom', label: 'Salón de niños', selected: false }
  ];
  newAmenityLabel = '';
  publicationChannels = [
    { id: 'residencial-las-condes', label: 'Residencial Las Condes', description: 'Sucursal', selected: true },
    { id: 'casa-familiar-providencia', label: 'Casa Familiar Providencia', description: 'Sucursal', selected: false },
    { id: 'cancha-deportiva-maipu', label: 'Cancha Deportiva Maipú', description: 'Sucursal', selected: false },
    { id: 'edificio-corporativo-santiago-centro', label: 'Edificio Corporativo Santiago Centro', description: 'Sucursal', selected: false },
    { id: 'villa-residencial-nunoa', label: 'Villa Residencial Ñuñoa', description: 'Sucursal', selected: false },
    { id: 'centro-comercial-las-condes', label: 'Centro Comercial Las Condes', description: 'Sucursal', selected: false }
  ];
  branchSearch = '';
  newBranchName = '';

  currentStep = 1;
  currentProjectId: number | null = null;
  isSaving = false;
  saveFeedback = '';
  project = {
    name: '',
    description: '',
    propertyType: 'apartment',
    estado: this.deliveryOptions[0].id,
    fechaEntrega: '',
    orientacion: '',
    ubicacion: '',
    puntoCercano: '',
    puntoCercano2: '',
    entornoDescripcion: '',
    mapAddress: '',
    coverImage: '',
    ambientAudio: ''
  };

  timings = {
    preVenta: 5,
    recorrido: 10,
    postVenta: 15
  };
  unitConfig = {
    totalUnits: 120,
    availableUnits: 2,
    deliveryQuarter: 'Q4 · 2025',
    stage: '2D / 2B',
    parkingRatio: 1.2,
    storageIncluded: true,
    petFriendly: true,
    observation: ''
  };
  mediaAssets = {
    masterPlan: '',
    brochure: '',
    legalDocs: ''
  };
  mediaGallery: string[] = [];
  contentPlan = {
    heroHeadline: 'Un nuevo skyline en Manquehue',
    heroTagline: 'Departamentos inteligentes con vistas infinitas.',
    narrative: '',
    sellingPoints: [
      'Sky pool temperada con vista 360°',
      'Cowork panorámico 24/7',
      'Departamentos con domótica integrada'
    ],
    ctaLabel: 'Solicitar visita guiada',
    videoUrl: ''
  };
  publicationSettings = {
    scheduleDate: '',
    scheduleTime: '',
    notifyTeam: true,
    autoTranslate: false,
    remarks: ''
  };
  publicationSettingsEnabled = true;
  isSavedProjectsModalOpen = false;
  isLoadingSavedProjects = false;
  savedProjectsError = '';
  savedProjects: SavedProjectItem[] = [];

  isAssociationModalOpen = false;
  associationForm = {
    typology: '',
    model: ''
  };
  isAiModalOpen = false;
  aiContextPrompt = '';
  private coverImageFile: File | null = null;
  private ambientAudioFile: File | null = null;
  coverImagePreviewUrl: string | null = null;

  constructor(private http: HttpClient) {
    this.currentProjectId = this.getStoredProjectId();
  }

  selectPropertyType(typeId: string) {
    this.project.propertyType = typeId;
  }

  setStep(stepId: number) {
    if (stepId >= 1 && stepId <= this.steps.length) {
      this.currentStep = stepId;
    }
  }

  handleFileChange(event: Event, key: 'coverImage' | 'ambientAudio') {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const selectedFile = input.files[0];
      this.project[key] = selectedFile.name;
      if (key === 'coverImage') {
        if (this.coverImagePreviewUrl) {
          URL.revokeObjectURL(this.coverImagePreviewUrl);
        }
        this.coverImagePreviewUrl = URL.createObjectURL(selectedFile);
        this.coverImageFile = selectedFile;
      } else {
        this.ambientAudioFile = selectedFile;
      }
    }
  }

  clearCoverImageSelection(input: HTMLInputElement): void {
    if (this.coverImagePreviewUrl) {
      URL.revokeObjectURL(this.coverImagePreviewUrl);
    }
    this.coverImagePreviewUrl = null;
    this.coverImageFile = null;
    this.project.coverImage = '';
    input.value = '';
  }

  clearAmbientAudioSelection(input: HTMLInputElement): void {
    this.ambientAudioFile = null;
    this.project.ambientAudio = '';
    input.value = '';
  }

  handleAssetUpload(event: Event, key: MediaAssetKey) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.mediaAssets[key] = Array.from(input.files)
        .map(file => file.name)
        .join(', ');
    }
  }

  handleGalleryUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const names = Array.from(input.files).map(file => file.name);
      this.mediaGallery = [...this.mediaGallery, ...names];
    }
  }

  removeGalleryAsset(index: number) {
    this.mediaGallery = this.mediaGallery.filter((_, i) => i !== index);
  }

  handleTypologyMediaChange(event: Event, typology: TypologyOption) {
    const input = event.target as HTMLInputElement;
    if (!input?.files?.length) {
      return;
    }

    const selectedFile = input.files[0];
    const mediaType: TypologyMediaType = selectedFile.type.startsWith('video/') ? 'video' : 'image';
    if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
      this.saveFeedback = 'La media principal de la tipología debe ser una imagen o un video.';
      input.value = '';
      return;
    }

    this.revokeTypologyPreview(typology);
    typology.pendingFile = selectedFile;
    typology.pendingPreviewUrl = URL.createObjectURL(selectedFile);
    typology.pendingMediaType = mediaType;
    typology.removeMedia = false;
    typology.selected = true;
    this.saveFeedback = `Media principal preparada para ${typology.label}. Guarda el paso para subirla.`;
  }

  removeTypologyMedia(typology: TypologyOption, input?: HTMLInputElement | null): void {
    this.revokeTypologyPreview(typology);
    typology.pendingFile = null;
    typology.pendingPreviewUrl = null;
    typology.pendingMediaType = null;
    typology.removeMedia = Boolean(typology.media);
    if (input) {
      input.value = '';
    }
  }

  handleTypologyBlueprintChange(event: Event, typology: TypologyOption) {
    const input = event.target as HTMLInputElement;
    if (!input?.files?.length) {
      return;
    }

    const selectedFile = input.files[0];
    if (!selectedFile.type.startsWith('image/')) {
      this.saveFeedback = 'La planta/plano debe ser una imagen JPG, PNG o WebP.';
      input.value = '';
      return;
    }

    this.revokeTypologyBlueprintPreview(typology);
    typology.pendingBlueprintFile = selectedFile;
    typology.pendingBlueprintPreviewUrl = URL.createObjectURL(selectedFile);
    typology.removeBlueprint = false;
    typology.selected = true;
    this.saveFeedback = `Plano/planta preparado para ${typology.label}. Guarda el paso para subirlo.`;
  }

  removeTypologyBlueprint(typology: TypologyOption, input?: HTMLInputElement | null): void {
    this.revokeTypologyBlueprintPreview(typology);
    typology.pendingBlueprintFile = null;
    typology.pendingBlueprintPreviewUrl = null;
    typology.removeBlueprint = Boolean(typology.blueprint);
    if (input) {
      input.value = '';
    }
  }

  getTypologyMediaPreviewUrl(typology: TypologyOption): string | null {
    return typology.pendingPreviewUrl || typology.media?.url || null;
  }

  getTypologyMediaType(typology: TypologyOption): TypologyMediaType | null {
    if (typology.pendingMediaType) {
      return typology.pendingMediaType;
    }
    return typology.removeMedia ? null : (typology.media?.type || null);
  }

  hasTypologyMedia(typology: TypologyOption): boolean {
    return Boolean(this.getTypologyMediaPreviewUrl(typology) && this.getTypologyMediaType(typology));
  }

  getTypologyBlueprintPreviewUrl(typology: TypologyOption): string | null {
    return typology.pendingBlueprintPreviewUrl || typology.blueprint?.url || null;
  }

  hasTypologyBlueprint(typology: TypologyOption): boolean {
    return Boolean(this.getTypologyBlueprintPreviewUrl(typology));
  }

  getTypologyStatusLabel(typology: TypologyOption): string {
    if (!typology.selected) {
      return 'Inactivo';
    }
    if (!this.hasTypologyMedia(typology)) {
      return 'Falta Media';
    }
    if (!this.hasTypologyBlueprint(typology)) {
      return 'Falta Planta';
    }
    return 'Completo';
  }

  openAssociationModal() {
    this.isAssociationModalOpen = true;
    this.associationForm = {
      typology: this.typologyOptions[0]?.label ?? '',
      model: ''
    };
  }

  closeAssociationModal() {
    this.isAssociationModalOpen = false;
  }

  selectAssociationModel(model: string) {
    this.associationForm.model = model;
  }

  addAssociation() {
    const { typology, model } = this.associationForm;
    if (!typology || !model) {
      return;
    }
    this.modelAssociations = [...this.modelAssociations, { typology, model }];
    this.closeAssociationModal();
  }

  addAmenity() {
    const label = this.newAmenityLabel.trim();
    if (!label) {
      return;
    }
    const exists = this.amenityOptions.some(
      amenity => amenity.label.toLowerCase() === label.toLowerCase()
    );
    if (exists) {
      this.newAmenityLabel = '';
      return;
    }
    const id = label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    this.amenityOptions = [...this.amenityOptions, { id, label, selected: true }];
    this.newAmenityLabel = '';
  }

  addBranchChannel() {
    const label = this.branchSearch.trim();
    if (!label) {
      return;
    }
    const existing = this.publicationChannels.find(
      channel => channel.label.toLowerCase() === label.toLowerCase()
    );
    if (existing) {
      this.selectBranchChannel(existing.label);
      return;
    }
    const id = `branch-${label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}`;
    this.publicationChannels = [
      ...this.publicationChannels,
      { id, label, description: 'Sucursal', selected: false }
    ];
    this.selectBranchChannel(label);
  }

  selectBranchChannel(label: string) {
    this.publicationChannels = this.publicationChannels.map(channel => ({
      ...channel,
      selected: channel.label === label
    }));
    this.branchSearch = label;
  }

  addBranchFromInput() {
    const label = this.newBranchName.trim();
    if (!label) {
      return;
    }
    this.branchSearch = label;
    this.newBranchName = '';
    this.addBranchChannel();
  }

  get branchOptions(): string[] {
    return this.publicationChannels
      .filter(channel => channel.description === 'Sucursal')
      .map(channel => channel.label)
      .sort((a, b) => a.localeCompare(b));
  }

  saveDraft() {
    this.openSavedProjectsModal();
  }

  cancel() {
    console.log('Cancelado');
  }

  fillWithAi() {
    this.isAiModalOpen = true;
  }

  closeAiModal() {
    this.isAiModalOpen = false;
  }

  applyAiAutofill() {
    const context = this.aiContextPrompt.trim();
    if (!context) {
      this.saveFeedback = 'Escribe un contexto para rellenar con IA.';
      return;
    }

    const propertyType = this.inferPropertyType(context);
    const orientation = this.inferOrientation(context);
    const delivery = this.inferDeliveryState(context);
    const normalizedContext = this.normalizeText(context);
    const contextoCapitalized = context.charAt(0).toUpperCase() + context.slice(1);

    this.project.name = this.project.name || this.buildProjectName(context, propertyType);
    this.project.description =
      `Proyecto ${contextoCapitalized}. Diseñado para entregar una experiencia residencial superior, ` +
      `con foco en calidad de vida, conectividad y plusvalía de largo plazo.`;
    this.project.entornoDescripcion =
      `Entorno destacado por ${context}. Cercano a comercio, servicios, áreas verdes y conectividad urbana.`;
    this.project.puntoCercano = this.pickNearbyPoint(normalizedContext, 1);
    this.project.puntoCercano2 = this.pickNearbyPoint(normalizedContext, 2);
    this.project.mapAddress = this.project.mapAddress || this.buildAddressFromContext(normalizedContext);
    this.project.ubicacion = this.project.ubicacion || this.project.mapAddress;
    this.project.propertyType = propertyType;
    this.project.orientacion = orientation;
    this.project.estado = delivery;

    this.timings.preVenta = this.timings.preVenta || 7;
    this.timings.recorrido = this.timings.recorrido || 12;
    this.timings.postVenta = this.timings.postVenta || 18;

    this.isAiModalOpen = false;
    this.saveFeedback = 'Campos del Paso 1 rellenados con IA.';
    console.log('[NuevoProyectoUI] ai autofill applied', {
      context,
      propertyType,
      orientation,
      delivery
    });
  }

  goNext() {
    if (this.currentStep < this.steps.length) {
      this.currentStep += 1;
    }
  }

  goPrev() {
    if (this.currentStep > 1) {
      this.currentStep -= 1;
    }
  }

  handlePrimaryAction() {
    if (this.currentStep === this.steps.length) {
      this.submitProject();
    } else {
      this.goNext();
    }
  }

  submitProject() {
    console.log('Proyecto listo para publicación', {
      project: this.project,
      timings: this.timings,
      unitConfig: this.unitConfig,
      content: this.contentPlan,
      publication: this.publicationSettings
    });
  }

  get primaryCtaLabel(): string {
    return this.currentStep === this.steps.length ? 'Finalizar y publicar' : 'Siguiente paso';
  }

  get selectedTypologies(): string[] {
    return this.typologyOptions.filter(option => option.selected).map(option => option.label);
  }

  get selectedAmenities(): string[] {
    return this.amenityOptions.filter(option => option.selected).map(option => option.label);
  }

  get selectedTypologiesWithMediaCount(): number {
    return this.typologyOptions.filter(
      (option) => option.selected && this.hasTypologyMedia(option) && this.hasTypologyBlueprint(option)
    ).length;
  }

  get landingManualUrl(): string {
    if (!this.currentProjectId) {
      return '';
    }
    const apiBase = encodeURIComponent(this.resolvePublicApiBaseUrl());
    return `landing-prueba-api.html?apiBase=${apiBase}&projectId=${this.currentProjectId}`;
  }

  async copyProjectId(): Promise<void> {
    if (!this.currentProjectId || typeof window === 'undefined' || !navigator?.clipboard) {
      this.saveFeedback = 'No se pudo copiar el ID.';
      return;
    }
    await navigator.clipboard.writeText(String(this.currentProjectId));
    this.saveFeedback = `ID ${this.currentProjectId} copiado.`;
  }

  async copyLandingUrl(): Promise<void> {
    if (!this.currentProjectId || typeof window === 'undefined' || !navigator?.clipboard) {
      this.saveFeedback = 'No se pudo copiar la URL.';
      return;
    }
    const absoluteUrl = `${window.location.origin}/${this.landingManualUrl}`;
    await navigator.clipboard.writeText(absoluteUrl);
    this.saveFeedback = 'URL de landing copiada.';
  }

  openLandingWithProjectId(): void {
    if (!this.currentProjectId || typeof window === 'undefined') {
      return;
    }
    const absoluteUrl = `${window.location.origin}/${this.landingManualUrl}`;
    window.open(absoluteUrl, '_blank', 'noopener,noreferrer');
  }

  async openSavedProjectsModal(): Promise<void> {
    this.isSavedProjectsModalOpen = true;
    this.savedProjectsError = '';
    await this.loadSavedProjects();
  }

  closeSavedProjectsModal(): void {
    this.isSavedProjectsModalOpen = false;
  }

  async loadSavedProjects(): Promise<void> {
    const token = this.getAccessToken();
    if (!token) {
      this.savedProjects = [];
      this.savedProjectsError = 'Primero debes iniciar sesión para ver proyectos guardados.';
      return;
    }
    this.isLoadingSavedProjects = true;
    this.savedProjectsError = '';
    try {
      const response = await firstValueFrom(
        this.http.get<{ data?: Array<Record<string, unknown>> }>(
          `${this.getApiBaseUrl()}/api/dash-manquehue/projects`,
          { headers: this.buildJsonHeaders(token) }
        )
      );
      const rows = Array.isArray(response?.data) ? response.data : [];
      this.savedProjects = rows.map((row) => ({
        id: Number(row['id'] || 0),
        nombre: String(row['nombre'] || `Proyecto ${row['id'] || ''}`),
        status: String(row['status'] || 'draft'),
        updatedAt: row['updated_at'] ? String(row['updated_at']) : null
      })).filter((row) => row.id > 0);
      console.log('[NuevoProyectoUI] saved projects loaded', { total: this.savedProjects.length });
    } catch (error) {
      console.error('[NuevoProyectoUI] loadSavedProjects error', error);
      this.savedProjects = [];
      this.savedProjectsError = 'No se pudieron cargar los proyectos guardados.';
    } finally {
      this.isLoadingSavedProjects = false;
    }
  }

  async selectSavedProject(projectId: number): Promise<void> {
    if (!projectId) {
      return;
    }
    const token = this.getAccessToken();
    if (!token) {
      this.savedProjectsError = 'Sesión inválida para cargar proyecto.';
      return;
    }
    this.isLoadingSavedProjects = true;
    this.savedProjectsError = '';
    try {
      const response = await firstValueFrom(
        this.http.get<{ data?: Record<string, unknown> }>(
          `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}`,
          { headers: this.buildJsonHeaders(token) }
        )
      );
      const data = (response?.data || {}) as Record<string, unknown>;
      this.currentProjectId = projectId;
      this.storeProjectId(projectId);
      this.project.name = String(data['nombre'] || '');
      this.project.description = String(data['descripcion_comercial'] || '');
      this.timings.preVenta = Number(data['tiempo_visita_min'] || 0) || this.timings.preVenta;
      this.timings.recorrido = Number(data['tiempo_recorrido_min'] || 0) || this.timings.recorrido;
      this.timings.postVenta = Number(data['tiempo_postventa_min'] || 0) || this.timings.postVenta;
      this.project.puntoCercano = String(data['punto_cercano_1'] || '');
      this.project.puntoCercano2 = String(data['punto_cercano_2'] || '');
      this.project.orientacion = String(data['orientacion_principal'] || data['orientacion_texto'] || '');
      this.project.propertyType = this.mapPropertyTypeFromApi(String(data['tipo_inmueble'] || ''));
      this.project.estado = String(data['estado_entrega'] || this.deliveryOptions[0].id);
      this.project.ubicacion = String(data['ubicacion_texto'] || '');
      this.project.entornoDescripcion = String(data['entorno_descripcion'] || '');
      this.project.mapAddress = String(data['direccion_pin'] || '');
      this.currentStep = Number(data['current_step'] || 1) || 1;
      await this.loadStep2Resources(projectId, token);
      this.saveFeedback = `Proyecto #${projectId} cargado correctamente.`;
      console.log('[NuevoProyectoUI] saved project selected', { projectId, data });
      this.closeSavedProjectsModal();
    } catch (error) {
      console.error('[NuevoProyectoUI] selectSavedProject error', error);
      this.savedProjectsError = 'No se pudo cargar el proyecto seleccionado.';
    } finally {
      this.isLoadingSavedProjects = false;
    }
  }

  async saveCurrentStep(): Promise<void> {
    if (this.isSaving) {
      return;
    }

    const token = this.getAccessToken();
    if (!token) {
      this.saveFeedback = 'Primero debes iniciar sesión para guardar.';
      console.warn('[NuevoProyectoUI] save blocked: missing access token');
      return;
    }

    this.isSaving = true;
    this.saveFeedback = '';
    console.log('[NuevoProyectoUI] save start', {
      step: this.currentStep,
      hasProjectId: Boolean(this.currentProjectId),
      hasCoverFile: Boolean(this.coverImageFile),
      hasAmbientFile: Boolean(this.ambientAudioFile)
    });

    try {
      const projectId = await this.ensureProjectId(token);
      console.log('[NuevoProyectoUI] project ready', { projectId, step: this.currentStep });

      if (this.currentStep === 1) {
        const step1Payload = this.buildStep1ProjectPayload();
        console.log('[NuevoProyectoUI] PATCH project payload', step1Payload);
        await firstValueFrom(
          this.http.patch(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}`,
            step1Payload,
            { headers: this.buildJsonHeaders(token) }
          )
        );
        console.log('[NuevoProyectoUI] PATCH project ok', { projectId });

        if (this.coverImageFile) {
          console.log('[NuevoProyectoUI] upload cover start', {
            projectId,
            name: this.coverImageFile.name,
            size: this.coverImageFile.size
          });
          await this.uploadStep1File(projectId, token, this.coverImageFile, 'cover-image');
          this.coverImageFile = null;
          console.log('[NuevoProyectoUI] upload cover ok', { projectId });
        }

        if (this.ambientAudioFile) {
          console.log('[NuevoProyectoUI] upload ambient start', {
            projectId,
            name: this.ambientAudioFile.name,
            size: this.ambientAudioFile.size
          });
          await this.uploadStep1File(projectId, token, this.ambientAudioFile, 'ambient-audio');
          this.ambientAudioFile = null;
          console.log('[NuevoProyectoUI] upload ambient ok', { projectId });
        }
      }

      if (this.currentStep === 2) {
        await this.saveStep2Resources(projectId, token);
      }

      const stepPayload = this.buildCurrentStepPayload();
      console.log('[NuevoProyectoUI] PATCH step payload', {
        projectId,
        step: this.currentStep,
        payload: stepPayload
      });
      await firstValueFrom(
        this.http.patch(
          `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/step/${this.currentStep}`,
          stepPayload,
          { headers: this.buildJsonHeaders(token) }
        )
      );
      console.log('[NuevoProyectoUI] PATCH step ok', { projectId, step: this.currentStep });

      this.saveFeedback = `Paso ${this.currentStep} guardado correctamente. ID: ${projectId}`;
    } catch (error) {
      console.error('[NuevoProyecto] saveCurrentStep error', error);
      this.saveFeedback = this.getApiErrorMessage(error);
    } finally {
      this.isSaving = false;
    }
  }

  private async ensureProjectId(token: string): Promise<number> {
    if (this.currentProjectId) {
      console.log('[NuevoProyectoUI] reusing projectId', { projectId: this.currentProjectId });
      return this.currentProjectId;
    }

    const createPayload = this.buildStep1ProjectPayload();
    console.log('[NuevoProyectoUI] create project payload', createPayload);
    const response = await firstValueFrom(
      this.http.post<{ data?: { projectId?: number } }>(
        `${this.getApiBaseUrl()}/api/dash-manquehue/projects`,
        createPayload,
        { headers: this.buildJsonHeaders(token) }
      )
    );

    const projectId = Number(response?.data?.projectId || 0);
    if (!projectId) {
      throw new Error('No projectId returned');
    }

    this.currentProjectId = projectId;
    this.storeProjectId(projectId);
    console.log('[NuevoProyectoUI] created projectId', { projectId });
    return projectId;
  }

  private buildStep1ProjectPayload() {
    return {
      nombre: this.project.name?.trim() || null,
      descripcionComercial: this.project.description?.trim() || null,
      tiempoVisitaMin: this.timings.preVenta ?? null,
      tiempoRecorridoMin: this.timings.recorrido ?? null,
      tiempoPostventaMin: this.timings.postVenta ?? null,
      puntoCercano1: this.project.puntoCercano?.trim() || null,
      puntoCercano2: this.project.puntoCercano2?.trim() || null,
      orientacionPrincipal: this.project.orientacion?.trim() || null,
      tipoInmueble: this.mapPropertyTypeForApi(this.project.propertyType),
      estadoEntrega: this.project.estado || null,
      orientacionTexto: this.project.orientacion?.trim() || null,
      ubicacionTexto: this.project.ubicacion?.trim() || null,
      entornoDescripcion: this.project.entornoDescripcion?.trim() || null,
      direccionPin: this.project.mapAddress?.trim() || null,
      mapRangeKm: 2.5
    };
  }

  private buildCurrentStepPayload() {
    if (this.currentStep === 1) {
      return {
        ...this.buildStep1ProjectPayload(),
        coverImageName: this.project.coverImage || null,
        ambientAudioName: this.project.ambientAudio || null
      };
    }

    if (this.currentStep === 2) {
      return {
        unitConfig: this.unitConfig,
        selectedTypologies: this.selectedTypologies,
        typologyMedia: this.typologyOptions
          .filter((option) => option.selected)
          .map((option) => ({
            typology: option.label,
            mediaName: option.pendingFile?.name || option.media?.name || null,
            mediaType: option.pendingMediaType || option.media?.type || null,
            blueprintName: option.pendingBlueprintFile?.name || option.blueprint?.name || null
          })),
        modelAssociations: this.modelAssociations,
        selectedAmenities: this.selectedAmenities,
        observation: this.unitConfig.observation || null
      };
    }

    if (this.currentStep === 3) {
      return {
        mediaAssets: this.mediaAssets,
        mediaGallery: this.mediaGallery
      };
    }

    if (this.currentStep === 4) {
      return {
        contentPlan: this.contentPlan
      };
    }

    return {
      publicationSettingsEnabled: this.publicationSettingsEnabled,
      publicationSettings: this.publicationSettings,
      publicationChannels: this.publicationChannels
    };
  }

  private async uploadStep1File(
    projectId: number,
    token: string,
    file: File,
    endpoint: 'cover-image' | 'ambient-audio'
  ): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    await firstValueFrom(
      this.http.post(
        `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/files/${endpoint}`,
        formData,
        { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      )
    );
  }

  private async saveStep2Resources(projectId: number, token: string): Promise<void> {
    const configPayload = {
      unidadesTotales: this.toNullableNumber(this.unitConfig.totalUnits),
      unidadesDisponibles: this.toNullableNumber(this.unitConfig.availableUnits),
      entregaEstimadaTexto: this.unitConfig.deliveryQuarter?.trim() || null,
      etapaTexto: this.unitConfig.stage?.trim() || null,
      ratioEstacionamientos: this.toNullableNumber(this.unitConfig.parkingRatio),
      bodegaIncluida: this.unitConfig.storageIncluded,
      petFriendly: this.unitConfig.petFriendly,
      notasOperacionales: this.unitConfig.observation?.trim() || null
    };

    const typologiesPayload = {
      typologies: this.typologyOptions
        .filter((option) => option.selected)
        .map((option, index) => {
          const parsed = this.parseTypologyLabel(option.label);
          const models = this.modelAssociations
            .filter((association) => association.typology === option.label)
            .map((association) => ({
              modelCode: this.slugifyValue(association.model),
              modelLabel: association.model
            }));

          return {
            typologyCode: option.id,
            dormitorios: parsed.dormitorios,
            banos: parsed.banos,
            isActive: true,
            sortOrder: index,
            models
          };
        })
    };

    const catalog = await this.fetchAmenitiesCatalog(token);
    const selectedAmenities = this.amenityOptions.filter((option) => option.selected);
    const amenityIds: number[] = [];
    const customLabels: string[] = [];

    selectedAmenities.forEach((option) => {
      const match = catalog.find((item) => this.catalogMatchesAmenity(item, option));
      if (match?.id) {
        amenityIds.push(match.id);
      } else {
        customLabels.push(option.label);
      }
    });

    await firstValueFrom(
      this.http.patch(
        `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/config`,
        configPayload,
        { headers: this.buildJsonHeaders(token) }
      )
    );

    await firstValueFrom(
      this.http.put(
        `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/typologies`,
        typologiesPayload,
        { headers: this.buildJsonHeaders(token) }
      )
    );

    await firstValueFrom(
      this.http.put(
        `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/amenities`,
        { amenityIds, customLabels },
        { headers: this.buildJsonHeaders(token) }
      )
    );

    await this.syncTypologyMedia(projectId, token);
  }

  private async loadStep2Resources(projectId: number, token: string): Promise<void> {
    try {
      const [configResponse, typologiesResponse, amenitiesResponse, catalogResponse] = await Promise.all([
        firstValueFrom(
          this.http.get<{ data?: Record<string, unknown> | null }>(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/config`,
            { headers: this.buildJsonHeaders(token) }
          )
        ),
        firstValueFrom(
          this.http.get<{ data?: Array<Record<string, unknown>> }>(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/typologies`,
            { headers: this.buildJsonHeaders(token) }
          )
        ),
        firstValueFrom(
          this.http.get<{ data?: Array<Record<string, unknown>> }>(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/amenities`,
            { headers: this.buildJsonHeaders(token) }
          )
        ),
        firstValueFrom(
          this.http.get<{ data?: Array<Record<string, unknown>> }>(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/amenities/catalog`,
            { headers: this.buildJsonHeaders(token) }
          )
        )
      ]);

      const config = configResponse?.data || null;
      if (config) {
        this.unitConfig.totalUnits = Number(config['unidades_totales'] || 0) || 0;
        this.unitConfig.availableUnits = Number(config['unidades_disponibles'] || 0) || 0;
        this.unitConfig.deliveryQuarter = String(config['entrega_estimada_texto'] || '');
        this.unitConfig.stage = String(config['etapa_texto'] || '');
        this.unitConfig.parkingRatio = Number(config['ratio_estacionamientos'] || 0) || 0;
        this.unitConfig.storageIncluded = Boolean(config['bodega_incluida']);
        this.unitConfig.petFriendly = Boolean(config['pet_friendly']);
        this.unitConfig.observation = String(config['notas_operacionales'] || '');
      }

      const typologyRows = Array.isArray(typologiesResponse?.data) ? typologiesResponse.data : [];
      const selectedLabels = new Set<string>();
      const modelAssociations = typologyRows.flatMap((row) => {
        const label = this.buildTypologyLabel(
          String(row['typology_code'] || ''),
          Number(row['dormitorios'] || 0),
          Number(row['banos'] || 0)
        );
        selectedLabels.add(label);
        const models = Array.isArray(row['models']) ? (row['models'] as Array<Record<string, unknown>>) : [];
        return models.map((model) => ({
          typology: label,
          model: String(model['model_label'] || model['model_code'] || '')
        })).filter((item) => item.model);
      });

      this.typologyOptions.forEach((option) => {
        option.selected = selectedLabels.has(option.label);
        const row = typologyRows.find((item) => String(item['typology_code'] || '') === option.id);
        option.media = this.mapTypologyMediaFromApi(row?.['media']);
        option.blueprint = this.mapTypologyMediaFromApi(row?.['blueprint']);
        option.removeMedia = false;
        option.removeBlueprint = false;
        option.pendingFile = null;
        this.revokeTypologyPreview(option);
        option.pendingPreviewUrl = null;
        option.pendingMediaType = null;
        option.pendingBlueprintFile = null;
        this.revokeTypologyBlueprintPreview(option);
        option.pendingBlueprintPreviewUrl = null;
      });
      this.modelAssociations = modelAssociations;

      const catalogRows = Array.isArray(catalogResponse?.data) ? catalogResponse.data : [];
      const selectedAmenityRows = Array.isArray(amenitiesResponse?.data) ? amenitiesResponse.data : [];
      const selectedAmenityKeys = new Set(
        selectedAmenityRows.map((row) => this.normalizeKey(String(row['label'] || row['code'] || ''))).filter(Boolean)
      );

      const mergedAmenities = new Map<string, AmenityOption>();

      this.amenityOptions.forEach((option) => {
        mergedAmenities.set(this.normalizeKey(option.label || option.id), {
          ...option,
          selected: false
        });
      });

      catalogRows.forEach((row) => {
        const option: AmenityOption = {
          id: String(row['code'] || ''),
          label: String(row['label'] || row['code'] || ''),
          selected: false,
          amenityId: Number(row['id'] || 0) || null
        };
        mergedAmenities.set(this.normalizeKey(option.label || option.id), option);
      });

      selectedAmenityRows.forEach((row) => {
        const option: AmenityOption = {
          id: String(row['code'] || this.slugifyValue(String(row['label'] || ''))),
          label: String(row['label'] || row['code'] || ''),
          selected: true,
          amenityId: Number(row['amenity_id'] || 0) || null
        };
        mergedAmenities.set(this.normalizeKey(option.label || option.id), option);
      });

      this.amenityOptions = Array.from(mergedAmenities.values()).map((option) => ({
        ...option,
        selected: selectedAmenityKeys.has(this.normalizeKey(option.label || option.id))
      }));
    } catch (error) {
      console.error('[NuevoProyectoUI] loadStep2Resources error', error);
    }
  }

  private async syncTypologyMedia(projectId: number, token: string): Promise<void> {
    const selectedTypologies = this.typologyOptions.filter((option) => option.selected);

    for (const typology of selectedTypologies) {
      if (typology.removeMedia && typology.media?.fileId) {
        await firstValueFrom(
          this.http.delete(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/typologies/${typology.id}/media`,
            { headers: this.buildJsonHeaders(token) }
          )
        );
        typology.media = null;
        typology.removeMedia = false;
      }

      if (typology.removeBlueprint && typology.blueprint?.fileId) {
        await firstValueFrom(
          this.http.delete(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/typologies/${typology.id}/blueprint`,
            { headers: this.buildJsonHeaders(token) }
          )
        );
        typology.blueprint = null;
        typology.removeBlueprint = false;
      }

      if (typology.pendingFile) {
        const formData = new FormData();
        formData.append('file', typology.pendingFile);
        await firstValueFrom(
          this.http.post(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/typologies/${typology.id}/media`,
            formData,
            { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
          )
        );
        this.revokeTypologyPreview(typology);
        typology.pendingFile = null;
        typology.pendingPreviewUrl = null;
        typology.pendingMediaType = null;
      }

      if (typology.pendingBlueprintFile) {
        const blueprintData = new FormData();
        blueprintData.append('file', typology.pendingBlueprintFile);
        await firstValueFrom(
          this.http.post(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/typologies/${typology.id}/blueprint`,
            blueprintData,
            { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
          )
        );
        this.revokeTypologyBlueprintPreview(typology);
        typology.pendingBlueprintFile = null;
        typology.pendingBlueprintPreviewUrl = null;
      }
    }

    await this.loadStep2Resources(projectId, token);
  }

  private mapTypologyMediaFromApi(value: unknown): TypologyMediaInfo | null {
    if (!value || typeof value !== 'object') {
      return null;
    }
    const row = value as Record<string, unknown>;
    const url = String(row['url'] || '');
    if (!url) {
      return null;
    }
    return {
      fileId: Number(row['id'] || 0) || null,
      url,
      name: String(row['name'] || ''),
      mimeType: String(row['mimeType'] || ''),
      type: String(row['type'] || '').toLowerCase() === 'video' ? 'video' : 'image'
    };
  }

  private async fetchAmenitiesCatalog(token: string): Promise<Array<{ id: number; code: string; label: string }>> {
    const response = await firstValueFrom(
      this.http.get<{ data?: Array<Record<string, unknown>> }>(
        `${this.getApiBaseUrl()}/api/dash-manquehue/projects/amenities/catalog`,
        { headers: this.buildJsonHeaders(token) }
      )
    );

    const rows = Array.isArray(response?.data) ? response.data : [];
    return rows
      .map((row) => ({
        id: Number(row['id'] || 0),
        code: String(row['code'] || ''),
        label: String(row['label'] || '')
      }))
      .filter((row) => row.id > 0);
  }

  private catalogMatchesAmenity(
    catalogItem: { id: number; code: string; label: string },
    amenity: AmenityOption
  ): boolean {
    return (
      this.normalizeKey(catalogItem.code) === this.normalizeKey(amenity.id) ||
      this.normalizeKey(catalogItem.label) === this.normalizeKey(amenity.label)
    );
  }

  private parseTypologyLabel(label: string): { dormitorios: number; banos: number } {
    const match = String(label || '').match(/(\d+)\s*D\s*\/\s*(\d+)\s*B/i);
    return {
      dormitorios: match ? Number(match[1]) : 0,
      banos: match ? Number(match[2]) : 0
    };
  }

  private buildTypologyLabel(code: string, dormitorios: number, banos: number): string {
    if (dormitorios > 0 || banos > 0) {
      return `${dormitorios}D / ${banos}B`;
    }
    return code || 'Tipología';
  }

  private slugifyValue(value: string): string {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private normalizeKey(value: string): string {
    return this.slugifyValue(value);
  }

  private toNullableNumber(value: unknown): number | null {
    if (value === '' || value === null || value === undefined) {
      return null;
    }
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : null;
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

  private resolvePublicApiBaseUrl(): string {
    if (typeof window === 'undefined') {
      return 'https://www.api.thefutureagencyai.com';
    }
    const host = window.location.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:4000';
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

  private getStoredProjectId(): number | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const raw = localStorage.getItem('imanquehue_current_project_id');
    const parsed = Number(raw || 0);
    return parsed > 0 ? parsed : null;
  }

  private storeProjectId(projectId: number): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem('imanquehue_current_project_id', String(projectId));
  }

  ngOnDestroy(): void {
    if (this.coverImagePreviewUrl) {
      URL.revokeObjectURL(this.coverImagePreviewUrl);
    }
    this.typologyOptions.forEach((option) => {
      this.revokeTypologyPreview(option);
      this.revokeTypologyBlueprintPreview(option);
    });
  }

  private normalizeText(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private inferPropertyType(context: string): 'apartment' | 'house' | 'field' {
    const normalized = this.normalizeText(context);
    if (normalized.includes('casa') || normalized.includes('condominio')) {
      return 'house';
    }
    if (normalized.includes('townhouse') || normalized.includes('townhouses')) {
      return 'field';
    }
    return 'apartment';
  }

  private inferOrientation(context: string): string {
    const normalized = this.normalizeText(context);
    if (normalized.includes('sur')) return 'Sur';
    if (normalized.includes('oriente')) return 'Oriente';
    if (normalized.includes('poniente')) return 'Poniente';
    return 'Norte';
  }

  private inferDeliveryState(context: string): 'inmediata' | 'pronta' | 'futura' {
    const normalized = this.normalizeText(context);
    if (normalized.includes('futura') || normalized.includes('2027') || normalized.includes('2028')) {
      return 'futura';
    }
    if (normalized.includes('pronta') || normalized.includes('2026')) {
      return 'pronta';
    }
    return 'inmediata';
  }

  private buildProjectName(context: string, propertyType: 'apartment' | 'house' | 'field'): string {
    const suffix = propertyType === 'house' ? 'Casas' : propertyType === 'field' ? 'Townhouses' : 'Residencias';
    const cleaned = context
      .split(' ')
      .map((token) => token.trim())
      .filter(Boolean)
      .slice(0, 3)
      .map((token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
      .join(' ');
    return `Proyecto ${cleaned || 'Manquehue'} ${suffix}`;
  }

  private pickNearbyPoint(context: string, slot: 1 | 2): string {
    const references = ['Metro Manquehue', 'Parque Araucano', 'Mall Parque Arauco', 'Clínica Alemana'];
    if (context.includes('metro')) return slot === 1 ? 'Metro Manquehue' : 'Parque Araucano';
    if (context.includes('parque')) return slot === 1 ? 'Parque Araucano' : 'Mall Parque Arauco';
    return references[slot - 1] || references[0];
  }

  private buildAddressFromContext(context: string): string {
    if (context.includes('las condes')) {
      return 'Av. Manquehue 1234, Las Condes';
    }
    if (context.includes('providencia')) {
      return 'Av. Providencia 1450, Providencia';
    }
    if (context.includes('nunoa') || context.includes('ñunoa')) {
      return 'Av. Irarrázaval 2500, Ñuñoa';
    }
    return 'Av. Manquehue 1234, Las Condes';
  }

  private mapPropertyTypeForApi(value: string): 'departamento' | 'casa' | 'townhouses' | null {
    if (value === 'house') {
      return 'casa';
    }
    if (value === 'field' || value === 'townhouses') {
      return 'townhouses';
    }
    if (value === 'apartment' || value === 'departamento') {
      return 'departamento';
    }
    return null;
  }

  private mapPropertyTypeFromApi(value: string): 'apartment' | 'house' | 'field' {
    if (value === 'casa') {
      return 'house';
    }
    if (value === 'townhouses') {
      return 'field';
    }
    return 'apartment';
  }

  private getApiErrorMessage(error: unknown): string {
    const fallback = 'No se pudo guardar. Revisa backend y sesión.';
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }

    const err = error.error as string | { error?: { message?: string }; message?: string } | null | undefined;
    if (typeof err === 'string' && err.trim()) {
      return `No se pudo guardar: ${err.slice(0, 160)}`;
    }

    let apiMessage = '';
    if (err && typeof err === 'object') {
      const obj = err as { error?: { message?: string }; message?: string };
      apiMessage = obj.error?.message || obj.message || '';
    }

    if (apiMessage) {
      return `No se pudo guardar: ${apiMessage}`;
    }

    return `No se pudo guardar (HTTP ${error.status || '0'}).`;
  }

  private revokeTypologyPreview(typology: TypologyOption): void {
    if (typology.pendingPreviewUrl) {
      URL.revokeObjectURL(typology.pendingPreviewUrl);
    }
  }

  private revokeTypologyBlueprintPreview(typology: TypologyOption): void {
    if (typology.pendingBlueprintPreviewUrl) {
      URL.revokeObjectURL(typology.pendingBlueprintPreviewUrl);
    }
  }
}

