import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavigationItem {
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
}

export interface PreviewNavigationConfig {
  items: NavigationItem[];
  centered?: boolean;
  showUnderline?: boolean;
}

@Component({
  selector: 'app-preview-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-navigation.component.html',
  styleUrls: ['./preview-navigation.component.scss']
})
export class PreviewNavigationComponent {
  @Input() config: PreviewNavigationConfig = {
    items: [],
    centered: true,
    showUnderline: true
  };

  @Output() itemClick = new EventEmitter<NavigationItem>();

  onItemClick(item: NavigationItem): void {
    if (!item.disabled) {
      this.itemClick.emit(item);
    }
  }

  trackByLabel(index: number, item: NavigationItem): string {
    return item.label;
  }

  hasActiveItems(): boolean {
    return this.config.items && this.config.items.some(item => item.active);
  }
}
