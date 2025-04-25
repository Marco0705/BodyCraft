import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IComida } from '../interfaces/icomida';

@Injectable({
  providedIn: 'root'
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

  // 👉 Aquí agregas el método para asociar producto a comida:
  asociarProductoAComida(comidaId: number, productoId: number) {
    return this.http.post(`${this.apiUrl}/AssociateProductoToComida/${comidaId}/${productoId}`, {});
  }
}
