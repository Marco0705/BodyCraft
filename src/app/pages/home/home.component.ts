// src/app/pages/home/home.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/login/auth-service.service';
import { ImcService, ResultadoIMC } from '../../services/imc/imc.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userName: string | null = null;
  isAuthenticated: boolean = false;

  // Variables para el cálculo de IMC
  peso: number | null = null;
  altura: number | null = null;
  resultado: ResultadoIMC | null = null;
  error: string | null = null;
  loading: boolean = false;
  resultadoClass: string = '';

  private authService = inject(AuthServiceService);
  private imcService = inject(ImcService);

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

  calcularIMC(): void {
    // Validar los datos ingresados
    if (!this.peso || !this.altura || this.peso <= 0 || this.altura <= 0) {
      this.error = 'Por favor ingresa valores válidos para peso y altura.';
      return;
    }

    this.loading = true;
    this.error = null;

    // Usar el servicio para calcular el IMC
    this.imcService.calcularIMC(this.peso, this.altura).subscribe({
      next: (response) => {
        this.loading = false;

        // Procesar la respuesta (ajusta según el formato exacto de tu API)
        const imc = response.imc || response;

        // Crear objeto de resultado con categoría y descripción
        this.resultado = {
          imc: imc,
          ...this.imcService.obtenerCategoriaIMC(imc),
        };

        // Establecer la clase de color según el resultado
        this.resultadoClass = this.imcService.obtenerClaseResultado(imc);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al calcular el IMC. Por favor intenta nuevamente.';
        console.error('Error al calcular IMC:', err);
      },
    });
  }

  scrollToIMC(): void {
    const imcSection = document.getElementById('imc-section');
    if (imcSection) {
      imcSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
