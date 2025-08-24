import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-project-tile',
  standalone: true,
  imports: [],
  templateUrl: './project-tile.component.html',
  styleUrl: './project-tile.component.scss'
})
export class ProjectTileComponent {
/** Texto bajo el ícono */
  @Input() label = 'Nombre del proyecto';
  /** Tamaño del ícono (px) */
  @Input() iconSize = 56;
  /** Estado seleccionado */
  @Input() selected = false;
  /** Deshabilitado */
  @Input() disabled = false;

  /** Evento al activar (click, Enter o Space) */
  @Output() pressed = new EventEmitter<void>();

  // Accesibilidad en el host
  @HostBinding('attr.role') role = 'button';
  @HostBinding('attr.aria-label') get ariaLabel() { return this.label; }
  @HostBinding('attr.tabindex') get tabIndex() { return this.disabled ? -1 : 0; }
  @HostBinding('class.is-selected') get isSelected() { return this.selected; }
  @HostBinding('class.is-disabled') get isDisabled() { return this.disabled; }

  @HostListener('click')
  onClick() { if (!this.disabled) this.pressed.emit(); }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.pressed.emit(); }
  }
}
