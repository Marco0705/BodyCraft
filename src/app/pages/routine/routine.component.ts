import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RoutineServiceService } from '../../services/routine-service.service';
import { DiasSemanaDto } from '../../interfaces/dias-semana-dto';

@Component({
  selector: 'app-routine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.css'] // cuidado con `styleUrl` vs `styleUrls`
})
export class RoutineComponent implements OnInit {
  diasSemana: DiasSemanaDto[] = [];
  cargando: boolean = false;
  error: string | null = null;

  constructor(private routineService: RoutineServiceService) {}

  ngOnInit() {
    this.obtenerDiasSemana();
  }

  obtenerDiasSemana() {
    this.cargando = true;
    this.error = null;

    this.routineService.getDiasSemana().subscribe({
      next: (data) => {
        this.diasSemana = data;
        console.log('Días de la semana recibidos:', data);
      },
      error: (err) => {
        this.error = 'Error al obtener los días de la semana.';
        console.error('Detalles del error:', err);
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }
}
