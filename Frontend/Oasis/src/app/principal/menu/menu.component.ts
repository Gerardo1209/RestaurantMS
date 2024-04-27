import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  itemsTemp = [
    {nombre: "Entradas", active: true},
    {nombre: "Fuertes", active: false},
    {nombre: "Sopas", active: false},
    {nombre: "Postres", active: false},
    {nombre: "Bebidas", active: false}
  ]

  prodTemp = [
    {nombre: "Alas", active: false, precio: 50},
    {nombre: "Haburguesa", active: true, precio: 50},
    {nombre: "Pizza", active: false, precio: 50},
    {nombre: "Burrito", active: false, precio: 50},
    {nombre: "Sandwich", active: false, precio: 50}
  ]

  changeActive(item:any){
    var active = this.itemsTemp.find((a)=>{return a.active == true});
    if(active)active.active = false
    var find = this.itemsTemp.find((a)=>{return a.nombre == item.nombre});
    if(find) find.active = true;
  }

  getActiveItem():string{
    console.log("Hola")
    var active = this.itemsTemp.find((a)=>{return a.active == true});
    if(active){
      return active?.nombre;
    }else{
      return ""
    }
  }


}
