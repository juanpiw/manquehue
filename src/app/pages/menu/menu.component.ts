import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MenuStateService } from '../../servicios/menuStateService';
import { AuthService } from '../../servicios/authService.service';
import { LangSwitcherComponent } from '../../shared/lang-switcher/lang-switcher.component';
import { TranslatePipe } from '../../i18n/t.pipe';
import { Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';

interface NavItem {
  id: string;
  labelKey: string;
  icon: string;
  component?: string;
  route?: string;
}

@Component({
  selector: 'app-menu-app',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LangSwitcherComponent,
    TranslatePipe,
    LucideAngularModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class menuComponent implements OnInit, OnDestroy {
  currentComponent = 'resumen';
  private subscription: Subscription;
  isCompact = false;

  mainItems: NavItem[] = [
    {
      id: 'resumen',
      labelKey: 'menu.resumen',
      component: 'resumen',
      icon: 'layout-grid'
    },
    {
      id: 'proyectos',
      labelKey: 'menu.proyectos',
      component: 'proyectos',
      icon: 'building-2'
    },
    {
      id: 'uso',
      labelKey: 'menu.estadisticas_uso',
      component: 'uso',
      icon: 'bar-chart-3'
    },
    {
      id: 'configuracion',
      labelKey: 'menu.configuraciones',
      component: 'configuracion',
      icon: 'settings-2'
    },
    {
      id: 'nuevoProyecto',
      labelKey: 'menu.nuevo_proyecto',
      component: 'nuevoProyecto',
      icon: 'plus-circle'
    },
    {
      id: 'preview',
      labelKey: 'menu_preview',
      route: '/preview',
      icon: 'eye'
    }
  ];

  footerItems: NavItem[] = [
    {
      id: 'usuario',
      labelKey: 'menu.usuario',
      component: 'Usuario',
      icon: 'user-round'
    },
    {
      id: 'soporte',
      labelKey: 'menu.soporte_ayuda',
      component: 'soporteyAyuda',
      icon: 'life-buoy'
    }
  ];
  
  constructor(
    private menuStateService: MenuStateService,
    private router: Router,
    private authService: AuthService
  ) {
    this.subscription = new Subscription();
    this.subscription.add(
      this.menuStateService.currentComponent.subscribe(component => {
        this.currentComponent = component;
      })
    );
    this.subscription.add(
      this.menuStateService.menuCompact$.subscribe(state => {
        this.isCompact = state;
      })
    );
  }

  ngOnInit() {
    this.currentComponent = this.menuStateService.getCurrentComponent();
    this.isCompact = this.menuStateService.getMenuCompact();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  changeComponent(componentName: string) {
    this.menuStateService.changeComponent(componentName);
  }

  isActive(componentName?: string): boolean {
    return !!componentName && this.currentComponent === componentName;
  }

  handleItemClick(item: NavItem) {
    if (item.component) {
      this.changeComponent(item.component);
    }
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  toggleCompact() {
    this.isCompact = !this.isCompact;
    this.menuStateService.setMenuCompact(this.isCompact);
  }

  logout() {
    this.authService.logout();
    this.menuStateService.changeComponent('resumen');
    this.router.navigate(['/login']);
  }
}
