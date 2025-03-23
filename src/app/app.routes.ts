import { Routes } from '@angular/router';
import { DietComponent } from './pages/diet/diet.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'home', pathMatch: 'full',
    },
    {
        path: "dieta", component: DietComponent
    }
];
