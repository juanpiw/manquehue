import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../i18n/t.pipe';

export interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
  url?: string;
  progress?: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  @Input() label: string = '';
  @Input() labelKey: string = ''; // Clave de traducción para el label
  @Input() placeholder: string = 'Arrastra archivos aquí o haz clic para seleccionar';
  @Input() placeholderKey: string = 'common.file_upload_placeholder';
  @Input() acceptedTypes: string = '.mp3,.mp4,.wav,.avi,.mov,.m4a,.wma,.flac,.aac';
  @Input() maxFileSize: number = 50 * 1024 * 1024; // 50MB por defecto
  @Input() multiple: boolean = false;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showLabel: boolean = true;
  @Input() maxFiles: number = 5;
  @Input() autoUpload: boolean = false;
  
  @Output() fileSelect = new EventEmitter<File[]>();
  @Output() fileUpload = new EventEmitter<UploadedFile>();
  @Output() fileRemove = new EventEmitter<UploadedFile>();
  @Output() uploadComplete = new EventEmitter<UploadedFile[]>();
  @Output() uploadError = new EventEmitter<{file: File, error: string}>();

  isDragOver: boolean = false;
  uploadedFiles: UploadedFile[] = [];
  fileInput: HTMLInputElement | null = null;

  // Tipos de archivo aceptados
  acceptedFileTypes = [
    'audio/mp3',
    'audio/mpeg',
    'audio/mp4',
    'audio/wav',
    'audio/wma',
    'audio/flac',
    'audio/aac',
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/quicktime'
  ];

  // Extensiones aceptadas
  acceptedExtensions = [
    '.mp3', '.mp4', '.wav', '.avi', '.mov', 
    '.m4a', '.wma', '.flac', '.aac', '.wmv'
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

    // Limitar número de archivos
    if (this.uploadedFiles.length + validFiles.length > this.maxFiles) {
      const remainingSlots = this.maxFiles - this.uploadedFiles.length;
      validFiles.splice(remainingSlots);
    }

    // Crear objetos UploadedFile
    const newUploadedFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending'
    }));

    // Agregar a la lista
    this.uploadedFiles = [...this.uploadedFiles, ...newUploadedFiles];

    // Emitir evento
    this.fileSelect.emit(validFiles);

    // Auto upload si está habilitado
    if (this.autoUpload) {
      newUploadedFiles.forEach(uploadedFile => {
        this.uploadFile(uploadedFile);
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
        error: 'Tipo de archivo no válido'
      });
      return false;
    }

    // Validar tamaño
    if (file.size > this.maxFileSize) {
      this.uploadError.emit({
        file,
        error: `El archivo es demasiado grande. Máximo ${this.formatFileSize(this.maxFileSize)}`
      });
      return false;
    }

    return true;
  }

  uploadFile(uploadedFile: UploadedFile) {
    uploadedFile.status = 'uploading';
    uploadedFile.progress = 0;

    // Simular progreso de upload (en un caso real, esto vendría del servicio)
    const interval = setInterval(() => {
      if (uploadedFile.progress! < 100) {
        uploadedFile.progress! += 10;
      } else {
        clearInterval(interval);
        uploadedFile.status = 'completed';
        this.fileUpload.emit(uploadedFile);
      }
    }, 200);
  }

  removeFile(uploadedFile: UploadedFile) {
    const index = this.uploadedFiles.indexOf(uploadedFile);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
      this.fileRemove.emit(uploadedFile);
    }
  }

  openFileSelector() {
    if (this.disabled) return;
    
    if (!this.fileInput) {
      this.fileInput = document.createElement('input');
      this.fileInput.type = 'file';
      this.fileInput.accept = this.acceptedTypes;
      this.fileInput.multiple = this.multiple;
      this.fileInput.style.display = 'none';
      this.fileInput.addEventListener('change', (event) => this.onFileInputChange(event));
      document.body.appendChild(this.fileInput);
    }
    
    this.fileInput.click();
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

  getPlaceholder(): string {
    return this.placeholderKey || this.placeholder;
  }

  getAcceptedTypesText(): string {
    return this.acceptedExtensions.join(', ').toUpperCase();
  }

  isUploading(): boolean {
    return this.uploadedFiles.some(file => file.status === 'uploading');
  }

  hasFiles(): boolean {
    return this.uploadedFiles.length > 0;
  }

  getUploadedFilesCount(): number {
    return this.uploadedFiles.length;
  }
}







