import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RoutineServiceService } from '../../services/routine/routine-service.service';
import { EjercicioDto } from '../../interfaces/ejercicio-dto';
import { CommonModule } from '@angular/common';
import { GruposMuscularesComponent } from "../grupos-musculares/grupos-musculares.component";

@Component({
  selector: 'app-ejercicios-dia',
  templateUrl: './ejercicios-dia.component.html',
  imports: [CommonModule, GruposMuscularesComponent],
  styleUrls: ['./ejercicios-dia.component.css'],
  standalone: true,
})
export class EjerciciosDiaComponent implements OnInit, OnChanges {
  @Input() diaId: number | null = null;
  @Input() diaTitulo: string | null = null;
  @Input() diaPic: string | null = null;
  @Input() usuarioId: number | null = null;

  mostrarGruposMusculares: boolean = false;
  ejercicios: { ejercicioData: EjercicioDto, reps: number, peso: number }[] = [];
  cargando: boolean = true;
  error: string | null = null;

  constructor(private routineService: RoutineServiceService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if (this.usuarioId) {
      this.cargarEjercicios();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['diaId'] && !changes['diaId'].firstChange) {
      this.cargarEjercicios();
    }
  }

  cargarEjercicios(): void {
    if (this.diaId) {
      this.cargando = true;
      this.error = null;

      this.routineService.getEjerciciosByDiaSemana(this.diaId).subscribe({
        next: (data: EjercicioDto[]) => {
          this.ejercicios = data.map(ejercicio => ({
            ejercicioData: ejercicio,
            reps: ejercicio.numeroRepeticiones || 0,
            peso: ejercicio.ultimoPesoTirado || 0,
          }));
          this.cargando = false;
        },
        error: () => {
          this.error = 'Error al cargar los ejercicios del día.';
          this.cargando = false;
        }
      });
    } else {
      this.error = 'Día no seleccionado.';
      this.ejercicios = [];
    }
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    // Expresión regular para capturar el ID del video en varias URLs de YouTube
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    // Si encontramos el ID, construimos la URL embebida
    if (videoId) {
      const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }

    // Si el enlace no es válido, devolver el URL sin modificar
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  toggleGruposMusculares(): void {
    this.mostrarGruposMusculares = !this.mostrarGruposMusculares;
  }

}
