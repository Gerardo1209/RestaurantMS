import { Component } from '@angular/core';
import { MenuComponent } from '../../../principal/menu/menu.component';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../servicios/productos.interface';

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

  }
}

