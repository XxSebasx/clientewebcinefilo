import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUser();
    console.log('AdminGuard user:', user); // <-- Añade esto para depurar

    if (!user) {
      this.router.navigate(['/error']);
      return false;
    }
    if (user.rol !== 'admin') {
      this.router.navigate(['/error']);
      return false;
    }
    return true;
  }
}