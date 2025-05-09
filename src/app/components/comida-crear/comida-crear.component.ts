import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DiasSemana } from '../../interfaces/dias-semana';
import { ProductoService } from '../../services/producto.service';
import { ComidaService } from '../../services/comida.service';
import { IProducto } from '../../interfaces/iproducto';
import { DiasSemanaService } from '../../services/dias-semana.service';
import { IComida, ICreateComidaDTO } from '../../interfaces/icomida';

@Component({
  selector: 'app-comida-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comida-crear.component.html',
  styleUrls: ['./comida-crear.component.css']
})
export class ComidaCrearComponent implements OnInit {
  form: FormGroup;
  productos: IProducto[] = [];
  diasSemana: DiasSemana[] = [];
  productosSeleccionados: IProducto[] = [];

  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private comidaService: ComidaService,
    private diaService: DiasSemanaService
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      pic: [''],
      kcal: [0, Validators.required],
      proteinas: [0, Validators.required],
      gramos: [0, Validators.required],
      carbohidratos: [0, Validators.required],
      diaSemana: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.productoService.getAllProductos().subscribe(data => this.productos = data);
    this.diaService.getDias().subscribe(data => this.diasSemana = data);
  }

  toggleProducto(producto: IProducto) {
    const index = this.productosSeleccionados.findIndex(p => p.id === producto.id);
    if (index > -1) {
      this.productosSeleccionados.splice(index, 1);
    } else {
      this.productosSeleccionados.push(producto);
    }
  }

  esSeleccionado(producto: IProducto): boolean {
    return this.productosSeleccionados.some(p => p.id === producto.id);
  }

  onSubmit() {
    if (this.form.invalid || this.productosSeleccionados.length === 0) {
      this.error.set('Completa todos los campos y selecciona al menos un producto.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    // Convertir el formulario a ICreateComidaDTO
    const comidaDTO: ICreateComidaDTO = {
      titulo: this.form.value.titulo,
      pic: this.form.value.pic,
      kcal: this.form.value.kcal,
      proteinas: this.form.value.proteinas,
      gramos: this.form.value.gramos,
      carbohidratos: this.form.value.carbohidratos,
      diaSemanaId: +this.form.value.diaSemana,
      productoIds: this.productosSeleccionados.map(p => p.id!)
    };

    // Enviar como array
    this.comidaService.crearComidas([comidaDTO]).subscribe({
      next: () => {
        this.success.set(true);
        this.form.reset();
        this.productosSeleccionados = [];
      },
      error: err => {
        console.error(err);
        this.error.set('Hubo un error al guardar la comida.');
      },
      complete: () => this.loading.set(false)
    });
  }
}