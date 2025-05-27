import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PeliculaService } from '../services/pelicula.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { SafeUrlPipe } from '../pipes/safe-url.pipe'; // Ajusta la ruta según la ubicación del Pipe
import { ComentarioService } from '../services/comentario.service';

@Component({
  selector: 'app-movie',
  imports: [NavbarComponent, FooterComponent, CommonModule, FormsModule, SafeUrlPipe], // Agrega SafeUrlPipe aquí
  standalone: true,
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css'
})
export class MovieComponent implements OnInit {
  pelicula: any;
  enlaces: any[] = [];
  usuario: any = null; // Datos del usuario de la sesión
  comentarios: any[] = []; // Almacena los comentarios de la película
  mostrarModal = false; // Controla la visibilidad del modal para reportar
  mostrarModalSesion = false; // Controla la visibilidad del modal para iniciar sesión
  motivoReporte = ''; // Motivo del reporte
  comentarioReportadoId: number | null = null; // ID del comentario a reportar

  constructor(
    private route: ActivatedRoute,
    private peliculaService: PeliculaService,
    private http: HttpClient,
    private router: Router,
    private comentarioService: ComentarioService // Añade el servicio aquí
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtener el ID de la película
    if (id) {
      this.obtenerPelicula(+id);
      this.obtenerEnlaces(+id);
      this.obtenerComentarios(+id); // Obtener los comentarios de la película
    }
    this.comprobarSesion(); // Comprobar si el usuario ha iniciado sesión
  }

  // Obtener los datos de la película
  obtenerPelicula(id: number): void {
    this.peliculaService.getPeliculaById(id).subscribe({
      next: (data) => {
        if (data.anio_estreno) {
          const fecha = new Date(data.anio_estreno);
          data.anio_estreno = fecha.toISOString().split('T')[0];
        }
        // Eliminar espacios iniciales y finales de la descripción
        if (data.descripcion) {
          data.descripcion = data.descripcion.trim();
        }
        this.pelicula = data;
        console.log('Película:', this.pelicula);
      },
      error: (err) => {
        console.error('Error al obtener la película:', err);
      }
    });
  }

  // Obtener los enlaces relacionados con la película
  obtenerEnlaces(peliculaID: number): void {
    this.http.get<any[]>(`http://172.20.0.10:3000/enlaces/${peliculaID}`).subscribe({
      next: (enlaces) => {
        this.enlaces = enlaces;
        console.log('Enlaces:', this.enlaces);
      },
      error: (err) => {
        console.error('Error al obtener los enlaces:', err);
      }
    });
  }

  // Obtener los comentarios relacionados con la película
  obtenerComentarios(peliculaID: number): void {
    this.http.get<any[]>(`http://172.20.0.10:3000/comentario/${peliculaID}`).subscribe({
      next: (comentarios) => {
        this.comentarios = comentarios;
        console.log('Comentarios:', this.comentarios); // Mostrar los comentarios en la consola
      },
      error: (err) => {
        console.error('Error al obtener los comentarios:', err);
      }
    });
  }

  // Método para comprobar si el usuario ha iniciado sesión
  comprobarSesion(): void {
    this.http.get('http://172.20.0.10:3000/session', { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.usuario = response.user;
        console.log('Usuario en sesión:', this.usuario);
      },
      error: (err) => {
        console.error('Error al comprobar la sesión:', err);
      }
    });
  }

  // Método para crear un comentario
  crearComentario(): void {
    if (!this.usuario) {
      console.error('El usuario no ha iniciado sesión.');
      return;
    }

    const comentarioInput = document.getElementById('comentario') as HTMLTextAreaElement;
    const calificacionInput = document.getElementById('calificacion') as HTMLInputElement;

    const comentario = comentarioInput.value;
    const calificacion = parseInt(calificacionInput.value, 10);

    if (!comentario || !calificacion) {
      console.error('Faltan datos para crear el comentario.');
      return;
    }

    const nuevoComentario = {
      idPelicula: this.pelicula.ID,
      idUsuario: this.usuario.id,
      texto: comentario,
      valoracion: calificacion
    };

    this.http.post('http://172.20.0.10:3000/comentario', nuevoComentario).subscribe({
      next: () => {
        console.log('Comentario creado exitosamente.');
        window.location.reload(); // Recargar la página
      },
      error: (err) => {
        console.error('Error al crear el comentario:', err);
      }
    });
  }

  // Abrir el modal para reportar un comentario
  abrirModalReporte(comentarioId: number): void {
    if (!this.usuario) {
      // Si el usuario no ha iniciado sesión, mostrar el modal de sesión
      this.mostrarModalSesion = true;
    } else {
      // Si el usuario ha iniciado sesión, mostrar el modal de reporte
      this.comentarioReportadoId = comentarioId;
      this.mostrarModal = true;
    }
  }

  // Cerrar el modal de sesión
  cerrarModalSesion(): void {
    this.mostrarModalSesion = false;
  }

  // Cerrar el modal de reporte
  cerrarModal(): void {
    this.mostrarModal = false;
    this.motivoReporte = '';
    this.comentarioReportadoId = null;
  }

  // Enviar el reporte al backend
  enviarReporte(): void {
    if (!this.usuario) {
      console.error('El usuario no ha iniciado sesión.');
      return;
    }

    if (!this.motivoReporte.trim()) {
      console.error('El motivo del reporte no puede estar vacío.');
      return;
    }

    const nuevoReporte = {
      idUsuario: this.usuario.id,
      idComentario: this.comentarioReportadoId,
      motivo: this.motivoReporte
    };

    this.http.post('http://172.20.0.10:3000/reporte', nuevoReporte).subscribe({
      next: () => {
        console.log('Reporte enviado exitosamente.');
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al enviar el reporte:', err);
      }
    });
  }

  // Método para obtener el color de fondo según la plataforma
  getBackgroundColor(plataforma: string): string {
    switch (plataforma.toLowerCase()) {
      case 'netflix': return 'red';
      case 'hbo': return 'purple';
      case 'amazon': return 'orange';
      case 'disney': return 'blue';
      case 'movistar': return 'green';
      default: return 'gray';
    }
  }

  // Método para obtener el logo según la plataforma
  getLogo(plataforma: string): string {
    
    switch (plataforma.toLowerCase()) {
      case 'netflix': return 'recursos/netflix.png';
      case 'hbo': return 'recursos/HBO.jpg';
      case 'amazon': return 'recursos/amazon.png';
      case 'disney': return 'recursos/disney.jpg';
      case 'movistar': return 'recursos/movistar.png';
      default: return 'recursos/default.png'; // Logo por defecto
    }
  }

  // Método para redirigir al perfil del usuario
  verPerfil(usuario: any): void {
    if (usuario && usuario.nombre) {
      console.log('Datos del usuario:', usuario); // Mostrar los datos del usuario en la consola
      this.router.navigate(['/profile', usuario.nombre]); // Redirigir al perfil usando el nombre del usuario
    } else {
      console.error('El usuario no tiene un nombre válido:', usuario); // Mostrar un mensaje de error en la consola
    }
  }

  irALogin(): void {
    this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
  }

  irARegistro(): void {
    this.router.navigate(['/register']); // Redirigir a la página de registro
  }

  eliminarComentario(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este comentario?')) {
      this.comentarioService.deleteComentario(id).subscribe({
        next: () => {
          this.obtenerComentarios(this.pelicula.ID); // Recarga comentarios
        },
        error: (err) => {
          console.error('Error al eliminar el comentario:', err);
        }
      });
    }
  }
}
