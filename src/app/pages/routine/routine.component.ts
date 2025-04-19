import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RoutineServiceService } from '../../services/routine-service.service';
import { DiasSemanaDto } from '../../interfaces/dias-semana-dto';
import { CardDiasSemanaComponentComponent } from '../../components/card-dias-semana-component/card-dias-semana-component.component';
import { AuthServiceService } from '../../services/auth-service.service';
import { UserDto } from '../../interfaces/user-dto';

@Component({
  selector: 'app-routine',
  standalone: true,
  imports: [CommonModule, CardDiasSemanaComponentComponent],
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.css']
})
export class RoutineComponent implements OnInit {
  diasSemana: DiasSemanaDto[] = [];
  cargando: boolean = false;
  error: string | null = null;
  usuarioId: number | null = null;

  constructor(
    private routineService: RoutineServiceService,
    private authService: AuthServiceService
  ) {}

  ngOnInit() {
    console.log('✅ RoutineComponent cargado');

    const email = this.authService.getEmail();
    console.log('📧 Email almacenado:', email);

    if (email) {
      this.authService.getUsuarioByEmail(email).subscribe({
        next: (user: UserDto) => {
          console.log('👤 Usuario obtenido:', user);

          if (user && user.id) {
            this.usuarioId = user.id;
            this.obtenerDiasSemana(this.usuarioId);
          } else {
            this.error = 'Usuario no encontrado.';
            console.warn('⚠️ Usuario no contiene un ID válido.');
          }
        },
        error: (err) => {
          this.error = 'Error al obtener el usuario por email.';
          console.error('❌ Error getUsuarioByEmail:', err);
        }
      });
    } else {
      this.error = 'No se pudo obtener el email del usuario.';
      console.error('❌ Email no disponible en localStorage.');
    }
  }

  obtenerDiasSemana(usuarioId: number) {
    this.cargando = true;
    this.error = null;
    console.log('⏳ Obteniendo días para usuario ID:', usuarioId);

    this.routineService.getDiasSemanaPorUsuario(usuarioId).subscribe({
      next: (data) => {
        this.diasSemana = data;
        console.log('✅ Días de la semana recibidos:', data);
      },
      error: (err) => {
        this.error = 'Error al obtener los días de la semana.';
        console.error('❌ Error getDiasSemanaPorUsuario:', err);
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }
}
