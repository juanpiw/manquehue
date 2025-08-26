import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ExecutiveContactInfo {
  name: string;
  email: string;
  phone: string;
}

export interface ContactModalConfig {
  title?: string;
  executiveInfo: ExecutiveContactInfo;
  showWhatsApp: boolean;
  showEmail: boolean;
  contactButtonText: string;
  privacyPolicyText: string;
}

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent {
  @Input() config!: ContactModalConfig;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() contactSubmit = new EventEmitter<{type: string, data: any}>();
  @Output() contactMethodChange = new EventEmitter<string>();

  contactData = {
    name: '',
    email: '',
    subject: '',
    phone: ''
  };

  currentContactMethod: 'whatsapp' | 'email' = 'whatsapp';

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onContactMethodChange(method: 'whatsapp' | 'email'): void {
    this.currentContactMethod = method;
    this.contactMethodChange.emit(method);
  }

  onSubmit(): void {
    const data = {
      type: this.currentContactMethod,
      data: {
        ...this.contactData,
        executive: this.config.executiveInfo
      }
    };
    this.contactSubmit.emit(data);
  }

  onPrivacyPolicyClick(): void {
    console.log('Privacy policy clicked');
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCloseModal();
    }
  }
}
