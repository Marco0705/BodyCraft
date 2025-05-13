// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DietComponent } from './pages/diet/diet.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RoutineComponent } from './pages/routine/routine.component';
import { authGuard } from '../core/guards/auth.guard';
import { RegisterComponent } from './pages/register/register.component';
import { ProductoListComponent } from './pages/producto-list/producto-list.component';
import { ProductFormComponent } from './shared/components/product-form/product-form.component';
import { ProductoDetailComponent } from './pages/producto-detail/producto-detail.component';
import { ComidaCrearComponent } from './components/comida-crear/comida-crear.component';

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
    path: 'productos',
    component: ProductoListComponent,
  },
  {
    path: 'productos/nuevo',
    component: ProductFormComponent,
  },
  {
    path: 'productos/editar/:id',
    component: ProductFormComponent,
  },
  {
    path: 'producto/detalle/:id',
    component: ProductoDetailComponent,
  },
  {
    path: 'comida',
    component: ComidaCrearComponent,
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