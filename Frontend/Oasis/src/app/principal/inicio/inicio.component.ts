import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
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
