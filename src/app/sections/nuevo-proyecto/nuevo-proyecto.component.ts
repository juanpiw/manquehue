import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-nuevo-proyecto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-proyecto.component.html',
  styleUrl: './nuevo-proyecto.component.scss'
})
export class NuevoProyectoComponent {
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
      label: 'Terreno / Lote',
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
  readonly deliveryOptions = ['Entrega inmediata', 'En verde', 'En blanco'];
  readonly typologyOptions = [
    { id: 'studio', label: 'Studio / 1B', selected: false },
    { id: 'onePlus', label: '1D + Flex', selected: true },
    { id: 'two', label: '2D / 2B', selected: true },
    { id: 'three', label: '3D / 3B', selected: false }
  ];
  readonly amenityOptions = [
    { id: 'cowork', label: 'Cowork panorámico', selected: true },
    { id: 'skyPool', label: 'Sky pool climatizada', selected: true },
    { id: 'gourmet', label: 'Sala gourmet', selected: false },
    { id: 'fitness', label: 'Fitness 24/7', selected: true },
    { id: 'petSpa', label: 'Pet spa', selected: false }
  ];
  readonly publicationChannels = [
    { id: 'web', label: 'Web Manquehue', description: 'Impact Render Studios', selected: true },
    { id: 'kiosko', label: 'Kioskos VR', description: 'Salas físicas', selected: false },
    { id: 'email', label: 'Email marketing', description: 'Base clientes', selected: false },
    { id: 'social', label: 'Social Ads', description: 'Meta + LinkedIn', selected: true }
  ];

  currentStep = 1;
  project = {
    name: '',
    description: '',
    propertyType: 'apartment',
    estado: this.deliveryOptions[0],
    orientacion: '',
    ubicacion: '',
    puntoCercano: '',
    puntoCercano2: '',
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
    towers: 2,
    deliveryQuarter: 'Q4 · 2025',
    defaultTypology: '2D / 2B',
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
      this.project[key] = input.files[0].name;
    }
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

  saveDraft() {
    console.log('Guardando borrador', this.project);
  }

  cancel() {
    console.log('Cancelado');
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
}

