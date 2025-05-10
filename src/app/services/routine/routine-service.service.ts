import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { DiasSemanaDto } from '../../interfaces/dias-semana-dto';
import { UsuarioEjercicioDto } from '../../interfaces/usuario-ejercicio-dto';
import { EjercicioDto } from '../../interfaces/ejercicio-dto';  // Nueva interfaz

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

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  // Obtener los días de la semana por usuario
  getDiasSemanaPorUsuario(usuarioId: number): Observable<DiasSemanaDto[]> {
    const url = `${this.apiUrl}/DiasSemana/GetDiasSemanaByUser/${usuarioId}`;
    console.log('➡️ GET:', url);
    return this.http.get<DiasSemanaDto[]>(url, { headers: this.getHeaders() });
  }

  // Obtener los ejercicios del usuario
  getUsuarioEjercicio(usuarioId: number): Observable<UsuarioEjercicioDto[]> {
    const url = `${this.apiUrl}/usuario-ejercicio/usuario/${usuarioId}`;
    console.log('➡️ GET:', url);
    return this.http.get<UsuarioEjercicioDto[]>(url, { headers: this.getHeaders() });
  }

  // ✅ Nuevo método: Obtener ejercicio por su ID
  getEjercicioById(ejercicioId: number): Observable<EjercicioDto> {
    const url = `${this.apiUrl}/Ejercicio/getEjercicioById/${ejercicioId}`;
    console.log('➡️ GET:', url);
    return this.http.get<EjercicioDto>(url, { headers: this.getHeaders() });
  }
}
