import { Routes } from '@angular/router';
import { LivePreviewComponent } from './live-preview/live-preview.component';

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
  }
];















