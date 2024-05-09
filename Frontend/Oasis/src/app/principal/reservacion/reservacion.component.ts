import { Component, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientesService } from '../../servicios/clientes.service';
import { Cliente, Reservacion, Servicio } from '../../servicios/clientes.interface';
import { AlertasService } from '../../servicios/alertas.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reservacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,],
  templateUrl: './reservacion.component.html',
  styleUrl: './reservacion.component.scss',
  providers: [ClientesService, Router]
})
export class ReservacionComponent {

  loginEvent = new EventEmitter();
  showCurp:boolean = false;

  formNuevaReservacion: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellidoPaterno: new FormControl('', [Validators.required]),
    apellidoMaterno: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    hora: new FormControl('', [Validators.required]),
    curp: new FormControl('')
  })

  formVerificarReservacion: FormGroup = new FormGroup({
    idReservacion: new FormControl('', [Validators.required]),
    contrasena: new FormControl('', [Validators.required]),
  })

  loadingReservacion: boolean = false;
  loadingServicio:boolean = false;

  constructor(
    private clientesService:ClientesService,
    private alertasService:AlertasService,
    private router:Router
  ) {}

  onSubmit(opc: number) {

    if (opc == 1) {
      this.loadingReservacion = true;
      var cliente:Cliente = {
        AM: this.formNuevaReservacion.controls['apellidoMaterno'].value,
        AP: this.formNuevaReservacion.controls['apellidoPaterno'].value,
        CURP: this.formNuevaReservacion.controls['curp'].value,
        Email: '',
        id: 0,
        Nombre: this.formNuevaReservacion.controls['nombre'].value,
        Telefono: this.formNuevaReservacion.controls['telefono'].value,
      }
      var fecha:string = this.formNuevaReservacion.controls['fecha'].value;
      var fechaSeparada = fecha.split('-');
      var hora:string = this.formNuevaReservacion.controls['hora'].value;
      var horaSeparada = hora.split(':');
      var reservacion:Reservacion = {
        fecha: new Date(parseInt(fechaSeparada[0]), parseInt(fechaSeparada[1])-1, parseInt(fechaSeparada[2]),parseInt(horaSeparada[0]), parseInt(horaSeparada[1])).toISOString(),
        habilitado: true,
        id: 0,
        id_cliente: 0,
        id_mesa: 3,
        password: '',
        cliente: cliente
      }
      this.clientesService.crearReservacion(reservacion).forEach(
        (res) => {
          if(res.success && typeof res.message == 'string'){
            this.alertasService.success(res.message);
            this.alertasService.modal('Reservación confirmada', 'Guarda muy bien tus datos de confirmación<br> Número de reservación: ' + res.data.id + '<br> Contaseña: ' + res.data.password)
            this.loadingReservacion = false;
          }else{
            if(typeof res.message == 'string') this.alertasService.error(res.message)
              this.loadingReservacion = false;
          }
        }
      )
    } else {
      this.loadingServicio = true;
      var servicio:Servicio = {
        Estado: '',
        HE: '',
        HS: '',
        id: 0,
        id_emp: 15,
        id_res: this.formVerificarReservacion.controls['idReservacion'].value,
        res_id: this.formVerificarReservacion.controls['idReservacion'].value,
        res_contrasena: this.formVerificarReservacion.controls['contrasena'].value,
      }
      this.clientesService.crearServicio(servicio).forEach(
        (res) => {
          if(res.success && typeof res.message == 'string'){
            this.alertasService.success(res.message);
            sessionStorage.setItem('servicio', JSON.stringify(res.data));
            this.loadingServicio = false;
            this.loginEvent.emit();
            this.router.navigate(['/sistema/ordenes/menu-cliente']);
          }else{
            if(typeof res.message == 'string') this.alertasService.error(res.message)
            this.loadingServicio = false;
          }
        }
      )
    }
  }
}
