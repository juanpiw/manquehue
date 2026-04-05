import { Component, OnDestroy, OnInit } from '@angular/core';
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
type DifferentiatorMediaState = {
  media: TypologyMediaInfo | null;
  pendingFile: File | null;
  pendingPreviewUrl: string | null;
  pendingMediaType: TypologyMediaType | null;
  removeMedia: boolean;
};

type PublicationChannel = {
  id: string;
  label: string;
  description: string;
  selected: boolean;
  branchId: number | null;
  code?: string | null;
};

type ProjectScreenStatus = 'online' | 'offline' | 'maintenance' | 'draft';
type ProjectScreenOrientation = 'horizontal' | 'vertical';

type ProjectScreen = {
  localId: string;
  id: number | null;
  branchId: number | null;
  branchName: string;
  screenName: string;
  screenCode: string;
  locationLabel: string;
  status: ProjectScreenStatus;
  deviceModel: string;
  operatingSystem: string;
  resolution: string;
  orientation: ProjectScreenOrientation;
  connectivity: string;
  responsibleName: string;
  responsibleRole: string;
  responsibleEmail: string;
  responsiblePhone: string;
  lastSyncAt: string;
  lastActivityAt: string;
  notes: string;
  sortOrder: number;
};

@Component({
  selector: 'app-nuevo-proyecto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-proyecto.component.html',
  styleUrl: './nuevo-proyecto.component.scss'
})
export class NuevoProyectoComponent implements OnDestroy, OnInit {
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
  publicationChannels: PublicationChannel[] = [
    { id: 'residencial-las-condes', label: 'Residencial Las Condes', description: 'Sucursal', selected: true, branchId: null },
    { id: 'casa-familiar-providencia', label: 'Casa Familiar Providencia', description: 'Sucursal', selected: false, branchId: null },
    { id: 'cancha-deportiva-maipu', label: 'Cancha Deportiva Maipu', description: 'Sucursal', selected: false, branchId: null },
    { id: 'edificio-corporativo-santiago-centro', label: 'Edificio Corporativo Santiago Centro', description: 'Sucursal', selected: false, branchId: null },
    { id: 'villa-residencial-nunoa', label: 'Villa Residencial Nunoa', description: 'Sucursal', selected: false, branchId: null },
    { id: 'centro-comercial-las-condes', label: 'Centro Comercial Las Condes', description: 'Sucursal', selected: false, branchId: null }
  ];
  branchSearch = '';
  newBranchName = '';
  projectScreens: ProjectScreen[] = [];
  readonly screenStatusOptions: Array<{ id: ProjectScreenStatus; label: string }> = [
    { id: 'online', label: 'Online' },
    { id: 'offline', label: 'Offline' },
    { id: 'maintenance', label: 'Mantención' },
    { id: 'draft', label: 'Borrador' }
  ];
  readonly screenOrientationOptions: Array<{ id: ProjectScreenOrientation; label: string }> = [
    { id: 'horizontal', label: 'Horizontal' },
    { id: 'vertical', label: 'Vertical' }
  ];
  readonly screenConnectivityOptions = ['Ethernet', 'WiFi', '4G/5G', 'Híbrida'];

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
    heroVideo: '',
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
  differentiatorMediaStates: DifferentiatorMediaState[] = [];
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
  selectedProjectPickerId = '';
  newProjectCandidateId = '';
  isCreateProjectModalOpen = false;
  pendingNewProjectId: number | null = null;

  isAssociationModalOpen = false;
  associationForm = {
    typology: '',
    model: ''
  };
  isAiModalOpen = false;
  aiContextPrompt = '';
  private coverImageFile: File | null = null;
  private heroVideoFile: File | null = null;
  private ambientAudioFile: File | null = null;
  private step3AssetFiles: Record<MediaAssetKey, File | null> = {
    masterPlan: null,
    brochure: null,
    legalDocs: null
  };
  private pendingGalleryFiles: File[] = [];
  coverImagePreviewUrl: string | null = null;
  heroVideoPreviewUrl: string | null = null;

  constructor(private http: HttpClient) {
    this.currentProjectId = this.getStoredProjectId();
    this.ensureDifferentiatorMediaStatesLength(this.contentPlan.sellingPoints.length);
    this.projectScreens = [this.createEmptyProjectScreen()];
    if (this.currentProjectId) {
      this.selectedProjectPickerId = String(this.currentProjectId);
    }
  }

  ngOnInit(): void {
    if (this.getAccessToken()) {
      void this.loadSavedProjects();
      void this.loadBranchChannels(this.getAccessToken());
    }
  }

  selectPropertyType(typeId: string) {
    this.project.propertyType = typeId;
  }

  setStep(stepId: number) {
    if (stepId >= 1 && stepId <= this.steps.length) {
      this.currentStep = stepId;
    }
  }

  handleFileChange(event: Event, key: 'coverImage' | 'heroVideo' | 'ambientAudio') {
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
      } else if (key === 'heroVideo') {
        if (this.heroVideoPreviewUrl) {
          URL.revokeObjectURL(this.heroVideoPreviewUrl);
        }
        this.heroVideoPreviewUrl = URL.createObjectURL(selectedFile);
        this.heroVideoFile = selectedFile;
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

  clearHeroVideoSelection(input: HTMLInputElement): void {
    if (this.heroVideoPreviewUrl) {
      URL.revokeObjectURL(this.heroVideoPreviewUrl);
    }
    this.heroVideoPreviewUrl = null;
    this.heroVideoFile = null;
    this.project.heroVideo = '';
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
      const selectedFile = input.files[0];
      this.mediaAssets[key] = selectedFile.name;
      this.step3AssetFiles[key] = selectedFile;
      this.saveFeedback = `${selectedFile.name} preparado. Guarda el paso 3 para subirlo.`;
      input.value = '';
    }
  }

  handleGalleryUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const files = Array.from(input.files);
      const names = files.map(file => file.name);
      this.mediaGallery = [...this.mediaGallery, ...names];
      this.pendingGalleryFiles = [...this.pendingGalleryFiles, ...files];
      this.saveFeedback = `${files.length} archivo(s) preparados para la galería.`;
      input.value = '';
    }
  }

  removeGalleryAsset(index: number) {
    const nonPendingCount = Math.max(this.mediaGallery.length - this.pendingGalleryFiles.length, 0);
    this.mediaGallery = this.mediaGallery.filter((_, i) => i !== index);
    const pendingIndex = index - nonPendingCount;
    if (pendingIndex >= 0 && pendingIndex < this.pendingGalleryFiles.length) {
      this.pendingGalleryFiles = this.pendingGalleryFiles.filter((_, i) => i !== pendingIndex);
    }
  }

  handleDifferentiatorMediaUpload(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (!input?.files?.length) {
      return;
    }

    const selectedFile = input.files[0];
    if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
      this.saveFeedback = 'La media del diferenciador debe ser imagen o video.';
      input.value = '';
      return;
    }

    this.ensureDifferentiatorMediaStatesLength(this.contentPlan.sellingPoints.length);
    const slot = this.differentiatorMediaStates[index];
    if (!slot) {
      input.value = '';
      return;
    }
    this.revokeDifferentiatorPreview(slot);
    slot.pendingFile = selectedFile;
    slot.pendingPreviewUrl = URL.createObjectURL(selectedFile);
    slot.pendingMediaType = selectedFile.type.startsWith('video/') ? 'video' : 'image';
    slot.removeMedia = false;
    this.saveFeedback = `Media preparada para Diferenciador ${index + 1}. Guarda el paso 4 para subirla.`;
    input.value = '';
  }

  removeDifferentiatorMedia(index: number): void {
    this.ensureDifferentiatorMediaStatesLength(this.contentPlan.sellingPoints.length);
    const slot = this.differentiatorMediaStates[index];
    if (!slot) {
      return;
    }
    this.revokeDifferentiatorPreview(slot);
    slot.pendingFile = null;
    slot.pendingPreviewUrl = null;
    slot.pendingMediaType = null;
    slot.removeMedia = Boolean(slot.media);
  }

  getDifferentiatorPreviewUrl(index: number): string {
    const slot = this.differentiatorMediaStates[index];
    return slot?.pendingPreviewUrl || slot?.media?.url || '';
  }

  isDifferentiatorPreviewVideo(index: number): boolean {
    const slot = this.differentiatorMediaStates[index];
    const type = slot?.pendingMediaType || slot?.media?.type || '';
    return type === 'video';
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
    const branchId = this.parseBranchId(this.branchSearch);
    if (!branchId) {
      return;
    }
    this.selectBranchChannel(branchId);
  }

  selectBranchChannel(branchId: number | null) {
    this.publicationChannels = this.publicationChannels.map((channel) => ({
      ...channel,
      selected: branchId !== null && channel.branchId === branchId
    }));
    this.branchSearch = branchId ? String(branchId) : '';
  }

  async addBranchFromInput() {
    const label = this.newBranchName.trim();
    if (!label) {
      return;
    }
    const token = this.getAccessToken();
    if (!token) {
      this.saveFeedback = 'Inicia sesión para crear sucursales.';
      return;
    }
    try {
      const response = await firstValueFrom(
        this.http.post<{ data?: { branchId?: number | null } }>(
          `${this.getApiBaseUrl()}/api/dash-manquehue/projects/branches`,
          { name: label },
          { headers: this.buildJsonHeaders(token) }
        )
      );
      const branchId = Number(response?.data?.branchId || 0) || null;
      this.newBranchName = '';
      await this.loadBranchChannels(token, branchId);
      this.saveFeedback = branchId
        ? `Sucursal creada y seleccionada: ${label}.`
        : `Sucursal creada: ${label}.`;
    } catch (error) {
      console.error('[NuevoProyectoUI] addBranchFromInput error', error);
      this.saveFeedback = this.getApiErrorMessage(error);
    }
  }

  addScreenCard(): void {
    const selectedChannel = this.publicationChannels.find((channel) => channel.selected) || null;
    this.projectScreens = [
      ...this.projectScreens,
      this.createEmptyProjectScreen({
        branchId: selectedChannel?.branchId || null,
        branchName: selectedChannel?.label || '',
        sortOrder: this.projectScreens.length + 1
      })
    ];
  }

  removeScreenCard(localId: string): void {
    const nextScreens = this.projectScreens
      .filter((screen) => screen.localId !== localId)
      .map((screen, index) => ({ ...screen, sortOrder: index + 1 }));
    this.projectScreens = nextScreens.length ? nextScreens : [this.createEmptyProjectScreen()];
  }

  syncScreenBranchName(screen: ProjectScreen, branchIdValue: string | number | null): void {
    const branchId = this.parseBranchId(branchIdValue);
    const branch = this.publicationChannels.find((channel) => channel.branchId === branchId) || null;
    screen.branchId = branchId;
    screen.branchName = branch?.label || '';
    if (branchId && this.selectedBranchId === null) {
      this.selectBranchChannel(branchId);
    }
  }

  get branchOptions(): PublicationChannel[] {
    return [...this.publicationChannels].sort((a, b) => a.label.localeCompare(b.label));
  }

  get selectedBranchId(): number | null {
    return this.publicationChannels.find((channel) => channel.selected)?.branchId || null;
  }

  get selectedBranchLabel(): string {
    return this.publicationChannels.find((channel) => channel.selected)?.label || '';
  }

  get totalOnlineScreens(): number {
    return this.projectScreens.filter((screen) => screen.status === 'online').length;
  }

  get totalOfflineScreens(): number {
    return this.projectScreens.filter((screen) => screen.status === 'offline').length;
  }

  getScreenInitials(value: string): string {
    const parts = String(value || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);
    if (!parts.length) {
      return 'SC';
    }
    return parts.map((part) => part.charAt(0).toUpperCase()).join('');
  }

  getScreenStatusLabel(status: ProjectScreenStatus): string {
    return this.screenStatusOptions.find((option) => option.id === status)?.label || 'Borrador';
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
    return `dashManqu/landing-prueba-api.html?apiBase=${apiBase}&projectId=${this.currentProjectId}`;
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
    const absoluteUrl = new URL(this.landingManualUrl, `${window.location.origin}/`).toString();
    await navigator.clipboard.writeText(absoluteUrl);
    this.saveFeedback = 'URL de landing copiada.';
  }

  openLandingWithProjectId(): void {
    if (!this.currentProjectId || typeof window === 'undefined') {
      return;
    }
    const absoluteUrl = new URL(this.landingManualUrl, `${window.location.origin}/`).toString();
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
    this.isLoadingSavedProjects = true;
    this.savedProjectsError = '';
    try {
      let rows: Array<Record<string, unknown>> = [];

      if (token) {
        try {
          const response = await firstValueFrom(
            this.http.get<{ data?: Array<Record<string, unknown>> }>(
              `${this.getApiBaseUrl()}/api/dash-manquehue/projects`,
              { headers: this.buildJsonHeaders(token) }
            )
          );
          rows = Array.isArray(response?.data) ? response.data : [];
        } catch (privateError) {
          console.warn('[NuevoProyectoUI] private projects list failed, trying public fallback', privateError);
        }
      }

      if (!rows.length) {
        const publicResponse = await firstValueFrom(
          this.http.get<{ data?: Array<Record<string, unknown>> }>(
            `${this.resolvePublicApiBaseUrl()}/api/dash-manquehue/public/projects?limit=200`
          )
        );
        rows = Array.isArray(publicResponse?.data) ? publicResponse.data : [];
      }

      this.savedProjects = rows.map((row) => ({
        id: Number(row['id'] || row['projectId'] || 0),
        nombre: String(row['nombre'] || `Proyecto ${row['id'] || row['projectId'] || ''}`),
        status: String(row['status'] || 'draft'),
        updatedAt: row['updated_at'] ? String(row['updated_at']) : (row['updatedAt'] ? String(row['updatedAt']) : null)
      })).filter((row) => row.id > 0);

      if (!this.selectedProjectPickerId && this.currentProjectId) {
        this.selectedProjectPickerId = String(this.currentProjectId);
      }
      if (!token) {
        this.savedProjectsError = 'Lista cargada en modo público. Para editar un proyecto existente necesitas iniciar sesión.';
      }
      console.log('[NuevoProyectoUI] saved projects loaded', { total: this.savedProjects.length });
    } catch (error) {
      console.error('[NuevoProyectoUI] loadSavedProjects error', error);
      this.savedProjects = [];
      this.savedProjectsError = 'No se pudieron cargar los proyectos guardados ni la lista pública.';
    } finally {
      this.isLoadingSavedProjects = false;
    }
  }

  async selectSavedProject(
    projectId: number,
    options: { suppressNotFoundMessage?: boolean } = {}
  ): Promise<'loaded' | 'not_found' | 'error'> {
    if (!projectId) {
      return 'error';
    }
    const token = this.getAccessToken();
    console.log('[NuevoProyectoUI] selectSavedProject start', {
      projectId,
      hasAccessToken: Boolean(token),
      hasRefreshToken: Boolean(this.getRefreshToken()),
      tokenPreview: token ? `${token.slice(0, 12)}...` : null,
      suppressNotFoundMessage: Boolean(options.suppressNotFoundMessage)
    });
    if (!token) {
      this.savedProjectsError = 'Sesión inválida para cargar proyecto.';
      return 'error';
    }
    this.isLoadingSavedProjects = true;
    this.savedProjectsError = '';
    try {
      let sessionToken = token;
      let response: { data?: Record<string, unknown> } | undefined;

      try {
        console.log('[NuevoProyectoUI] selectSavedProject request', {
          projectId,
          endpoint: `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}`,
          attempt: 'initial'
        });
        response = await firstValueFrom(
          this.http.get<{ data?: Record<string, unknown> }>(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}`,
            { headers: this.buildJsonHeaders(sessionToken) }
          )
        );
      } catch (error) {
        console.warn('[NuevoProyectoUI] selectSavedProject initial request failed', {
          projectId,
          status: error instanceof HttpErrorResponse ? error.status : null,
          message: error instanceof HttpErrorResponse ? error.message : String(error)
        });
        if (error instanceof HttpErrorResponse && error.status === 401) {
          const refreshedToken = await this.refreshDashSession();
          if (!refreshedToken) {
            this.savedProjectsError = 'Tu sesión expiró. Vuelve a iniciar sesión para editar proyectos.';
            return 'error';
          }
          sessionToken = refreshedToken;
          console.log('[NuevoProyectoUI] selectSavedProject retry after refresh', {
            projectId,
            endpoint: `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}`
          });
          response = await firstValueFrom(
            this.http.get<{ data?: Record<string, unknown> }>(
              `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}`,
              { headers: this.buildJsonHeaders(sessionToken) }
            )
          );
        } else {
          throw error;
        }
      }

      const data = (response?.data || {}) as Record<string, unknown>;
      this.currentProjectId = projectId;
      this.selectedProjectPickerId = String(projectId);
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
      await this.loadStep1Resources(projectId, sessionToken);
      await this.loadStep2Resources(projectId, sessionToken);
      await this.loadStep3Resources(projectId, sessionToken);
      await this.loadStep4Resources(projectId, sessionToken);
      await this.loadStep5Resources(projectId, sessionToken);
      this.saveFeedback = `Proyecto #${projectId} cargado correctamente.`;
      console.log('[NuevoProyectoUI] saved project selected', { projectId, data });
      this.closeSavedProjectsModal();
      return 'loaded';
    } catch (error) {
      console.error('[NuevoProyectoUI] selectSavedProject error', error);
      if (error instanceof HttpErrorResponse && error.status === 404) {
        if (!options.suppressNotFoundMessage) {
          this.savedProjectsError = `El proyecto #${projectId} no existe.`;
        }
        return 'not_found';
      }
      this.savedProjectsError = 'No se pudo cargar el proyecto seleccionado.';
      return 'error';
    } finally {
      this.isLoadingSavedProjects = false;
    }
  }

  async refreshProjectPicker(): Promise<void> {
    await this.loadSavedProjects();
    this.saveFeedback = this.savedProjects.length
      ? `${this.savedProjects.length} proyecto(s) disponibles.`
      : 'No hay proyectos guardados todavía.';
  }

  async loadProjectFromPicker(): Promise<void> {
    const projectId = this.parseProjectPickerId(this.selectedProjectPickerId);
    console.log('[NuevoProyectoUI] loadProjectFromPicker start', {
      requestedProjectId: projectId,
      selectedProjectPickerId: this.selectedProjectPickerId,
      savedProjectsCount: this.savedProjects.length,
      hasAccessToken: Boolean(this.getAccessToken()),
      hasRefreshToken: Boolean(this.getRefreshToken()),
      apiBaseUrl: this.getApiBaseUrl(),
      publicApiBaseUrl: this.resolvePublicApiBaseUrl()
    });
    if (!projectId) {
      this.saveFeedback = 'Selecciona un ID para cargar.';
      return;
    }

    if (!this.savedProjects.length && this.getAccessToken()) {
      await this.loadSavedProjects();
    }

    const exists = this.savedProjects.some((project) => project.id === projectId);
    if (exists) {
      await this.selectSavedProject(projectId);
      return;
    }

    const directLoadResult = await this.selectSavedProject(projectId, { suppressNotFoundMessage: true });
    if (directLoadResult === 'loaded') {
      return;
    }
    if (directLoadResult === 'error') {
      this.saveFeedback = '';
      return;
    }

    this.pendingNewProjectId = projectId;
    this.isCreateProjectModalOpen = true;
  }

  async requestNewProjectFromInput(): Promise<void> {
    const projectId = this.parseProjectPickerId(this.newProjectCandidateId);
    if (!projectId) {
      this.saveFeedback = 'Escribe un ID válido para el nuevo proyecto.';
      return;
    }

    if (!this.savedProjects.length && this.getAccessToken()) {
      await this.loadSavedProjects();
    }

    const exists = this.savedProjects.some((project) => project.id === projectId);
    if (exists) {
      this.selectedProjectPickerId = String(projectId);
      this.saveFeedback = `El proyecto #${projectId} ya existe. Selecciónalo desde la lista y cárgalo.`;
      return;
    }

    this.pendingNewProjectId = projectId;
    this.isCreateProjectModalOpen = true;
  }

  closeCreateProjectModal(): void {
    this.isCreateProjectModalOpen = false;
    this.pendingNewProjectId = null;
  }

  confirmCreateProjectFromModal(): void {
    const projectId = this.pendingNewProjectId;
    this.closeCreateProjectModal();
    this.resetFormForNewProject();
    this.newProjectCandidateId = projectId ? String(projectId) : '';
    this.saveFeedback = projectId
      ? `Proyecto nuevo preparado desde el ID #${projectId}. La BD asignará el próximo ID disponible al guardar.`
      : 'Proyecto nuevo preparado. La BD asignará el próximo ID disponible al guardar.';
  }

  createNewProjectId(): void {
    this.resetFormForNewProject();
    this.newProjectCandidateId = '';
    this.saveFeedback = 'Formulario desacoplado del proyecto actual. Al guardar se creará un nuevo ID.';
  }

  private parseProjectPickerId(value: string | number | null | undefined): number {
    const normalized = String(value ?? '').trim();
    if (!normalized) {
      return 0;
    }
    const digitsOnly = normalized.replace(/[^\d]/g, '');
    const projectId = Number(digitsOnly);
    return Number.isInteger(projectId) && projectId > 0 ? projectId : 0;
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
        hasHeroVideoFile: Boolean(this.heroVideoFile),
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

        if (this.heroVideoFile) {
          console.log('[NuevoProyectoUI] upload hero video start', {
            projectId,
            name: this.heroVideoFile.name,
            size: this.heroVideoFile.size
          });
          await this.uploadStep1File(projectId, token, this.heroVideoFile, 'hero-video');
          this.heroVideoFile = null;
          console.log('[NuevoProyectoUI] upload hero video ok', { projectId });
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

      if (this.currentStep === 3) {
        await this.saveStep3Resources(projectId, token);
      }

      if (this.currentStep === 4) {
        await this.saveStep4Resources(projectId, token);
      }

      if (this.currentStep === 5) {
        await this.saveStep5Resources(projectId, token);
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
      publicationChannels: this.publicationChannels,
      selectedBranchId: this.selectedBranchId,
      selectedBranchLabel: this.selectedBranchLabel || null,
      projectScreens: this.projectScreens
    };
  }

  private createEmptyProjectScreen(overrides: Partial<ProjectScreen> = {}): ProjectScreen {
    const nextIndex = Number(overrides.sortOrder || this.projectScreens.length + 1) || 1;
    return {
      localId: `screen-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      id: null,
      branchId: null,
      branchName: '',
      screenName: `Pantalla ${nextIndex}`,
      screenCode: '',
      locationLabel: '',
      status: 'draft',
      deviceModel: 'Touch 50',
      operatingSystem: 'Windows 11 Pro',
      resolution: '1920 x 1080',
      orientation: 'horizontal',
      connectivity: 'Ethernet',
      responsibleName: '',
      responsibleRole: '',
      responsibleEmail: '',
      responsiblePhone: '',
      lastSyncAt: '',
      lastActivityAt: '',
      notes: '',
      sortOrder: nextIndex,
      ...overrides
    };
  }

  private parseBranchId(value: string | number | null | undefined): number | null {
    const parsed = Number(value || 0);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }

  private normalizeDateTimeLocal(value: unknown): string {
    const raw = String(value || '').trim();
    if (!raw) {
      return '';
    }
    const normalized = raw.replace(' ', 'T');
    const parsed = new Date(normalized);
    if (Number.isNaN(parsed.getTime())) {
      return normalized.slice(0, 16);
    }
    const local = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  private buildPublicationChannelsFromRows(
    rows: Array<Record<string, unknown>>,
    selectedBranchId: number | null = null
  ): PublicationChannel[] {
    if (!rows.length) {
      return this.publicationChannels.map((channel) => ({
        ...channel,
        selected: selectedBranchId !== null && channel.branchId === selectedBranchId
      }));
    }
    return rows.map((row, index) => {
      const branchId = Number(row['id'] || 0) || null;
      const label = String(row['name'] || '').trim() || `Sucursal ${index + 1}`;
      return {
        id: String(row['code'] || this.slugifyValue(label) || `branch-${branchId || index + 1}`),
        label,
        description: 'Sucursal',
        selected: selectedBranchId !== null ? branchId === selectedBranchId : index === 0,
        branchId,
        code: String(row['code'] || '') || null
      };
    });
  }

  private async loadBranchChannels(token: string, selectedBranchId: number | null = null): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ data?: Array<Record<string, unknown>> }>(
          `${this.getApiBaseUrl()}/api/dash-manquehue/projects/branches`,
          { headers: this.buildJsonHeaders(token) }
        )
      );
      const rows = Array.isArray(response?.data) ? response.data : [];
      this.publicationChannels = this.buildPublicationChannelsFromRows(rows, selectedBranchId);
      if (selectedBranchId) {
        this.branchSearch = String(selectedBranchId);
      } else if (this.selectedBranchId) {
        this.branchSearch = String(this.selectedBranchId);
      }
    } catch (error) {
      console.error('[NuevoProyectoUI] loadBranchChannels error', error);
    }
  }

  private async uploadStep1File(
    projectId: number,
    token: string,
    file: File,
    endpoint: 'cover-image' | 'hero-video' | 'ambient-audio'
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

  private async loadStep1Resources(projectId: number, token: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ data?: Record<string, unknown> | null }>(
          `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/files/step1-media`,
          { headers: this.buildJsonHeaders(token) }
        )
      );

      const data = (response?.data || {}) as Record<string, unknown>;
      const cover = (data['cover'] || null) as Record<string, unknown> | null;
      const heroVideo = (data['heroVideo'] || null) as Record<string, unknown> | null;
      const ambientAudio = (data['ambientAudio'] || null) as Record<string, unknown> | null;

      if (this.coverImagePreviewUrl) {
        URL.revokeObjectURL(this.coverImagePreviewUrl);
      }
      if (this.heroVideoPreviewUrl) {
        URL.revokeObjectURL(this.heroVideoPreviewUrl);
      }

      this.coverImageFile = null;
      this.heroVideoFile = null;
      this.ambientAudioFile = null;
      this.project.coverImage = String(cover?.['original_name'] || '');
      this.project.heroVideo = String(heroVideo?.['original_name'] || '');
      this.project.ambientAudio = String(ambientAudio?.['original_name'] || '');
      this.coverImagePreviewUrl = String(cover?.['url'] || '') || null;
      this.heroVideoPreviewUrl = String(heroVideo?.['url'] || '') || null;
    } catch (error) {
      console.error('[NuevoProyectoUI] loadStep1Resources error', error);
    }
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

  private async saveStep3Resources(projectId: number, token: string): Promise<void> {
    const documentEndpoints: Array<{ key: MediaAssetKey; endpoint: 'masterplan' | 'brochure' | 'legal' }> = [
      { key: 'masterPlan', endpoint: 'masterplan' },
      { key: 'brochure', endpoint: 'brochure' },
      { key: 'legalDocs', endpoint: 'legal' }
    ];

    for (const entry of documentEndpoints) {
      const file = this.step3AssetFiles[entry.key];
      if (!file) {
        continue;
      }
      const formData = new FormData();
      formData.append('file', file);
      await firstValueFrom(
        this.http.post(
          `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/files/${entry.endpoint}`,
          formData,
          { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
        )
      );
      this.step3AssetFiles[entry.key] = null;
    }

    if (this.pendingGalleryFiles.length > 0) {
      const galleryData = new FormData();
      this.pendingGalleryFiles.forEach((file) => galleryData.append('files', file));
      await firstValueFrom(
        this.http.post(
          `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/files/gallery`,
          galleryData,
          { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
        )
      );
      this.pendingGalleryFiles = [];
    }

    await firstValueFrom(
      this.http.patch(
        `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/content`,
        {
          videoTourUrl: this.contentPlan.videoUrl?.trim() || null
        },
        { headers: this.buildJsonHeaders(token) }
      )
    );

    await this.loadStep3Resources(projectId, token);
  }

  private async loadStep3Resources(projectId: number, token: string): Promise<void> {
    try {
      const [documentsResponse, galleryResponse, contentResponse] = await Promise.all([
        firstValueFrom(
          this.http.get<{ data?: Array<Record<string, unknown>> }>(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/files/documents`,
            { headers: this.buildJsonHeaders(token) }
          )
        ),
        firstValueFrom(
          this.http.get<{ data?: Array<Record<string, unknown>> }>(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/files/gallery`,
            { headers: this.buildJsonHeaders(token) }
          )
        ),
        firstValueFrom(
          this.http.get<{ data?: Record<string, unknown> | null }>(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/content`,
            { headers: this.buildJsonHeaders(token) }
          )
        )
      ]);

      const documents = Array.isArray(documentsResponse?.data) ? documentsResponse.data : [];
      const gallery = Array.isArray(galleryResponse?.data) ? galleryResponse.data : [];
      const content = (contentResponse?.data || null) as Record<string, unknown> | null;
      const pickName = (category: string) =>
        String(
          documents.find((row) => String(row['file_category'] || '') === category)?.['original_name'] || ''
        );

      this.mediaAssets.masterPlan = pickName('masterplan');
      this.mediaAssets.brochure = pickName('brochure');
      this.mediaAssets.legalDocs = pickName('legal_document');
      this.mediaGallery = gallery.map((row) => String(row['original_name'] || '')).filter(Boolean);
      this.contentPlan.videoUrl = String(content?.['video_tour_url'] || this.contentPlan.videoUrl || '');
      this.pendingGalleryFiles = [];
      this.step3AssetFiles.masterPlan = null;
      this.step3AssetFiles.brochure = null;
      this.step3AssetFiles.legalDocs = null;
    } catch (error) {
      console.error('[NuevoProyectoUI] loadStep3Resources error', error);
    }
  }

  private async saveStep4Resources(projectId: number, token: string): Promise<void> {
    this.ensureDifferentiatorMediaStatesLength(this.contentPlan.sellingPoints.length);
    await firstValueFrom(
      this.http.patch(
        `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/content`,
        {
          headlinePrincipal: this.contentPlan.heroHeadline?.trim() || null,
          subtituloInspiracional: this.contentPlan.heroTagline?.trim() || null,
          narrativaComercial: this.contentPlan.narrative?.trim() || null,
          ctaPrincipal: this.contentPlan.ctaLabel?.trim() || null,
          videoTourUrl: this.contentPlan.videoUrl?.trim() || null
        },
        { headers: this.buildJsonHeaders(token) }
      )
    );

    await firstValueFrom(
      this.http.put(
        `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/differentiators`,
        {
          items: (this.contentPlan.sellingPoints || [])
            .map((item) => String(item || '').trim())
            .filter(Boolean)
            .map((text) => ({ text }))
        },
        { headers: this.buildJsonHeaders(token) }
      )
    );

    for (let i = 0; i < this.differentiatorMediaStates.length; i += 1) {
      const slot = this.differentiatorMediaStates[i];
      const position = i + 1;
      if (slot.removeMedia && slot.media?.fileId) {
        await firstValueFrom(
          this.http.delete(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/differentiators/${position}/media`,
            { headers: this.buildJsonHeaders(token) }
          )
        );
        slot.media = null;
        slot.removeMedia = false;
      }
      if (slot.pendingFile) {
        const uploadedFile = slot.pendingFile;
        const previewUrl = slot.pendingPreviewUrl;
        const mediaType = slot.pendingMediaType || (uploadedFile.type.startsWith('video/') ? 'video' : 'image');
        const formData = new FormData();
        formData.append('file', uploadedFile);
        const response = await firstValueFrom(
          this.http.post<{ data?: { fileId?: number } }>(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/differentiators/${position}/media`,
            formData,
            { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
          )
        );
        slot.media = {
          fileId: Number(response?.data?.fileId || 0) || null,
          url: previewUrl || slot.media?.url || '',
          name: uploadedFile.name,
          mimeType: uploadedFile.type,
          type: mediaType
        };
        slot.pendingFile = null;
        slot.pendingPreviewUrl = null;
        slot.pendingMediaType = null;
      }
    }
  }

  private async loadStep4Resources(projectId: number, token: string): Promise<void> {
    try {
      const [contentResponse, differentiatorsResponse] = await Promise.all([
        firstValueFrom(
          this.http.get<{ data?: Record<string, unknown> | null }>(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/content`,
            { headers: this.buildJsonHeaders(token) }
          )
        ),
        firstValueFrom(
          this.http.get<{ data?: Array<Record<string, unknown>> }>(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/differentiators`,
            { headers: this.buildJsonHeaders(token) }
          )
        )
      ]);

      const content = contentResponse?.data || null;
      if (content) {
        this.contentPlan.heroHeadline = String(content['headline_principal'] || this.contentPlan.heroHeadline || '');
        this.contentPlan.heroTagline = String(
          content['subtitulo_inspiracional'] || this.contentPlan.heroTagline || ''
        );
        this.contentPlan.narrative = String(content['narrativa_comercial'] || this.contentPlan.narrative || '');
        this.contentPlan.ctaLabel = String(content['cta_principal'] || this.contentPlan.ctaLabel || '');
        this.contentPlan.videoUrl = String(content['video_tour_url'] || this.contentPlan.videoUrl || '');
      }

      const differentiators = Array.isArray(differentiatorsResponse?.data) ? differentiatorsResponse.data : [];
      const points = differentiators
        .map((row) => String(row['text'] || row['label'] || ''))
        .map((text) => text.trim())
        .filter(Boolean);
      if (points.length > 0) {
        this.contentPlan.sellingPoints = points;
      }
      this.ensureDifferentiatorMediaStatesLength(this.contentPlan.sellingPoints.length);
      this.differentiatorMediaStates.forEach((slot) => {
        this.revokeDifferentiatorPreview(slot);
        slot.media = null;
        slot.pendingFile = null;
        slot.pendingPreviewUrl = null;
        slot.pendingMediaType = null;
        slot.removeMedia = false;
      });
      differentiators.forEach((row, index) => {
        const sortOrder = Number(row['sort_order'] || index + 1);
        const slot = this.differentiatorMediaStates[Math.max(sortOrder - 1, 0)];
        if (!slot) {
          return;
        }
        const media = this.mapTypologyMediaFromApi(row['media']);
        slot.media = media;
      });
    } catch (error) {
      console.error('[NuevoProyectoUI] loadStep4Resources error', error);
    }
  }

  private async saveStep5Resources(projectId: number, token: string): Promise<void> {
    const selectedBranchId =
      this.selectedBranchId ||
      this.projectScreens.find((screen) => screen.branchId)?.branchId ||
      null;

    await firstValueFrom(
      this.http.patch(
        `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/publish-config`,
        {
          automationEnabled: this.publicationSettingsEnabled,
          notifySalesTeam: this.publicationSettings.notifyTeam,
          finalNotes: this.publicationSettings.remarks?.trim() || null,
          selectedBranchId,
          publicationMode: 'manual'
        },
        { headers: this.buildJsonHeaders(token) }
      )
    );

    await firstValueFrom(
      this.http.put(
        `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/screens`,
        {
          screens: this.projectScreens
            .map((screen, index) => ({
              ...screen,
              branchId: screen.branchId || selectedBranchId,
              sortOrder: index + 1
            }))
            .filter((screen) =>
              Boolean(
                screen.branchId ||
                  screen.screenName?.trim() ||
                  screen.locationLabel?.trim() ||
                  screen.responsibleName?.trim()
              )
            )
        },
        { headers: this.buildJsonHeaders(token) }
      )
    );
  }

  private async loadStep5Resources(projectId: number, token: string): Promise<void> {
    try {
      const [publishConfigResponse, screensResponse, branchesResponse] = await Promise.all([
        firstValueFrom(
          this.http.get<{ data?: Record<string, unknown> | null }>(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/publish-config`,
            { headers: this.buildJsonHeaders(token) }
          )
        ),
        firstValueFrom(
          this.http.get<{ data?: Array<Record<string, unknown>> }>(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/${projectId}/screens`,
            { headers: this.buildJsonHeaders(token) }
          )
        ),
        firstValueFrom(
          this.http.get<{ data?: Array<Record<string, unknown>> }>(
            `${this.getApiBaseUrl()}/api/dash-manquehue/projects/branches`,
            { headers: this.buildJsonHeaders(token) }
          )
        )
      ]);

      const publishConfig = (publishConfigResponse?.data || {}) as Record<string, unknown>;
      const selectedBranchId = this.parseBranchId(publishConfig['selected_branch_id'] || publishConfig['selectedBranchId']);
      const branchRows = Array.isArray(branchesResponse?.data) ? branchesResponse.data : [];
      const screenRows = Array.isArray(screensResponse?.data) ? screensResponse.data : [];

      this.publicationChannels = this.buildPublicationChannelsFromRows(branchRows, selectedBranchId);

      screenRows.forEach((row) => {
        const branchId = this.parseBranchId(row['branchId']);
        const branchName = String(row['branchName'] || '').trim();
        if (branchId && branchName && !this.publicationChannels.some((channel) => channel.branchId === branchId)) {
          this.publicationChannels = [
            ...this.publicationChannels,
            {
              id: String(row['branchCode'] || this.slugifyValue(branchName)),
              label: branchName,
              description: 'Sucursal',
              selected: branchId === selectedBranchId,
              branchId,
              code: String(row['branchCode'] || '') || null
            }
          ];
        }
      });

      this.publicationSettingsEnabled = Boolean(
        publishConfig['automation_enabled'] ?? publishConfig['automationEnabled'] ?? true
      );
      this.publicationSettings = {
        ...this.publicationSettings,
        scheduleDate: '',
        scheduleTime: '',
        notifyTeam: Boolean(publishConfig['notify_sales_team'] ?? publishConfig['notifySalesTeam'] ?? true),
        remarks: String(publishConfig['final_notes'] || publishConfig['finalNotes'] || '')
      };
      this.branchSearch = selectedBranchId ? String(selectedBranchId) : '';
      if (selectedBranchId) {
        this.selectBranchChannel(selectedBranchId);
      }

      this.projectScreens = screenRows.length
        ? screenRows.map((row, index) =>
            this.createEmptyProjectScreen({
              localId: `screen-${row['id'] || index + 1}`,
              id: Number(row['id'] || 0) || null,
              branchId: this.parseBranchId(row['branchId']),
              branchName: String(row['branchName'] || ''),
              screenName: String(row['screenName'] || ''),
              screenCode: String(row['screenCode'] || ''),
              locationLabel: String(row['locationLabel'] || ''),
              status: (String(row['status'] || 'draft') as ProjectScreenStatus),
              deviceModel: String(row['deviceModel'] || ''),
              operatingSystem: String(row['operatingSystem'] || ''),
              resolution: String(row['resolution'] || ''),
              orientation: (String(row['orientation'] || 'horizontal') as ProjectScreenOrientation),
              connectivity: String(row['connectivity'] || ''),
              responsibleName: String(row['responsibleName'] || ''),
              responsibleRole: String(row['responsibleRole'] || ''),
              responsibleEmail: String(row['responsibleEmail'] || ''),
              responsiblePhone: String(row['responsiblePhone'] || ''),
              lastSyncAt: this.normalizeDateTimeLocal(row['lastSyncAt']),
              lastActivityAt: this.normalizeDateTimeLocal(row['lastActivityAt']),
              notes: String(row['notes'] || ''),
              sortOrder: Number(row['sortOrder'] || index + 1) || index + 1
            })
          )
        : [this.createEmptyProjectScreen({ branchId: selectedBranchId, branchName: this.selectedBranchLabel })];
    } catch (error) {
      console.error('[NuevoProyectoUI] loadStep5Resources error', error);
    }
  }

  private ensureDifferentiatorMediaStatesLength(length: number): void {
    const normalizedLength = Math.max(Number(length) || 0, 0);
    while (this.differentiatorMediaStates.length < normalizedLength) {
      this.differentiatorMediaStates.push({
        media: null,
        pendingFile: null,
        pendingPreviewUrl: null,
        pendingMediaType: null,
        removeMedia: false
      });
    }
    if (this.differentiatorMediaStates.length > normalizedLength) {
      this.differentiatorMediaStates
        .slice(normalizedLength)
        .forEach((slot) => this.revokeDifferentiatorPreview(slot));
      this.differentiatorMediaStates = this.differentiatorMediaStates.slice(0, normalizedLength);
    }
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

  private getRefreshToken(): string {
    if (typeof window === 'undefined') {
      return '';
    }
    return localStorage.getItem('imanquehue_refresh_token') || '';
  }

  private async refreshDashSession(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    console.log('[NuevoProyectoUI] refreshDashSession start', {
      hasRefreshToken: Boolean(refreshToken),
      endpoint: `${this.getApiBaseUrl()}/api/dash-manquehue/auth/refresh`
    });
    if (!refreshToken) {
      return '';
    }

    try {
      const response = await firstValueFrom(
        this.http.post<{
          data?: { accessToken?: string; refreshToken?: string; user?: unknown };
        }>(
          `${this.getApiBaseUrl()}/api/dash-manquehue/auth/refresh`,
          { refreshToken }
        )
      );

      const accessToken = String(response?.data?.accessToken || '');
      const nextRefreshToken = String(response?.data?.refreshToken || refreshToken);
      if (!accessToken || typeof window === 'undefined') {
        console.warn('[NuevoProyectoUI] refreshDashSession empty access token', {
          hasAccessToken: Boolean(accessToken)
        });
        return '';
      }

      localStorage.setItem('imanquehue_access_token', accessToken);
      localStorage.setItem('imanquehue_refresh_token', nextRefreshToken);
      if (response?.data?.user) {
        localStorage.setItem('imanquehue_user', JSON.stringify(response.data.user));
      }
      console.log('[NuevoProyectoUI] refreshDashSession success', {
        accessTokenPreview: `${accessToken.slice(0, 12)}...`,
        hasUser: Boolean(response?.data?.user)
      });
      return accessToken;
    } catch (error) {
      console.error('[NuevoProyectoUI] refreshDashSession error', error);
      return '';
    }
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

  private clearStoredProjectId(): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem('imanquehue_current_project_id');
  }

  private resetFormForNewProject(): void {
    this.currentProjectId = null;
    this.selectedProjectPickerId = '';
    this.clearStoredProjectId();
    this.currentStep = 1;
    this.savedProjectsError = '';

    if (this.coverImagePreviewUrl) {
      URL.revokeObjectURL(this.coverImagePreviewUrl);
    }
    if (this.heroVideoPreviewUrl) {
      URL.revokeObjectURL(this.heroVideoPreviewUrl);
    }
    this.coverImagePreviewUrl = null;
    this.heroVideoPreviewUrl = null;
    this.coverImageFile = null;
    this.heroVideoFile = null;
    this.ambientAudioFile = null;
    this.pendingGalleryFiles = [];
    this.step3AssetFiles = {
      masterPlan: null,
      brochure: null,
      legalDocs: null
    };

    this.project = {
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
      heroVideo: '',
      ambientAudio: ''
    };
    this.timings = {
      preVenta: 5,
      recorrido: 10,
      postVenta: 15
    };
    this.unitConfig = {
      totalUnits: 120,
      availableUnits: 2,
      deliveryQuarter: 'Q4 · 2025',
      stage: '2D / 2B',
      parkingRatio: 1.2,
      storageIncluded: true,
      petFriendly: true,
      observation: ''
    };
    this.mediaAssets = {
      masterPlan: '',
      brochure: '',
      legalDocs: ''
    };
    this.mediaGallery = [];
    this.contentPlan = {
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
    this.publicationSettings = {
      scheduleDate: '',
      scheduleTime: '',
      notifyTeam: true,
      autoTranslate: false,
      remarks: ''
    };
    this.publicationSettingsEnabled = true;
    this.publicationChannels = [
      { id: 'residencial-las-condes', label: 'Residencial Las Condes', description: 'Sucursal', selected: true, branchId: null },
      { id: 'casa-familiar-providencia', label: 'Casa Familiar Providencia', description: 'Sucursal', selected: false, branchId: null },
      { id: 'cancha-deportiva-maipu', label: 'Cancha Deportiva Maipu', description: 'Sucursal', selected: false, branchId: null },
      { id: 'edificio-corporativo-santiago-centro', label: 'Edificio Corporativo Santiago Centro', description: 'Sucursal', selected: false, branchId: null },
      { id: 'villa-residencial-nunoa', label: 'Villa Residencial Nunoa', description: 'Sucursal', selected: false, branchId: null },
      { id: 'centro-comercial-las-condes', label: 'Centro Comercial Las Condes', description: 'Sucursal', selected: false, branchId: null }
    ];
    this.branchSearch = '';
    this.newBranchName = '';
    this.projectScreens = [this.createEmptyProjectScreen()];
    this.modelAssociations = [
      { typology: '2D / 2B', model: 'Azotea' },
      { typology: '3D / 3B', model: 'Jardín' }
    ];

    this.typologyOptions.forEach((option) => {
      this.revokeTypologyPreview(option);
      this.revokeTypologyBlueprintPreview(option);
      option.selected = option.id === '2d1b' || option.id === '2d2b';
      option.media = null;
      option.pendingFile = null;
      option.pendingPreviewUrl = null;
      option.pendingMediaType = null;
      option.removeMedia = false;
      option.blueprint = null;
      option.pendingBlueprintFile = null;
      option.pendingBlueprintPreviewUrl = null;
      option.removeBlueprint = false;
    });

    const defaultAmenityIds = new Set(['cowork', 'gourmet', 'gym', 'pool']);
    this.amenityOptions = this.amenityOptions.map((option) => ({
      ...option,
      selected: defaultAmenityIds.has(option.id)
    }));

    this.differentiatorMediaStates.forEach((slot) => this.revokeDifferentiatorPreview(slot));
    this.differentiatorMediaStates = [];
    this.ensureDifferentiatorMediaStatesLength(this.contentPlan.sellingPoints.length);
  }

  ngOnDestroy(): void {
    if (this.coverImagePreviewUrl) {
      URL.revokeObjectURL(this.coverImagePreviewUrl);
    }
    if (this.heroVideoPreviewUrl) {
      URL.revokeObjectURL(this.heroVideoPreviewUrl);
    }
    this.typologyOptions.forEach((option) => {
      this.revokeTypologyPreview(option);
      this.revokeTypologyBlueprintPreview(option);
    });
    this.differentiatorMediaStates.forEach((slot) => this.revokeDifferentiatorPreview(slot));
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

  private revokeDifferentiatorPreview(slot: DifferentiatorMediaState): void {
    if (slot.pendingPreviewUrl) {
      URL.revokeObjectURL(slot.pendingPreviewUrl);
    }
  }
}

