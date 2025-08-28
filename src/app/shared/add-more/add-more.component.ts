import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../i18n/t.pipe';

@Component({
  selector: 'app-add-more',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './add-more.component.html',
  styleUrl: './add-more.component.scss'
})
export class AddMoreComponent {
  @Input() text: string = 'add_more.default_text';
  @Input() disabled: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() iconSize: 'sm' | 'md' | 'lg' = 'md';

  @Output() click = new EventEmitter<void>();
  @Output() addMore = new EventEmitter<void>();

  onClick(event: Event) {
    if (this.disabled) return;
    
    event.stopPropagation();
    this.click.emit();
    this.addMore.emit();
  }
}










