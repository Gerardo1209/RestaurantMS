import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPlatillosComponent } from './menu-platillos/menu-platillos.component';

const routes: Routes = [
  { path: 'menu', component: MenuPlatillosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
