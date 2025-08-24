import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-new',
  standalone: true,
  imports: [],
  templateUrl: './card-new.component.html',
  styleUrl: './card-new.component.scss'
})
export class CardNewComponent {
 /** Texto del botón */
  @Input() label = 'New project';
  /** Tamaño visual: md | lg */
  @Input() size: 'md' | 'lg' = 'lg';
  /** Deshabilitar interacción */
  @Input() disabled = false;

  /** Click del usuario (mouse, Enter o Space) */
  @Output() pressed = new EventEmitter<void>();

  // Accesibilidad
  @HostBinding('attr.role') role = 'button';
  @HostBinding('attr.tabindex') get tabIndex() { return this.disabled ? -1 : 0; }
  @HostBinding('class.disabled') get isDisabled() { return this.disabled; }

  @HostListener('click')
  onClick() {
    if (!this.disabled) this.pressed.emit();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.pressed.emit();
    }
  }
}
