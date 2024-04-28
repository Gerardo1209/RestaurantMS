import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../servicios/productos.service';
import { Categoria, Producto } from '../../servicios/productos.interface';
import { AlertasService } from '../../servicios/alertas.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
  providers: [
    ProductosService
  ]
})
export class InicioComponent implements OnInit{

  productos:Producto[] = [];

  constructor(
    private productosService:ProductosService,
    private alertasService:AlertasService
  ){}

  ngOnInit(): void {
      this.getProductos();
  }


  getProductos(){
    this.productosService.getProductos().forEach((res) => {
      if(res.success && typeof res.message == 'object'){
        //Obtiene 6 productos aleatorios para mostrar o si hay menos los muestra
        var cantidadMostrar = 6;
        if(res.message.length < 6){
          var cantidadMostrar = res.message.length;
        }
        while (this.productos.length < cantidadMostrar) {
          var i = Math.floor(Math.random() * res.message.length);
          var insert = res.message[i]
          var find = this.productos.find((a) => {return a.id == insert.id});
          if(!find) this.productos.push(insert);
        }
      }else{
        if(typeof res.message == 'string') this.alertasService.error(res.message)
      }
    });
  }

  cards = [
    {
      imageUrl: '../../../assets/png/1.png',
      title: 'Producto 1',
      text: 'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.'
    },
    {
      imageUrl: '../../../assets/png/2.png',
      title: 'Producto 2',
      text: 'This is a short card.'
    },
    {
      imageUrl: '../../../assets/png/3.png',
      title: 'Producto 3',
      text: 'This is a longer card with supporting text below as a natural lead-in to additional content.'
    },
    {
      imageUrl: '../../../assets/png/5.png',
      title: 'Producto 4',
      text: 'This is a short card.'
    },
    {
      imageUrl: '../../../assets/png/6.png',
      title: 'Producto 5',
      text: 'This is a longer card with supporting text below as a natural lead-in to additional content.'
    },
    {
      imageUrl: '../../../assets/png/1.png',
      title: 'Producto 6',
      text: 'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.'
    },

  ];
}
