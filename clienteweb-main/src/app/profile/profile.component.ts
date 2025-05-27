import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {
    imagenPerfil: '',
    imagenCabecera: '',
  };
  mostrarModal: boolean = false; // Controla la visibilidad del modal
  perfilFile: File | null = null;
  cabeceraFile: File | null = null;
  modoEdicion: boolean = false; // Controla si el perfil está en modo edición
  esPerfilPropio: boolean = true; // Indica si el perfil es del usuario actual
  mostrarPassword: boolean = false; // Controla la visibilidad de la contraseña

  // Variables para verificación
  codigoEnviado: boolean = false; // Indica si se ha enviado el código
  codigoVerificacion: string = ''; // Código ingresado por el usuario
  codigoGenerado: string = ''; // Código generado en el backend
  enviandoCodigo: boolean = false; // Nueva variable para mostrar el mensaje de envío

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Verificar si se accede al perfil con un nombre en la URL
    const userName = this.route.snapshot.paramMap.get('nombre');
    if (userName) {
      this.esPerfilPropio = false; // No es el perfil propio
      this.obtenerUsuarioPorNombre(userName);
    } else {
      this.esPerfilPropio = true; // Es el perfil propio
      this.obtenerPerfilPropio();
    }
  }

  // Obtener los datos del usuario actual
  obtenerPerfilPropio(): void {
    this.http.get('http://172.20.0.10:3000/session', { withCredentials: true }).subscribe({
      next: (response: any) => {
        const nombreUsuario = response.user?.nombre;
        if (nombreUsuario) {
          this.http.get(`http://172.20.0.10:3000/usuario/${nombreUsuario}`, { withCredentials: true }).subscribe({
            next: (usuario: any) => {
              this.user = usuario;
              this.updateProfile();
            },
            error: (err) => {
              console.error('Error al obtener los datos del usuario:', err);
            },
          });
        }
      },
      error: (err) => {
        console.error('Error al obtener la sesión:', err);
      },
    });
  }

  // Obtener los datos de un usuario por ID
  obtenerUsuarioPorId(userId: string): void {
    this.http.get(`http://172.20.0.10:3000/usuario/${userId}`).subscribe({
      next: (usuario: any) => {
        this.user = usuario;
        this.updateProfile();
      },
      error: (err) => {
        console.error('Error al obtener los datos del usuario:', err);
      },
    });
  }

  // Obtener los datos de un usuario por nombre
  obtenerUsuarioPorNombre(nombre: string): void {
    this.http.get(`http://172.20.0.10:3000/usuario/${nombre}`).subscribe({
      next: (usuario: any) => {
        this.user = usuario;
        this.updateProfile();
      },
      error: (err) => {
        console.error('Error al obtener los datos del usuario:', err);
      },
    });
  }

  updateProfile(): void {
    if (this.user) {
      // Actualizar los campos del perfil
      const nombreInput = document.getElementById('nombre') as HTMLInputElement;
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      const rolParagraph = document.querySelector('#rol') as HTMLElement;
      const estadoParagraph = document.querySelector('#estado') as HTMLElement;
      const miembroDesdeParagraph = document.querySelector('#miembroDesde') as HTMLElement;
      const imgProfile = document.getElementById('imgProfile') as HTMLImageElement;
      const imgHeader = document.getElementById('imgHeader') as HTMLElement;

      if (nombreInput) nombreInput.value = this.user.nombre || '';
      if (emailInput) emailInput.value = this.user.email || '';
      if (passwordInput) passwordInput.value = this.user.password || ''; // Mostrar la contraseña
      if (rolParagraph) rolParagraph.textContent = `Rol: ${this.user.rol || 'N/A'}`;
      if (estadoParagraph) estadoParagraph.textContent = `Estado: ${this.user.estado || 'N/A'}`;
      if (miembroDesdeParagraph) {
        // Formatear la fecha a "YYYY-MM-DD"
        const fecha = new Date(this.user.fecha);
        miembroDesdeParagraph.textContent = `Miembro desde: ${fecha.toISOString().split('T')[0] || 'N/A'}`;
      }
      if (imgProfile && this.user.imagenPerfil) imgProfile.src = this.user.imagenPerfil;
      if (imgHeader && this.user.imagenCabecera) imgHeader.style.backgroundImage = `url(${this.user.imagenCabecera})`;
    }
  }

  // Enviar el correo con el código de verificación
  enviarCodigo(): void {
    // Usa siempre el email del usuario cargado
    const email = this.user.email;

    if (!email) {
      alert('No se ha encontrado un correo electrónico válido.');
      this.enviandoCodigo = false;
      return;
    }

    this.enviandoCodigo = true; // Mostrar el mensaje
    this.codigoGenerado = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generar un código aleatorio

    this.http.post('http://172.20.0.10:3000/enviar-codigo', {
      email: email,
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
      this.actualizarDatosYCerrarSesion();
    } else {
      alert('El código de verificación es incorrecto.');
    }
  }

  // Actualizar los datos del usuario y cerrar sesión
  actualizarDatosYCerrarSesion(): void {
    const datosActualizados = {
      nombre: this.user.nombre,
      email: this.user.email,
      password: this.user.password,
      imagenPerfil: this.user.imagenPerfil,
      imagenCabecera: this.user.imagenCabecera,
    };

    this.http.put(`http://172.20.0.10:3000/usuario/${this.user.ID}`, datosActualizados, { withCredentials: true }).subscribe({
      next: () => {
        alert('Datos actualizados correctamente.');

        // Cerrar sesión
        this.http.post('http://172.20.0.10:3000/logout', {}, { withCredentials: true }).subscribe({
          next: () => {
            alert('Sesión cerrada. Redirigiendo a la página principal...');
            this.router.navigate(['/']); // Redirigir al componente Home
          },
          error: () => {
            alert('Error al cerrar la sesión.');
          },
        });
      },
      error: () => {
        alert('Error al actualizar los datos.');
      },
    });
  }

  // Actualizar los datos del usuario
  actualizarDatos(): void {
    const nombreInput = document.getElementById('nombre') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const datosActualizados = {
      nombre: nombreInput?.value || '',
      email: emailInput?.value || '',
      password: passwordInput?.value || '',
      imagenPerfil: this.user.imagenPerfil,
      imagenCabecera: this.user.imagenCabecera,
    };

    this.http.put(`http://172.20.0.10:3000/usuario/${this.user.ID}`, datosActualizados, { withCredentials: true }).subscribe({
      next: () => {
        alert('Datos actualizados correctamente.');
        this.mostrarModal = false; // Cerrar el modal
        this.modoEdicion = false; // Salir del modo edición
      },
      error: () => {
        alert('Error al actualizar los datos.');
      },
    });
  }

  // Manejar el clic en el botón de guardar
  guardarCambios(): void {
    this.enviarCodigo(); // Enviar el código de verificación al correo
  }

  triggerFileInput(type: 'perfil' | 'cabecera'): void {
    const input = document.getElementById(`${type}Input`) as HTMLInputElement;
    input.click();
  }

  onFileSelected(event: Event, type: 'perfil' | 'cabecera'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      // Subir la imagen al servidor
      this.http.post<{ url: string }>('http://172.20.0.10:3000/upload', formData).subscribe({
        next: (response) => {
          if (response && response.url) {
            if (type === 'perfil') {
              this.user.imagenPerfil = response.url; // Actualizar la URL de la imagen de perfil
              const perfilInput = document.getElementById('imagenPerfilRuta') as HTMLInputElement;
              if (perfilInput) perfilInput.value = response.url;
            } else if (type === 'cabecera') {
              this.user.imagenCabecera = response.url; // Actualizar la URL de la imagen de cabecera
              const cabeceraInput = document.getElementById('imagenCabeceraRuta') as HTMLInputElement;
              if (cabeceraInput) cabeceraInput.value = response.url;

              // Actualizar visualmente la cabecera
              const imgHeader = document.getElementById('imgHeader') as HTMLElement;
              if (imgHeader) imgHeader.style.backgroundImage = `url(${response.url})`;
            }
          }
        },
        error: (err) => {
          console.error('Error al subir la imagen:', err);
          alert('Error al subir la imagen.');
        },
      });
    }
  }

  confirmarGuardar(): void {
    const nombreInput = document.getElementById('nombre') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const datosActualizados = {
      nombre: nombreInput?.value || '',
      email: emailInput?.value || '',
      password: passwordInput?.value || '',
      imagenPerfil: this.user.imagenPerfil,
      imagenCabecera: this.user.imagenCabecera,
    };

    // Subir las imágenes antes de actualizar los datos
    const subirImagenes = () => {
      const promesas: Promise<void>[] = [];

      if (this.perfilFile) {
        const formData = new FormData();
        formData.append('file', this.perfilFile);

        const promesaPerfil = this.http.post<{ url: string }>('http://172.20.0.10:3000/upload', formData).toPromise().then((response) => {
          if (response && response.url) {
            this.user.imagenPerfil = response.url; // Actualizar la URL de la imagen de perfil
          }
        });
        promesas.push(promesaPerfil);
      }

      if (this.cabeceraFile) {
        const formData = new FormData();
        formData.append('file', this.cabeceraFile);

        const promesaCabecera = this.http.post<{ url: string }>('http://172.20.0.10:3000/upload', formData).toPromise().then((response) => {
          if (response && response.url) {
            this.user.imagenCabecera = response.url; // Actualizar la URL de la imagen de cabecera
          }
        });
        promesas.push(promesaCabecera);
      }

      return Promise.all(promesas);
    };

    subirImagenes()
      .then(() => {
        // Actualizar los datos del usuario en la base de datos
        this.http.put(`http://172.20.0.10:3000/usuario/${this.user.ID}`, datosActualizados, { withCredentials: true }).subscribe({
          next: () => {
            alert('Datos actualizados correctamente.');

            // Cerrar sesión
            this.http.post('http://172.20.0.10:3000/logout', {}, { withCredentials: true }).subscribe({
              next: () => {
                this.mostrarModal = false; // Cerrar el modal
                this.router.navigate(['/']); // Redirigir al componente Home
              },
              error: () => {
                alert('Error al cerrar la sesión.');
              },
            });
          },
          error: () => {
            alert('Error al actualizar los datos.');
          },
        });
      })
      .catch(() => {
        alert('Error al subir las imágenes.');
      });
  }

  // Método para recargar la página
  recargarPagina(): void {
    window.location.reload();
  }

  cancelarGuardar(): void {
    // Ocultar el modal sin realizar cambios
    this.mostrarModal = false;
  }

  // Activar el modo edición
  activarEdicion(): void {
    this.modoEdicion = true; // Cambiar a modo edición
  }

  // Desactivar el modo edición
  desactivarEdicion(): void {
    this.modoEdicion = false; // Salir del modo edición
  }

  togglePasswordVisibility(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
