import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MenuStateService } from '../../servicios/menuStateService';
import { LangSwitcherComponent } from '../../shared/lang-switcher/lang-switcher.component';
import { TranslatePipe } from '../../i18n/t.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu-app',
  standalone: true,
  imports: [RouterOutlet,
    LangSwitcherComponent,TranslatePipe,
   
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class menuComponent implements OnInit, OnDestroy {
  
  currentComponent: string = 'resumen'; // Por defecto
  private subscription: Subscription;
  
  constructor(
    private menuStateService: MenuStateService,
    private router: Router
  ) { 
    this.subscription = this.menuStateService.currentComponent.subscribe(component => {
      this.currentComponent = component;
    });
  }

  ngOnInit() {
    // Obtener el componente actual al inicializar
    this.currentComponent = this.menuStateService.getCurrentComponent();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  changeComponent(componentName: string) {
    console.log(componentName,'menu')
    this.menuStateService.changeComponent(componentName);
  }

  isActive(componentName: string): boolean {
    return this.currentComponent === componentName;
  }

  navigateToPreview() {
    this.router.navigate(['/preview']);
  }
}
