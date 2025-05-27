import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComentarioService } from '../services/comentario.service';

@Component({
  selector: 'app-reports',
  imports: [NavbarComponent, FooterComponent, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  reportes: any[] = []; // Almacena los reportes
  todosLosReportes: any[] = [];
  textoFiltro: string = '';
  usuario: any = null; // Añade esta línea

  constructor(
    private http: HttpClient,
    private router: Router,
    private comentarioService: ComentarioService // Añade el servicio aquí
  ) {}

  ngOnInit(): void {
    this.obtenerReportes();
    this.comprobarSesion(); // Añade esto
  }

  comprobarSesion(): void {
    this.http.get('http://172.20.0.10:3000/session', { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.usuario = response.user;
      },
      error: (err) => {
        this.usuario = null;
      }
    });
  }

  // Obtener todos los reportes
  obtenerReportes(): void {
    this.http.get<any[]>('http://172.20.0.10:3000/reportes').subscribe({
      next: (data) => {
        this.reportes = data;
        this.todosLosReportes = data;
        console.log('Reportes:', this.reportes); // Mostrar los reportes en la consola
      },
      error: (err) => {
        console.error('Error al obtener los reportes:', err);
      },
    });
  }

  filtrarReportes(): void {
    const filtro = this.textoFiltro.trim().toLowerCase();
    if (!filtro) {
      this.reportes = this.todosLosReportes;
      return;
    }
    this.reportes = this.todosLosReportes.filter(reporte =>
      reporte.comentario?.Usuario?.nombre?.toLowerCase().includes(filtro)
    );
  }

  // Redirigir al perfil del usuario usando el nombre
  verPerfil(usuario: any): void {
    if (usuario && usuario.nombre) {
      console.log('Datos del usuario:', usuario); // Mostrar los datos del usuario en la consola
      this.router.navigate(['/profile', usuario.nombre]); // Redirigir al perfil usando el nombre del usuario
    } else {
      console.error('El usuario no tiene un nombre válido:', usuario); // Mostrar un mensaje de error en la consola
    }
  }

  eliminarComentario(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este comentario?')) {
      this.comentarioService.deleteComentario(id).subscribe({
        next: () => {
          this.obtenerReportes(); // Recarga los reportes
        },
        error: (err) => {
          console.error('Error al eliminar el comentario:', err);
        }
      });
    }
  }
}
