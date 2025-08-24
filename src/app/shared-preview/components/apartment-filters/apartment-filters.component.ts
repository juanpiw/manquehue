import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ApartmentFilter {
  label: string;
  value: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
}

export interface ApartmentFiltersConfig {
  filters: ApartmentFilter[];
}

@Component({
  selector: 'app-apartment-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apartment-filters.component.html',
  styleUrls: ['./apartment-filters.component.scss']
})
export class ApartmentFiltersComponent {
  @Input() config: ApartmentFiltersConfig = {
    filters: []
  };

  @Output() filterChange = new EventEmitter<{label: string, value: string}>();

  onFilterChange(label: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const value = target.value;
    this.filterChange.emit({ label, value });
  }

  trackByLabel(index: number, filter: ApartmentFilter): string {
    return filter.label;
  }
}
