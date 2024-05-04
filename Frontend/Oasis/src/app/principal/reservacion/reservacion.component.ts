import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-reservacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,],
  templateUrl: './reservacion.component.html',
  styleUrl: './reservacion.component.scss'
})
export class ReservacionComponent {

  showCurp: boolean;
  formNuevaReservacion: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.email]),
    apellidoPaterno: new FormControl('', [Validators.required]),
    apellidoMaterno: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    curp: new FormControl(''),
  })
  formVerificarReservacion: FormGroup = new FormGroup({
    correo: new FormControl('', [Validators.email]),
    contrasena: new FormControl('', [Validators.required]),
  })

  constructor() {
    this.showCurp = false;
  }

  onSubmit(opc: number) {
    if (opc == 1) {
      console.log("reservar")
    } else {
      console.log("verifacr")
    }
  }
}
