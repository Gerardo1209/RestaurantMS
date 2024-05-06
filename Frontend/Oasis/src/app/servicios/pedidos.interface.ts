export interface Orden{
    id:number,
    id_serv:number,
    estado:string,
    hora:Date,
    flag:string,
    habilitado:boolean,
    usr_usuario?:string;
    usr_contrasena?:string;
}

export interface DetalleOrden{
    id:number,
    id_prod:number,
    id_orden:number,
    cantidad:number,
    p_unit:number,
    descripcion:number,
    usr_usuario?:string;
    usr_contrasena?:string;
}

export interface DetPedOrden{
    id:number,
    id_do:number,
    id_ingre:number,
    cantidad:number,
    usr_usuario?:string;
    usr_contrasena?:string;
}