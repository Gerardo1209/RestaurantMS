import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientesService } from '../../servicios/clientes.service';
import { Cliente, Reservacion } from '../../servicios/clientes.interface';
import { AlertasService } from '../../servicios/alertas.service';
@Component({
  selector: 'app-reservacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,],
  templateUrl: './reservacion.component.html',
  styleUrl: './reservacion.component.scss',
  providers: [ClientesService]
})
export class ReservacionComponent {

  formNuevaReservacion: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellidoPaterno: new FormControl('', [Validators.required]),
    apellidoMaterno: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    curp: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
    hora: new FormControl('', Validators.required)
  })
  formVerificarReservacion: FormGroup = new FormGroup({
    idReservacion: new FormControl('', [Validators.email]),
    contrasena: new FormControl('', [Validators.required]),
  })

  loadingReservacion: boolean = false;

  constructor(
    private clientesService:ClientesService,
    private alertasService:AlertasService
  ) {}

  onSubmit(opc: number) {

    if (opc == 1) {
      console.log("reservar")
      var cliente:Cliente = {
        AM: this.formNuevaReservacion.controls['apellidoMaterno'].value,
        AP: this.formNuevaReservacion.controls['apellidoPaterno'].value,
        CURP: this.formNuevaReservacion.controls['curp'].value,
        Email: '',
        id: 0,
        Nombre: this.formNuevaReservacion.controls['nombre'].value,
        Telefono: this.formNuevaReservacion.controls['telefono'].value,
      }
      console.log(this.formNuevaReservacion.controls['fecha'].value, this.formNuevaReservacion.controls['hora'].value)
      var fecha:string = this.formNuevaReservacion.controls['fecha'].value;
      var fechaSeparada = fecha.split('-');
      var hora:string = this.formNuevaReservacion.controls['hora'].value;
      var horaSeparada = hora.split(':');
      var reservacion:Reservacion = {
        fecha: new Date(parseInt(fechaSeparada[0]), parseInt(fechaSeparada[1])-1, parseInt(fechaSeparada[2]),parseInt(horaSeparada[0]), parseInt(horaSeparada[1])).toISOString(),
        habilitado: true,
        id: 0,
        id_cliente: 0,
        id_mesa: 0,
        password: '',
        cliente: cliente
      }
      /*this.clientesService.crearReservacion(reservacion).forEach(
        (res) => {
          if(res.success && typeof res.message == 'string'){
            this.alertasService.success(res.message);
          }else{
            if(typeof res.message == 'string') this.alertasService.error(res.message)
          }
        }
      )*/
    } else {
      console.log("verificar")
      var reservacion:Reservacion = {
        fecha: '',
        habilitado: true,
        id: 0,
        id_cliente: 0,
        id_mesa: 0,
        password: '',
      }
    }
  }
}
