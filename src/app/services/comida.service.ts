import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IComida, ICreateComidaDTO } from '../interfaces/icomida';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComidaService {
  private apiUrl = `${environment.apiUrl}/api/Comida`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<IComida[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<IComida>(`${this.apiUrl}/${id}`);
  }

  removeProductoFromComida(
    comidaId: number,
    productoId: number
  ): Observable<void> {
    // Mock implementation for removing a product from a meal
    console.log(`Removing product ${productoId} from meal ${comidaId}`);
    return of();
  }

  asociarProductoAComida(comidaId: number, productoId: number, gramos: number) {
    return this.http.post(
      `${this.apiUrl}/AssociateProductoToComida/${comidaId}/${productoId}`,
      { gramos }
    );
  }

  crearComidas(comidasDTO: ICreateComidaDTO[]): Observable<IComida[]> {
    return this.http.post<IComida[]>(`${this.apiUrl}/CreateComida`, comidasDTO);
  }

  asociarProducto(comidaId: number, productoId: number): Promise<any> {
    return this.http
      .post(
        `${this.apiUrl}/AssociateProductoToComida/${comidaId}/${productoId}`,
        {}
      )
      .toPromise();
  }
}
