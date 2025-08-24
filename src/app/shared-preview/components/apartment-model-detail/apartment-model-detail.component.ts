import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ModelSpecification {
  label: string;
  value: string;
  icon?: string;
}

export interface FloorType {
  id: string;
  label: string;
  active: boolean;
}

export interface ApartmentModelDetailConfig {
  title: string;
  specifications: ModelSpecification[];
  floorTypes: FloorType[];
  floorPlanImage?: string;
  showFloorPlan: boolean;
  useRealImage?: boolean;
}

@Component({
  selector: 'app-apartment-model-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apartment-model-detail.component.html',
  styleUrls: ['./apartment-model-detail.component.scss']
})
export class ApartmentModelDetailComponent {
  @Input() config!: ApartmentModelDetailConfig;
  @Output() floorTypeChange = new EventEmitter<string>();
  @Output() sendPdfClick = new EventEmitter<void>();
  @Output() quoteModelClick = new EventEmitter<void>();

  onFloorTypeClick(typeId: string): void {
    this.config.floorTypes.forEach(type => {
      type.active = type.id === typeId;
    });
    this.floorTypeChange.emit(typeId);
  }

  onSendPdf(): void {
    this.sendPdfClick.emit();
  }

  onQuoteModel(): void {
    this.quoteModelClick.emit();
  }
}
