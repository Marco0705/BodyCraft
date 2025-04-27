// src/app/services/fisico/imc.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResultadoIMC {
  imc: number;
  categoria?: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ImcService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api/Fisico';

  /**
   * Calcula el IMC enviando el peso y altura a la API
   * @param peso Peso en kilogramos
   * @param altura Altura en metros
   * @returns Observable con el resultado del cálculo de IMC
   */
  calcularIMC(peso: number, altura: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/imc`, {
      params: {
        peso: peso.toString(),
        altura: altura.toString(),
      },
    });
  }

  /**
   * Obtiene la categoría y descripción basada en el valor del IMC
   * @param imc Valor numérico del IMC
   * @returns Objeto con la categoría y descripción
   */
  obtenerCategoriaIMC(imc: number): { categoria: string; descripcion: string } {
    if (imc < 18.5) {
      return {
        categoria: 'Bajo peso',
        descripcion:
          'Es recomendable aumentar la ingesta calórica y consultar con un profesional.',
      };
    } else if (imc < 25) {
      return {
        categoria: 'Peso normal',
        descripcion: '¡Felicidades! Mantén tu estilo de vida saludable.',
      };
    } else if (imc < 30) {
      return {
        categoria: 'Sobrepeso',
        descripcion:
          'Considera ajustar tu dieta y aumentar tu actividad física.',
      };
    } else if (imc < 35) {
      return {
        categoria: 'Obesidad grado I',
        descripcion:
          'Es recomendable consultar con un profesional para un plan personalizado.',
      };
    } else if (imc < 40) {
      return {
        categoria: 'Obesidad grado II',
        descripcion: 'Importante buscar apoyo médico para gestionar tu salud.',
      };
    } else {
      return {
        categoria: 'Obesidad grado III',
        descripcion:
          'Se recomienda atención médica inmediata para gestionar riesgos de salud.',
      };
    }
  }

  /**
   * Obtiene la clase CSS para estilizar el resultado según el valor del IMC
   * @param imc Valor numérico del IMC
   * @returns String con las clases CSS
   */
  obtenerClaseResultado(imc: number): string {
    if (imc < 18.5) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    } else if (imc < 25) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    } else if (imc < 30) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    } else {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  }
}
