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

  getOrdenes():Observable<ResponseObject<Orden[]>>{
    return <Observable<ResponseObject<Orden[]>>> this.httpClient.get(serverdirection + APIS.GET_ORDENES)
  }

  getOrden(idOrden:number):Observable<ResponseObject<Orden>>{
    var url = APIS.GET_ORDEN.replace(':idOrden',idOrden.toString());
    return <Observable<ResponseObject<Orden>>> this.httpClient.get(serverdirection + url)
  }

  crearOrden(orden:Orden):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    orden.usr_usuario = usuario.usuario;
    orden.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.POST_CREAR_ORDEN, orden);
  }

  editarOrden(orden:Orden):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    orden.usr_usuario = usuario.usuario;
    orden.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.POST_EDITAR_ORDEN, orden);
  }

  //DetalleOrden
  getDetalleOrdenes():Observable<ResponseObject<Detalle_Orden[]>>{
    return <Observable<ResponseObject<Detalle_Orden[]>>> this.httpClient.get(serverdirection + APIS.GET_DETALLE_ORDENES)
  }

  getDetalleOrden(idDetalleOrden:number):Observable<ResponseObject<Detalle_Orden>>{
    var url = APIS.GET_DETALLE_ORDEN.replace(':idDetalleOrden',idDetalleOrden.toString());
    return <Observable<ResponseObject<Detalle_Orden>>> this.httpClient.get(serverdirection + url)
  }

  crearDetalleOrden(detalleOrden:Detalle_Orden):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    detalleOrden.usr_usuario = usuario.usuario;
    detalleOrden.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.POST_CREAR_DETALLE_ORDEN, detalleOrden);
  }

  editarDetalleOrden(detalleOrden:Detalle_Orden):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    detalleOrden.usr_usuario = usuario.usuario;
    detalleOrden.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.POST_EDITAR_DETALLE_ORDEN, detalleOrden);
  }

  //Detalleorden pedido
  getDetPedOrdenes():Observable<ResponseObject<Det_Ped_Ord[]>>{
    return <Observable<ResponseObject<Det_Ped_Ord[]>>> this.httpClient.get(serverdirection + APIS.GET_DET_PED_ORDENES)
  }

  getDetPedOrden(idDetPedOrden:number):Observable<ResponseObject<Det_Ped_Ord>>{
    var url = APIS.GET_DET_PED_ORDEN.replace(':idDetPedOrden',idDetPedOrden.toString());
    return <Observable<ResponseObject<Det_Ped_Ord>>> this.httpClient.get(serverdirection + url)
  }

  crearDetPedOrden(detPedOrden:Det_Ped_Ord):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    detPedOrden.usr_usuario = usuario.usuario;
    detPedOrden.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.POST_CREAR_DET_PED_ORDEN, detPedOrden);
  }

  editarDetPedOrden(detPedOrden:Det_Ped_Ord):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    detPedOrden.usr_usuario = usuario.usuario;
    detPedOrden.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.POST_EDITAR_DET_PED_ORDEN, detPedOrden);
  }

  //Servicios
  crearServicio(servicio:Servicio):Observable<ResponseObject<string>>{
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.POST_CREAR_SERVICIO, servicio)
  }


}
