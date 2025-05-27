import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  errorMessage: string = '';
  mostrarPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  // Iniciar sesión
  iniciarSesion(): void {
    this.errorMessage = ''; // Limpiar mensaje previo
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        const user = response.user;
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        if (err.status === 403) {
          // Usuario inactivo, redirigir a warning
          this.router.navigate(['/warning']);
        } else if (err.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Inténtalo de nuevo.';
        }
      },
    });
  }

  togglePasswordVisibility(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  // Manejar el envío del formulario
  onSubmit(): void {
    this.iniciarSesion();
  }
}
