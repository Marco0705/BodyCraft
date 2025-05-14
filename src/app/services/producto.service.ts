import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IProducto } from '../interfaces/iproducto';


@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = `${environment.apiUrl}/api/Producto`;

  constructor(private http: HttpClient) {}
  // Obtener todos los productos
  getAllProductos(): Observable<IProducto[]> {
    console.log('Obteniendo todos los productos');
    return this.http.get<IProducto[]>(`${this.apiUrl}/GetAllProductos`).pipe(
      catchError((error) => {
        console.error('Error al obtener productos:', error);
        return throwError(
          () =>
            new Error(
              'Error al obtener los productos. Por favor, inténtalo de nuevo.'
            )
        );
      })
    );
  }

  // Obtener productos paginados
  getProductosPaged(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    console.log(
      `Obteniendo productos paginados (página: ${page}, tamaño: ${size})`
    );
    return this.http
      .get<any>(`${this.apiUrl}/GetAllProductosPaged`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error al obtener productos paginados:', error);
          return throwError(
            () =>
              new Error(
                'Error al obtener los productos. Por favor, inténtalo de nuevo.'
              )
          );
        })
      );
  }

  // Buscar productos por marca
  getProductosByMarca(
    marca: string,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    const params = new HttpParams()
      .set('marca', marca)
      .set('page', page.toString())
      .set('size', size.toString());

    console.log(`Buscando productos por marca: "${marca}"`);
    return this.http
      .get<any>(`${this.apiUrl}/GetProductosByMarcaPaged`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error al buscar productos por marca:', error);
          return throwError(
            () =>
              new Error(
                'Error al buscar productos por marca. Por favor, inténtalo de nuevo.'
              )
          );
        })
      );
  }

  // Buscar productos por tipo de comida
  getProductosByTipoComida(
    tipoComida: string,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    const params = new HttpParams()
      .set('tipoComida', tipoComida)
      .set('page', page.toString())
      .set('size', size.toString());

    console.log(`Buscando productos por tipo de comida: "${tipoComida}"`);
    return this.http
      .get<any>(`${this.apiUrl}/GetProductosByTipoComidaPaged`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error al buscar productos por tipo de comida:', error);
          return throwError(
            () =>
              new Error(
                'Error al buscar productos por tipo de comida. Por favor, inténtalo de nuevo.'
              )
          );
        })
      );
  }

  // Buscar productos por título
  getProductosByTitulo(
    nombre: string,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('page', page.toString())
      .set('size', size.toString());

    console.log(`Buscando productos por título: "${nombre}"`);
    return this.http
      .get<any>(`${this.apiUrl}/GetProductosByTituloPaged`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error al buscar productos por título:', error);
          return throwError(
            () =>
              new Error(
                'Error al buscar productos por título. Por favor, inténtalo de nuevo.'
              )
          );
        })
      );
  }

  // Obtener producto por ID
  getProductoById(id: number): Observable<IProducto> {
    console.log(`Obteniendo producto con ID: ${id}`);
    return this.http
      .get<IProducto>(`${this.apiUrl}/GetProductoById/${id}`)
      .pipe(
        catchError((error) => {
          console.error(`Error al obtener producto con ID ${id}:`, error);
          return throwError(
            () =>
              new Error(
                'Error al obtener el producto. Por favor, inténtalo de nuevo.'
              )
          );
        })
      );
  }

  // Crear producto
  createProducto(producto: IProducto): Observable<IProducto> {
    console.log('Creando nuevo producto:', producto);

    // Configurar los headers adecuados
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http
      .post<IProducto>(`${this.apiUrl}/CreateProducto`, producto, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al crear producto:', error);
          return throwError(
            () =>
              new Error(
                'Error al crear el producto. Por favor, inténtalo de nuevo.'
              )
          );
        })
      );
  }

  // Método para actualizar un producto existente
  updateProducto(id: number, producto: IProducto): Observable<IProducto> {
    console.log(`Actualizando producto con ID: ${id}`, producto);

    // Configurar los headers adecuados
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    // Asegurarnos de que estamos enviando la solicitud al endpoint correcto
    return this.http
      .put<IProducto>(`${this.apiUrl}/UpdateProducto/${id}`, producto, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error(`Error al actualizar producto con ID ${id}:`, error);

          // Si hay un error CORS, podemos intentar una alternativa
          if (error.status === 0) {
            console.warn(
              'Posible error CORS detectado. Intentando método alternativo...'
            );
            return this.updateProductoWithFetch(id, producto);
          }

          return throwError(
            () =>
              new Error(
                'Error al actualizar el producto. Por favor, inténtalo de nuevo.'
              )
          );
        })
      );
  }

  // Método alternativo para actualizar usando fetch en caso de problemas CORS
  private updateProductoWithFetch(
    id: number,
    producto: IProducto
  ): Observable<IProducto> {
    return new Observable((observer) => {
      fetch(`${this.apiUrl}/UpdateProducto/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(producto),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          observer.next(data);
          observer.complete();
        })
        .catch((error) => {
          console.error('Error en updateProductoWithFetch:', error);
          observer.error(
            new Error(
              'Error al actualizar el producto usando método alternativo.'
            )
          );
        });
    });
  }

  // Eliminar producto
  deleteProducto(id: number): Observable<any> {
    console.log(`Eliminando producto con ID: ${id}`);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http
      .delete<any>(`${this.apiUrl}/DeleteProductoById/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error(`Error al eliminar producto con ID ${id}:`, error);
          return throwError(
            () =>
              new Error(
                'Error al eliminar el producto. Por favor, inténtalo de nuevo.'
              )
          );
        })
      );
  }

  // Calcular nutrientes
  calcularNutrientes(productoId: number, gramos: number): Observable<any> {
    const params = new HttpParams()
      .set('productoId', productoId.toString())
      .set('gramos', gramos.toString());

    console.log(
      `Calculando nutrientes para producto ID: ${productoId}, cantidad: ${gramos}g`
    );
    return this.http
      .get<any>(`${this.apiUrl}/CalcularNutrientes`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error al calcular nutrientes:', error);
          return throwError(
            () =>
              new Error(
                'Error al calcular los nutrientes. Por favor, inténtalo de nuevo.'
              )
          );
        })
      );
  }
  ///////////////////////////////////////////////////
  //   // Método para actualizar un producto existente
  // updateProducto(id: number, producto: IProducto): Observable<IProducto> {
  //   console.log(`Actualizando producto con ID: ${id}`, producto);

  //   return this.http.put<IProducto>(`${this.apiUrl}/UpdateProducto/${id}`, producto)
  //     .pipe(
  //       catchError(error => {
  //         console.error(`Error al actualizar producto con ID ${id}:`, error);
  //         return throwError(() => new Error('Error al actualizar el producto. Por favor, inténtalo de nuevo.'));
  //       })
  //     );
  // }

  //   createProducto(producto: IProducto): Observable<IProducto> {
  //     return this.http.post<IProducto>(`${this.apiUrl}/CreateProducto`, producto);
  //   }

  //   getProductoById(id: number): Observable<IProducto> {
  //     return this.http.get<IProducto>(`${this.apiUrl}/GetProductoById/${id}`);
  //   }

  //   getAllProductos(): Observable<IProducto[]> {
  //     return this.http.get<IProducto[]>(`${this.apiUrl}/GetAllProductos`);
  //   }

  //   // Método de eliminación mejorado
  //   deleteProducto(id: number): Observable<any> {
  //     console.log(`Eliminando producto con ID: ${id}`);

  //     // Asegurarnos de que las cabeceras estén configuradas correctamente
  //     const headers = new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json'
  //     });

  //     return this.http.delete<any>(`${this.apiUrl}/DeleteProductoById/${id}`, { headers })
  //       .pipe(
  //         catchError(error => {
  //           console.error('Error al eliminar producto:', error);
  //           return throwError(() => new Error('Error al eliminar el producto. Por favor, inténtalo de nuevo.'));
  //         })
  //       );
  //   }

  //   ///////////////////
  //     // Obtener productos paginados
  //     getProductosPaged(page: number = 0, size: number = 10): Observable<any> {
  //       const params = new HttpParams()
  //         .set('page', page.toString())
  //         .set('size', size.toString());

  //       return this.http.get<any>(`${this.apiUrl}/GetAllProductosPaged`, { params });
  //     }

  //      // Buscar productos por título
  //   getProductosByTitulo(nombre: string, page: number = 0, size: number = 10): Observable<any> {
  //     const params = new HttpParams()
  //       .set('nombre', nombre)
  //       .set('page', page.toString())
  //       .set('size', size.toString());

  //     return this.http.get<any>(`${this.apiUrl}/GetProductosByTituloPaged`, { params });
  //   }

  //     // Buscar productos por marca
  //     getProductosByMarca(marca: string, page: number = 0, size: number = 10): Observable<any> {
  //       const params = new HttpParams()
  //         .set('marca', marca)
  //         .set('page', page.toString())
  //         .set('size', size.toString());

  //       return this.http.get<any>(`${this.apiUrl}/GetProductosByMarcaPaged`, { params });
  //     }

  //       // Buscar productos por tipo de comida
  //   getProductosByTipoComida(tipoComida: string, page: number = 0, size: number = 10): Observable<any> {
  //     const params = new HttpParams()
  //       .set('tipoComida', tipoComida)
  //       .set('page', page.toString())
  //       .set('size', size.toString());

  //     return this.http.get<any>(`${this.apiUrl}/GetProductosByTipoComidaPaged`, { params });
  //   }
}
