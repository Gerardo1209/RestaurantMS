export interface Empleado{
  id:number,
  nombre:string,
  AP:string,
  AM:string,
  sueldo:number,
  telefono:string,
  email:string,
  jefe:string,
  usuario:string,
  contrasena:string,
  activo:string,
  FCU:Date,
  FAU:Date,
  cdg_dir:number,
  id_puesto:number,
  direccion?:Direccion,
  puesto?:Puesto
}

export interface Puesto{
  id:number,
  nombre:string,
  descripcion: string
}

export interface Direccion{
  id:number,
  calle:string,
  no_ext:string,
  no_int:string,
  localidad:string,
  id_mun:number,
  descripcion:string,
  municipio?:Municipio
}

export interface Municipio{
  id:number,
  nombre:string,
  id_edo:number,
  estado?:Estado
}

export interface Estado{
  id:number,
  nombre:string
}
