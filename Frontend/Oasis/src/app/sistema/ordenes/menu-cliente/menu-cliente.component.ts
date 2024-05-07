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
  totalAPagar: number = 0;

  fnRecibirProducto(productoAgregar: Producto): void {
    const productoExistente = this.products.find(p => p.id === productoAgregar.id);

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      productoAgregar.cantidad = 1;
      this.products.push(productoAgregar);
    }

    this.calcularTotal();
    console.log(this.products);
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

  removeProduct(productId: number): void {
    this.products = this.products.filter(product => product.id !== productId);
    this.calcularTotal();
  }

  private calcularTotal(): void {
    this.totalAPagar = this.products.reduce((acc, product) => acc + product.precio * product.cantidad, 0);
  }
}