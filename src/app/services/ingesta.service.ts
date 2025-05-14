import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IIngestaDTO } from '../interfaces/iingesta';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class IngestaService {
  private apiUrl = `${environment.apiUrl}/api/ingestas`;

  constructor(private http: HttpClient) {}
  // Obtener todas las ingestas
  getAllIngestas(): Observable<IIngestaDTO[]> {
    return this.http.get<IIngestaDTO[]>(this.apiUrl);
  }

  // Obtener ingestas por usuario
  getIngestasByUser(userId: number): Observable<IIngestaDTO[]> {
    return this.http.get<IIngestaDTO[]>(`${this.apiUrl}/usuario/${userId}`);
  }

  // Crear una nueva ingesta
  createIngesta(ingestaDTO: IIngestaDTO): Observable<IIngestaDTO> {
    return this.http.post<IIngestaDTO>(this.apiUrl, ingestaDTO);
  }

  // Eliminar una ingesta
  deleteIngesta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
