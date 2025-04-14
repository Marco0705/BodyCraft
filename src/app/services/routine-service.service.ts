import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { DiasSemanaDto } from '../interfaces/dias-semana-dto';

@Injectable({
  providedIn: 'root'
})
export class RoutineServiceService {
  private apiUrl = `${environment.apiUrl}/api`;
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  constructor() {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDiasSemana(): Observable<DiasSemanaDto[]> {
    const token = this.getToken();

    if (!token) {
      console.warn('Token no encontrado en localStorage');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    console.log('Realizando GET a:', `${this.apiUrl}/GetAllDiasSemana`);
    console.log('Headers:', headers);

    return this.http.get<DiasSemanaDto[]>(`${this.apiUrl}/DiasSemana/GetAllDiasSemana`, { headers });
  }
}
