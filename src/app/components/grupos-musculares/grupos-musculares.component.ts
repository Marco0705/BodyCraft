import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EjerciciosMusculoComponent } from "../ejercicios-musculo/ejercicios-musculo.component";

@Component({
  selector: 'app-grupos-musculares',
  imports: [CommonModule, EjerciciosMusculoComponent],
  templateUrl: './grupos-musculares.component.html',
  styleUrl: './grupos-musculares.component.css'
})
export class GruposMuscularesComponent {
  gruposMusculares = [
    { nombre: 'Pecho', imagen: 'images/Hombre2.jpg' },
    { nombre: 'Espalda', imagen: 'images/Hombre1.jpg' },
    { nombre: 'Brazos', imagen: 'images/Mujer1.jpg' },
    { nombre: 'Hombros', imagen: 'images/Hombre2.jpg' },
    { nombre: 'Piernas', imagen: 'images/Hombre3.jpg' },
    { nombre: 'Abdomen', imagen: 'images/Mujer2.jpg' },
  ];

  mostrarDetalle = false;
  grupoSeleccionado: string = '';

  seleccionarGrupo(grupo: { nombre: string }) {
    this.grupoSeleccionado = grupo.nombre;
    this.mostrarDetalle = true;
    console.log('✅ Grupo seleccionado:', this.grupoSeleccionado);
  }
}