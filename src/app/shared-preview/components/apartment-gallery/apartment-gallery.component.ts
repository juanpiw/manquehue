import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  active: boolean;
}

export interface ApartmentGalleryConfig {
  images: GalleryImage[];
  showNavigation: boolean;
  showScrollIndicator: boolean;
}

@Component({
  selector: 'app-apartment-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apartment-gallery.component.html',
  styleUrls: ['./apartment-gallery.component.scss']
})
export class ApartmentGalleryComponent {
  @Input() config!: ApartmentGalleryConfig;
  @Output() imageChange = new EventEmitter<string>();
  @Output() previousClick = new EventEmitter<void>();
  @Output() nextClick = new EventEmitter<void>();

  onImageClick(imageId: string): void {
    this.config.images.forEach(image => {
      image.active = image.id === imageId;
    });
    this.imageChange.emit(imageId);
  }

  onPrevious(): void {
    this.previousClick.emit();
  }

  onNext(): void {
    this.nextClick.emit();
  }
}

