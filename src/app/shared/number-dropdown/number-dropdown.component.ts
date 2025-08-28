import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../i18n/t.pipe';

@Component({
  selector: 'app-number-dropdown',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './number-dropdown.component.html',
  styleUrl: './number-dropdown.component.scss'
})
export class NumberDropdownComponent {
  @Input() value: number = 1;
  @Input() min: number = 1;
  @Input() max: number = 30;
  @Input() disabled: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() valueChange = new EventEmitter<number>();
  @Output() change = new EventEmitter<number>();

  isOpen: boolean = false;
  numbers: number[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.generateNumbers();
  }

  ngOnChanges() {
    this.generateNumbers();
  }

  private generateNumbers() {
    this.numbers = [];
    for (let i = this.min; i <= this.max; i++) {
      this.numbers.push(i);
    }
  }

  toggleDropdown(event: Event) {
    if (this.disabled) return;
    
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  selectNumber(number: number) {
    if (this.value !== number) {
      this.value = number;
      this.valueChange.emit(number);
      this.change.emit(number);
    }
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.isOpen = false;
  }

  @HostListener('document:keydown.arrowdown', ['$event'])
  onArrowDown(event: Event) {
    if (this.isOpen) {
      event.preventDefault();
      const currentIndex = this.numbers.indexOf(this.value);
      const nextIndex = Math.min(currentIndex + 1, this.numbers.length - 1);
      this.selectNumber(this.numbers[nextIndex]);
    }
  }

  @HostListener('document:keydown.arrowup', ['$event'])
  onArrowUp(event: Event) {
    if (this.isOpen) {
      event.preventDefault();
      const currentIndex = this.numbers.indexOf(this.value);
      const prevIndex = Math.max(currentIndex - 1, 0);
      this.selectNumber(this.numbers[prevIndex]);
    }
  }
}











