import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { recuperarComponent } from './recuperar/recuperar.component';
import { registroComponent } from './registro/registro.componen';

export const LOGIN_ROUTES: Routes = [
  { path: '', component: LoginComponent },
  { path: 'recuperar', component: recuperarComponent },
  { path: 'registro', component: registroComponent },
];