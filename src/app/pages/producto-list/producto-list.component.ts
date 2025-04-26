import { Component, computed, inject, Inject, signal } from '@angular/core';
import { IProducto } from '../../interfaces/iproducto';
import { ProductoService } from '../../services/producto.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto-list',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, FormsModule],
  templateUrl: './producto-list.component.html',
  styleUrl: './producto-list.component.css'
})
export class ProductoListComponent {
  private productoService = inject(ProductoService);
  
  productos = signal<IProducto[]>([]);
  totalItems = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  searchTerm = signal<string>('');
  searchType = signal<string>('titulo'); // 'titulo', 'marca', 'tipoComida'
  isLoading = signal<boolean>(false);
  isDeleting = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  // Computed values
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));
  
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
  }

  loadProductos(): void {
    this.isLoading.set(true);
    this.clearMessages();
    
    if (this.searchTerm() === '') {
      // Sin búsqueda, cargar todos con paginación
      this.productoService.getProductosPaged(this.currentPage(), this.pageSize()).subscribe({
        next: (response) => {
          this.productos.set(response.content);
          this.totalItems.set(response.totalElements);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage.set('Error al cargar los productos. Por favor, inténtalo de nuevo.');
          console.error('Error loading products:', error);
          this.isLoading.set(false);
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
              this.productos.set(response.content);
              this.totalItems.set(response.totalElements);
              this.isLoading.set(false);
            },
            error: (error) => {
              this.errorMessage.set('Error al buscar productos por título.');
              console.error('Error searching by title:', error);
              this.isLoading.set(false);
            }
          });
          break;
          
        case 'marca':
          this.productoService.getProductosByMarca(
            this.searchTerm(), this.currentPage(), this.pageSize()
          ).subscribe({
            next: (response) => {
              this.productos.set(response.content);
              this.totalItems.set(response.totalElements);
              this.isLoading.set(false);
            },
            error: (error) => {
              this.errorMessage.set('Error al buscar productos por marca.');
              console.error('Error searching by brand:', error);
              this.isLoading.set(false);
            }
          });
          break;
          
        case 'tipoComida':
          this.productoService.getProductosByTipoComida(
            this.searchTerm(), this.currentPage(), this.pageSize()
          ).subscribe({
            next: (response) => {
              this.productos.set(response.content);
              this.totalItems.set(response.totalElements);
              this.isLoading.set(false);
            },
            error: (error) => {
              this.errorMessage.set('Error al buscar productos por tipo de comida.');
              console.error('Error searching by food type:', error);
              this.isLoading.set(false);
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

  eliminar(id: number): void {
    console.log('Intentando eliminar producto con ID:', id);
    
    if (!id) {
      this.errorMessage.set('ID de producto no válido');
      return;
    }
    
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.isDeleting.set(true);
      this.clearMessages();
      
      this.productoService.deleteProducto(id).subscribe({
        next: () => {
          console.log('Producto eliminado correctamente');
          this.successMessage.set('Producto eliminado correctamente');
          this.isDeleting.set(false);
          this.loadProductos(); // Recargar la lista después de eliminar
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
          this.errorMessage.set('Error al eliminar el producto. Por favor, inténtalo de nuevo.');
          this.isDeleting.set(false);
        }
      });
    }
  }

  clearMessages(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  calculateMinValue(): number {
    return Math.min((this.currentPage() + 1) * this.pageSize(), this.totalItems());
  }
  
}
