import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { PeliculaService } from '../services/pelicula.service';

@Component({
  selector: 'app-catalog',
  imports: [NavbarComponent, FooterComponent, CommonModule],
  standalone: true,
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  peliculas: any[] = [];
  todasLasPeliculas: any[] = []; // Guardar todas las películas
  paginaActual: number = 1;
  peliculasPorPagina: number = 20;

  constructor(
    private peliculaService: PeliculaService, // Servicio para obtener todas las películas
    private http: HttpClient, // HttpClient para la búsqueda
    private router: Router,
    private route: ActivatedRoute // Para observar los cambios en los parámetros de la URL
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      const query = params['query'];
      if (query) {
        this.buscarPeliculas(query); // Realizar la búsqueda si hay un parámetro
      } else {
        this.obtenerPeliculas(); // Obtener todas las películas si no hay búsqueda
      }
    });
  }

  // Obtener todas las películas (usando el servicio)
  obtenerPeliculas(): void {
    this.peliculaService.getPeliculas().subscribe({
      next: (data) => {
        this.todasLasPeliculas = data;
        this.paginaActual = 1;
        this.actualizarPeliculasPaginadas();
        //mostrar las primeras 24 películas por consola del navegador
        console.log(this.todasLasPeliculas.slice(0, 24));
      },
      error: (err) => {
        console.error('Error al obtener las películas:', err);
      }
    });
  }

  actualizarPeliculasPaginadas(): void {
    const inicio = (this.paginaActual - 1) * this.peliculasPorPagina;
    const fin = inicio + this.peliculasPorPagina;
    this.peliculas = this.todasLasPeliculas.slice(inicio, fin);
  }

  paginaSiguiente(): void {
    if (this.paginaActual * this.peliculasPorPagina < this.todasLasPeliculas.length) {
      this.paginaActual++;
      this.actualizarPeliculasPaginadas();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPeliculasPaginadas();
    }
  }

  // Buscar películas por título (usando la ruta /peliculas/buscar directamente)
  buscarPeliculas(query: string): void {
    this.http
      .get<any[]>('http://172.20.0.10:3000/peliculas/buscar', { params: { query } })
      .subscribe({
        next: (data) => {
          this.peliculas = data; // Mostrar solo las películas que coincidan
        },
        error: (err) => {
          console.error('Error al buscar películas:', err);
        }
      });
  }

  // Obtener películas populares
  obtenerPeliculasPopulares(): void {
    this.http.get('http://172.20.0.10:3000/peliculas/populares').subscribe({
      next: (data: any) => {
        this.peliculas = data.slice(0, 24); // Mostrar películas ordenadas por popularidad
      },
      error: (err) => {
        console.error('Error al obtener las películas populares:', err);
      }
    });
  }

  // Obtener películas mejor valoradas
  obtenerPeliculasValoradas(): void {
    this.http.get('http://172.20.0.10:3000/peliculas/top').subscribe({
      next: (data: any) => {
        this.peliculas = data.slice(0, 24); // Mostrar películas ordenadas por calificación
      },
      error: (err) => {
        console.error('Error al obtener las películas mejor valoradas:', err);
      }
    });
  }

  // Obtener películas más recientes (estrenos)
  obtenerPeliculasEstrenos(): void {
    this.http.get('http://172.20.0.10:3000/peliculas/estrenos').subscribe({
      next: (data: any) => {
        this.peliculas = data.slice(0, 24); // Mostrar películas ordenadas por fecha de estreno
      },
      error: (err) => {
        console.error('Error al obtener las películas más recientes:', err);
      }
    });
  }

  // Obtener películas por género
  obtenerPeliculasPorGenero(genero: string): void {
    this.http.get('http://172.20.0.10:3000/peliculas/genero', { params: { genero } }).subscribe({
      next: (data: any) => {
        this.peliculas = data.slice(0, 24); // Mostrar películas filtradas por género
      },
      error: (err) => {
        console.error('Error al obtener películas por género:', err);
      }
    });
  }

  // Obtener películas por intervalo de años
  obtenerPeliculasPorAnio(inicio: number, fin: number): void {
    this.http.get('http://172.20.0.10:3000/peliculas/anio', { params: { inicio, fin } }).subscribe({
      next: (data: any) => {
        this.peliculas = data.slice(0, 24); // Mostrar películas filtradas por intervalo de años
      },
      error: (err) => {
        console.error('Error al obtener películas por intervalo de años:', err);
      }
    });
  }

  // Manejar el cambio en el select de género
  onGeneroChange(event: Event): void {
    const genero = (event.target as HTMLSelectElement).value;
    if (genero !== 'Genero') {
      this.obtenerPeliculasPorGenero(genero);
    } else {
      this.obtenerPeliculas(); // Mostrar todas las películas si no se selecciona un género
    }
  }

  // Manejar el cambio en el select de año
  onAnioChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const intervalos: { [key: string]: [number, number] } = {
      '2': [2020, 2025],
      '3': [2010, 2019],
      '4': [2000, 2009],
      '5': [1990, 1999],
      '6': [1980, 1989],
      '7': [1970, 1979],
      '8': [1960, 1969],
      '9': [1950, 1959],
      '10': [1940, 1949],
      '11': [1930, 1939],
      '20': [1920, 1929],
    };

    if (intervalos[value]) {
      const [inicio, fin] = intervalos[value];
      this.obtenerPeliculasPorAnio(inicio, fin);
    } else {
      this.obtenerPeliculas(); // Mostrar todas las películas si no se selecciona un intervalo
    }
  }

  // Redirigir a la página de detalles de la película
  verPelicula(id: number): void {
    this.router.navigate(['/movie', id]); // Redirige a la página de detalles con el ID
  }
}
