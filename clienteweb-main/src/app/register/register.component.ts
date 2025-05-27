import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule], // Asegúrate de incluir HttpClientModule aquí
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  nuevoUsuario = {
    nombre: '',
    email: '',
    password: '',
    imagenPerfil: '',
  };

  confirmPassword: string = '';
  mostrarPassword: boolean = false;
  mostrarConfirmPassword: boolean = false;

  // Variables para mensajes de error
  passwordError: string | null = null;
  nombreUsuarioError: string | null = null;
  emailError: string | null = null;

  // Variables para verificación
  codigoEnviado: boolean = false;
  codigoVerificacion: string = '';
  codigoGenerado: string = '';

  // Nueva variable para mostrar el mensaje de envío
  enviandoCodigo: boolean = false;

  constructor(private usuarioService: UsuarioService, private http: HttpClient) {}

  // Manejar la selección de archivos
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.http.post<{ url: string }>('http://172.20.0.10:3000/upload', formData).subscribe({
        next: (response) => {
          this.nuevoUsuario.imagenPerfil = response.url;
        },
        error: (err) => {
          console.error('Error al subir la imagen:', err);
        },
      });
    }
  }

  // Activar el input de archivo
  triggerFileInput(): void {
    const fileInput = document.getElementById('imagenPerfilInput') as HTMLInputElement;
    fileInput.click();
  }

  // Alternar visibilidad de contraseñas
  togglePasswordVisibility(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.mostrarConfirmPassword = !this.mostrarConfirmPassword;
  }

  // Verificar si el nombre de usuario ya existe
  verificarNombreUsuario(): void {
    this.http
      .get(`http://172.20.0.10:3000/usuario/${this.nuevoUsuario.nombre}`)
      .subscribe({
        next: () => {
          this.nombreUsuarioError = 'Este nombre de usuario ya existe';
        },
        error: (err) => {
          if (err.status === 404) {
            this.nombreUsuarioError = null; // No existe el usuario
          } else {
            console.error('Error al verificar el nombre de usuario:', err);
          }
        },
      });
  }

  // Verificar si el email ya existe
  verificarEmail(): void {
    this.http
      .get(`http://172.20.0.10:3000/usuario/email/${this.nuevoUsuario.email}`)
      .subscribe({
        next: () => {
          this.emailError = 'Este correo ya existe, pruebe con otro';
        },
        error: (err) => {
          if (err.status === 404) {
            this.emailError = null; // No existe el email
          } else {
            console.error('Error al verificar el email:', err);
          }
        },
      });
  }

  // Validar contraseñas
  validarpassword(): void {
    this.passwordError =
      this.nuevoUsuario.password !== this.confirmPassword
        ? 'Las contraseñas no coinciden'
        : null;
  }

  // Enviar el correo con el código de verificación
  enviarCodigo(): void {
    this.enviandoCodigo = true; // Mostrar el mensaje
    this.codigoGenerado = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generar un código aleatorio

    this.http.post('http://172.20.0.10:3000/enviar-codigo', {
      email: this.nuevoUsuario.email,
      codigo: this.codigoGenerado,
    }).subscribe({
      next: () => {
        this.codigoEnviado = true;
        this.enviandoCodigo = false; // Ocultar el mensaje
        alert('Código de verificación enviado al correo.');
      },
      error: (err) => {
        console.error('Error al enviar el código:', err);
        this.enviandoCodigo = false; // Ocultar el mensaje
        alert('Error al enviar el código de verificación.');
      },
    });
  }

  // Verificar el código ingresado
  verificarCodigo(): void {
    if (this.codigoVerificacion === this.codigoGenerado) {
      this.registrarUsuario();
    } else {
      alert('El código de verificación es incorrecto.');
    }
  }

  // Registrar al usuario
  registrarUsuario(): void {
    this.usuarioService.addUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        alert('Usuario registrado exitosamente');
        this.resetFormulario();
      },
      error: (err) => {
        console.error('Error al registrar el usuario:', err);
        alert('Error al registrar el usuario');
      },
    });
  }

  // Manejar el envío del formulario
  onSubmit(): void {
    if (!this.codigoEnviado) {
      this.enviarCodigo();
    } else {
      this.verificarCodigo();
    }
  }

  // Resetear el formulario
  resetFormulario(): void {
    this.nuevoUsuario = {
      nombre: '',
      email: '',
      password: '',
      imagenPerfil: '',
    };
    this.confirmPassword = '';
    this.passwordError = null;
    this.nombreUsuarioError = null;
    this.emailError = null;
    this.codigoEnviado = false;
    this.codigoVerificacion = '';
    this.codigoGenerado = '';
  }
}
