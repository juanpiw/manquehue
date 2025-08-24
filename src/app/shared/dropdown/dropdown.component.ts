import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../i18n/t.pipe';

export interface DropdownOption {
  id: string | number;
  label: string;
  labelKey?: string;
  value: any;
  disabled?: boolean;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements OnInit {
  @Input() label: string = '';
  @Input() labelKey: string = ''; // Clave de traducción para el label
  @Input() placeholder: string = 'Seleccionar...';
  @Input() placeholderKey: string = 'common.select_placeholder'; // Clave de traducción para el placeholder
  @Input() options: DropdownOption[] = [];
  @Input() selectedValue: any = null;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showLabel: boolean = true;
  @Input() loading: boolean = false;
  @Input() error: string = '';
  @Input() errorKey: string = '';
  
  @Output() valueChange = new EventEmitter<any>();
  @Output() optionSelect = new EventEmitter<DropdownOption>();
  @Output() dropdownOpen = new EventEmitter<void>();
  @Output() dropdownClose = new EventEmitter<void>();

  isOpen: boolean = false;
  selectedOption: DropdownOption | null = null;

  ngOnInit() {
    this.updateSelectedOption();
  }

  ngOnChanges() {
    this.updateSelectedOption();
  }

  updateSelectedOption() {
    if (this.selectedValue && this.options.length > 0) {
      this.selectedOption = this.options.find(option => 
        option.id === this.selectedValue || option.value === this.selectedValue
      ) || null;
    } else {
      this.selectedOption = null;
    }
  }

  toggleDropdown() {
    if (this.disabled || this.loading) return;
    
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      this.dropdownOpen.emit();
    } else {
      this.dropdownClose.emit();
    }
  }

  selectOption(option: DropdownOption) {
    if (option.disabled) return;
    
    this.selectedOption = option;
    this.selectedValue = option.value;
    this.isOpen = false;
    
    this.valueChange.emit(option.value);
    this.optionSelect.emit(option);
    this.dropdownClose.emit();
  }

  closeDropdown() {
    this.isOpen = false;
    this.dropdownClose.emit();
  }

  // Método para obtener el label (prioriza la clave de traducción)
  getLabel(): string {
    return this.labelKey || this.label;
  }

  // Método para obtener el placeholder (prioriza la clave de traducción)
  getPlaceholder(): string {
    return this.placeholderKey || this.placeholder;
  }

  // Método para obtener el texto del error (prioriza la clave de traducción)
  getError(): string {
    return this.errorKey || this.error;
  }

  // Método para obtener el texto de la opción seleccionada
  getSelectedText(): string {
    if (this.selectedOption) {
      return this.selectedOption.labelKey ? 
        this.selectedOption.labelKey : 
        this.selectedOption.label;
    }
    return '';
  }

  // Método para verificar si hay opciones
  hasOptions(): boolean {
    return this.options && this.options.length > 0;
  }

  // Método para obtener opciones habilitadas
  getEnabledOptions(): DropdownOption[] {
    return this.options.filter(option => !option.disabled);
  }
}







