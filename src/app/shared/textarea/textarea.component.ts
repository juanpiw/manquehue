import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../i18n/t.pipe';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss'
})
export class TextareaComponent {
  @Input() label: string = '';
  @Input() labelKey: string = ''; // Clave de traducción para el label
  @Input() placeholder: string = '';
  @Input() placeholderKey: string = ''; // Clave de traducción para el placeholder
  @Input() value: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() maxLength: number = 500;
  @Input() minLength: number = 0;
  @Input() rows: number = 4;
  @Input() showLabel: boolean = true;
  @Input() showCounter: boolean = true;
  @Input() resize: 'none' | 'vertical' | 'horizontal' | 'both' = 'vertical';
  
  @Output() valueChange = new EventEmitter<string>();
  @Output() textareaFocus = new EventEmitter<void>();
  @Output() textareaBlur = new EventEmitter<void>();
  @Output() textareaInput = new EventEmitter<string>();

  currentValue: string = '';

  ngOnInit() {
    this.currentValue = this.value;
  }

  ngOnChanges() {
    if (this.value !== this.currentValue) {
      this.currentValue = this.value;
    }
  }

  onInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.currentValue = target.value;
    this.valueChange.emit(this.currentValue);
    this.textareaInput.emit(this.currentValue);
  }

  onFocus() {
    this.textareaFocus.emit();
  }

  onBlur() {
    this.textareaBlur.emit();
  }

  // Método para obtener el label (prioriza la clave de traducción)
  getLabel(): string {
    return this.labelKey || this.label;
  }

  // Método para obtener el placeholder (prioriza la clave de traducción)
  getPlaceholder(): string {
    return this.placeholderKey || this.placeholder;
  }

  // Método para obtener el contador de caracteres
  getCharacterCount(): number {
    return this.currentValue ? this.currentValue.length : 0;
  }

  // Método para verificar si se ha alcanzado el límite
  isLimitReached(): boolean {
    return this.getCharacterCount() >= this.maxLength;
  }

  // Método para obtener el color del contador
  getCounterColor(): string {
    const count = this.getCharacterCount();
    const percentage = (count / this.maxLength) * 100;
    
    if (percentage >= 90) return '#ef4444'; // Rojo
    if (percentage >= 75) return '#f59e0b'; // Amarillo
    return '#6b7280'; // Gris
  }
}

