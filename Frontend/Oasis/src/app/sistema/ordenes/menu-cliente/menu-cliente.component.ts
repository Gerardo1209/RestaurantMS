import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../../principal/menu/menu.component';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../servicios/productos.interface';
import { ClientesService } from '../../../servicios/clientes.service';
import { Orden } from '../../../servicios/clientes.interface';
import { AlertasService } from '../../../servicios/alertas.service';
import * as bootstrap from 'bootstrap';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-menu-cliente',
  standalone: true,
  imports: [
    MenuComponent,
    CommonModule
  ],
  templateUrl: './menu-cliente.component.html',
  styleUrl: './menu-cliente.component.scss'
})

export class MenuClienteComponent implements OnInit{

  products: Producto[] = [];
  totalAPagar: number = 0;

  fnRecibirProducto(productoAgregar: Producto): void {
    const productoExistente = this.products.find(p => {
      if(p.id !== productoAgregar.id) return false;
      if(p.listaIngredientesTexto != productoAgregar.listaIngredientesTexto) return false;
      return true;
    });
    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      productoAgregar.cantidad = 1;
      this.products.push(productoAgregar);
    }

    this.calcularTotal();
  }




  constructor(private clientesService:ClientesService,
    private alertasService:AlertasService
  ){
    /*var orden:Orden = {
      id_serv: JSON.parse(sessionStorage.getItem('servicio')!).id,
      Estado: '',
      Flag: '',
      habilitado: true,
      Hora: '',
      id: 0,
    }
    this.clientesService.crearOrden(orden).forEach((res) => {
      if(res.success && typeof res.message == 'string'){
        this.alertasService.success(res.message);

      }else{
        if(typeof res.message == 'string') this.alertasService.error(res.message)
      }
    })*/
  }
  ngOnInit(): void {

  }

  incrementQuantity(product: Producto): void {
    product.cantidad++;
    this.calcularTotal();
  }

  decrementQuantity(product: Producto): void {
    if (product.cantidad > 1) {
      product.cantidad--;
    } else {
      this.products = this.products.filter(p => p.id !== product.id);
    }
    this.calcularTotal();
  }

  removeProduct(productId: Producto): void {
    this.products = this.products.filter(product => {
      if(product.id !== productId.id) return true;
      if(product.listaIngredientesTexto != productId.listaIngredientesTexto) return true;
      return false;
    });
    this.calcularTotal();
  }

  private calcularTotal(): void {
    this.totalAPagar = this.products.reduce((acc, product) => acc + product.precio * product.cantidad, 0);
  }
}
