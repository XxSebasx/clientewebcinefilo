import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://172.20.0.10:3000/login'; // Cambia el puerto si es necesario

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials,{ withCredentials: true });
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  isLoggedIn(): boolean {
    return !!this.getUser(); // Verificar si hay un usuario autenticado
  }

  logout(): Observable<any> {
    // Llama al backend para cerrar sesión y limpia el localStorage
    return new Observable(observer => {
      this.http.post('http://172.20.0.10:3000/logout', {}, { withCredentials: true }).subscribe({
        next: (res) => {
          localStorage.removeItem('user');
          observer.next(res);
          observer.complete();
        },
        error: (err) => {
          localStorage.removeItem('user');
          observer.error(err);
        }
      });
    });
  }
}