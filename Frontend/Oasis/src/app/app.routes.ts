import { Routes } from '@angular/router';
import { InicioComponent } from './principal/inicio/inicio.component';
import { MenuComponent } from './principal/menu/menu.component';
import { PreguntasComponent } from './principal/preguntas/preguntas.component';
import { UbicacionComponent } from './principal/ubicacion/ubicacion.component';

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
      path: '',
      redirectTo: 'inicio',
      pathMatch: 'full'
    },
    /*{
      path: '**',
      redirectTo: 'inicio'
    }*/
];
