// src/app/core/interceptors/auth.interceptor.function.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServiceService);
  const token = authService.getToken();

  if (token) {
    const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
       
    });
       console.log(token.toString());
    return next(authReq);
  }

  return next(req);
};
