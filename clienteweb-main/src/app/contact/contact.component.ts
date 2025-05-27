import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule

@Component({
  selector: 'app-contact',
  imports: [NavbarComponent, FooterComponent, CommonModule, FormsModule], // Agregar FormsModule aquí
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contacto = {
    nombre: '',
    email: '',
    asunto: '',
    contenido: '', // Cambiar "mensaje" por "contenido" para coincidir con el modelo del backend
  };

  mensajeEnviado: boolean = false;
  enviando: boolean = false;

  constructor(private http: HttpClient) {}

  enviarFormulario(): void {
    this.enviando = true;
    this.http.post('http://172.20.0.10:3000/contacto', this.contacto).subscribe({
      next: () => {
        this.mensajeEnviado = true;
        this.enviando = false;
        alert('Mensaje enviado correctamente.');
        this.contacto = { nombre: '', email: '', asunto: '', contenido: '' }; // Limpiar el formulario
      },
      error: (err) => {
        console.error('Error al enviar el mensaje:', err);
        this.enviando = false;
        alert('Hubo un error al enviar el mensaje. Inténtelo de nuevo.');
      },
    });
  }
}
