import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { InicioComponent } from './principal/inicio/inicio.component';
import { HeaderComponent } from './principal/header/header.component';
import { FooterComponent } from './principal/footer/footer.component';
import { IniciarsesionComponent } from './sistema/iniciarsesion/iniciarsesion.component';
import { ReservacionComponent } from './principal/reservacion/reservacion.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    InicioComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'Oasis';
  outlet:HTMLDivElement | undefined;
  iniciarSesion = new EventEmitter();

  constructor(private router:Router){}

  suscribeToEmmiter(componentRef:Component){
    if(componentRef instanceof IniciarsesionComponent){
      componentRef.loginEvent.subscribe(()=>{
        this.iniciarSesion.emit();
      });
    }
    if(componentRef instanceof ReservacionComponent){
      componentRef.loginEvent.subscribe(() => {
        this.iniciarSesion.emit();
      })
    }
  }

  ngOnInit(): void {
    /*this.outlet = <HTMLDivElement>document.getElementById("router-outlet-container");
    this.router.events.subscribe(
      (event) => {
        if(event.type == 0 && this.outlet){
          this.outlet.style.animation = 'none';
          this.outlet.style.animation = '';
        }
      }
    )*/
  }

}
