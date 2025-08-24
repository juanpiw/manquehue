import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../i18n/t.pipe';

export interface ManagedImage {
  id: string;
  file?: File;
  name: string;
  url?: string;
  size?: number;
  type?: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress?: number;
  error?: string;
  isNew?: boolean;
}

@Component({
  selector: 'app-image-manager',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './image-manager.component.html',
  styleUrl: './image-manager.component.scss'
})
export class ImageManagerComponent {
  @Input() label: string = '';
  @Input() labelKey: string = ''; // Clave de traducción para el label
  @Input() addMoreText: string = 'Agregar más';
  @Input() addMoreTextKey: string = 'common.add_more';
  @Input() acceptedTypes: string = '.jpg,.jpeg,.png,.gif,.webp,.svg';
  @Input() maxFileSize: number = 10 * 1024 * 1024; // 10MB por defecto
  @Input() maxImages: number = 10;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showLabel: boolean = true;
  @Input() autoUpload: boolean = false;
  @Input() images: ManagedImage[] = [];
  
  @Output() imageAdd = new EventEmitter<File[]>();
  @Output() imageEdit = new EventEmitter<{image: ManagedImage, newFile: File}>();
  @Output() imageRemove = new EventEmitter<ManagedImage>();
  @Output() imageUpload = new EventEmitter<ManagedImage>();
  @Output() imagesChange = new EventEmitter<ManagedImage[]>();
  @Output() uploadError = new EventEmitter<{file: File, error: string}>();

  isDragOver: boolean = false;
  fileInput: HTMLInputElement | null = null;
  
  // Propiedades para el progreso global
  globalProgress: number = 0;
  totalImages: number = 0;
  completedImages: number = 0;
  uploadingImages: number = 0;

