import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warning',
  imports: [NavbarComponent, FooterComponent],
  standalone: true,
  templateUrl: './warning.component.html',
  styleUrl: './warning.component.css'
})
export class WarningComponent {
  constructor(private router: Router) { }

  irAContacto(): void {
    this.router.navigate(['/contact']);
  }
}
