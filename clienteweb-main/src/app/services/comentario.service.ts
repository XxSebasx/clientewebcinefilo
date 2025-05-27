import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private apiUrl = 'http://172.20.0.10:3000/comentario';

  constructor(private http: HttpClient) {}

  // Crear un comentario
  createComentario(comentario: { texto: string; usuarioId: number; peliculaId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, comentario);
  }

  // Obtener comentarios por ID de película
  getComentarios(peliculaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${peliculaId}`);
  }

  // Eliminar un comentario por ID
  deleteComentario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}