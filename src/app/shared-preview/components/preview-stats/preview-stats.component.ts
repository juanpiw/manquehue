import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatItem {
  value: string | number;
  label: string;
  icon?: string;
  color?: string;
}

export interface PreviewStatsConfig {
  items: StatItem[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  size?: 'small' | 'medium' | 'large';
  showDividers?: boolean;
  centered?: boolean;
}

@Component({
  selector: 'app-preview-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-stats.component.html',
  styleUrls: ['./preview-stats.component.scss']
})
export class PreviewStatsComponent {
  @Input() config: PreviewStatsConfig = {
    items: [],
    layout: 'horizontal',
    size: 'medium',
    showDividers: true,
    centered: true
  };

  trackByLabel(index: number, item: StatItem): string {
    return item.label;
  }
}
