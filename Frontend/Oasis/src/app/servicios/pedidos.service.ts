import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIS, ResponseObject, serverdirection } from './APIS.enum';
import { DetPedOrden, DetalleOrden, Orden } from './pedidos.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private httpClient:HttpClient) { }

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
  getDetalleOrdenes():Observable<ResponseObject<DetalleOrden[]>>{
    return <Observable<ResponseObject<DetalleOrden[]>>> this.httpClient.get(serverdirection + APIS.GET_DETALLE_ORDENES)
  }

  getDetalleOrden(idDetalleOrden:number):Observable<ResponseObject<DetalleOrden>>{
    var url = APIS.GET_DETALLE_ORDEN.replace(':idDetalleOrden',idDetalleOrden.toString());
    return <Observable<ResponseObject<DetalleOrden>>> this.httpClient.get(serverdirection + url)
  }

  crearDetalleOrden(detalleOrden:DetalleOrden):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    detalleOrden.usr_usuario = usuario.usuario;
    detalleOrden.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.POST_CREAR_DETALLE_ORDEN, detalleOrden);
  }

  editarDetalleOrden(detalleOrden:DetalleOrden):Observable<ResponseObject<string>>{
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
  getDetPedOrdenes():Observable<ResponseObject<DetPedOrden[]>>{
    return <Observable<ResponseObject<DetPedOrden[]>>> this.httpClient.get(serverdirection + APIS.GET_DET_PED_ORDENES)
  }

  getDetPedOrden(idDetPedOrden:number):Observable<ResponseObject<DetPedOrden>>{
    var url = APIS.GET_DET_PED_ORDEN.replace(':idDetPedOrden',idDetPedOrden.toString());
    return <Observable<ResponseObject<DetPedOrden>>> this.httpClient.get(serverdirection + url)
  }

  crearDetPedOrden(detPedOrden:DetPedOrden):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    detPedOrden.usr_usuario = usuario.usuario;
    detPedOrden.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.POST_CREAR_DET_PED_ORDEN, detPedOrden);
  }

  editarDetPedOrden(detPedOrden:DetPedOrden):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    detPedOrden.usr_usuario = usuario.usuario;
    detPedOrden.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.POST_EDITAR_DET_PED_ORDEN, detPedOrden);
  }

}
