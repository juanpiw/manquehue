import { Routes } from '@angular/router';
import { LivePreviewComponent } from './live-preview/live-preview.component';
import { ApiTesterComponent } from './api-tester/api-tester.component';

export const PREVIEW_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'live',
    pathMatch: 'full'
  },
  {
    path: 'live',
    component: LivePreviewComponent,
    title: 'Previsualización en Vivo'
  },
  {
    path: 'api-tester',
    component: ApiTesterComponent,
    title: 'API Tester Dash Manquehue'
  }
];

















