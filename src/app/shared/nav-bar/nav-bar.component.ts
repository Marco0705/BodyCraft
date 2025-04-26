import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../services/login/auth-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit, OnDestroy {
  protected userName: string | null = null;
  protected email: string | null = null;

  private authService = inject(AuthServiceService);
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    // Cargar datos iniciales
    this.updateUserInfo();

    // Suscribirse a cambios en el estado de autenticación
    this.subscription.add(
      this.authService.authStatus$.subscribe(() => {
        this.updateUserInfo();
      })
    );
  }

  protected updateUserInfo(): void {
    if (this.authService.isAuthenticated()) {
      // Si está autenticado, obtenemos el nombre y el email
      this.userName = this.authService.getUserName();
      this.email = this.authService.getEmail();
    } else {
      // Si no está autenticado, mostramos 'Invitado'
      this.userName = 'Invitado';
      this.email = null;
    }
  }

  protected logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
