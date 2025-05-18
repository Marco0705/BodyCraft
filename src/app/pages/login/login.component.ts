// src/app/pages/login/login.component.ts
import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../services/login/auth-service.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthServiceService);
  protected loginForm = signal<FormGroup>(this.fb.group({}));

  error = signal<string | null>(null);

  ngOnInit(): void {
    this.ping();
    this.loadLogin();
  }

  ping() {
    this.authService.ping().subscribe({
      next: (response) => {
        console.log('Ping response:', response);
      },
      error: (err) => {
        console.error('Error en ping:', err);
      },
    });
  }

  loadLogin() {
    this.loginForm.set(
      this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      })
    );
  }

  onSubmit(): void {
    if (this.loginForm().invalid) return;

    const { email, password } = this.loginForm().value;

    this.authService.login({ email, password }).subscribe({
      next: (token) => {
        this.authService.saveToken(token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.error.set('Credenciales incorrectas');
      },
    });
  }

  get email(): FormControl {
    return this.loginForm().get('email') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm().get('password') as FormControl;
  }
}
