import { ExtraOptions, Routes } from '@angular/router';


export const ROUTING_CONFIG: ExtraOptions = {
  paramsInheritanceStrategy: 'always',
  bindToComponentInputs: true,
};

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/pages.routes').then(m => m.PAGES_ROUTES),
    // canActivateChild: [authGuardCanActivate], // opcional
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.routes').then(m => m.LOGIN_ROUTES),
    // canActivate: [AuthLoginGuardCanActivate], // opcional
  },
  { path: '**', redirectTo: '' },
];