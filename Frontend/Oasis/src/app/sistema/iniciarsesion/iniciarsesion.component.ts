import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EmpleadosService } from '../../servicios/empleados.service';
import { AlertasService } from '../../servicios/alertas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-iniciarsesion',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './iniciarsesion.component.html',
  styleUrl: './iniciarsesion.component.scss'
})
export class IniciarsesionComponent {

  loading:boolean = false;
  formLogin: FormGroup = new FormGroup({
    usuario: new FormControl<string>('', [Validators.required]),
    contrasena: new FormControl<string>('', [Validators.required])
  })

  constructor(
    private empleadosService:EmpleadosService,
    private alertasService:AlertasService,
    private router:Router
  ){
  }


  onSubmit(){
    this.loading = true;
    this.empleadosService.loginEmpleado(this.formLogin.controls['usuario'].value, this.formLogin.controls['contrasena'].value)
    .forEach((res) => {
      if(res.success && typeof res.message == 'object'){
        this.alertasService.success('Iniciando sesión');
        sessionStorage.setItem('usuario', JSON.stringify(res.message))
        this.loading = false;
        this.router.navigate(['sistema/subcategorias']);
      }else{
        this.loading = false;
        if(typeof res.message == 'string') this.alertasService.error(res.message)
      }
    })
  }

}
