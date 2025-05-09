import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

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

  ngOnInit(): void {
    console.log('Día ID:', this.diaId);
    console.log('Día Título:', this.diaTitulo);
    console.log('Día Pic:', this.diaPic);
    console.log('Usuario ID:', this.usuarioId);
  }
}
