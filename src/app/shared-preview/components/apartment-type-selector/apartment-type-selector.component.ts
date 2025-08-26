import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ApartmentType {
  id: string;
  label: string;
  active: boolean;
}

export interface ApartmentTypeSelectorConfig {
  title: string;
  types: ApartmentType[];
}

@Component({
  selector: 'app-apartment-type-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apartment-type-selector.component.html',
  styleUrls: ['./apartment-type-selector.component.scss']
})
export class ApartmentTypeSelectorComponent {
  @Input() config: ApartmentTypeSelectorConfig = {
    title: 'Tipo de apartamento',
    types: []
  };

  @Output() typeChange = new EventEmitter<string>();

  onTypeClick(type: ApartmentType): void {
    // Update active state
    this.config.types.forEach(t => t.active = t.id === type.id);
    this.typeChange.emit(type.id);
  }

  trackById(index: number, type: ApartmentType): string {
    return type.id;
  }
}

