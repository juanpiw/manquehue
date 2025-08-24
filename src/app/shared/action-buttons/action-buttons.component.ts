import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../i18n/t.pipe';

export interface ActionButton {
  type: 'cancel' | 'save' | 'view' | 'custom';
  text: string;
  disabled?: boolean;
  customClass?: string;
}

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.scss'
})
export class ActionButtonsComponent {
  @Input() buttons: ActionButton[] = [];
  @Input() showCancel: boolean = true;
  @Input() showSave: boolean = true;
  @Input() showView: boolean = true;
  @Input() cancelText: string = 'common.cancel';
  @Input() saveText: string = 'common.save';
  @Input() viewText: string = 'common.view';
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal';
  @Input() alignment: 'left' | 'center' | 'right' = 'center';

  @Output() cancelClick = new EventEmitter<void>();
  @Output() saveClick = new EventEmitter<void>();
  @Output() viewClick = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<{type: string, text: string}>();

  onCancel() {
    this.cancelClick.emit();
    this.buttonClick.emit({type: 'cancel', text: this.cancelText});
  }

  onSave() {
    this.saveClick.emit();
    this.buttonClick.emit({type: 'save', text: this.saveText});
  }

  onView() {
    this.viewClick.emit();
    this.buttonClick.emit({type: 'view', text: this.viewText});
  }

  onCustomButton(button: ActionButton) {
    this.buttonClick.emit({type: button.type, text: button.text});
  }
}


