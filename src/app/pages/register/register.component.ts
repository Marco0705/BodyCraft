import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/login/auth-service.service';
import { Register } from '../../interfaces/register/register';
import { Subscription } from 'rxjs';
import { LoginUserDTO } from '../../interfaces/login-user-dto';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthServiceService);
  protected registerForm = signal<FormGroup>(this.fb.group({}));

  protected subscriptions = new Subscription();

  constructor() {}

  ngOnInit() {
    this.loadRegister();
  }

  loadRegister() {
    this.registerForm.set(
      this.fb.group(
        {
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          repeatPassword: ['', Validators.required],
        },
        { validators: this.passwordMatchValidator }
      )
    );
  }

  onSubmit() {
    const form = this.registerForm();
    if (form.invalid) return;

    const user: Register = {
      id: 0,
      name: form.get('name')?.value,
      username: form.get('name')?.value,
      password: form.get('password')?.value,
      email: form.get('email')?.value,
    /*   rolIds: [0],
      diasSemanaIds: [0], */
    };

    this.subscriptions.add(
      this.authService.register(user).subscribe({
        next: () => {
          // Después del registro, inicia sesión automáticamente
          this.loginAfterRegistration(user.email, user.password);
        },
        error: (error) => {
          console.error('Error al registrar:', error);
          // Aquí podrías manejar errores específicos
        },
      })
    );
  }

  // Método para iniciar sesión automáticamente después del registro
  private loginAfterRegistration(email: string, password: string) {
    const loginData: LoginUserDTO = {
      email: email,
      password: password,
    };

    this.subscriptions.add(
      this.authService.login(loginData).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error al iniciar sesión automáticamente:', error);
          // Si falla el login automático, redirigir al login manual
          this.router.navigate(['/login']);
        },
      })
    );
  }

  // Control para verificar que la contraseña coincida
  private passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const repeatPassword = formGroup.get('repeatPassword')?.value;

    return password === repeatPassword ? null : { passwordMismatch: true };
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
