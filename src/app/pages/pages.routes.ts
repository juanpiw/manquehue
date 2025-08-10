import { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { dashComponent } from './dash/dash.component';
import { menuComponent } from './menu/menu.component';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: PagesComponent, // tu layout (side/top nav)
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dash' },
      { path: 'dash', component: dashComponent },
      { path: 'menu', component: menuComponent },
    ],
  },
];