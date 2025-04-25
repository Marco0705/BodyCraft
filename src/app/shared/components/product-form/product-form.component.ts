import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { IProducto } from '../../../interfaces/iproducto';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  
  form = new FormGroup({
    titulo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
    }),
    tipoComida: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    marca: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
    }),
    cantGramos: new FormControl(100, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)]
    }),
    kcal: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)]
    }),
    proteinas: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)]
    }),
    grasas: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)]
    }),
    carbohidratos: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)]
    }),
    descripcion: new FormControl(''),
    urlImagen: new FormControl('')
  });
  
  isEditing = signal<boolean>(false);
  productId = signal<number | null>(null);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  tiposComida = signal<string[]>([
    'Carnes', 'Pescados', 'Verduras', 'Frutas', 'Lácteos', 
    'Cereales', 'Legumbres', 'Snacks', 'Bebidas', 'Otros'
  ]);

  ngOnInit(): void {
    // Check if we're editing
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.productId.set(Number(id));
      this.loadProduct(Number(id));
    }
  }

  loadProduct(id: number): void {
    this.isLoading.set(true);

    this.productoService.getProductoById(id).subscribe({
      next: (producto) => {
        // Fill the form with product data
        this.form.setValue({
          titulo: producto.titulo,
          tipoComida: producto.tipoComida,
          marca: producto.marca,
          cantGramos: producto.cantGramos,
          kcal: producto.kcal,
          proteinas: producto.proteinas || 0,
          grasas: producto.grasas || 0,
          carbohidratos: producto.carbohidratos || 0,
          descripcion: '', // Removed usage of producto.descripcion as it does not exist in IProducto
          urlImagen: producto.urlimagen || ''
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error al cargar el producto. Intente nuevamente.');
        this.isLoading.set(false);
        console.error('Error loading product', error);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const productoData: IProducto = this.form.getRawValue();

    if (this.isEditing()) {
      // Update existing product (implementation depends on your API)
      // Since your API doesn't have an update method, this would need to be implemented
      // For now, we'll just redirect back to the list
      alert('La API no tiene un método para actualizar productos. Esta funcionalidad debe ser implementada en el backend.');
      this.router.navigate(['/productos']);
    } else {
      // Create new product
      this.productoService.createProducto(productoData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/productos']);
        },
        error: (error) => {
          this.errorMessage.set('Error al guardar el producto. Intente nuevamente.');
          this.isSaving.set(false);
          console.error('Error saving product', error);
        }
      });
    }
  }

  // Field validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    
    if (!control) return '';
    
    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    
    if (control.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }
    
    if (control.hasError('maxlength')) {
      const maxLength = control.getError('maxlength').requiredLength;
      return `Debe tener máximo ${maxLength} caracteres`;
    }
    
    if (control.hasError('min')) {
      const min = control.getError('min').min;
      return `El valor mínimo es ${min}`;
    }
    
    return 'Campo inválido';
  }
}
