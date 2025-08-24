import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SurfaceArea {
  interior: string;
  terraza: string;
  total: string;
}

export interface ApartmentDetails {
  superficie: SurfaceArea;
  orientacion: string;
  banos: number;
  habitaciones: number;
  piso: number;
}

export interface ApartmentDetailCardConfig {
  details: ApartmentDetails;
}

@Component({
  selector: 'app-apartment-detail-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apartment-detail-card.component.html',
  styleUrls: ['./apartment-detail-card.component.scss']
})
export class ApartmentDetailCardComponent {
  @Input() config: ApartmentDetailCardConfig = {
    details: {
      superficie: {
        interior: '0 M2',
        terraza: '0 M2',
        total: '0 M2'
      },
      orientacion: '',
      banos: 0,
      habitaciones: 0,
      piso: 0
    }
  };

  @Output() cardClick = new EventEmitter<void>();

  onCardClick(): void {
    this.cardClick.emit();
  }
}
