import { Routes } from '@angular/router';
import { DietComponent } from './pages/diet/diet.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'home', pathMatch: 'full',
    },
    {
        path: "dieta", component: DietComponent
    },
    {
        path: '**', redirectTo: 'home'
    },
    {
        path: 'home', component: HomeComponent
    }
];
