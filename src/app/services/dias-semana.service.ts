import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { DiasSemana } from '../interfaces/dias-semana';

@Injectable({
  providedIn: 'root',
})
export class DiasSemanaService {
  private apiUrl = `${environment.apiUrl}/api/DiasSemana`;

  constructor(private http: HttpClient) {}

  getDias(): Observable<DiasSemana[]> {
    return this.http.get<DiasSemana[]>(`${this.apiUrl}/GetAllDiasSemana`);
  }
}
