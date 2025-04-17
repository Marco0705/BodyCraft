// src/app/services/routine-service.service.ts
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

  getDiasSemanaPorUsuario(usuarioId: number): Observable<DiasSemanaDto[]> {
    const token = this.getToken();

    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();

    const url = `${this.apiUrl}/DiasSemana/GetDiasSemanaByUser/${usuarioId}`;
    console.log('➡️ GET:', url);
    console.log('➡️ Headers:', headers.get('Authorization'));

    return this.http.get<DiasSemanaDto[]>(url, { headers });
  }
}
