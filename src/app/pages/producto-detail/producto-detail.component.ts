import { Component, computed, inject, signal } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IProducto } from '../../interfaces/iproducto';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-producto-detail',
  imports: [RouterLink],
  templateUrl: './producto-detail.component.html',
  styleUrl: './producto-detail.component.css'
})
export class ProductoDetailComponent {
  private productoService = inject(ProductoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  
  producto = signal<IProducto | null>(null);
  isLoading = signal<boolean>(false);
  isDeleting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  cantidadSeleccionada = signal<number>(100);
  
  // Valores calculados para nutrientes según la cantidad seleccionada
  nutrientesCalculados = computed(() => {
    if (!this.producto()) return null;
    
    const factor = this.cantidadSeleccionada() / 100;
    
    return {
      kcal: Math.round(this.producto()!.kcal * factor),
      proteinas: Math.round(this.producto()!.proteinas * factor * 10) / 10,
      grasas: Math.round(this.producto()!.grasas * factor * 10) / 10,
      carbohidratos: Math.round(this.producto()!.carbohidratos * factor * 10) / 10
    };
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProducto(Number(id));
    } else {
      this.errorMessage.set('ID de producto no encontrado');
      this.alertService.error('Error', 'ID de producto no encontrado');
    }
  }

  loadProducto(id: number): void {
    this.isLoading.set(true);
    
    this.productoService.getProductoById(id).subscribe({
      next: (data) => {
        this.producto.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error al cargar el producto');
        this.isLoading.set(false);
        this.alertService.error('Error', 'No se pudo cargar la información del producto');
        console.error('Error loading product', error);
      }
    });
  }

  actualizarCantidad(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cantidad = Number(input.value);
    
    if (cantidad > 0) {
      this.cantidadSeleccionada.set(cantidad);
      this.alertService.toast(`Cantidad actualizada a ${cantidad}g`, 'info', 1500);
    } else {
      this.alertService.warning('Valor inválido', 'La cantidad debe ser mayor a 0');
      // Restablecer al valor anterior
      input.value = this.cantidadSeleccionada().toString();
    }
  }

  eliminarProducto(): void {
    if (!this.producto()?.id) return;
    
    this.alertService.confirm(
      '¿Eliminar producto?', 
      '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.',
      'Sí, eliminar',
      'No, cancelar'
    ).then((result) => {
      if (result.isConfirmed) {
        this.isDeleting.set(true);
        this.alertService.loading('Eliminando producto...');
        
        this.productoService.deleteProducto(this.producto()!.id!).subscribe({
          next: () => {
            this.isDeleting.set(false);
            this.alertService.close(); // Cerrar el loader
            this.alertService.success('Producto eliminado', 'El producto ha sido eliminado correctamente');
            
            // Redirigir después de mostrar el mensaje
            setTimeout(() => {
              this.router.navigate(['/productos']);
            }, 1500);
          },
          error: (error) => {
            this.isDeleting.set(false);
            this.alertService.close(); // Cerrar el loader
            this.errorMessage.set('Error al eliminar el producto');
            this.alertService.error('Error', 'No se pudo eliminar el producto. Por favor, inténtalo de nuevo.');
            console.error('Error deleting product', error);
          }
        });
      }
    });
  }
}
