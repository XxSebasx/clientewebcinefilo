import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-admin-movie-update',
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  standalone: true,
  templateUrl: './admin-movie-update.component.html',
  styleUrl: './admin-movie-update.component.css',
})
export class AdminMovieUpdateComponent {
  buscarPelicula: string = '';
  peliculas: any[] = [];
  nuevaPelicula: any = {};
  mostrarVistaPelicula: boolean = false;
  enlaces: any[] = [];
  plataformaSeleccionada: string = '';
  enlacePlataforma: string | null = null;
  nuevoEnlace: { url: string; plataforma: string } = { url: '', plataforma: '' };
  generos: string[] = [
    'terror',
    'accion',
    'comedia',
    'drama',
    'ciencia ficcion',
    'fantasia',
    'romance'
  ];

  constructor(private http: HttpClient) {}

  buscarPeliculas(): void {
    console.log('Método buscarPeliculas ejecutado con el término:', this.buscarPelicula);
    if (!this.buscarPelicula.trim()) {
      console.warn('El campo de búsqueda está vacío.');
      return;
    }

    this.http
      .get<any[]>('http://172.20.0.10:3000/peliculas/buscar', {
        params: { query: this.buscarPelicula },
      })
      .subscribe({
        next: (data) => {
          console.log('Películas encontradas:', data);
          this.peliculas = data;
        },
        error: (err) => {
          console.error('Error al buscar películas:', err);
        },
      });
  }

  seleccionarPelicula(pelicula: any): void {
    this.nuevaPelicula = { ...pelicula };
    // Formatea la fecha a "YYYY-MM-DD"
    if (pelicula.anio_estreno) {
      const d = new Date(pelicula.anio_estreno);
      // Si la fecha es válida, formatea
      if (!isNaN(d.getTime())) {
        this.nuevaPelicula.anio_estreno = d.toISOString().slice(0, 10);
      } else {
        this.nuevaPelicula.anio_estreno = '';
      }
    } else {
      this.nuevaPelicula.anio_estreno = '';
    }
    this.mostrarVistaPelicula = true;

    // Obtener enlaces de la película
    this.http
      .get<any[]>(`http://172.20.0.10:3000/enlaces/${pelicula.ID}`)
      .subscribe({
        next: (data) => {
          this.enlaces = data;
        },
        error: (err) => {
          console.error('Error al obtener enlaces:', err);
        },
      });
  }

  mostrarEnlacePorPlataforma(): void {
    const enlace = this.enlaces.find(
      (e) => e.plataforma === this.nuevoEnlace.plataforma
    );
    this.nuevoEnlace.url = enlace ? enlace.url : ''; // Cambia 'enlace.enlace' por 'enlace.url'
  }

  agregarEnlace(): void {
    if (!this.nuevoEnlace.url || !this.nuevoEnlace.plataforma) {
      console.error('Faltan datos para agregar el enlace.');
      return;
    }

    this.enlaces.push({ ...this.nuevoEnlace });
    console.log('Enlace agregado:', this.nuevoEnlace);
    this.nuevoEnlace = { url: '', plataforma: '' };
  }

  actualizarEnlace(): void {
    if (!this.nuevoEnlace.url || !this.nuevoEnlace.plataforma) {
      console.error('Faltan datos para actualizar o crear el enlace.');
      return;
    }

    const enlaceExistente = this.enlaces.find(
      (e) => e.plataforma === this.nuevoEnlace.plataforma
    );

    if (enlaceExistente) {
      // Actualizar enlace existente
      this.http
        .put(`http://172.20.0.10:3000/enlace/${enlaceExistente.ID}`, {
          url: this.nuevoEnlace.url,
        })
        .subscribe({
          next: () => {
            console.log('Enlace actualizado correctamente.');
            enlaceExistente.url = this.nuevoEnlace.url;
          },
          error: (err) => {
            console.error('Error al actualizar el enlace:', err);
          },
        });
    } else {
      // Crear nuevo enlace
      this.http
        .post('http://172.20.0.10:3000/enlace', {
          peliculaID: this.nuevaPelicula.ID,
          plataforma: this.nuevoEnlace.plataforma,
          url: this.nuevoEnlace.url,
        })
        .subscribe({
          next: (nuevoEnlace: any) => {
            console.log('Enlace creado correctamente.');
            this.enlaces.push(nuevoEnlace);
          },
          error: (err) => {
            console.error('Error al crear el enlace:', err);
          },
        });
    }
  }

  actualizarPelicula(): void {
    // Validar formato YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(this.nuevaPelicula.anio_estreno)) {
      alert('La fecha debe tener el formato YYYY-MM-DD');
      return;
    }
    this.http
      .put(`http://172.20.0.10:3000/pelicula/${this.nuevaPelicula.ID}`, this.nuevaPelicula)
      .subscribe({
        next: () => {
          console.log('Película actualizada correctamente.');
        },
        error: (err) => {
          console.error('Error al actualizar la película:', err);
        },
      });
  }

  eliminarPelicula(): void {
    if (!this.nuevaPelicula.ID) {
      alert('No hay película seleccionada.');
      return;
    }
    if (!confirm('¿Seguro que quieres eliminar esta película? Esta acción no se puede deshacer.')) {
      return;
    }
    this.http
      .delete(`http://172.20.0.10:3000/pelicula/${this.nuevaPelicula.ID}`)
      .subscribe({
        next: () => {
          alert('Película eliminada correctamente.');
          this.mostrarVistaPelicula = false;
          this.buscarPeliculas(); // Refresca el listado
        },
        error: (err) => {
          console.error('Error al eliminar la película:', err);
          alert('Error al eliminar la película.');
        },
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.http.post<{ url: string }>('http://172.20.0.10:3000/upload', formData)
        .subscribe({
          next: (res) => {
            this.nuevaPelicula.portada = res.url; // Guarda solo la URL
          },
          error: (err) => {
            console.error('Error al subir la imagen:', err);
          }
        });
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('portadaInput') as HTMLInputElement;
    fileInput.click();
  }

  getFechaFormateada(fecha: string): string {
    // Si ya está en formato YYYY-MM-DD, devuélvelo tal cual
    if (!fecha) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
    // Si viene en otro formato, intenta convertirlo
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  }

  onFechaChange(valor: string) {
    this.nuevaPelicula.anio_estreno = valor;
  }
}
