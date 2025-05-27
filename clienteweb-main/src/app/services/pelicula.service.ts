import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeliculaService {
  private apiUrl = 'http://172.20.0.10:3000/pelicula'; // Cambia el puerto si es necesario

  constructor(private http: HttpClient) {}

  getPeliculas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addPelicula(pelicula: { titulo: string; anio_estreno: string; descripcion: string; director: string; genero: string; duracion: string; portada: string; trailer: string }): Observable<any> {
    return this.http.post(this.apiUrl, pelicula);
  }

  getPeliculaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}