// src/app/services/auth-service.service.ts
import { inject, Injectable } from '@angular/core';
import { LoginUserDTO } from '../../interfaces/login-user-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserDto } from '../../interfaces/user-dto';
import { Register } from '../../interfaces/register/register';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  // BehaviorSubject para el estado de autenticación
  private authStatusChanged = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );
  public authStatus$ = this.authStatusChanged.asObservable();

  constructor() {}

  login(user: LoginUserDTO): Observable<string> {
    const credentials = btoa(`${user.email}:${user.password}`);
    const headers = {
      Authorization: `Basic ${credentials}`,
    };
  
    return this.http
      .get(this.apiUrl + '/login', {
        headers,
        responseType: 'text',
      })
      .pipe(
        tap((response) => {
          this.saveToken(credentials); // OJO: no es un token JWT, sino las credenciales en base64
          this.getUsuarioByEmail(user.email).subscribe((userInfo) => {
            this.saveUserName(userInfo.name);
            this.saveEmail(userInfo.email);
            this.authStatusChanged.next(true);
          });
        })
      );
  }
  

  saveUserName(userName: string) {
    localStorage.setItem('user_name', userName); // Guardamos solo el nombre
  }

  getUserName(): string | null {
    return localStorage.getItem('user_name');
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  saveEmail(email: string) {
    localStorage.setItem('email', email);
  }

  getEmail() {
    return localStorage.getItem('email');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('email');
    // Notificar cambio en estado de autenticación
    this.authStatusChanged.next(false);
    this.router.navigate(['/home']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  register(user: Register): Observable<Register> {
    const url = `${this.apiUrl}/signup`; // esto ya concatena con "/auth"
    return this.http.post<Register>(url, user).pipe(
      tap(() => {
        // Solo notificar que se ha registrado (opcional, depende de si quieres login automático)
        // Si quieres login automático después del registro, deberás agregar esa lógica aquí
      })
    );
  }

  getUsuarioByEmail(email: string): Observable<UserDto> {
    const encodedEmail = encodeURIComponent(email); // Codificar el email
    const url = `${environment.apiUrl}/auth/userByEmail/${encodedEmail}`;
    return this.http.get<UserDto>(url);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const payload = token.split('.')[1];
    try {
      const decoded = JSON.parse(atob(payload));
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp && decoded.exp < now;
    } catch (e) {
      return true;
    }
  }
}
