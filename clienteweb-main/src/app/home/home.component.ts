import { Component, OnInit, HostListener } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  peliculasValoradas: any[] = [];
  peliculasPopulares: any[] = [];
  peliculasEstrenos: any[] = [];

  paginaActual: number = 0;
  paginaActualPopulares: number = 0;
  paginaActualEstrenos: number = 0;

  itemsPorPagina: number = 5; // Valor inicial para pantallas grandes
  totalPaginas: number = 2; // Para 10 películas (10/5=2)

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.calcularItemsPorPagina();
    this.obtenerPeliculasValoradas();
    this.obtenerPeliculasPopulares();
    this.obtenerPeliculasEstrenos();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calcularItemsPorPagina();
  }

  calcularItemsPorPagina(): void {
    const width = window.innerWidth;
    
    if (width < 576) {
      this.itemsPorPagina = 2; // 2 películas en móviles pequeños
    } else if (width < 768) {
      this.itemsPorPagina = 2; // 2 películas en móviles
    } else if (width < 992) {
      this.itemsPorPagina = 3; // 3 películas en tablets
    } else if (width < 1200) {
      this.itemsPorPagina = 3; // 3 películas en pantallas medianas
    } else if (width < 1400) {
      this.itemsPorPagina = 4; // 4 películas en pantallas grandes
    } else {
      this.itemsPorPagina = 5; // 5 películas en pantallas muy grandes
    }
    
    this.totalPaginas = Math.ceil(10 / this.itemsPorPagina);
  }

  obtenerPeliculasValoradas(): void {
    this.http.get('http://172.20.0.10:3000/peliculas/top?limit=10').subscribe({
      next: (data: any) => {
        this.peliculasValoradas = data;
      },
      error: (err) => {
        console.error('Error al obtener las mejores películas:', err);
      },
    });
  }

  obtenerPeliculasPopulares(): void {
    this.http.get('http://172.20.0.10:3000/peliculas/populares?limit=10').subscribe({
      next: (data: any) => {
        this.peliculasPopulares = data;
      },
      error: (err) => {
        console.error('Error al obtener las películas más populares:', err);
      },
    });
  }

  obtenerPeliculasEstrenos(): void {
    this.http.get('http://172.20.0.10:3000/peliculas/estrenos?limit=10').subscribe({
      next: (data: any) => {
        this.peliculasEstrenos = data;
      },
      error: (err) => {
        console.error('Error al obtener las películas más recientes:', err);
      },
    });
  }

  avanzar(): void {
    if (this.paginaActual < this.totalPaginas - 1) {
      this.paginaActual++;
    }
  }

  retroceder(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
    }
  }

  avanzarPopulares(): void {
    if (this.paginaActualPopulares < this.totalPaginas - 1) {
      this.paginaActualPopulares++;
    }
  }

  retrocederPopulares(): void {
    if (this.paginaActualPopulares > 0) {
      this.paginaActualPopulares--;
    }
  }

  avanzarEstrenos(): void {
    if (this.paginaActualEstrenos < this.totalPaginas - 1) {
      this.paginaActualEstrenos++;
    }
  }

  retrocederEstrenos(): void {
    if (this.paginaActualEstrenos > 0) {
      this.paginaActualEstrenos--;
    }
  }

  verPelicula(id: number): void {
    this.router.navigate(['/movie', id]);
  }
}