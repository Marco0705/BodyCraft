import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
=======
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit } from '@angular/core';
>>>>>>> master

@Component({
  selector: 'app-card-dias-semana-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-dias-semana-component.component.html',
  styleUrls: ['./card-dias-semana-component.component.css'],
})
<<<<<<< HEAD
export class CardDiasSemanaComponentComponent implements AfterViewInit, OnDestroy {

  @Input() titulo!: string;
  @Input() pic!: string;
  @Input() image!: string;
  @Output() slideLeft = new EventEmitter<string>();
  @Output() slideRight = new EventEmitter<string>();

  @ViewChild('imageElement') imageElement!: ElementRef;
  private observer!: IntersectionObserver;

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage();
          this.observer.unobserve(this.imageElement.nativeElement);
        }
      });
    }, {
      rootMargin: '0px 0px 200px 0px', // Carga la imagen 200px antes de que sea visible
      threshold: 0
    });

    this.observer.observe(this.imageElement.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
=======
export class CardDiasSemanaComponentComponent implements OnInit {
  
  @Input() titulo!: string;  // Nombre del día de la semana
  @Input() pic!: string;     // Fecha
  @Input() image!: string;   // Imagen recibida como parámetro
  @Output() slideLeft = new EventEmitter<string>();
  @Output() slideRight = new EventEmitter<string>();

  @ViewChild('slider') slider!: ElementRef;

  ngOnInit(): void {
    this.image;
>>>>>>> master
  }

  loadImage(): void {
    // No es necesario hacer nada aquí si el [src]="image" ya está enlazado
    // Si estuvieras usando un placeholder, aquí cambiarías el src.
  }
}