  // Tipos de archivo aceptados para imágenes
  acceptedFileTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  // Extensiones aceptadas
  acceptedExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'
  ];

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled) {
      this.isDragOver = true;
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    if (this.disabled) return;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    
    if (files) {
      this.handleFiles(Array.from(files));
    }
    
    // Reset input para permitir seleccionar el mismo archivo
    target.value = '';
  }

  handleFiles(files: File[]) {
    const validFiles = files.filter(file => this.validateFile(file));
    
    if (validFiles.length === 0) return;

    // Limitar número de imágenes
    if (this.images.length + validFiles.length > this.maxImages) {
      const remainingSlots = this.maxImages - this.images.length;
      validFiles.splice(remainingSlots);
    }

    // Crear objetos ManagedImage
    const newImages: ManagedImage[] = validFiles.map(file => ({
      id: this.generateId(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      isNew: true
    }));

    // Agregar a la lista
    this.images = [...this.images, ...newImages];
    this.imagesChange.emit(this.images);
    this.updateGlobalProgress();

    // Emitir evento
    this.imageAdd.emit(validFiles);

    // Auto upload si está habilitado
    if (this.autoUpload) {
      newImages.forEach(image => {
        this.uploadImage(image);
      });
    }
  }

  validateFile(file: File): boolean {
    // Validar tipo de archivo
    const isValidType = this.acceptedFileTypes.includes(file.type) || 
                       this.acceptedExtensions.some(ext => 
                         file.name.toLowerCase().endsWith(ext)
                       );

    if (!isValidType) {
      this.uploadError.emit({
        file,
        error: 'Tipo de archivo no válido. Solo se permiten imágenes.'
      });
      return false;
    }

    // Validar tamaño
    if (file.size > this.maxFileSize) {
      this.uploadError.emit({
        file,
        error: `La imagen es demasiado grande. Máximo ${this.formatFileSize(this.maxFileSize)}`
      });
      return false;
    }

    return true;
  }

  uploadImage(image: ManagedImage) {
    if (!image.file) return;

    image.status = 'uploading';
    image.progress = 0;
    this.uploadingImages++;
    this.updateGlobalProgress();

    // Simular progreso de upload (en un caso real, esto vendría del servicio)
    const interval = setInterval(() => {
      if (image.progress! < 100) {
        image.progress! += 10;
        this.updateGlobalProgress();
      } else {
        clearInterval(interval);
        image.status = 'completed';
        image.isNew = false;
        this.uploadingImages--;
        this.completedImages++;
        this.updateGlobalProgress();
        this.imageUpload.emit(image);
      }
    }, 200);
  }

  editImage(image: ManagedImage) {
    if (this.disabled || image.status === 'uploading') return;
    
    if (!this.fileInput) {
      this.fileInput = document.createElement('input');
      this.fileInput.type = 'file';
      this.fileInput.accept = this.acceptedTypes;
      this.fileInput.multiple = false;
      this.fileInput.style.display = 'none';
      this.fileInput.addEventListener('change', (event) => this.onEditFileChange(event, image));
      document.body.appendChild(this.fileInput);
    }
    
    this.fileInput.click();
  }

  onEditFileChange(event: Event, image: ManagedImage) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    
    if (files && files.length > 0) {
      const newFile = files[0];
      
      if (this.validateFile(newFile)) {
        // Actualizar la imagen
        image.file = newFile;
        image.name = newFile.name;
        image.size = newFile.size;
        image.type = newFile.type;
        image.status = 'pending';
        image.isNew = true;
        image.error = undefined;
        
        this.imageEdit.emit({image, newFile});
        
        // Auto upload si está habilitado
        if (this.autoUpload) {
          this.uploadImage(image);
        }
      }
    }
    
    // Reset input
    target.value = '';
  }

  removeImage(image: ManagedImage) {
    const index = this.images.indexOf(image);
    if (index > -1) {
      // Si la imagen estaba subiendo, actualizar contadores
      if (image.status === 'uploading') {
        this.uploadingImages--;
      } else if (image.status === 'completed') {
        this.completedImages--;
      }
      
      this.images.splice(index, 1);
      this.imagesChange.emit(this.images);
      this.imageRemove.emit(image);
      this.updateGlobalProgress();
    }
  }

  addMoreImages() {
    if (this.disabled || this.images.length >= this.maxImages) return;
    
    if (!this.fileInput) {
      this.fileInput = document.createElement('input');
      this.fileInput.type = 'file';
      this.fileInput.accept = this.acceptedTypes;
      this.fileInput.multiple = true;
      this.fileInput.style.display = 'none';
      this.fileInput.addEventListener('change', (event) => this.onFileInputChange(event));
      document.body.appendChild(this.fileInput);
    }
    
    this.fileInput.click();
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getLabel(): string {
    return this.labelKey || this.label;
  }

  getAddMoreText(): string {
    return this.addMoreTextKey || this.addMoreText;
  }

  getAcceptedTypesText(): string {
    return this.acceptedExtensions.join(', ').toUpperCase();
  }

  hasImages(): boolean {
    return this.images.length > 0;
  }

  canAddMore(): boolean {
    return this.images.length < this.maxImages;
  }

  getImagesCount(): number {
    return this.images.length;
  }

  isUploading(): boolean {
    return this.images.some(image => image.status === 'uploading');
  }

  getImagePreviewUrl(image: ManagedImage): string {
    if (image.url) {
      return image.url;
    }
    
    if (image.file) {
      return URL.createObjectURL(image.file);
    }
    
    return '';
  }

  // Métodos para el progreso global
  updateGlobalProgress() {
    this.totalImages = this.images.length;
    this.completedImages = this.images.filter(img => img.status === 'completed').length;
    this.uploadingImages = this.images.filter(img => img.status === 'uploading').length;
    
    if (this.totalImages === 0) {
      this.globalProgress = 0;
    } else {
      // Calcular progreso basado en imágenes completadas y en progreso
      const completedProgress = this.completedImages / this.totalImages * 100;
      const uploadingProgress = this.uploadingImages > 0 ? 
        this.uploadingImages / this.totalImages * 50 : 0; // Las que están subiendo cuentan como 50%
      
      this.globalProgress = Math.min(completedProgress + uploadingProgress, 100);
    }
  }

  isGlobalUploading(): boolean {
    return this.uploadingImages > 0;
  }

  getGlobalProgressText(): string {
    if (this.totalImages === 0) {
      return 'common.global_progress_no_images';
    }
    
    if (this.completedImages === this.totalImages) {
      return 'common.global_progress_all_completed';
    }
    
    if (this.uploadingImages > 0) {
      return 'common.global_progress_uploading';
    }
    
    return 'common.global_progress_pending';
  }

  getGlobalProgressPercentage(): number {
    return Math.round(this.globalProgress);
  }
}
