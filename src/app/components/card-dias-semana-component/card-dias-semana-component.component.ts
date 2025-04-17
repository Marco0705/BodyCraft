import { Component, Input } from '@angular/core';
import { DiasSemanaDto } from '../../interfaces/dias-semana-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-dias-semana-component',
  imports: [CommonModule],
  templateUrl: './card-dias-semana-component.component.html',
  styleUrl: './card-dias-semana-component.component.css'
})
export class CardDiasSemanaComponentComponent {
  @Input() dia!: DiasSemanaDto;

  getImagenPorDia(): string {
    switch (this.dia.titulo.toLowerCase()) {
      case 'lunes':
        return '/assets/images/lunes.jpg';
      case 'martes':
        return '/assets/images/martes.jpg';
      case 'miércoles':
        return '/assets/images/miercoles.jpg';
      case 'jueves':
        return '/assets/images/jueves.jpg';
      case 'viernes':
        return '/assets/images/viernes.jpg';
      case 'sábado':
        return '/assets/images/sabado.jpg';
      case 'domingo':
        return '/assets/images/domingo.jpg';
      default:
        return '/assets/images/default.jpg';
    }
  }
}
