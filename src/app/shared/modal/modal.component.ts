import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../i18n/t.pipe';

export interface ModalConfig {
  title: string;
  message?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  confirmText?: string;
  cancelText?: string;
  showInput?: boolean;
  showCancel?: boolean;
  confirmButtonType?: 'primary' | 'danger' | 'success';
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() config: ModalConfig = {
    title: 'Modal Title',
    message: '',
    inputPlaceholder: 'Enter text...',
    inputValue: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    showInput: false,
    showCancel: true,
    confirmButtonType: 'primary'
  };

  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  inputValue: string = '';

  ngOnInit() {
    this.inputValue = this.config.inputValue || '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && this.config.inputValue !== undefined) {
      this.inputValue = this.config.inputValue;
    }
  }

  onConfirm() {
    this.confirm.emit(this.inputValue);
    this.closeModal();
  }

  onCancel() {
    this.cancel.emit();
    this.closeModal();
  }

  onClose() {
    this.close.emit();
    this.closeModal();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  private closeModal() {
    this.isOpen = false;
    this.inputValue = '';
  }

  getConfirmButtonClass(): string {
    switch (this.config.confirmButtonType) {
      case 'danger':
        return 'btn-danger';
      case 'success':
        return 'btn-success';
      default:
        return 'btn-primary';
    }
  }
}
