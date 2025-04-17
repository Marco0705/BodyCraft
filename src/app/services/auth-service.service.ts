// src/app/services/auth-service.service.ts
import { inject, Injectable } from '@angular/core';
import { LoginUserDTO } from '../interfaces/login-user-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserDto } from '../interfaces/user-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  constructor() {}

  login(user: LoginUserDTO): Observable<string> {
    return this.http.post(this.apiUrl + '/login', user, {
      responseType: 'text',
    });
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
    localStorage.removeItem('email');   
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  // Nueva función para obtener el usuario por su email
  getUsuarioByEmail(email: string): Observable<UserDto> {
    const url = `${environment.apiUrl}/userByEmail/${email}`;
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