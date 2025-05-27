import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-messages',
  imports: [NavbarComponent, FooterComponent, CommonModule],
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  messages: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://172.20.0.10:3000/contacto/mensajes').subscribe({
      next: (mensajes) => {
        this.messages = mensajes;
        console.log('Mensajes de la BD:', this.messages);
      },
      error: (err) => {
        console.error('Error al obtener los mensajes:', err);
      }
    });
  }
}