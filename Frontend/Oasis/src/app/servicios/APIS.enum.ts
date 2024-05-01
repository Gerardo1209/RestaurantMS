export const serverdirection = "http://localhost:3000"
export interface ResponseObject<T> {
  success:boolean;
  message:T|string;
}
export enum APIS{
  // CATEGORIAS
  GET_CATEGORIAS = '/productos/categorias',
  GET_CATEGORIA = '/productos/categoria/:idCategoria',

  //SUBCATEGORIAS
  GET_SUBCATEGORIAS = '/productos/subcategorias',

  //PRODUCTOS
  GET_PRODUCTOS = '/productos/productos',
  GET_PRODUCTO = '/productos/producto/:idProducto',
}
