import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuStateService } from '../../servicios/menuStateService';
import { menuComponent } from '../menu/menu.component';
import { NgClass, NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-dash-app',
  standalone: true,
  imports: [RouterOutlet,
    menuComponent,
    NgIf,
    NgClass,
    NgFor,
   
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
  
}
