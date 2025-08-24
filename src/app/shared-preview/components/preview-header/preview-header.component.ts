import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PreviewHeaderConfig {
  logo?: string;
  title?: string;
  showMenu?: boolean;
  menuItems?: string[];
}

@Component({
  selector: 'app-preview-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-header.component.html',
  styleUrls: ['./preview-header.component.scss']
})
export class PreviewHeaderComponent {
  @Input() config: PreviewHeaderConfig = {
    logo: '',
    title: 'DashManqué',
    showMenu: false,
    menuItems: []
  };

  @Output() menuToggle = new EventEmitter<void>();
  @Output() logoClick = new EventEmitter<void>();

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  onLogoClick(): void {
    this.logoClick.emit();
  }
}

