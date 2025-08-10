import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [RouterOutlet,
    MatIconModule
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class inputComponent {
  @Input() label: string = '';
  @Input() type: string = 'text';  // Puedes personalizar el tipo de input (text, number, password, etc.)
  @Input() value: string | number = '';  // Valor inicial del input
  @Output() valueChange = new EventEmitter<string | number>();  // Emite cambios al valor

  ngOnInit(): void {}

  onChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }
}
