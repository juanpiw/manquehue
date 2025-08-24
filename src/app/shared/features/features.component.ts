import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMoreComponent } from '../add-more/add-more.component';
import { inputComponent } from '../input/input.component';
import { TextareaComponent } from '../textarea/textarea.component';
import { FileUploadComponent, UploadedFile } from '../file-upload/file-upload.component';
import { ImageManagerComponent, ManagedImage } from '../image-manager/image-manager.component';
import { TranslatePipe } from '../../i18n/t.pipe';

export interface Feature {
  id: string;
  title: string;
  description: string;
  imageVideo: ManagedImage[];
  audio: UploadedFile[];
}

@Component({
  selector: 'app-features-manager',
  standalone: true,
  imports: [
    CommonModule,
    AddMoreComponent,
    inputComponent,
    TextareaComponent,
    FileUploadComponent,
    ImageManagerComponent,
    TranslatePipe
  ],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {
  @Input() features: Feature[] = [];
  @Output() featuresChange = new EventEmitter<Feature[]>();

  constructor() {
    if (this.features.length === 0) {
      this.addFeature();
    }
  }

  addFeature() {
    const newFeature: Feature = {
      id: this.generateId(),
      title: '',
      description: '',
      imageVideo: [],
      audio: []
    };
    this.features.push(newFeature);
    this.featuresChange.emit(this.features);
  }

  removeFeature(index: number) {
    if (this.features.length > 1) {
      this.features.splice(index, 1);
      this.featuresChange.emit(this.features);
    }
  }

  updateFeature(index: number, field: keyof Feature, value: string | number) {
    if (field === 'title' || field === 'description') {
      this.features[index][field] = String(value);
      this.featuresChange.emit(this.features);
    }
  }

  onTitleChange(value: string | number, index: number) {
    this.updateFeature(index, 'title', value);
  }

  onDescriptionChange(value: string | number, index: number) {
    this.updateFeature(index, 'description', value);
  }

  onFileSelect(files: File[], index: number) {
    // Convert files to UploadedFile format
    const uploadedFiles: UploadedFile[] = files.map(file => ({
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending'
    }));
    
    this.features[index].audio = uploadedFiles;
    this.featuresChange.emit(this.features);
  }

  onImageAdd(files: File[], index: number) {
    // Convert files to ManagedImage format
    const managedImages: ManagedImage[] = files.map(file => ({
      id: this.generateId(),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending'
    }));
    
    this.features[index].imageVideo = managedImages;
    this.featuresChange.emit(this.features);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
