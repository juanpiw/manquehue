import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface ApartmentModelConfig {
  title: string;
  floorPlanImage: string;
  contact: ContactInfo;
}

@Component({
  selector: 'app-apartment-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apartment-model.component.html',
  styleUrls: ['./apartment-model.component.scss']
})
export class ApartmentModelComponent {
  @Input() config: ApartmentModelConfig = {
    title: 'Modelo 135,2',
    floorPlanImage: '',
    contact: {
      name: 'Carmen Geissbuhler',
      email: 'carmen@example.com'
    }
  };

  @Output() viewClick = new EventEmitter<void>();
  @Output() contactClick = new EventEmitter<string>();

  onViewClick(): void {
    this.viewClick.emit();
  }

  onContactClick(type: 'email' | 'phone'): void {
    this.contactClick.emit(type);
  }
}
