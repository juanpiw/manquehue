import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ModelSpecification {
  label: string;
  value: string;
  icon?: string;
}

export interface FloorType {
  id: string;
  label: string;
  active: boolean;
}

export interface ApartmentModelDetailConfig {
  title: string;
  specifications: ModelSpecification[];
  floorTypes: FloorType[];
  floorPlanImage?: string;
  showFloorPlan: boolean;
  useRealImage?: boolean;
}

export interface QuoteFormData {
  name: string;
  email: string;
}

export interface PdfFormData {
  email: string;
}

@Component({
  selector: 'app-apartment-model-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apartment-model-detail.component.html',
  styleUrls: ['./apartment-model-detail.component.scss']
})
export class ApartmentModelDetailComponent {
  @Input() config!: ApartmentModelDetailConfig;
  @Output() floorTypeChange = new EventEmitter<string>();
  @Output() sendPdfClick = new EventEmitter<PdfFormData>();
  @Output() quoteModelClick = new EventEmitter<QuoteFormData>();

  // Modal properties
  showQuoteModal = false;
  showPdfModal = false;
  quoteForm: QuoteFormData = {
    name: '',
    email: ''
  };
  pdfForm: PdfFormData = {
    email: ''
  };
  formErrors: { [key: string]: string } = {};
  pdfFormErrors: { [key: string]: string } = {};

  onFloorTypeClick(typeId: string): void {
    this.config.floorTypes.forEach(type => {
      type.active = type.id === typeId;
    });
    this.floorTypeChange.emit(typeId);
  }

  onSendPdf(): void {
    this.showPdfModal = true;
  }

  onQuoteModel(): void {
    this.showQuoteModal = true;
  }

  closeQuoteModal(): void {
    this.showQuoteModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.quoteForm = {
      name: '',
      email: ''
    };
    this.formErrors = {};
  }

  validateForm(): boolean {
    this.formErrors = {};

    if (!this.quoteForm.name.trim()) {
      this.formErrors['name'] = 'El nombre es requerido';
    }

    if (!this.quoteForm.email.trim()) {
      this.formErrors['email'] = 'El correo es requerido';
    } else if (!this.isValidEmail(this.quoteForm.email)) {
      this.formErrors['email'] = 'Ingrese un correo válido';
    }

    return Object.keys(this.formErrors).length === 0;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSubmitQuote(): void {
    if (this.validateForm()) {
      this.quoteModelClick.emit(this.quoteForm);
      this.closeQuoteModal();
    }
  }

  onModalBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeQuoteModal();
    }
  }

  // PDF Modal methods
  closePdfModal(): void {
    this.showPdfModal = false;
    this.resetPdfForm();
  }

  resetPdfForm(): void {
    this.pdfForm = {
      email: ''
    };
    this.pdfFormErrors = {};
  }

  validatePdfForm(): boolean {
    this.pdfFormErrors = {};

    if (!this.pdfForm.email.trim()) {
      this.pdfFormErrors['email'] = 'El correo es requerido';
    } else if (!this.isValidEmail(this.pdfForm.email)) {
      this.pdfFormErrors['email'] = 'Ingrese un correo válido';
    }

    return Object.keys(this.pdfFormErrors).length === 0;
  }

  onSubmitPdf(): void {
    if (this.validatePdfForm()) {
      this.sendPdfClick.emit(this.pdfForm);
      this.closePdfModal();
    }
  }

  onPdfModalBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closePdfModal();
    }
  }
}
