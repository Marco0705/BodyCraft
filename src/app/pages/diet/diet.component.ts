import { Component, inject, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IngestaService } from '../../services/ingesta.service';
import { IIngesta, IIngestaDTO } from '../../interfaces/iingesta';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { AuthServiceService } from '../../services/login/auth-service.service';
import { IProducto } from '../../interfaces/iproducto';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-diet',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './diet.component.html',
  styleUrl: './diet.component.css',
  standalone: true
})
export class DietComponent {
private fb = inject(FormBuilder);
  private ingestasService = inject(IngestaService);
  private productosService = inject(ProductoService);
  private alertService = inject(AlertService);

  ingestas: IIngestaDTO[] = [];
  productos: IProducto[] = [];
  ingestaForm!: FormGroup;
  currentUserId = 1; // Esto debería venir de un servicio de autenticación
  loading = false;
  isEditing = false;
  selectedIngestaId?: number;

  // Modal state
  showModal = false;
  
  ngOnInit(): void {
    this.createForm();
    this.loadIngestas();
    this.loadProductos();
  }

  createForm(): void {
    this.ingestaForm = this.fb.group({
      comidaNombre: ['', Validators.required],
      fecha: [new Date().toISOString().split('T')[0], Validators.required],
      productoIds: [[], Validators.required]
    });
  }

  loadIngestas(): void {
    this.loading = true;
    this.ingestasService.getIngestasByUser(this.currentUserId).subscribe({
      next: (data) => {
        this.ingestas = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar ingestas:', error);
        this.alertService.error('Error', 'No se pudieron cargar las ingestas');
        this.loading = false;
      }
    });
  }

  loadProductos(): void {
    this.productosService.getAllProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.alertService.error('Error', 'No se pudieron cargar los productos');
      }
    });
  }

  openModal(): void {
    this.showModal = true;
    this.isEditing = false;
    this.createForm();
  }

  closeModal(): void {
    this.showModal = false;
    this.ingestaForm.reset();
    this.selectedIngestaId = undefined;
  }


onSubmit(): void {
  if (this.ingestaForm.invalid) {
    this.ingestaForm.markAllAsTouched();
    return;
  }

  const ingestaDTO: IIngestaDTO = {
    comidaNombre: this.ingestaForm.value.comidaNombre,
    fecha: this.ingestaForm.value.fecha,
    productoIds: this.ingestaForm.value.productoIds,
    userId: this.currentUserId // Add the user ID to the request
  };

  this.alertService.loading('Guardando ingesta...');
  this.ingestasService.createIngesta(ingestaDTO).subscribe({
    next: (ingesta) => {
      this.alertService.close();
      this.alertService.toast('Ingesta creada con éxito');
      this.loadIngestas();
      this.closeModal();
      this.loading = false;
    },
    error: (error) => {
      console.error('Error al crear ingesta:', error);
      this.alertService.error('Error', 'No se pudo crear la ingesta');
      this.loading = false;
    }
  });
}

  deleteIngesta(id: number): void {
    this.alertService.confirm(
      '¿Eliminar ingesta?',
      '¿Estás seguro de que deseas eliminar esta ingesta? Esta acción no se puede deshacer.',
      'Sí, eliminar',
      'Cancelar'
    ).then((result) => {
      if (result.isConfirmed) {
        this.alertService.loading('Eliminando ingesta...');
        this.ingestasService.deleteIngesta(id).subscribe({
          next: () => {
            this.alertService.close();
            this.alertService.toast('Ingesta eliminada con éxito');
            this.loadIngestas();
          },
          error: (error) => {
            console.error('Error al eliminar ingesta:', error);
            this.alertService.error('Error', 'No se pudo eliminar la ingesta');
          }
        });
      }
    });
  }

  // Método para formatear la fecha a formato local
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getProductoNombres(ingesta: any): string {
    if (!ingesta || !ingesta.productos) return '';
    
    // Assuming ingesta.productos is an array of product objects or names
    return Array.isArray(ingesta.productos) 
      ? ingesta.productos.map((p: any) => p.titulo || p).join(', ')
      : '';
  }
}