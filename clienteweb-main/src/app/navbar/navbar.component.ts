import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isMobileMenuOpen = false;
  showMobileMenuButton = false;
  isLoggedIn = false;
  userProfileImage: string = 'recursos/perfil.jpg';
  userName: string | null = null;
  userRole: string | null = null;
  searchQuery: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private elementRef: ElementRef // Añade esto
  ) {}

  ngOnInit(): void {
    this.checkSession();
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.showMobileMenuButton = window.innerWidth <= 991; // Cambia 768 por 991
    if (!this.showMobileMenuButton) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  checkSession(): void {
    this.http.get('http://172.20.0.10:3000/session', { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.isLoggedIn = true;
        this.userName = response.user.nombre;
        this.userRole = response.user.rol;

        if (this.userName) {
          this.getUserProfileImage(this.userName);
        }
      },
      error: () => {
        this.isLoggedIn = false;
        this.userName = null;
        this.userRole = null;
      }
    });
  }

  getUserProfileImage(userName: string): void {
    this.http.get(`http://172.20.0.10:3000/usuario/${userName}`).subscribe({
      next: (user: any) => {
        this.userProfileImage = user.imagenPerfil || 'recursos/perfil.jpg';
      },
      error: () => {
        this.userProfileImage = 'recursos/perfil.jpg';
      }
    });
  }

  onSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (this.searchQuery.trim() === '') {
        this.router.navigate(['/catalog']);
      } else {
        this.router.navigate(['/catalog'], { queryParams: { query: this.searchQuery.trim() } });
      }
      this.isMobileMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Cierra el menú si el clic es fuera del menú de usuario y del avatar
    if (
      this.isMenuOpen &&
      !this.elementRef.nativeElement.querySelector('.user-menu').contains(target)
    ) {
      this.isMenuOpen = false;
    }
  }
}