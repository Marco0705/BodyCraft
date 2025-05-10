import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, signal, ViewChild } from '@angular/core';
import { RoutineServiceService } from '../../services/routine/routine-service.service';
import { AuthServiceService } from '../../services/login/auth-service.service';
import { Component, ElementRef, HostListener, OnInit, signal, ViewChild } from '@angular/core';
import { RoutineServiceService } from '../../services/routine/routine-service.service';
import { AuthServiceService } from '../../services/login/auth-service.service';
import { DiasSemanaDto } from '../../interfaces/dias-semana-dto';
import { UserDto } from '../../interfaces/user-dto';
import { UserDto } from '../../interfaces/user-dto';
import { CardDiasSemanaComponentComponent } from '../../components/card-dias-semana-component/card-dias-semana-component.component';
import { Router, RouterModule } from '@angular/router';
import { EjerciciosDiaComponent } from "../../components/ejercicios-dia/ejercicios-dia.component";
import { Router, RouterModule } from '@angular/router';
import { EjerciciosDiaComponent } from "../../components/ejercicios-dia/ejercicios-dia.component";

@Component({
  selector: 'app-routine',
  standalone: true,
  imports: [CommonModule, CardDiasSemanaComponentComponent, RouterModule, EjerciciosDiaComponent],
  imports: [CommonModule, CardDiasSemanaComponentComponent, RouterModule, EjerciciosDiaComponent],
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.css'],
})
export class RoutineComponent implements OnInit {
  // Signals
  diasSemana = signal<DiasSemanaDto[]>([]);
  currentIndex = signal<number>(0);
  usuarioId = signal<number | null>(null);
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);
  numerodiassemana: { [key: string]: string } = {};
  selectedDia: { id: number; titulo: string; pic: string } | null = null;

  // Variables para el arrastre
  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;

  constructor(
    private routineService: RoutineServiceService,
    private authService: AuthServiceService,
    private router: Router
  ) { }
    private authService: AuthServiceService,
    private router: Router
  ) { }

  ngOnInit() {
    this.obtenerUsuario();
  }
    this.obtenerUsuario();
  }

  // Obtener el usuario actual por email
  obtenerUsuario() {
  // Obtener el usuario actual por email
  obtenerUsuario() {
    const email = this.authService.getEmail();
    if (email) {
      this.authService.getUsuarioByEmail(email).subscribe({
        next: (user: UserDto) => {
          if (user?.id) {
            this.usuarioId.set(user.id);
            this.obtenerDiasSemana(user.id);
          if (user?.id) {
            this.usuarioId.set(user.id);
            this.obtenerDiasSemana(user.id);
          } else {
            this.setError('Usuario no encontrado.');
            this.setError('Usuario no encontrado.');
          }
        },
        error: () => this.setError('Error al obtener el usuario.'),
        error: () => this.setError('Error al obtener el usuario.'),
      });
    } else {
      this.setError('No se pudo obtener el email.');
      this.setError('No se pudo obtener el email.');
    }
  }

  // Obtener los días de la semana del usuario
  // Obtener los días de la semana del usuario
  obtenerDiasSemana(usuarioId: number) {
    this.cargando.set(true);
    this.cargando.set(true);
    this.routineService.getDiasSemanaPorUsuario(usuarioId).subscribe({
      next: (data: DiasSemanaDto[]) => {
        this.diasSemana.set(data);

        if (data.length > 0) {
          this.asignarImagenesAleatorias(data);
          this.currentIndex.set(0);
        } else {
          this.setError('No hay rutinas disponibles.');
        }

        this.cargando.set(false);
      next: (data: DiasSemanaDto[]) => {
        this.diasSemana.set(data);

        if (data.length > 0) {
          this.asignarImagenesAleatorias(data);
          this.currentIndex.set(0);
        } else {
          this.setError('No hay rutinas disponibles.');
        }

        this.cargando.set(false);
      },
      error: () => {
        this.setError('Error al cargar las rutinas.');
        this.cargando.set(false);
      error: () => {
        this.setError('Error al cargar las rutinas.');
        this.cargando.set(false);
      },
    });
  }

  // Método para manejar el clic en una tarjeta y navegar a la página de ejercicios con parámetros
  irAEjerciciosDia(dia: { id: number; titulo: string; pic: string }) {
    this.selectedDia = dia;
  }

  // Asignar imágenes aleatorias a cada día
  asignarImagenesAleatorias(dias: DiasSemanaDto[]) {
    dias.forEach((dia) => {
      const imagenAleatoria = this.getRandomImage();
      this.numerodiassemana[dia.titulo] = imagenAleatoria;  // Asignamos la imagen al día
    });
  }

  // Mover a la izquierda en la lista de días
  moverIzquierda(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.set(this.currentIndex() - 1);
      this.aplicarTransicionLenta();
    }
  }

  // Mover a la derecha en la lista de días
  moverDerecha(): void {
    if (this.currentIndex() < this.diasSemana().length - 3) {
      this.currentIndex.set(this.currentIndex() + 1);
      this.aplicarTransicionLenta();
    }
  }

  // Método para aplicar la transición lenta a las tarjetas
  aplicarTransicionLenta() {
    // Selecciona el contenedor de las tarjetas (o las tarjetas individuales)
    const cards = document.querySelectorAll('.card');

    // Asegúrate de quitar la clase 'transition-lenta' de cualquier tarjeta antes de añadirla nuevamente
    cards.forEach(card => card.classList.remove('transition-lenta'));

    // Añade la clase 'transition-lenta' a las tarjetas
    cards.forEach(card => card.classList.add('transition-lenta'));

    // Opcional: quitar la clase 'transition-lenta' después de que pase el tiempo de la transición
    setTimeout(() => {
      cards.forEach(card => card.classList.remove('transition-lenta'));
    }, 2000); // Tiempo de duración de la transición (2 segundos)
  }

  // Manejo de errores
  private setError(message: string): void {
    this.error.set(message);
    setTimeout(() => this.error.set(null), 3000);
  }

  // Obtener las tarjetas visibles, incluyendo un espacio vacío en el primer o último caso
  get diasVisibles(): (DiasSemanaDto | null)[] {
    let visibleDias = [...this.diasSemana()];

    // Cuando estamos en la primera tarjeta, agregar un "vacío" a la izquierda
    if (this.currentIndex() === 0) {
      return [null, ...visibleDias.slice(0, 2)];
    }

    // Cuando estamos en la última tarjeta, agregar un "vacío" a la derecha
    if (this.currentIndex() === visibleDias.length - 1) {
      return [...visibleDias.slice(-2), null];
    }

    // En otros casos, mostrar tres tarjetas consecutivas
    return visibleDias.slice(this.currentIndex(), this.currentIndex() + 3);
  }


  // Mapear cada día de la semana a una lista de imágenes posibles
  images: string[] = [
    'images/HOMBRE11.PNG',
    'images/HOMBRE12.PNG',
    'images/Hombre1.jpg',
    'images/Hombre2.jpg',
    'images/Hombre3.jpg',
    'images/Mujer1.jpg',
    'images/Mujer2.jpg',
    'images/Mujer3.jpg'
  ];

  getRandomImage(): string {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    return this.images[randomIndex];
  }


  // Drag and Drop: iniciar el arrastre
  startDrag(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.scrollContainer.nativeElement.style.cursor = 'grabbing';

    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    this.startX = clientX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
  }

  // Drag and Drop: mover el contenedor durante el arrastre
  drag(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;

    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const x = clientX - this.scrollContainer.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.5; // Sensibilidad al arrastre
    this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  // Drag and Drop: finalizar el arrastre
  stopDrag(): void {
    this.isDragging = false;
    this.scrollContainer.nativeElement.style.cursor = 'grab';
  }

  // Evento para detener el arrastre si se suelta el ratón fuera del contenedor
  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  endDrag(): void {
    if (this.isDragging) this.stopDrag();
  }

  // Prevenir el comportamiento de arrastre predeterminado
  preventDrag(event: Event): void {
    event.preventDefault();
  }

  // Método para manejar el clic en una tarjeta y navegar a la página de ejercicios con parámetros
  irAEjerciciosDia(dia: { id: number; titulo: string; pic: string }) {
    this.selectedDia = dia;
  }

  // Asignar imágenes aleatorias a cada día
  asignarImagenesAleatorias(dias: DiasSemanaDto[]) {
    dias.forEach((dia) => {
      const imagenAleatoria = this.getRandomImage();
      this.numerodiassemana[dia.titulo] = imagenAleatoria;  // Asignamos la imagen al día
    });
  }

  // Mover a la izquierda en la lista de días
  moverIzquierda(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.set(this.currentIndex() - 1);
      this.aplicarTransicionLenta();
    }
  }

  // Mover a la derecha en la lista de días
  moverDerecha(): void {
    if (this.currentIndex() < this.diasSemana().length - 3) {
      this.currentIndex.set(this.currentIndex() + 1);
      this.aplicarTransicionLenta();
    }
  }

  // Método para aplicar la transición lenta a las tarjetas
  aplicarTransicionLenta() {
    // Selecciona el contenedor de las tarjetas (o las tarjetas individuales)
    const cards = document.querySelectorAll('.card');

    // Asegúrate de quitar la clase 'transition-lenta' de cualquier tarjeta antes de añadirla nuevamente
    cards.forEach(card => card.classList.remove('transition-lenta'));

    // Añade la clase 'transition-lenta' a las tarjetas
    cards.forEach(card => card.classList.add('transition-lenta'));

    // Opcional: quitar la clase 'transition-lenta' después de que pase el tiempo de la transición
    setTimeout(() => {
      cards.forEach(card => card.classList.remove('transition-lenta'));
    }, 2000); // Tiempo de duración de la transición (2 segundos)
  }

  // Manejo de errores
  private setError(message: string): void {
    this.error.set(message);
    setTimeout(() => this.error.set(null), 3000);
  }

  // Obtener las tarjetas visibles, incluyendo un espacio vacío en el primer o último caso
  get diasVisibles(): (DiasSemanaDto | null)[] {
    let visibleDias = [...this.diasSemana()];

    // Cuando estamos en la primera tarjeta, agregar un "vacío" a la izquierda
    if (this.currentIndex() === 0) {
      return [null, ...visibleDias.slice(0, 2)];
    }

    // Cuando estamos en la última tarjeta, agregar un "vacío" a la derecha
    if (this.currentIndex() === visibleDias.length - 1) {
      return [...visibleDias.slice(-2), null];
    }

    // En otros casos, mostrar tres tarjetas consecutivas
    return visibleDias.slice(this.currentIndex(), this.currentIndex() + 3);
  }


  // Mapear cada día de la semana a una lista de imágenes posibles
  images: string[] = [
    'images/HOMBRE11.PNG',
    'images/HOMBRE12.PNG',
    'images/Hombre1.jpg',
    'images/Hombre2.jpg',
    'images/Hombre3.jpg',
    'images/Mujer1.jpg',
    'images/Mujer2.jpg',
    'images/Mujer3.jpg'
  ];

  getRandomImage(): string {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    return this.images[randomIndex];
  }


  // Drag and Drop: iniciar el arrastre
  startDrag(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.scrollContainer.nativeElement.style.cursor = 'grabbing';

    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    this.startX = clientX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
  }

  // Drag and Drop: mover el contenedor durante el arrastre
  drag(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;

    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const x = clientX - this.scrollContainer.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.5; // Sensibilidad al arrastre
    this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  // Drag and Drop: finalizar el arrastre
  stopDrag(): void {
    this.isDragging = false;
    this.scrollContainer.nativeElement.style.cursor = 'grab';
  }

  // Evento para detener el arrastre si se suelta el ratón fuera del contenedor
  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  endDrag(): void {
    if (this.isDragging) this.stopDrag();
  }

  // Prevenir el comportamiento de arrastre predeterminado
  preventDrag(event: Event): void {
    event.preventDefault();
  }
}
