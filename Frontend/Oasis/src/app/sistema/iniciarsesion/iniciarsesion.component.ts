import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-iniciarsesion',
  standalone: true,
  imports: [],
  templateUrl: './iniciarsesion.component.html',
  styleUrl: './iniciarsesion.component.scss'
})
export class IniciarsesionComponent {
  email:string;
  password:string;

  constructor(){
    this.email = "";
    this.password = "";
  }

  onSubmit(form:NgForm){
    if(form.valid){
      this.email = form.value.email;
      this.password = form.value.password;
    }
  }
  
}
