export const serverdirection = "http://localhost:3000"
export interface ResponseObject<T> {
  success:boolean;
  message:T|string;
}
export enum APIS{
  // CATEGORIAS
  GET_CATEGORIAS = '/productos/categorias',
  GET_CATEGORIA = '/productos/categoria/:idCategoria',
  POST_CREAR_CATEGORIA = '/productos/categoria/nueva',
  POST_EDITAR_CATEGORIA = '/productos/categoria/cambio',
  DELETE_BAJA_CATEGORIA = '/productos/categoria/baja',
  PUT_REACTIVAR_CATEGORIA = '/productos/categoria/recuperar',

  //SUBCATEGORIAS
  GET_SUBCATEGORIAS = '/productos/subcategorias',
  GET_SUBCATEGORIA = '/productos/subcategoria/:idSubCategoria',
  POST_CREAR_SUBCATEGORIA = '/productos/subcategoria/nueva',
  POST_EDITAR_SUBCATEGORIA = '/productos/subcategoria/cambio',
  DELETE_BAJA_SUBCATEGORIA = '/productos/subcategoria/baja',
  PUT_REACTIVAR_SUBCATEGORIA = '/productos/subcategoria/recuperar',

  //INGREDIENTES
  GET_INGREDIENTES = '/productos/ingredientes',
  GET_INGREDIENTE = '/productos/ingrediente/:idIngrediente',
  POST_CREAR_INGREDIENTE = '/productos/ingrediente/nuevo',
  POST_EDITAR_INGREDIENTE = '/productos/ingrediente/cambio',
  DELETE_BAJA_INGREDIENTE = '/productos/ingrediente/baja',
  PUT_REACTIVAR_INGREDIENTE = '/productos/ingrediente/recuperar',

  //PRODUCTOS
  GET_PRODUCTOS = '/productos/productos',
  GET_PRODUCTO = '/productos/producto/:idProducto',
  POST_CREAR_PRODUCTO = '/productos/producto/nuevo',
  POST_EDITAR_PRODUCTO = '/productos/producto/cambio',

  //EMPLEADOS
  POST_LOGIN_EMPLEADO = '/empleados/empleado/login',

  //Orden
  GET_ORDENES = '/pedidos/ordenes',
  GET_ORDEN = '/pedidos/orden/:idOrden',
  POST_CREAR_ORDEN = '/pedidos/orden/nuevo',
  POST_EDITAR_ORDEN = '/pedidos/orden/cambio',

  //Detalle orden
  GET_DETALLE_ORDENES = '/pedidos/detalle_ordenes',
  GET_DETALLE_ORDEN = '/pedidos/detalle_orden/:idDetalleOrden',
  POST_CREAR_DETALLE_ORDEN = '/pedidos/detalle_orden/nuevo',
  POST_EDITAR_DETALLE_ORDEN = '/pedidos/detalle_orden/cambio',

  //Detalle pedido orden
  GET_DET_PED_ORDENES = '/pedidos/det_ped_ordenes',
  GET_DET_PED_ORDEN = '/pedidos/det_ped_orden/:idDetPedOrden',
  POST_CREAR_DET_PED_ORDEN = '/pedidos/det_ped_orden/nuevo',
  POST_EDITAR_DET_PED_ORDEN = '/pedidos/det_ped_orden/cambio',
  

}
