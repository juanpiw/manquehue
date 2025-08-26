import { Injectable, Renderer2, RendererFactory2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private renderer: Renderer2;
  private modalElement: HTMLElement | null = null;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  createImageModal(
    imageSrc: string,
    imageAlt: string,
    onPrevious: () => void,
    onNext: () => void,
    onClose: () => void
  ): void {
    // Remove existing modal if any
    this.removeModal();

    // Create modal overlay
    this.modalElement = this.renderer.createElement('div');
    this.renderer.addClass(this.modalElement, 'global-image-modal-overlay');
    
    // Create modal content
    const modalContent = this.renderer.createElement('div');
    this.renderer.addClass(modalContent, 'global-image-modal-content');

    // Create navigation buttons
    const prevButton = this.createNavButton('Anterior', onPrevious, 'global-image-modal-nav', 'global-image-modal-prev');
    const nextButton = this.createNavButton('Siguiente', onNext, 'global-image-modal-nav', 'global-image-modal-next');
    
    // Create close button
    const closeButton = this.createNavButton('Cerrar', onClose, 'global-image-modal-close');
    
    // Create image
    const image = this.renderer.createElement('img');
    this.renderer.setAttribute(image, 'src', imageSrc);
    this.renderer.setAttribute(image, 'alt', imageAlt);
    this.renderer.addClass(image, 'global-image-modal-image');

    // Add SVG icons to buttons
    this.addSvgIcon(prevButton, 'M15 18L9 12L15 6');
    this.addSvgIcon(nextButton, 'M9 18L15 12L9 6');
    this.addSvgIcon(closeButton, 'M18 6L6 18M6 6L18 18');

    // Assemble modal
    this.renderer.appendChild(modalContent, prevButton);
    this.renderer.appendChild(modalContent, closeButton);
    this.renderer.appendChild(modalContent, image);
    this.renderer.appendChild(modalContent, nextButton);
    this.renderer.appendChild(this.modalElement, modalContent);

    // Add click handler for backdrop
    this.renderer.listen(this.modalElement, 'click', (event: Event) => {
      if (event.target === this.modalElement) {
        onClose();
      }
    });

    // Add to body
    this.renderer.appendChild(this.document.body, this.modalElement);
    
    // Add styles
    this.addModalStyles();
  }

  private createNavButton(label: string, onClick: () => void, ...classes: string[]): HTMLElement {
    const button = this.renderer.createElement('button');
    this.renderer.setAttribute(button, 'aria-label', label);
    classes.forEach(cls => this.renderer.addClass(button, cls));
    
    this.renderer.listen(button, 'click', (event: Event) => {
      event.stopPropagation();
      onClick();
    });

    return button;
  }

  private addSvgIcon(button: HTMLElement, pathData: string): void {
    // Create SVG element with proper namespace
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '22');
    svg.setAttribute('height', '22');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    
    // Create path element with proper namespace
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    
    svg.appendChild(path);
    button.appendChild(svg);
  }

  private addModalStyles(): void {
    if (this.document.getElementById('global-modal-styles')) {
      return; // Styles already added
    }

    const style = this.renderer.createElement('style');
    this.renderer.setAttribute(style, 'id', 'global-modal-styles');
    
    const css = `
      .global-image-modal-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(0, 0, 0, 0.9) !important;
        backdrop-filter: blur(10px) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 999999 !important;
        overflow: hidden !important;
      }

      .global-image-modal-content {
        position: relative !important;
        width: 100% !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .global-image-modal-image {
        max-width: 90vw !important;
        max-height: 90vh !important;
        object-fit: contain !important;
        border-radius: 8px !important;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6) !important;
      }

      .global-image-modal-nav {
        position: absolute !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        width: 48px !important;
        height: 48px !important;
        border-radius: 50% !important;
        background: rgba(0, 0, 0, 0.8) !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        color: #f3f4f6 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        transition: all 0.25s ease !important;
        backdrop-filter: blur(8px) !important;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
        z-index: 1000000 !important;
      }

      .global-image-modal-nav:hover {
        background: rgba(0, 0, 0, 0.9) !important;
        transform: translateY(-50%) scale(1.05) !important;
        border-color: rgba(255, 255, 255, 0.5) !important;
      }

      .global-image-modal-prev {
        left: 20px !important;
      }

      .global-image-modal-next {
        right: 20px !important;
      }

      .global-image-modal-close {
        position: absolute !important;
        top: 20px !important;
        right: 20px !important;
        width: 44px !important;
        height: 44px !important;
        border-radius: 50% !important;
        background: rgba(0, 0, 0, 0.8) !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        color: #f3f4f6 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        transition: all 0.25s ease !important;
        backdrop-filter: blur(8px) !important;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
        z-index: 1000000 !important;
      }

      .global-image-modal-close:hover {
        transform: translateY(-2px) !important;
        background: rgba(0, 0, 0, 0.9) !important;
        border-color: rgba(255, 255, 255, 0.5) !important;
      }
    `;
    
    this.renderer.setProperty(style, 'textContent', css);
    this.renderer.appendChild(this.document.head, style);
  }

  removeModal(): void {
    if (this.modalElement) {
      this.renderer.removeChild(this.document.body, this.modalElement);
      this.modalElement = null;
    }
  }
}
