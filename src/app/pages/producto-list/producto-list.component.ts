import { Component, computed, inject, signal } from '@angular/core';
import { IProducto } from '../../interfaces/iproducto';
import { ProductoService } from '../../services/producto.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-producto-list',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, FormsModule],
  templateUrl: './producto-list.component.html',
  styleUrl: './producto-list.component.css'
})
export class ProductoListComponent {
  private productoService = inject(ProductoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  
  productos = signal<IProducto[]>([]);
  totalItems = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  searchTerm = signal<string>('');
  searchType = signal<string>('titulo'); // 'titulo', 'marca', 'tipoComida'
  isLoading = signal<boolean>(false);
  isDeletingProducto = signal<{[key: number]: boolean}>({});
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  // Computed values
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));
  
  calculateMinValue = computed(() => Math.min((this.currentPage() + 1) * this.pageSize(), this.totalItems()));

  pages = computed(() => {
    const pageCount = this.totalPages();
    const maxVisiblePages = 5;
    const pages: number[] = [];

    if (pageCount <= maxVisiblePages) {
      // Mostrar todas las páginas si hay menos que el máximo visible
      for (let i = 0; i < pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Algoritmo para mostrar páginas alrededor de la actual
      const currentPage = this.currentPage();
      let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(pageCount - 1, startPage + maxVisiblePages - 1);

      // Ajustar si estamos cerca del final
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  });

  ngOnInit(): void {
    this.loadProductos();
    
    // Verificar si hay mensajes de éxito en los parámetros de consulta (después de crear o actualizar)
    this.route.queryParams.subscribe(params => {
      if (params['success']) {
        this.alertService.success('Éxito', params['success']);
      }
    });
  }

  loadProductos(): void {
    this.isLoading.set(true);
    this.clearMessages();
    
    if (this.searchTerm() === '') {
      // Sin búsqueda, cargar todos con paginación
      this.productoService.getProductosPaged(this.currentPage(), this.pageSize()).subscribe({
        next: (response) => {
          this.productos.set(response.content || []);
          this.totalItems.set(response.totalElements || 0);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage.set('Error al cargar los productos. Por favor, inténtalo de nuevo.');
          this.alertService.error('Error', 'No se pudieron cargar los productos');
          console.error('Error loading products:', error);
          this.isLoading.set(false);
          this.productos.set([]);
        }
      });
    } else {
      // Con búsqueda, filtrar según el tipo
      switch (this.searchType()) {
        case 'titulo':
          this.productoService.getProductosByTitulo(
            this.searchTerm(), this.currentPage(), this.pageSize()
          ).subscribe({
            next: (response) => {
              this.productos.set(response.content || []);
              this.totalItems.set(response.totalElements || 0);
              this.isLoading.set(false);
            },
            error: (error) => {
              this.errorMessage.set('Error al buscar productos por título.');
              this.alertService.error('Error', 'No se pudieron buscar productos por título');
              console.error('Error searching by title:', error);
              this.isLoading.set(false);
              this.productos.set([]);
            }
          });
          break;
          
        case 'marca':
          this.productoService.getProductosByMarca(
            this.searchTerm(), this.currentPage(), this.pageSize()
          ).subscribe({
            next: (response) => {
              this.productos.set(response.content || []);
              this.totalItems.set(response.totalElements || 0);
              this.isLoading.set(false);
            },
            error: (error) => {
              this.errorMessage.set('Error al buscar productos por marca.');
              this.alertService.error('Error', 'No se pudieron buscar productos por marca');
              console.error('Error searching by brand:', error);
              this.isLoading.set(false);
              this.productos.set([]);
            }
          });
          break;
          
        case 'tipoComida':
          this.productoService.getProductosByTipoComida(
            this.searchTerm(), this.currentPage(), this.pageSize()
          ).subscribe({
            next: (response) => {
              this.productos.set(response.content || []);
              this.totalItems.set(response.totalElements || 0);
              this.isLoading.set(false);
            },
            error: (error) => {
              this.errorMessage.set('Error al buscar productos por tipo de comida.');
              this.alertService.error('Error', 'No se pudieron buscar productos por tipo de comida');
              console.error('Error searching by food type:', error);
              this.isLoading.set(false);
              this.productos.set([]);
            }
          });
          break;
      }
    }
  }

  onSearch(): void {
    this.currentPage.set(0);
    this.loadProductos();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadProductos();
  }

  // Método para editar un producto
  editar(id: number): void {
    if (!id) {
      this.alertService.error('Error', 'ID de producto no válido');
      return;
    }
    
    this.router.navigate(['/productos/editar', id]);
  }

  // Método para ver detalles de un producto
  verDetalle(id: number): void {
    if (!id) {
      this.alertService.error('Error', 'ID de producto no válido');
      return;
    }
    
    this.router.navigate(['/producto/detalle', id]);
  }

  eliminar(id: number): void {
    if (!id) {
      this.alertService.error('Error', 'ID de producto no válido');
      return;
    }
    
    this.alertService.confirm(
      '¿Eliminar producto?', 
      '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.',
      'Sí, eliminar',
      'No, cancelar'
    ).then((result) => {
      if (result.isConfirmed) {
        // Marcar este producto como "eliminando"
        const currentDeleting = this.isDeletingProducto();
        currentDeleting[id] = true;
        this.isDeletingProducto.set({...currentDeleting});
        
        this.clearMessages();
        this.alertService.loading('Eliminando producto...');
        
        this.productoService.deleteProducto(id).subscribe({
          next: () => {
            // Marcar como ya no eliminando
            const currentDeleting = this.isDeletingProducto();
            delete currentDeleting[id];
            this.isDeletingProducto.set({...currentDeleting});
            
            this.alertService.close(); // Cerrar el loader
            this.alertService.success('Producto eliminado', 'El producto ha sido eliminado correctamente');
            
            // Recargar la lista de productos
            this.loadProductos();
          },
          error: (error) => {
            // Marcar como ya no eliminando
            const currentDeleting = this.isDeletingProducto();
            delete currentDeleting[id];
            this.isDeletingProducto.set({...currentDeleting});
            
            this.alertService.close(); // Cerrar el loader
            this.errorMessage.set('Error al eliminar el producto. Por favor, inténtalo de nuevo.');
            this.alertService.error('Error', 'No se pudo eliminar el producto. Por favor, inténtalo de nuevo.');
            console.error('Error deleting product:', error);
          }
        });
      }
    });
  }

  clearMessages(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  isDeleting(id: number): boolean {
    return this.isDeletingProducto()[id] === true;
  }
  
}
