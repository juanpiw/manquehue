import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ApartmentListItem {
  id: string;
  title: string;
  selected: boolean;
}

export interface ApartmentListConfig {
  items: ApartmentListItem[];
}

@Component({
  selector: 'app-apartment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss']
})
export class ApartmentListComponent {
  @Input() config: ApartmentListConfig = {
    items: []
  };

  @Output() itemClick = new EventEmitter<string>();

  onItemClick(item: ApartmentListItem): void {
    this.itemClick.emit(item.id);
  }

  trackById(index: number, item: ApartmentListItem): string {
    return item.id;
  }
}
