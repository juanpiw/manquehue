import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LocationTagConfig {
  city: string;
  address: string;
  showIcon?: boolean;
  size?: 'small' | 'medium' | 'large';
}

@Component({
  selector: 'app-location-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-tag.component.html',
  styleUrls: ['./location-tag.component.scss']
})
export class LocationTagComponent {
  @Input() config: LocationTagConfig = {
    city: 'Piedra Roja',
    address: 'Club de Golf Hacienda Chicureo',
    showIcon: true,
    size: 'medium'
  };

  get locationText(): string {
    return `${this.config.city}, ${this.config.address}`;
  }
}
