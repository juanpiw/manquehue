import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CardNewComponent } from '../../shared/card-new/card-new.component';
import { ProjectTileComponent } from '../../shared/project-tile/project-tile.component';
import { StatDonutComponent } from '../../shared/stat-donut/stat-donut.component';
import { ProjectItem, ProjectsCreatedComponent } from '../../shared/projects-created/projects-created.component';
import { LangSwitcherComponent } from '../../shared/lang-switcher/lang-switcher.component';
import { SearchInputComponent } from '../../shared/search-input/search-input.component';
import { UserProfileComponent } from '../../shared/user-profile/user-profile.component';
import { ActionButtonsComponent } from '../../shared/action-buttons/action-buttons.component';
import { StepIndicatorComponent, Step } from '../../shared/step-indicator/step-indicator.component';
import { inputComponent } from '../../shared/input/input.component';
import { ProjectTypeSelectorComponent } from '../../shared/project-type-selector/project-type-selector.component';
import { TextareaComponent } from '../../shared/textarea/textarea.component';
import { DropdownComponent, DropdownOption } from '../../shared/dropdown/dropdown.component';
import { FileUploadComponent, UploadedFile } from '../../shared/file-upload/file-upload.component';
import { ImageManagerComponent, ManagedImage } from '../../shared/image-manager/image-manager.component';
import { ProjectTagComponent, ProjectTag } from '../../shared/project-tag/project-tag.component';
import { InfoTooltipComponent, InfoTooltipData } from '../../shared/info-tooltip/info-tooltip.component';
import { NumberDropdownComponent } from '../../shared/number-dropdown/number-dropdown.component';
import { AddMoreComponent } from '../../shared/add-more/add-more.component';
import { FeaturesComponent, Feature } from '../../shared/features/features.component';
import { ModalComponent, ModalConfig } from '../../shared/modal/modal.component';
import { TranslatePipe } from '../../i18n/t.pipe';



@Component({
  selector: 'app-resumen',
  standalone: true,
      imports: [
        CommonModule, 
        NgFor, 
        NgIf, 
        CardNewComponent,
        ProjectTileComponent,
        StatDonutComponent,
        ProjectsCreatedComponent,
        LangSwitcherComponent,
        SearchInputComponent,
        UserProfileComponent,
        ActionButtonsComponent,
        StepIndicatorComponent,
        inputComponent,
        ProjectTypeSelectorComponent,
        TextareaComponent,
        DropdownComponent,
        FileUploadComponent,
        ImageManagerComponent,
        ProjectTagComponent,
        InfoTooltipComponent,
        NumberDropdownComponent,
        AddMoreComponent,
        FeaturesComponent,
        ModalComponent,
        TranslatePipe
      ],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.scss'
})
export class ResumenComponent {
  // Datos de prueba para los project tags
  testProjects: ProjectTag[] = [
    {
      id: '1',
      name: 'Europa proyecto',
      status: 'active'
    },
    {
      id: '2',
      name: 'América proyecto',
      status: 'inactive'
    },
    {
      id: '3',
      name: 'Asia proyecto',
      status: 'loading'
    },
    {
      id: '4',
      name: 'África proyecto',
      isSelected: true
    }
  ];
    @Output() navigate = new EventEmitter<'nuevoProyecto' | 'proyectos'>();
  // MOCK por ahora
  projectsCount = 4;   // ← viene del API después
  projectsMax   = 10;  // si mañana es 20, cambia acá
   created: ProjectItem[] = [
    { id: 1, name: 'Torre 1' },
    { id: 2, name: 'Torre 2' },
    { id: 3, name: 'Torre 3' },
  ];

  // Propiedades para la búsqueda
  filteredProjects: ProjectItem[] = [...this.created];
  searchTerm: string = '';

  // Datos del usuario (mock)
  currentUser = {
    name: 'Juan Pablo',
    image: undefined // Si tienes una imagen, puedes ponerla aquí
  };

  // Propiedades para el step indicator
  currentStep = 1;
  customSteps: Step[] = [
    { id: 1, title: 'common.step_1', completed: false },
    { id: 2, title: 'common.step_2', completed: false },
    { id: 3, title: 'common.step_3', completed: false },
    { id: 4, title: 'common.step_4', completed: false },
    { id: 5, title: 'common.step_5', completed: false }
  ];

  goNuevo() { this.navigate.emit('nuevoProyecto'); }
  
  openProject(project: ProjectItem) {
    console.log('abrir proyecto', project);
    this.navigate.emit('proyectos'); 
  }

