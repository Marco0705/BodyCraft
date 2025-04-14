import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import Lottie from 'lottie-web';
import player from 'lottie-web';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-routine',
  imports: [CommonModule, LottieComponent],
  templateUrl: './routine.component.html',
  styleUrl: './routine.component.css'
})
export class RoutineComponent {
  comidasDiasSemana = ['Desayuno', 'Almuerzo', 'Cena']; // ejemplo
  showOverlay = false;
  showCloudImage = false;
  showText = false;
  showAnimation = false;

  lottieOptions: AnimationOptions = {
    path: '/assets/animations/animation1715270027160.json',
    autoplay: true,
    loop: true,
  };

  generarRutina() {
    // Aquí va tu lógica
    this.showOverlay = true;
    this.showText = true;
    this.showCloudImage = true;
    this.showAnimation = true;
  }
}
