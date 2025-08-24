import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../i18n/t.pipe';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, TranslatePipe],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class inputComponent {
  @Input() label: string = '';
  @Input() labelKey: string = ''; // Clave de traducción para el label
  @Input() placeholder: string = '';
  @Input() placeholderKey: string = ''; // Clave de traducción para el placeholder
  @Input() type: string = 'text';
  @Input() value: string | number = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() maxLength: number = 100;
  @Input() minLength: number = 0;
  @Input() pattern: string = '';
  @Input() showLabel: boolean = true;
  
  @Output() valueChange = new EventEmitter<string | number>();
  @Output() inputFocus = new EventEmitter<void>();
  @Output() inputBlur = new EventEmitter<void>();

  ngOnInit(): void {}

  onChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }

  onFocus(): void {
    this.inputFocus.emit();
  }

  onBlur(): void {
    this.inputBlur.emit();
  }

  // Método para obtener el label (prioriza la clave de traducción)
  getLabel(): string {
    return this.labelKey || this.label;
  }

  // Método para obtener el placeholder (prioriza la clave de traducción)
  getPlaceholder(): string {
    return this.placeholderKey || this.placeholder;
  }
}
