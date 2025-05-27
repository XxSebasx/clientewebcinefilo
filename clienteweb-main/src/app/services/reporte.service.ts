import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = 'http://172.20.0.10:3000/reporte';

  constructor(private http: HttpClient) {}

  // Crear un reporte
  createReporte(reporte: { descripcion: string; usuarioId: number; peliculaId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, reporte);
  }

  // Obtener todos los reportes
  getAllReportes(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Eliminar un reporte por ID
  deleteReporte(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}