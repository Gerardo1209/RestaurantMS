import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIS, ResponseObject, serverdirection } from './APIS.enum'
import { Observable } from 'rxjs';
import { Cliente,Det_Ped_Ord, Detalle_Orden, Mesa, Orden, Reservacion, Servicio } from './clientes.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private httpClient:HttpClient) { }

  //Mesas
  getMesas():Observable<ResponseObject<Mesa[]>>{
    return <Observable<ResponseObject<Mesa[]>>> this.httpClient.get(serverdirection + APIS.GET_MESAS)
  }

  //Reservaciones
  crearReservacion(reservacion:Reservacion):Observable<ResponseObject<string>>{
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.POST_CREAR_RESERVACION, reservacion);
  }
}
