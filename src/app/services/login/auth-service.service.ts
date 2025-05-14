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
    return this.http
      .post(this.apiUrl + '/login', user, { responseType: 'text' })
      .pipe(
        tap((token) => {
          this.saveToken(token);
          // Suponiendo que la respuesta de login contiene el usuario, obtenemos y guardamos solo el nombre
          this.getUsuarioByEmail(user.email).subscribe((userInfo) => {
            this.saveUserName(userInfo.name);
            this.saveEmail(userInfo.email);
            this.saveUserId(userInfo.id);
            // Notificar cambio en estado de autenticación
            this.authStatusChanged.next(true);
          });
        })
      );
  }

  //   getAuthenticatedUserId(): number | null {
  //   const user = JSON.parse(localStorage.getItem('user') || '{}');
  //   return user.id || null; // Asumiendo que el objeto usuario tiene un campo 'id'
  // }

  getAuthenticatedUserId(): number | null {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      return decodedToken.userId || null;
    }
    return null;
  }
  //   getEmailFromToken(): string | null {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     const decoded: any = jwt_decode(token);  // Decodificamos el JWT
  //     return decoded.sub;  // Suponiendo que el email está en 'sub'
  //   }
  //   return null;
  // }

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

  saveUserId(id: number) {
    localStorage.setItem('user_id', id.toString());
  }

  // auth-service.service.ts
  getUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || null;
    } catch (e) {
      return null;
    }
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
    const url = `${this.apiUrl}/registerFull`; // esto ya concatena con "/auth"
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
function jwt_decode(token: string): any {
  throw new Error('Function not implemented.');
}