// src/app/pages/home/home.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthServiceService } from '../../services/login/auth-service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userName: string | null = null;
  isAuthenticated: boolean = false;

  private authService = inject(AuthServiceService);

  featuredWorkouts = [
    {
      id: 1,
      title: 'Entrenamiento de Fuerza',
      description: 'Aumenta tu fuerza y resistencia con este plan completo',
      image: 'assets/images/strength.webp',
      level: 'Intermedio',
    },
    {
      id: 2,
      title: 'Cardio HIIT',
      description: 'Quema calorías y mejora tu resistencia cardiovascular',
      image: 'assets/images/cardio.webp',
      level: 'Avanzado',
    },
    {
      id: 3,
      title: 'Yoga para Principiantes',
      description: 'Mejora tu flexibilidad y reduce el estrés',
      image: 'assets/images/yoga.webp',
      level: 'Principiante',
    },
  ];

  nutritionTips = [
    {
      id: 1,
      title: 'Proteínas para la recuperación muscular',
      content:
        'Consume proteínas de alta calidad dentro de los 30 minutos posteriores a tu entrenamiento.',
    },
    {
      id: 2,
      title: 'Hidratación adecuada',
      content:
        'Beber agua regularmente es esencial para un rendimiento óptimo.',
    },
    {
      id: 3,
      title: 'Carbohidratos complejos',
      content:
        'Incorpora carbohidratos complejos para mantener los niveles de energía durante todo el día.',
    },
  ];

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userName = this.authService.getUserName();

    // Suscribirse a cambios en la autenticación
    this.authService.authStatus$.subscribe((status) => {
      this.isAuthenticated = status;
      this.userName = this.authService.getUserName();
    });
  }
}
