import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SelectorOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface PreviewSelectorConfig {
  type: 'radio' | 'dropdown' | 'toggle';
  options: SelectorOption[];
  selectedValue?: string;
  label?: string;
  layout?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
}

@Component({
  selector: 'app-preview-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-selector.component.html',
  styleUrls: ['./preview-selector.component.scss']
})
export class PreviewSelectorComponent {
  @Input() config: PreviewSelectorConfig = {
    type: 'radio',
    options: [],
    selectedValue: '',
    label: '',
    layout: 'horizontal',
    size: 'medium'
  };

  @Output() selectionChange = new EventEmitter<string>();

  onOptionSelect(event: Event | string): void {
    let value: string;
    
    if (typeof event === 'string') {
      value = event;
    } else {
      const target = event.target as HTMLSelectElement;
      value = target.value;
    }
    
    this.config.selectedValue = value;
    this.selectionChange.emit(value);
  }

  isSelected(value: string): boolean {
    return this.config.selectedValue === value;
  }

  trackByValue(index: number, option: SelectorOption): string {
    return option.value;
  }
}
