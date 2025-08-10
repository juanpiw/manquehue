import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { inputComponent } from './shared/input/input.component';  // Asegúrate de que la importación y el nombre son correctos


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,  // Importa RouterModule para usar RouterOutlet
    RouterOutlet,  // Importa RouterOutlet para la funcionalidad de enrutamiento
    inputComponent,
   
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  miValor: string = '';  // Inicializa cualquier propiedad si es necesario

  onValueChange(newValue: string | number): void {
    this.miValor = newValue.toString();  // Maneja cambios y asegura que el tipo sea correcto
    console.log("Valor actualizado:", this.miValor);
  }
}
