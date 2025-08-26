import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PreviewHeroConfig {
  title: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large';
  centered?: boolean;
  showDivider?: boolean;
}

@Component({
  selector: 'app-preview-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-hero.component.html',
  styleUrls: ['./preview-hero.component.scss']
})
export class PreviewHeroComponent {
  @Input() config: PreviewHeroConfig = {
    title: '',
    subtitle: '',
    size: 'large',
    centered: true,
    showDivider: false
  };
}


