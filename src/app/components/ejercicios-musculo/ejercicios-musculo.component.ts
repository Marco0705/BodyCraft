import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { RoutineServiceService } from '../../services/routine/routine-service.service';
import { EjercicioDto } from '../../interfaces/ejercicio-dto';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ejercicios-musculo',
  templateUrl: './ejercicios-musculo.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrls: ['./ejercicios-musculo.component.css']
})
export class EjerciciosMusculoComponent implements OnInit, OnChanges {
  @Input() grupo: string = '';
  ejercicios: EjercicioDto[] = [];
  cargando: boolean = true;
  error: string | null = null;

  constructor(private routineService: RoutineServiceService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    console.log('Inicializando el componente EjerciciosMusculoComponent.');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grupo'] && changes['grupo'].currentValue) {
      console.log('🔄 Cambio detectado en el grupo muscular:', this.grupo);
      this.obtenerEjercicios();
    }
  }

  obtenerEjercicios(): void {
    this.cargando = true;
    console.log('📦 Obteniendo ejercicios para el grupo:', this.grupo);

    this.routineService.getEjerciciosByGrupoMuscularPaged(this.grupo, 0, 4).subscribe({
      next: (data: any) => {
        // Accedemos a la propiedad 'content' que contiene el array de ejercicios
        console.log('✅ Ejercicios obtenidos:', data);
        this.ejercicios = data.content || [];
        this.cargando = false;
        console.log('✅ Lista de ejercicios procesada:', this.ejercicios);
      },
      error: (err) => {
        this.error = 'Error al cargar los ejercicios.';
        console.error('❌ Error al cargar ejercicios:', err);
        this.cargando = false;
      }
    });
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    // Expresión regular para capturar el ID del video en varias URLs de YouTube
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    // Si encontramos el ID, construimos la URL embebida
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }

    // Si el enlace no es válido, devolver el URL sin modificar
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
