import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../services/login/auth-service.service';



@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  protected userName: string | null = null;
  protected email: string | null = null;

  private authService = inject(AuthServiceService);

  ngOnInit(): void {
    this.getUserName();
  }

  protected getUserName() {
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
}
