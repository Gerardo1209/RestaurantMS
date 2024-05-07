import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AlertasService } from '../../servicios/alertas.service';
import { Empleado } from '../../servicios/empleados.interface';
import { Cliente } from '../../servicios/clientes.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  selectedButton: string = '';
  private eventSubscription!:Subscription;
  @Input() evento!:Observable<any>;
  usuario:Empleado|undefined;
  servicio:Cliente|undefined;

  constructor(
    private router:Router,
    private alertasService:AlertasService
  ){}

  ngOnInit() {
    this.eventSubscription = this.evento.subscribe(() => {
      this.obtenerSesion();
    });
    this.obtenerSesion();
  }

  async obtenerSesion(){
    if(sessionStorage.getItem('usuario')){
      this.usuario = JSON.parse(sessionStorage.getItem('usuario')!)
    }else if(sessionStorage.getItem('servicio')){
      this.servicio =  <Cliente>JSON.parse(sessionStorage.getItem('servicio')!).cliente;
    }

  }

  cerrarServicio(){
    if(this.servicio != undefined){
      sessionStorage.removeItem('servicio');
      this.alertasService.success('Servicio finalizado');
      this.servicio = undefined;
      this.router.navigate(['/']);
    }
  }

  cerrarSesion(){
    if(this.usuario != undefined){
      sessionStorage.removeItem('usuario');
      this.alertasService.success('Sesión cerrada');
      this.usuario = undefined;
      this.router.navigate(['/']);
    }
  }
}
