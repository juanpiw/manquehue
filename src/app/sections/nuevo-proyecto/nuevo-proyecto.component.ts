import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepIndicatorComponent, Step } from '../../shared/step-indicator/step-indicator.component';
import { ProjectTypeSelectorComponent } from '../../shared/project-type-selector/project-type-selector.component';
import { inputComponent } from '../../shared/input/input.component';
import { TextareaComponent } from '../../shared/textarea/textarea.component';
import { NumberDropdownComponent } from '../../shared/number-dropdown/number-dropdown.component';
import { InfoTooltipComponent, InfoTooltipData } from '../../shared/info-tooltip/info-tooltip.component';
import { DropdownComponent, DropdownOption } from '../../shared/dropdown/dropdown.component';
import { FileUploadComponent } from '../../shared/file-upload/file-upload.component';
import { ImageManagerComponent } from '../../shared/image-manager/image-manager.component';
import { ActionButtonsComponent } from '../../shared/action-buttons/action-buttons.component';
import { AddMoreComponent } from '../../shared/add-more/add-more.component';
import { TranslatePipe } from '../../i18n/t.pipe';

@Component({
  selector: 'app-nuevo-proyecto',
  standalone: true,
  imports: [
    CommonModule, 
    StepIndicatorComponent, 
    ProjectTypeSelectorComponent,
    inputComponent,
    TextareaComponent,
    NumberDropdownComponent,
    InfoTooltipComponent,
    DropdownComponent,
    FileUploadComponent,
    ImageManagerComponent,
    ActionButtonsComponent,
    AddMoreComponent,
    TranslatePipe
  ],
  templateUrl: './nuevo-proyecto.component.html',
  styleUrl: './nuevo-proyecto.component.scss'
})
export class NuevoProyectoComponent {
  currentStep: number = 1;
  creationDate: string = new Date().toLocaleDateString();
  
  // Datos del formulario
  projectName: string = '';
  projectDescription: string = '';
  selectedProjectType: string = '';
  
  // Datos para los campos de tiempo
  tiempo1: number = 5;
  tiempo2: number = 5;
  tiempo3: number = 5;
  puntoCercano1: string = '';
  orientacion: string = '';
  puntoCercano2: string = '';
  
  // Datos para entrega
  selectedDelivery: string = 'future';
  deliveryOptions: DropdownOption[] = [
    { id: '1', value: 'immediate', label: 'common.immediate' },
    { id: '2', value: 'future', label: 'common.future' },
    { id: '3', value: 'scheduled', label: 'common.scheduled' }
  ];
  
  // Datos para tooltips
  tiempoTooltipData: InfoTooltipData = {
    title: 'Información de Tiempo',
    content: 'Ingrese el tiempo estimado en minutos para completar esta tarea o actividad.'
  };

  // Datos para el Paso 2 - Configuración de apartamentos
  apartmentQuantity: number = 2;
  projectTags: Array<{name: string}> = [
    { name: 'Europa proyecto' },
    { name: 'Europa proyecto' }
  ];
  
  // Datos del apartamento
  apartmentName: string = 'ALTO EL GOLF';
  minPrice: string = '10mll';
  maxPrice: string = '20mll';
  selectedCurrency: string = 'uf';
  squareMeters: string = '';
  floorNumber: number = 1;
  orientation: string = '';
  bathrooms: number = 1;
  rooms: number = 1;
  terraces: number = 0;
  
  // Datos para 360 Pin
  pinCoordinates: string = '';
  pinDescription: string = '';
  
  // Datos de contacto
  executiveName: string = '';
  contactPhone: string = '';
  contactEmail: string = '';
  
  // Opciones de moneda
  currencyOptions: DropdownOption[] = [
    { id: '1', value: 'uf', label: 'UF' },
    { id: '2', value: 'clp', label: 'CLP' },
    { id: '3', value: 'usd', label: 'USD' },
    { id: '4', value: 'eur', label: 'EUR' }
  ];

  // Datos para el Paso 3 - Archivos
  selectedApartment: string = '';
  selectedFloorType: string = '';
  apartmentNumber: number = 1;
  bathroomsNumber: number = 1;
  balconiesNumber: number = 0;

  // Opciones para el Paso 3
  apartmentSelectionOptions: DropdownOption[] = [
    { id: '1', value: 'apartment_1', label: 'Apartamento 1' },
    { id: '2', value: 'apartment_2', label: 'Apartamento 2' },
    { id: '3', value: 'apartment_3', label: 'Apartamento 3' },
    { id: '4', value: 'apartment_4', label: 'Apartamento 4' }
  ];

