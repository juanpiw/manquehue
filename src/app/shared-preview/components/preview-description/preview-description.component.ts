import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PreviewDescriptionConfig {
  text: string;
  maxWidth?: string;
  centered?: boolean;
  showBackground?: boolean;
  padding?: 'small' | 'medium' | 'large';
}

@Component({
  selector: 'app-preview-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-description.component.html',
  styleUrls: ['./preview-description.component.scss']
})
export class PreviewDescriptionComponent {
  @Input() config: PreviewDescriptionConfig = {
    text: '',
    maxWidth: '800px',
    centered: true,
    showBackground: false,
    padding: 'medium'
  };
}

