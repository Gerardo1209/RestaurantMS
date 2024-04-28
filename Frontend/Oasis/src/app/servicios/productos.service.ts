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

  getCategorias():Observable<ResponseObject<Categoria[]>>{
    return <Observable<ResponseObject<Categoria[]>>> this.httpClient.get(serverdirection + APIS.GET_CATEGORIA)
  }

  getSubcategorias():Observable<ResponseObject<Subcategoria[]>>{
    return <Observable<ResponseObject<Subcategoria[]>>> this.httpClient.get(serverdirection + APIS.GET_SUBCATEGORIAS)
  }

  getProductos():Observable<ResponseObject<Producto[]>>{
    return <Observable<ResponseObject<Producto[]>>> this.httpClient.get(serverdirection + APIS.GET_PRODUCTOS)
  }

  getProducto(idProducto:number):Observable<ResponseObject<Producto>>{
    var url = APIS.GET_PRODUCTO.replace('?',idProducto.toString());
    return <Observable<ResponseObject<Producto>>> this.httpClient.get(serverdirection + url)
  }

}
