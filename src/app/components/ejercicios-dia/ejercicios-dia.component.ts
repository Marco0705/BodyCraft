import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UsuarioEjercicioDto } from '../../interfaces/usuario-ejercicio-dto';
import { RoutineServiceService } from '../../services/routine/routine-service.service';
import { EjercicioDto } from '../../interfaces/ejercicio-dto';

@Component({
  selector: 'app-ejercicios-dia',
  templateUrl: './ejercicios-dia.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrls: ['./ejercicios-dia.component.css']
})
export class EjerciciosDiaComponent implements OnInit {
  @Input() diaId: number | null = null;
  @Input() diaTitulo: string | null = null;
  @Input() diaPic: string | null = null;
  @Input() usuarioId: number | null = null;

  ejercicios: { ejercicioData: EjercicioDto, reps: number, peso: number }[] = [];
  cargando: boolean = true;
  error: string | null = null;

  constructor(private routineService: RoutineServiceService) {}

  ngOnInit(): void {
    if (this.usuarioId) {
      this.cargarEjercicios();
    }
  }

  cargarEjercicios(): void {
    if (this.usuarioId) {
      this.cargando = true;
      this.routineService.getUsuarioEjercicio(this.usuarioId).subscribe({
        next: async (data: UsuarioEjercicioDto[]) => {
          // Filtrar los ejercicios por el día seleccionado
          const ejerciciosFiltrados = data.filter(ejercicio => ejercicio.diaSemanaId === this.diaId);

          if (ejerciciosFiltrados.length === 0) {
            this.error = 'No hay ejercicios para este día.';
            this.cargando = false;
            return;
          }

          try {
            // Obtener información detallada de cada ejercicio
            const observables = ejerciciosFiltrados.map(async (ejercicio) => {
              const ejercicioData = await this.routineService.getEjercicioById(ejercicio.ejercicioId).toPromise();

              // Verificar si el ejercicioData es undefined
              if (!ejercicioData) {
                console.warn(`El ejercicio con ID ${ejercicio.ejercicioId} no se encontró.`);
                return null;
              }

              return {
                ejercicioData,
                reps: ejercicio.reps,
                peso: ejercicio.peso
              };
            });

            const resultados = await Promise.all(observables);

            // Filtrar los resultados válidos
            this.ejercicios = resultados.filter((res): res is { ejercicioData: EjercicioDto, reps: number, peso: number } => res !== null);

            if (this.ejercicios.length === 0) {
              this.error = 'No hay ejercicios válidos para mostrar.';
            }
            this.cargando = false;
            console.log('Ejercicios detallados:', this.ejercicios);
          } catch (err) {
            this.error = 'Error al cargar los detalles de los ejercicios.';
            console.error('❌ Error al cargar ejercicios:', err);
            this.cargando = false;
          }
        },
        error: (err: any) => {
          this.error = 'Error al cargar los ejercicios.';
          console.error('❌ Error al cargar ejercicios:', err);
          this.cargando = false;
        }
      });
    }
  }
}
