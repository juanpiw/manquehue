import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PreviewFooterConfig {
  address?: string;
  buttonText?: string;
  buttonAction?: string;
  showDivider?: boolean;
  layout?: 'horizontal' | 'vertical';
}

@Component({
  selector: 'app-preview-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-footer.component.html',
  styleUrls: ['./preview-footer.component.scss']
})
export class PreviewFooterComponent {
  @Input() config: PreviewFooterConfig = {
    address: '',
    buttonText: 'Recorrer',
    buttonAction: '',
    showDivider: true,
    layout: 'horizontal'
  };

  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick(): void {
    this.buttonClick.emit();
  }
}


