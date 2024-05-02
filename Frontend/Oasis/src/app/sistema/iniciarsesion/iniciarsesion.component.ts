import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-iniciarsesion',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './iniciarsesion.component.html',
  styleUrl: './iniciarsesion.component.scss'
})
export class IniciarsesionComponent {

  formLogin: FormGroup = new FormGroup({
    usuario: new FormControl<string>('', [Validators.required, Validators.email]),
    contrasena: new FormControl<string>('', [Validators.required])
  })

  constructor(){
  }



  onSubmit(){

  }

}