  // Método para manejar la búsqueda
  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    if (!searchTerm.trim()) {
      this.filteredProjects = [...this.created];
    } else {
      this.filteredProjects = this.created.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  // Métodos para los botones de acción
  onCancel() {
    console.log('Acción Cancelar');
  }

  onSave() {
    console.log('Acción Guardar');
  }

  onView() {
    console.log('Acción Ver');
  }

  onButtonClick(event: {type: string, text: string}) {
    console.log('Botón clickeado:', event);
  }

  // Métodos para el step indicator
  onStepChange(stepNumber: number) {
    console.log('Cambio al paso:', stepNumber);
    this.currentStep = stepNumber;
  }

  onStepClick(step: Step) {
    console.log('Click en paso:', step);
  }

  // Métodos para los controles de prueba
  previousStep() {
    this.currentStep = Math.max(1, this.currentStep - 1);
  }

  nextStep() {
    this.currentStep = Math.min(5, this.currentStep + 1);
  }

  // Métodos para diferentes tipos de búsqueda
  onSearchProjects(searchTerm: string) {
    console.log('Búsqueda de proyectos:', searchTerm);
    this.onSearch(searchTerm); // Reutiliza la lógica existente
  }

  onSearchUsers(searchTerm: string) {
    console.log('Búsqueda de usuarios:', searchTerm);
    // Aquí podrías implementar lógica específica para usuarios
  }

  onSearchFiles(searchTerm: string) {
    console.log('Búsqueda de archivos:', searchTerm);
    // Aquí podrías implementar lógica específica para archivos
  }

  onSearchDisabled(searchTerm: string) {
    console.log('Búsqueda deshabilitada (no debería ejecutarse):', searchTerm);
  }

  // Métodos para el input component
  onInputChange(value: string | number, field: string) {
    console.log(`Input ${field} cambiado:`, value);
  }

  onInputFocus(field: string) {
    console.log(`Input ${field} enfocado`);
  }

  onInputBlur(field: string) {
    console.log(`Input ${field} perdió el foco`);
  }

  // Métodos para el project type selector
  onProjectTypeChange(typeId: string) {
    console.log('Tipo de proyecto seleccionado:', typeId);
  }

  onProjectTypeSelect(type: any) {
    console.log('Tipo de proyecto completo seleccionado:', type);
  }

  // Métodos para el textarea component
  onTextareaChange(value: string) {
    console.log('Valor del textarea cambiado:', value);
  }

  onTextareaFocus() {
    console.log('Textarea enfocado');
  }

  onTextareaBlur() {
    console.log('Textarea perdió el foco');
  }

  onTextareaInput(value: string) {
    console.log('Texto ingresado en textarea:', value);
  }

  // Datos de ejemplo para el dropdown
  deliveryOptions: DropdownOption[] = [
    {
      id: 'future',
      label: 'Futura',
      labelKey: 'common.delivery_future',
      value: 'future'
    },
    {
      id: 'immediate',
      label: 'Inmediata',
      labelKey: 'common.delivery_immediate',
      value: 'immediate'
    },
    {
      id: 'scheduled',
      label: 'Programada',
      labelKey: 'common.delivery_scheduled',
      value: 'scheduled'
    },
    {
      id: 'urgent',
      label: 'Urgente',
      labelKey: 'common.delivery_urgent',
      value: 'urgent',
      disabled: true
    }
  ];

  // Métodos para el dropdown component
  onDropdownChange(value: any) {
    console.log('Valor del dropdown cambiado:', value);
  }

  onDropdownOptionSelect(option: DropdownOption) {
    console.log('Opción del dropdown seleccionada:', option);
  }

  onDropdownOpen() {
    console.log('Dropdown abierto');
  }

  onDropdownClose() {
    console.log('Dropdown cerrado');
  }

  // Métodos para el file upload component
  onFileSelect(files: File[]) {
    console.log('Archivos seleccionados:', files);
  }

  onFileUpload(uploadedFile: UploadedFile) {
    console.log('Archivo subido:', uploadedFile);
  }

  onFileRemove(uploadedFile: UploadedFile) {
    console.log('Archivo eliminado:', uploadedFile);
  }

  onUploadComplete(uploadedFiles: UploadedFile[]) {
    console.log('Upload completado:', uploadedFiles);
  }

  onUploadError(error: {file: File, error: string}) {
    console.log('Error en upload:', error);
  }

  // Métodos para el image manager component
  onImageAdd(files: File[]) {
    console.log('Imágenes agregadas:', files);
  }

  onImageEdit(data: {image: ManagedImage, newFile: File}) {
    console.log('Imagen editada:', data);
  }

  onImageRemove(image: ManagedImage) {
    console.log('Imagen eliminada:', image);
  }

  onImageUpload(image: ManagedImage) {
    console.log('Imagen subida:', image);
  }

  onImagesChange(images: ManagedImage[]) {
    console.log('Lista de imágenes actualizada:', images);
  }

  onImageUploadError(error: {file: File, error: string}) {
    console.log('Error en upload de imagen:', error);
  }

  // Métodos para el project tag component
  onProjectEdit(project: ProjectTag) {
    console.log('Editar proyecto:', project);
    // Aquí conectarías al formulario de configuración
  }

  onProjectDelete(project: ProjectTag) {
    console.log('Eliminar proyecto:', project);
    // Aquí eliminarías el proyecto
    const index = this.testProjects.findIndex(p => p.id === project.id);
    if (index > -1) {
      this.testProjects.splice(index, 1);
    }
  }

  onProjectSelect(project: ProjectTag) {
    console.log('Seleccionar proyecto:', project);
    // Aquí manejarías la selección del proyecto
    this.testProjects.forEach(p => p.isSelected = p.id === project.id);
  }

  // Datos para el info tooltip
  tooltipData: InfoTooltipData = {
    title: 'Información del Proyecto',
    content: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500.'
  };

  // Métodos para el info tooltip
  onTooltipOpen() { console.log('Tooltip abierto'); }
  onTooltipClose() { console.log('Tooltip cerrado'); }
  onTooltipContentChange(event: any) { 
    console.log('Contenido del tooltip cambiado:', event);
    if (typeof event === 'string') {
      this.tooltipData.content = event;
    }
  }

  // Propiedades para el number dropdown
  selectedNumber: number = 2;
  minNumber: number = 1;
  maxNumber: number = 30;

  // Métodos para el number dropdown
  onNumberChange(newValue: number) {
    console.log('Número seleccionado:', newValue);
    this.selectedNumber = newValue;
  }

  // Métodos para el add more
  onAddMore() {
    console.log('Agregar más elementos');
  }

  onAddProject() {
    console.log('Agregar proyecto');
  }

  onAddFile() {
    console.log('Agregar archivo');
  }

  onAddImage() {
    console.log('Agregar imagen');
  }

  // Propiedades para el features component
  features: Feature[] = [];

  // Métodos para el features component
  onFeaturesChange(event: any) {
    console.log('Features actualizadas:', event);
    if (Array.isArray(event)) {
      this.features = event;
    }
  }

  // Propiedades para el modal
  isModalOpen = false;
  modalConfig: ModalConfig = {
    title: 'Modal de Prueba',
    message: 'Este es un modal de prueba para demostrar la funcionalidad.',
    inputPlaceholder: 'Ingresa texto aquí...',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    showInput: true,
    showCancel: true,
    confirmButtonType: 'primary'
  };

  // Métodos para el modal
  openModal() {
    this.isModalOpen = true;
  }

  openDeleteModal() {
    this.modalConfig = {
      title: 'Confirmar Eliminación',
      message: '¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      showInput: false,
      showCancel: true,
      confirmButtonType: 'danger'
    };
    this.isModalOpen = true;
  }

  openCreateProjectModal() {
    this.modalConfig = {
      title: 'Crear Nuevo Proyecto',
      message: 'Ingresa el nombre para tu nuevo proyecto:',
      inputPlaceholder: 'Nombre del proyecto',
      confirmText: 'Crear',
      cancelText: 'Cancelar',
      showInput: true,
      showCancel: true,
      confirmButtonType: 'success'
    };
    this.isModalOpen = true;
  }

  onModalConfirm(value: string) {
    console.log('Modal confirmado con valor:', value);
    this.isModalOpen = false;
    
    // Aquí puedes manejar diferentes tipos de modales
    if (this.modalConfig.confirmButtonType === 'danger') {
      console.log('Eliminando elemento...');
    } else if (this.modalConfig.confirmButtonType === 'success') {
      console.log('Creando proyecto:', value);
    } else {
      console.log('Acción confirmada:', value);
    }
  }

  onModalCancel() {
    console.log('Modal cancelado');
    this.isModalOpen = false;
  }

  onModalClose() {
    console.log('Modal cerrado');
    this.isModalOpen = false;
  }
}
