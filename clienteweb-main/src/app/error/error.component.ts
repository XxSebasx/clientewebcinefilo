import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-error',
  imports: [NavbarComponent, FooterComponent],
  standalone: true,
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {


}
