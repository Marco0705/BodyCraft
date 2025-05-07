import { Component, EventEmitter, input, Input, Output, output } from '@angular/core';
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
  @Input() num!: number;
  @Output() slideLeft = new EventEmitter<string>();
  @Output() slideRight = new EventEmitter<string>();

  // Método para emitir el evento de mover a la izquierda
  emitSlideLeft() {
    this.slideLeft.emit(`slider${this.num}`);
  }

  // Método para emitir el evento de mover a la derecha
  emitSlideRight() {
    this.slideRight.emit(`slider${this.num}`);
  }

  // Lista de imágenes (como ejemplo de imágenes relacionadas con los días de la semana)
  myItems: any[] = [
    { path: 'images/lunes_00000.jpg' },
    { path: 'images/lunes.webp' },
    { path: 'images/mieroles.jpg' },
    { path: 'images/jueves.jpg' },
    { path: 'images/brazosgrandes.jpg' },
    { path: 'images/espalda.jpg' },
    { path: 'images/espaldaanacha.jpg' },
    { path: 'images/pectorales.jpg' },
    { path: 'images/young-woman-doing-exercise-on-260nw-2317686063.webp' },
  ];
  

}
