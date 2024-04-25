import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InicioComponent } from './principal/inicio/inicio.component';
import { HeaderComponent } from './principal/header/header.component';
import { FooterComponent } from './principal/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    InicioComponent,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Oasis';
}
