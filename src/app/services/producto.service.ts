import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IProducto } from '../interfaces/iproducto';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = `${environment.apiUrl}/api/Producto`;

  constructor(private http: HttpClient) {}

  createProducto(producto: IProducto): Observable<IProducto> {
    return this.http.post<IProducto>(`${this.apiUrl}/CreateProducto`, producto);
  }

  getProductoById(id: number): Observable<IProducto> {
    return this.http.get<IProducto>(`${this.apiUrl}/GetProductoById/${id}`);
  }

  getAllProductos(): Observable<IProducto[]> {
    return this.http.get<IProducto[]>(`${this.apiUrl}/GetAllProductos`);
  }

  // Método de eliminación mejorado
  deleteProducto(id: number): Observable<any> {
    console.log(`Eliminando producto con ID: ${id}`);
    
    // Asegurarnos de que las cabeceras estén configuradas correctamente
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    return this.http.delete<any>(`${this.apiUrl}/DeleteProductoById/${id}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al eliminar producto:', error);
          return throwError(() => new Error('Error al eliminar el producto. Por favor, inténtalo de nuevo.'));
        })
      );
  }


  ///////////////////
    // Obtener productos paginados
    getProductosPaged(page: number = 0, size: number = 10): Observable<any> {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
      
      return this.http.get<any>(`${this.apiUrl}/GetAllProductosPaged`, { params });
    }

     // Buscar productos por título
  getProductosByTitulo(nombre: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.apiUrl}/GetProductosByTituloPaged`, { params });
  }
  
    // Buscar productos por marca
    getProductosByMarca(marca: string, page: number = 0, size: number = 10): Observable<any> {
      const params = new HttpParams()
        .set('marca', marca)
        .set('page', page.toString())
        .set('size', size.toString());
      
      return this.http.get<any>(`${this.apiUrl}/GetProductosByMarcaPaged`, { params });
    }

      // Buscar productos por tipo de comida
  getProductosByTipoComida(tipoComida: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('tipoComida', tipoComida)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.apiUrl}/GetProductosByTipoComidaPaged`, { params });
  }

}
