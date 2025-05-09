import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-card-dias-semana-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-dias-semana-component.component.html',
  styleUrls: ['./card-dias-semana-component.component.css'],
})
export class CardDiasSemanaComponentComponent implements AfterViewInit {
  
  @Input() titulo!: string;  // Nombre del día de la semana
  @Input() pic!: string;     // Fecha
  @Input() image!: string;   // Imagen recibida como parámetro
  @Output() slideLeft = new EventEmitter<string>();
  @Output() slideRight = new EventEmitter<string>();

  @ViewChild('slider') slider!: ElementRef;

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
}
