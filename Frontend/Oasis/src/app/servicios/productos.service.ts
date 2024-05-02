import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIS, ResponseObject, serverdirection } from './APIS.enum'
import { Observable } from 'rxjs';
import { Producto, Categoria, Ingrediente, Subcategoria } from './productos.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {

  constructor(private httpClient:HttpClient) { }

  //CATEGORIAS
  getCategorias():Observable<ResponseObject<Categoria[]>>{
    return <Observable<ResponseObject<Categoria[]>>> this.httpClient.get(serverdirection + APIS.GET_CATEGORIAS)
  }

  getCategoria(idCategoria:number):Observable<ResponseObject<Categoria>>{
    var url = APIS.GET_CATEGORIA.replace(':idCategoria',idCategoria.toString());
    return <Observable<ResponseObject<Categoria>>> this.httpClient.get(serverdirection + url)
  }

  crearCategoria(categoria:Categoria):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    categoria.usr_usuario = usuario.usuario;
    categoria.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.POST_CREAR_CATEGORIA, categoria);
  }

  editarCategoria(categoria:Categoria):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    categoria.usr_usuario = usuario.usuario;
    categoria.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.POST_EDITAR_CATEGORIA, categoria);
  }

  eliminarCategoria(categoria:Categoria):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    categoria.usr_usuario = usuario.usuario;
    categoria.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.DELETE_BAJA_CATEGORIA, categoria);
  }

  activarCategoria(categoria:Categoria):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    categoria.usr_usuario = usuario.usuario;
    categoria.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.PUT_REACTIVAR_CATEGORIA, categoria);
  }

  //SUBCATEGORIAS
  getSubcategorias():Observable<ResponseObject<Subcategoria[]>>{
    return <Observable<ResponseObject<Subcategoria[]>>> this.httpClient.get(serverdirection + APIS.GET_SUBCATEGORIAS)
  }

  getSubcategoria(idSubcategoria:number):Observable<ResponseObject<Subcategoria>>{
    var url = APIS.GET_SUBCATEGORIA.replace(':idSubCategoria',idSubcategoria.toString());
    return <Observable<ResponseObject<Subcategoria>>> this.httpClient.get(serverdirection + url)
  }

  crearSubcategoria(subcategoria:Subcategoria):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    subcategoria.usr_usuario = usuario.usuario;
    subcategoria.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.POST_CREAR_SUBCATEGORIA, subcategoria);
  }

  editarSubcategoria(subcategoria:Subcategoria):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    subcategoria.usr_usuario = usuario.usuario;
    subcategoria.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.POST_EDITAR_SUBCATEGORIA, subcategoria);
  }

  eliminarSubcategoria(subcategoria:Subcategoria):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    subcategoria.usr_usuario = usuario.usuario;
    subcategoria.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.DELETE_BAJA_SUBCATEGORIA, subcategoria);
  }

  activarSubcategoria(subcategoria:Subcategoria):Observable<ResponseObject<string>>{
    var usuario_json = sessionStorage.getItem('usuario');
    var usuario;
    if(usuario_json){
      usuario = JSON.parse(usuario_json);
    }
    subcategoria.usr_usuario = usuario.usuario;
    subcategoria.usr_contrasena = usuario.contrasena;
    return <Observable<ResponseObject<string>>> this.httpClient.post(serverdirection + APIS.PUT_REACTIVAR_SUBCATEGORIA, subcategoria);
  }

  //INGREDIENTES
  getIngredienes():Observable<ResponseObject<Subcategoria[]>>{
    return <Observable<ResponseObject<Subcategoria[]>>> this.httpClient.get(serverdirection + APIS.GET_INGREDIENTES)
  }

  getIngrediente(idIngrediente:number):Observable<ResponseObject<Subcategoria>>{
    var url = APIS.GET_INGREDIENTE.replace(':idIngrediente',idIngrediente.toString());
    return <Observable<ResponseObject<Subcategoria>>> this.httpClient.get(serverdirection + url)
  }

  //PRODUCTOS
  getProductos():Observable<ResponseObject<Producto[]>>{
    return <Observable<ResponseObject<Producto[]>>> this.httpClient.get(serverdirection + APIS.GET_PRODUCTOS)
  }

  getProducto(idProducto:number):Observable<ResponseObject<Producto>>{
    var url = APIS.GET_PRODUCTO.replace(':idProducto',idProducto.toString());
    return <Observable<ResponseObject<Producto>>> this.httpClient.get(serverdirection + url)
  }

}
