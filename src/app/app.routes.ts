// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DietComponent } from './pages/diet/diet.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RoutineComponent } from './pages/routine/routine.component';
import { authGuard } from '../core/guards/auth.guard';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    //canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },

  {
    path: 'dieta',
    component: DietComponent,
    canActivate: [authGuard],
  },
  {
    path: 'rutina',
    component: RoutineComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
