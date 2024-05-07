import { Component } from '@angular/core';
import { MenuComponent } from '../../../principal/menu/menu.component';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../servicios/productos.interface';
import { ClientesService } from '../../../servicios/clientes.service';
import { Orden } from '../../../servicios/clientes.interface';
import { AlertasService } from '../../../servicios/alertas.service';

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

export class MenuClienteComponent {

  products: Producto[] = [];

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

  incrementQuantity(product: Producto): void {
    product.cantidad++;
  }

  decrementQuantity(product: Producto): void {
    if (product.cantidad > 0) {
      product.cantidad--;
    }
  }

  removeProduct(productId: number): void {
    this.products = this.products.filter(product => product.id !== productId);
  }

  fnRecibirProducto(productoAgregar: Producto) {
    console.log(productoAgregar)
    this.products.push(productoAgregar)
  }
}

