import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://172.20.0.10:3000/usuario'; // Cambia el puerto si es necesario

  constructor(private http: HttpClient) {}

  addUsuario(usuario: { nombre: string; email: string; password: string; imagenPerfil: string }): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  getUsuarioPorNombre(nombre: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${nombre}`);
  }

  cambiarRol(id: number, rol: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/rol`, { rol });
  }

  cambiarEstado(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, {});
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
