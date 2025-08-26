import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EquipmentOption {
  id: string;
  label: string;
  selected: boolean;
}

export interface EquipmentSelectorConfig {
  title: string;
  description: string;
  options: EquipmentOption[];
  showScrollbar: boolean;
  showQuoteButton: boolean;
  quoteButtonText: string;
}

@Component({
  selector: 'app-equipment-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipment-selector.component.html',
  styleUrls: ['./equipment-selector.component.scss']
})
export class EquipmentSelectorComponent {
  @Input() config!: EquipmentSelectorConfig;
  @Output() optionChange = new EventEmitter<string>();
  @Output() quoteClick = new EventEmitter<void>();

  onOptionClick(optionId: string): void {
    this.config.options.forEach(option => {
      option.selected = option.id === optionId;
    });
    this.optionChange.emit(optionId);
  }

  onQuoteClick(): void {
    this.quoteClick.emit();
  }

  getSelectedOptions(): EquipmentOption[] {
    return this.config.options.filter(option => option.selected);
  }
}

