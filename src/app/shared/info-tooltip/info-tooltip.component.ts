import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../i18n/t.pipe';

export interface InfoTooltipData {
  title?: string;
  content: string;
  maxLength?: number;
  showCounter?: boolean;
}

@Component({
  selector: 'app-info-tooltip',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './info-tooltip.component.html',
  styleUrl: './info-tooltip.component.scss'
})
export class InfoTooltipComponent {
  @Input() data: InfoTooltipData = { content: '' };
  @Input() iconSize: 'sm' | 'md' | 'lg' = 'md';
  @Input() iconColor: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'success';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() disabled: boolean = false;

  @Output() tooltipOpen = new EventEmitter<void>();
  @Output() tooltipClose = new EventEmitter<void>();

  isOpen: boolean = false;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // Inicialización si es necesaria
  }

  ngOnChanges() {
    // Manejo de cambios en inputs si es necesario
  }

  toggleTooltip(event: Event) {
    if (this.disabled) return;
    
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      this.tooltipOpen.emit();
    } else {
      this.tooltipClose.emit();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeTooltip();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.closeTooltip();
  }

  private closeTooltip() {
    if (this.isOpen) {
      this.isOpen = false;
      this.tooltipClose.emit();
    }
  }
}
