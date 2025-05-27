import { Component } from '@angular/core';
import { PeliculaService } from '../services/pelicula.service';
import { EnlaceService } from '../services/enlace.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-movie',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './admin-movie-add.component.html',
  styleUrl: './admin-movie-add.component.css',
})
export class AdminMovieAddComponent {
  nuevaPelicula = {
    titulo: '',
    anio_estreno: '',
    descripcion: '',
    director: '',
    genero: '',
    duracion: '',
    portada: '',
    trailer: '',
  };

  nuevoEnlace = {
    url: '',
    plataforma: '',
  };

  peliculaGuardada: boolean = false; // Indica si la película se ha guardado
  peliculaID: number | null = null; // ID de la película guardada
  mostrarEnlaces: boolean = false; // Controla la visibilidad de la sección de enlaces

  errores: { [key: string]: string } = {}; // Objeto para almacenar errores

  constructor(
    private peliculaService: PeliculaService,
    private enlaceService: EnlaceService,
    private http: HttpClient
  ) {}

  // Manejar la selección de archivos
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      // Subir la imagen al servidor
      this.http.post<{ url: string }>('http://172.20.0.10:3000/upload', formData).subscribe({
        next: (response) => {
          this.nuevaPelicula.portada = response.url; // Guardar la URL completa de la imagen
          console.log('Imagen subida:', response.url);
        },
        error: (err) => {
          console.error('Error al subir la imagen:', err);
        },
      });
    }
  }

  // Activar el input de archivo
  triggerFileInput(): void {
    const fileInput = document.getElementById('portadaInput') as HTMLInputElement;
    fileInput.click();
  }

  // Guardar la película en la base de datos
  onSubmit(): void {
    if (this.peliculaGuardada) {
      alert('La película ya está guardada.');
      return;
    }

    this.peliculaService.addPelicula(this.nuevaPelicula).subscribe({
      next: (pelicula) => {
        console.log('Película guardada:', pelicula);
        alert('Película guardada exitosamente');
        this.peliculaGuardada = true;
        this.mostrarEnlaces = true;
        this.peliculaID = pelicula.ID; // Asignar el ID de la película guardada
        this.errores = {}; // Limpiar errores
      },
      error: (err) => {
        console.error('Error al guardar la película:', err);
        if (err.error && err.error.errors) {
          this.errores = {};
          err.error.errors.forEach((error: any) => {
            this.errores[error.path] = error.msg;
          });
        } else {
          alert('Error al guardar la película');
        }
      },
    });
  }

  agregarEnlace(): void {
    if (!this.peliculaID) {
      alert('No se ha guardado la película. Guarda la película antes de añadir enlaces.');
      return;
    }

    // Validar que los campos no estén vacíos
    if (!this.nuevoEnlace.url || !this.nuevoEnlace.plataforma) {
      alert('Por favor, completa todos los campos del enlace.');
      return;
    }

    const enlace = {
      peliculaID: this.peliculaID, // Asociar el enlace con el ID de la película
      plataforma: this.nuevoEnlace.plataforma,
      url: this.nuevoEnlace.url, // Cambiado de 'enlace' a 'url'
    };

    this.enlaceService.createEnlace(enlace).subscribe({
      next: (response) => {
        console.log('Enlace añadido:', response);
        alert('Enlace añadido exitosamente');
        this.nuevoEnlace = { url: '', plataforma: '' }; // Resetear los campos
      },
      error: (err) => {
        console.error('Error al añadir el enlace:', err);
        alert('Error al añadir el enlace');
      },
    });
  }

  // Resetear el formulario después de guardar
  resetFormulario(): void {
    this.nuevaPelicula = {
      titulo: '',
      anio_estreno: '',
      descripcion: '',
      director: '',
      genero: '',
      duracion: '',
      portada: '',
      trailer: '',
    };
  }

  // Método para recargar la página
  borrarDatos(): void {
    window.location.reload();
  }
}
