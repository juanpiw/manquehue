import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuStateService } from '../../servicios/menuStateService';
import { menuComponent } from '../menu/menu.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ResumenComponent } from '../../sections/resumen/resumen.component';
import { ProyectosComponent } from '../../sections/proyectos/proyectos.component';
import { NuevoProyectoComponent } from '../../sections/nuevo-proyecto/nuevo-proyecto.component';
import { ConfiguracionComponent } from '../../sections/configuracion/configuracion.component';
import { UsoComponent } from '../../sections/uso/uso.component';
import { SoporteAyudaComponent } from '../../sections/soporte-ayuda/soporte-ayuda.component';
import { UsuarioComponent } from '../../sections/usuario/usuario.component';


@Component({
  selector: 'app-dash-app',
  standalone: true,
  imports: [RouterOutlet,
    menuComponent,
    NgIf,
    NgClass,
    NgFor,
    ResumenComponent,
    ProyectosComponent,
    NuevoProyectoComponent,
    ConfiguracionComponent,
    UsoComponent,
    SoporteAyudaComponent,
    UsuarioComponent
   
  ],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss'
})
export class dashComponent {
    currentComponent!: string;
    subscription: Subscription;
  
    constructor(private menuStateService: MenuStateService) {
      this.subscription = this.menuStateService.currentComponent.subscribe(component => {
        this.currentComponent = component;
      });
    }
  
      ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onNavigate(destination: 'nuevoProyecto' | 'proyectos') {
    this.menuStateService.changeComponent(destination);
  }
  
}
