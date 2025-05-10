import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { IProducto } from '../../../interfaces/iproducto';
import { AlertService } from '../../../services/alert.service';

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
  private alertService = inject(AlertService);
  
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
    urlimagen: new FormControl('')
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
    } else {
      // Si es un nuevo producto, establece un valor por defecto para tipoComida
      this.form.controls.tipoComida.setValue(this.tiposComida()[0]);
    }
  }

  loadProduct(id: number): void {
    this.isLoading.set(true);
    this.alertService.loading('Cargando producto...');

    this.productoService.getProductoById(id).subscribe({
      next: (producto) => {
        console.log('Producto cargado para edición:', producto);
        
        // Utilizar patchValue en lugar de setValue para no fallar si faltan campos
        this.form.patchValue({
          titulo: producto.titulo,
          tipoComida: producto.tipoComida,
          marca: producto.marca,
          cantGramos: producto.cantGramos,
          kcal: producto.kcal,
          proteinas: producto.proteinas || 0,
          grasas: producto.grasas || 0,
          carbohidratos: producto.carbohidratos || 0,
          urlimagen: producto.urlimagen || ''
        });
        
        // Verificación específica para tipoComida
        if (!producto.tipoComida || producto.tipoComida.trim() === '') {
          console.warn('Campo tipoComida vacío en producto existente, asignando valor por defecto');
          this.form.controls.tipoComida.setValue(this.tiposComida()[0]);
        }
        
        this.isLoading.set(false);
        this.alertService.close();
      },
      error: (error) => {
        this.errorMessage.set('Error al cargar el producto. Intente nuevamente.');
        this.isLoading.set(false);
        this.alertService.close();
        this.alertService.error('Error', 'No se pudo cargar la información del producto');
        console.error('Error loading product', error);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertService.warning('Formulario incompleto', 'Por favor, completa todos los campos obligatorios');
      return;
    }
  
    this.isSaving.set(true);
    this.alertService.loading(this.isEditing() ? 'Actualizando producto...' : 'Guardando producto...');
    
    const formData = this.form.getRawValue();
    
    // Depuración: Verificar los valores antes de enviar
    console.log('Datos del formulario antes de enviar:', formData);
    console.log('Valor de tipoComida:', formData.tipoComida);
  
    // Crear un objeto con los nombres de campos que el backend espera
    const productoData: IProducto = {
      titulo: formData.titulo,
      tipoComida: formData.tipoComida,
      marca: formData.marca,
      cantGramos: formData.cantGramos,
      kcal: formData.kcal,
      proteinas: formData.proteinas,
      grasas: formData.grasas,
      carbohidratos: formData.carbohidratos,
      urlimagen: formData.urlimagen ?? '' // Nota la conversión de urlImagen a urlimagen
    };
  
    if (this.isEditing()) {
      // Añadimos el ID al objeto de datos para la actualización
      productoData.id = this.productId() ?? undefined;
      
      console.log('Enviando datos para actualización:', productoData);
      
      // Utilizamos el método updateProducto del servicio
      this.productoService.updateProducto(this.productId()!, productoData).subscribe({
        next: (updatedProducto) => {
          console.log('Producto actualizado correctamente:', updatedProducto);
          this.isSaving.set(false);
          this.alertService.close();
          this.alertService.success('Producto actualizado', 'El producto ha sido actualizado correctamente');
          
          // Navegar de vuelta a la lista después de mostrar el mensaje
          setTimeout(() => {
            this.router.navigate(['/productos']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage.set('Error al actualizar el producto. Por favor, inténtalo de nuevo.');
          this.isSaving.set(false);
          this.alertService.close();
          this.alertService.error('Error', 'No se pudo actualizar el producto. Por favor, inténtalo de nuevo.');
          console.error('Error updating product:', error);
        }
      });
    } else {
      console.log('Enviando datos para creación:', productoData);
      
      // Crear nuevo producto
      this.productoService.createProducto(productoData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.alertService.close();
          this.alertService.success('Producto creado', 'El producto ha sido creado correctamente');
          
          // Navegar de vuelta a la lista después de mostrar el mensaje
          setTimeout(() => {
            this.router.navigate(['/productos']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage.set('Error al guardar el producto. Por favor, inténtalo de nuevo.');
          this.isSaving.set(false);
          this.alertService.close();
          this.alertService.error('Error', 'No se pudo crear el producto. Por favor, inténtalo de nuevo.');
          console.error('Error saving product:', error);
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
  
  cancelarEdicion(): void {
    this.alertService.confirm(
      'Cancelar edición', 
      '¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.',
      'Sí, cancelar',
      'No, continuar editando'
    ).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/productos']);
      }
    });
  }
}
