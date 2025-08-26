import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';

export interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  active: boolean;
}

export interface ImageCarouselConfig {
  images: CarouselImage[];
  showNavigation: boolean;
  showPreviewThumbnails: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit, OnDestroy {
  @Input() config!: ImageCarouselConfig;
  @Output() imageChange = new EventEmitter<string>();
  @Output() previousClick = new EventEmitter<void>();
  @Output() nextClick = new EventEmitter<void>();

  constructor(private modalService: ModalService) {}

  // Modal state for large image preview
  showImageModal = false;
  modalImageSrc: string | null = null;
  modalImageAlt: string | null = null;

  ngOnInit(): void {
    // Provide sensible defaults if no images provided
    if (!this.config) {
      this.config = {
        images: [],
        showNavigation: true,
        showPreviewThumbnails: true
      };
    }

    if (!this.config.images || this.config.images.length === 0) {
      const base = 'assets/images/carrousel';
      this.config.images = [1,2,3,4,5].map((n, idx) => ({
        id: `img-${n}`,
        src: `${base}/img${n}.jpg`,
        alt: `Imagen ${n}`,
        active: idx === 0
      }));
    }
  }

  onImageClick(imageId: string): void {
    const clicked = this.config.images.find(img => img.id === imageId);
    if (clicked) {
      // Mark active
      this.config.images.forEach(image => {
        image.active = image.id === imageId;
      });
      this.imageChange.emit(imageId);
      // Open modal
      this.openImageModal(clicked.src, clicked.alt);
    }
  }

  onMainImageClick(): void {
    const activeImage = this.getActiveImage();
    if (activeImage) {
      this.openImageModal(activeImage.src, activeImage.alt);
    }
  }

  onPrevious(): void {
    this.previousClick.emit();
  }

  onNext(): void {
    this.nextClick.emit();
  }

  getActiveImage(): CarouselImage | undefined {
    return this.config.images.find(image => image.active);
  }

  getActiveIndex(): number {
    return this.config.images.findIndex(image => image.active);
  }

  ngOnDestroy(): void {
    this.modalService.removeModal();
  }

  // Modal helpers
  openImageModal(src: string, alt: string): void {
    console.log('Opening modal with:', src, alt);
    this.modalImageSrc = src;
    this.modalImageAlt = alt;
    this.showImageModal = true;
    
    // Use the modal service to create the modal
    this.modalService.createImageModal(
      src,
      alt,
      () => this.modalPrevious(),
      () => this.modalNext(),
      () => this.closeImageModal()
    );
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.modalImageSrc = null;
    this.modalImageAlt = null;
    this.modalService.removeModal();
  }

  // Modal navigation
  modalPrevious(): void {
    if (!this.config?.images?.length) return;
    const currentIndex = this.getActiveIndex();
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : this.config.images.length - 1;
    this.config.images.forEach((img, idx) => (img.active = idx === previousIndex));
    const img = this.config.images[previousIndex];
    this.modalImageSrc = img.src;
    this.modalImageAlt = img.alt;
    this.imageChange.emit(img.id);
    
    // Update the modal with new image
    this.modalService.createImageModal(
      img.src,
      img.alt,
      () => this.modalPrevious(),
      () => this.modalNext(),
      () => this.closeImageModal()
    );
  }

  modalNext(): void {
    if (!this.config?.images?.length) return;
    const currentIndex = this.getActiveIndex();
    const nextIndex = currentIndex < this.config.images.length - 1 ? currentIndex + 1 : 0;
    this.config.images.forEach((img, idx) => (img.active = idx === nextIndex));
    const img = this.config.images[nextIndex];
    this.modalImageSrc = img.src;
    this.modalImageAlt = img.alt;
    this.imageChange.emit(img.id);
    
    // Update the modal with new image
    this.modalService.createImageModal(
      img.src,
      img.alt,
      () => this.modalPrevious(),
      () => this.modalNext(),
      () => this.closeImageModal()
    );
  }
}

