import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router'; // Importar RouterOutlet para la navegación
import { AuthService } from '../services/auth.service';
import { PeliculaService } from '../services/pelicula.service';

@Component({
  selector: 'app-admin-movie',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink, RouterOutlet], // Importar RouterLink y RouterOutlet
  templateUrl: './admin-movie.component.html',
  styleUrl: './admin-movie.component.css',
})
export class AdminMovieComponent {
  
}

