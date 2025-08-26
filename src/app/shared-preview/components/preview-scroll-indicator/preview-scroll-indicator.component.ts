import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ScrollIndicatorConfig {
  totalSections: number;
  currentSection: number;
  position?: 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
  sections?: {
    id: number;
    label: string;
    elementId?: string;
  }[];
}

@Component({
  selector: 'app-preview-scroll-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-scroll-indicator.component.html',
  styleUrls: ['./preview-scroll-indicator.component.scss']
})
export class PreviewScrollIndicatorComponent {
  @Input() config: ScrollIndicatorConfig = {
    totalSections: 1,
    currentSection: 1,
    position: 'right',
    size: 'medium',
    showLabels: false
  };

  @Output() sectionChange = new EventEmitter<number>();
  @Output() sectionNavigate = new EventEmitter<{id: number, label: string, elementId?: string}>();

  get sections(): number[] {
    return Array.from({ length: this.config.totalSections }, (_, i) => i + 1);
  }

  onSectionClick(section: number): void {
    this.sectionChange.emit(section);
    
    // Emit navigation event with section details
    const sectionConfig = this.config.sections?.find(s => s.id === section);
    if (sectionConfig) {
      this.sectionNavigate.emit(sectionConfig);
    }
  }

  isActive(section: number): boolean {
    return section === this.config.currentSection;
  }

  trackBySection(index: number, section: number): number {
    return section;
  }

  getSectionLabel(section: number): string {
    const sectionConfig = this.config.sections?.find(s => s.id === section);
    return sectionConfig?.label || section.toString();
  }
}
