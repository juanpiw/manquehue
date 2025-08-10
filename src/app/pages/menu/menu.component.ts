import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuStateService } from '../../servicios/menuStateService';


@Component({
  selector: 'app-menu-app',
  standalone: true,
  imports: [RouterOutlet,
   
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class menuComponent {
  
    constructor(private menuStateService: MenuStateService) { }

    changeComponent(componentName: string) {
        console.log(componentName,'menu')
      this.menuStateService.changeComponent(componentName);
    }
}
