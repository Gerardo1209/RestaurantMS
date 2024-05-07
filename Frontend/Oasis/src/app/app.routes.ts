import { Routes } from '@angular/router';
import { InicioComponent } from './principal/inicio/inicio.component';
import { MenuComponent } from './principal/menu/menu.component';
import { PreguntasComponent } from './principal/preguntas/preguntas.component';
import { UbicacionComponent } from './principal/ubicacion/ubicacion.component';
import { IniciarsesionComponent } from './sistema/iniciarsesion/iniciarsesion.component';
import { SidenavComponent } from './sistema/sidenav/sidenav.component';
import { SubcategoriasComponent } from './sistema/configuracion/subcategorias/subcategorias.component';
import { ReservacionComponent } from './principal/reservacion/reservacion.component';
import { MenuClienteComponent } from './sistema/ordenes/menu-cliente/menu-cliente.component';
import { MenuMeserosComponent } from './sistema/ordenes/menu-meseros/menu-meseros.component';

export const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
  },
  {
    path: 'menu',
    component: MenuComponent,
  },
  {
    path: 'FAQ',
    component: PreguntasComponent,
  },
  {
    path: 'ubicacion',
    component: UbicacionComponent,
  },
  {
    path: 'iniciarsesion',
    component: IniciarsesionComponent,
  },
  {
    path: 'reservacion',
    component: ReservacionComponent,
  },
  {
    path: 'sistema/subcategorias',
    component: SubcategoriasComponent,
  },
  {
    path: 'sistema/ordenes/menu-cliente',
    component: MenuClienteComponent,
  },
  {
    path: 'sistema/ordenes/menu-meseros',
    component: MenuMeserosComponent,
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  /*{
      path: '**',
      redirectTo: 'inicio'
    }*/
];
