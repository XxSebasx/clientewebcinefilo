import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnlaceService {
  private apiUrl = 'http://172.20.0.10:3000/enlace';

  constructor(private http: HttpClient) {}

  createEnlace(enlace: { peliculaID: number; plataforma: string; url: string }): Observable<any> {
    return this.http.post(this.apiUrl, enlace);
  }
}