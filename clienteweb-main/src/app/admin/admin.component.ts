import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router'; // Importar RouterOutlet para la navegación


@Component({
  selector: 'app-admin',
  imports: [NavbarComponent, FooterComponent,RouterLink],
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  
}
