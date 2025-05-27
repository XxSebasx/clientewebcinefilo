import { Component } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.css',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent, FooterComponent],
})
export class AdminUserComponent {
  nombreUsuario: string = '';
  usuario: any = null;
  nuevoRol: string = '';

  constructor(private usuarioService: UsuarioService) {}

  buscarUsuario(): void {
    if (!this.nombreUsuario.trim()) {
      console.error('Por favor, ingresa un nombre de usuario.');
      return;
    }

    this.usuarioService.getUsuarioPorNombre(this.nombreUsuario).subscribe({
      next: (response: any) => {
        console.log('Usuario encontrado:', response);
        this.usuario = response;
      },
      error: (err) => {
        console.error('Error al buscar el usuario:', err);
        this.usuario = null;
      },
    });
  }

  cambiarRol(): void {
    if (!this.nuevoRol) {
      alert('Por favor, selecciona un rol.');
      return;
    }

    this.usuarioService.cambiarRol(this.usuario.ID, this.nuevoRol).subscribe({
      next: (response) => {
        console.log('Rol actualizado:', response);
        alert('Rol actualizado exitosamente.');
        this.usuario.rol = this.nuevoRol;
      },
      error: (err) => {
        console.error('Error al cambiar el rol:', err);
        alert('Error al cambiar el rol.');
      },
    });
  }

  cambiarEstado(): void {
    this.usuarioService.cambiarEstado(this.usuario.ID).subscribe({
      next: (response) => {
        console.log('Estado actualizado:', response);
        alert('Estado actualizado exitosamente.');
        this.usuario.estado =
          this.usuario.estado === 'activo' ? 'inactivo' : 'activo';
      },
      error: (err) => {
        console.error('Error al cambiar el estado:', err);
        alert('Error al cambiar el estado.');
      },
    });
  }

  eliminarUsuario(): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    this.usuarioService.eliminarUsuario(this.usuario.ID).subscribe({
      next: () => {
        console.log('Usuario eliminado.');
        alert('Usuario eliminado exitosamente.');
        this.usuario = null;
      },
      error: (err) => {
        console.error('Error al eliminar el usuario:', err);
        alert('Error al eliminar el usuario.');
      },
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
}