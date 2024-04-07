import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-platillos',
  templateUrl: './menu-platillos.component.html',
  styleUrls: ['./menu-platillos.component.css']
})
export class MenuPlatillosComponent implements OnInit {
  dishes: Dish[];

  constructor() {
    this.dishes = [];
  }

  ngOnInit(): void {
    for (let i = 0; i < 5; i++) {
      let dishAux: Dish = {
        name: "Platillo "+i,
        ingredients: ["ing1","ing2","ing3"],
        time: "",
        cost: 50.00,
        img: "assets/img/logo.png",

      }
      this.dishes.push(dishAux);
    }
  }

}
interface Dish {
  name: String,
  ingredients: String[],
  time: String,
  cost: number,
  img: String,
}