  floorTypeOptions: DropdownOption[] = [
    { id: '1', value: 'standard', label: 'Estándar' },
    { id: '2', value: 'premium', label: 'Premium' },
    { id: '3', value: 'luxury', label: 'Lujo' },
    { id: '4', value: 'penthouse', label: 'Penthouse' }
  ];

  // Opciones numéricas para Paso 3 (como dropdowns estándar)
  apartmentNumberOptions: DropdownOption[] = Array.from({ length: 100 }, (_, i) => ({
    id: String(i + 1),
    value: String(i + 1),
    label: String(i + 1)
  }));

  bathroomsNumberOptions: DropdownOption[] = Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
    value: String(i + 1),
    label: String(i + 1)
  }));

  balconiesNumberOptions: DropdownOption[] = Array.from({ length: 11 }, (_, i) => ({
    id: String(i),
    value: String(i),
    label: String(i)
  }));
  
  steps: Step[] = [
    {
      id: 1,
      title: 'nuevo_proyecto.step_1_title',
      description: 'nuevo_proyecto.step_1_description',
      completed: false,
      disabled: false
    },
    {
      id: 2,
      title: 'nuevo_proyecto.step_2_title',
      description: 'nuevo_proyecto.step_2_description',
      completed: false,
      disabled: true
    },
    {
      id: 3,
      title: 'nuevo_proyecto.step_3_title',
      description: 'nuevo_proyecto.step_3_description',
      completed: false,
      disabled: true
    },
    {
      id: 4,
      title: 'nuevo_proyecto.step_4_title',
      description: 'nuevo_proyecto.step_4_description',
      completed: false,
      disabled: true
    },
    {
      id: 5,
      title: 'nuevo_proyecto.step_5_title',
      description: 'nuevo_proyecto.step_5_description',
      completed: false,
      disabled: true
    }
  ];

  // Métodos para el step indicator
  onStepChange(stepNumber: number) {
    this.currentStep = stepNumber;
    this.updateStepsState();
  }

  onStepClick(step: Step) {
    if (!step.disabled) {
      this.currentStep = step.id;
      this.updateStepsState();
    }
  }

  private updateStepsState() {
    this.steps.forEach(step => {
      step.completed = step.id < this.currentStep;
      step.disabled = step.id > this.currentStep;
    });
  }

  nextStep() {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
      this.updateStepsState();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepsState();
    }
  }

  isStepActive(stepId: number): boolean {
    return stepId === this.currentStep;
  }

  // Métodos para los componentes del formulario
  onProjectTypeChange(type: string) {
    this.selectedProjectType = type;
    console.log('Tipo de proyecto seleccionado:', type);
  }

  onProjectTypeSelect(type: any) {
    console.log('Tipo de proyecto clickeado:', type);
  }

  onInputChange(value: any, field: string) {
    const stringValue = String(value);
    switch(field) {
      case 'projectName':
        this.projectName = stringValue;
        break;
      case 'puntoCercano1':
        this.puntoCercano1 = stringValue;
        break;
      case 'orientacion':
        this.orientacion = stringValue;
        break;
      case 'puntoCercano2':
        this.puntoCercano2 = stringValue;
        break;
    }
  }

  onTextareaChange(value: string) {
    this.projectDescription = value;
  }

  onTiempoChange(value: number, field: string) {
    switch(field) {
      case 'tiempo1':
        this.tiempo1 = value;
        break;
      case 'tiempo2':
        this.tiempo2 = value;
        break;
      case 'tiempo3':
        this.tiempo3 = value;
        break;
    }
  }

  onDeliveryChange(value: string) {
    this.selectedDelivery = value;
    console.log('Entrega seleccionada:', value);
  }

  // Métodos para el Paso 2 - Configuración de apartamentos
  onApartmentQuantityChange(value: number) {
    this.apartmentQuantity = value;
    console.log('Cantidad de apartamentos:', value);
  }

  removeProjectTag(index: number) {
    this.projectTags.splice(index, 1);
    console.log('Tag removido:', index);
  }

  onCurrencyChange(value: string) {
    this.selectedCurrency = value;
    console.log('Moneda seleccionada:', value);
  }

  onFloorNumberChange(value: number) {
    this.floorNumber = value;
    console.log('Número de piso:', value);
  }

  onBathroomsChange(value: number) {
    this.bathrooms = value;
    console.log('Número de baños:', value);
  }

  onRoomsChange(value: number) {
    this.rooms = value;
    console.log('Número de habitaciones:', value);
  }

  onTerracesChange(value: number) {
    this.terraces = value;
    console.log('Número de terrazas:', value);
  }

  onAddPin() {
    console.log('Agregar pin 360');
  }

  onAddMoreApartments() {
    console.log('Agregar más apartamentos');
  }

  // Métodos para el Paso 3 - Archivos
  onApartmentSelectionChange(value: string) {
    this.selectedApartment = value;
    console.log('Apartamento seleccionado:', value);
  }

  onFloorTypeChange(value: string) {
    this.selectedFloorType = value;
    console.log('Tipo de piso seleccionado:', value);
  }

  onApartmentNumberChange(value: string) {
    this.apartmentNumber = Number(value);
    console.log('Número de apartamento:', value);
  }

  onBathroomsNumberChange(value: string) {
    this.bathroomsNumber = Number(value);
    console.log('Número de baños:', value);
  }

  onBalconiesNumberChange(value: string) {
    this.balconiesNumber = Number(value);
    console.log('Número de balcones:', value);
  }

  onEditMedia() {
    console.log('Editar medio de fondo');
  }

  // Métodos para el Paso 4 - Gestión de Contenido
  onApartmentForImagesChange(value: string) {
    this.selectedApartmentForImages = value;
    console.log('Apartamento seleccionado para imágenes:', value);
  }

  onScreenTitleChange(value: string | number) {
    this.screenTitle = String(value);
    console.log('Título de pantalla:', value);
  }

  onBriefDescriptionChange(value: string | number) {
    this.briefDescription = String(value);
    console.log('Descripción breve:', value);
  }

  onCarouselImagesChange(images: any[]) {
    this.carouselImages = images;
    console.log('Imágenes del carrusel actualizadas:', images);
  }

  onCarouselImageAdd(files: File[]) {
    console.log('Imágenes agregadas al carrusel:', files);
  }

  onCarouselImageEdit(data: any) {
    console.log('Imagen del carrusel editada:', data);
  }

  onCarouselImageRemove(image: any) {
    console.log('Imagen del carrusel eliminada:', image);
  }

  onFeatureTitleChange(index: number, value: string | number) {
    this.features[index].title = String(value);
    console.log(`Título del feature ${index + 1}:`, value);
  }

  onFeatureDescriptionChange(index: number, value: string | number) {
    this.features[index].description = String(value);
    console.log(`Descripción del feature ${index + 1}:`, value);
  }

  onFeatureImageVideoChange(index: number, value: string | number) {
    this.features[index].imageVideo = String(value);
    console.log(`Imagen/Video del feature ${index + 1}:`, value);
  }

  onFeatureAudioSelect(files: File[], index: number) {
    this.features[index].audio = files;
    console.log(`Audio del feature ${index + 1}:`, files);
  }

  addFeature() {
    this.features.push({
      title: '',
      description: '',
      imageVideo: '',
      audio: []
    });
    console.log('Feature agregado. Total:', this.features.length);
  }

  removeFeature(index: number) {
    if (this.features.length > 1) {
      this.features.splice(index, 1);
      console.log('Feature eliminado. Total:', this.features.length);
    }
  }

  // Métodos para el Paso 5 - Datos Entregables
  onPdfBrochureSelect(files: File[]) {
    if (files.length > 0) {
      this.pdfBrochure = files[0];
      console.log('PDF Brochure seleccionado:', this.pdfBrochure.name);
    }
  }

  onExecutiveContactChange(value: string | number) {
    this.executiveContact = String(value);
    console.log('Contacto del ejecutivo:', this.executiveContact);
  }

  onExecutiveMailChange(value: string | number) {
    this.executiveMail = String(value);
    console.log('Mail del ejecutivo:', this.executiveMail);
  }

  // Propiedades para el Paso 4 - Gestión de Contenido
  selectedApartmentForImages: string = '';
  screenTitle: string = '';
  briefDescription: string = '';
  carouselImages: any[] = [];
  features: Array<{
    title: string;
    description: string;
    imageVideo: string;
    audio: any[];
  }> = [
    {
      title: '',
      description: '',
      imageVideo: '',
      audio: []
    }
  ];

  // Propiedades para el Paso 5 - Datos Entregables
  executiveContact: string = '';
  executiveMail: string = '';
  pdfBrochure: File | null = null;



  // Métodos para los botones de acción
  onCancel() {
    console.log('Cancelar proyecto');
  }

  onSave() {
    console.log('Guardar proyecto y avanzar al siguiente paso');
    this.nextStep();
  }

  onView() {
    console.log('Ver proyecto');
  }

  onButtonClick(buttonType: any) {
    console.log('Botón clickeado:', buttonType);
  }
}
