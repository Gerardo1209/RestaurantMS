export interface Cliente {
  id: number
  Nombre: string;
  AP: string;
  AM: string;
  Telefono: string;
  Email: string;
  CURP: string;
  usr_usuario?: string;
  usr_contrasena?: string;
}

export interface Reservacion {
  id: number;
  id_cliente: number;
  id_mesa: number;
  fecha: string;
  password: string;
  habilitado: boolean
  cliente?:Cliente;
  usr_usuario?: string;
  usr_contrasena?: string;
}

export interface Mesa {
  id: number;
  capacidad: number;
  Estado: string;
  tipo: string;
  posx1: number;
  posx2: number;
  posy1: number;
  posy2: number;
  descripcion: string;
  habilitado: boolean;
  usr_usuario?: string;
  usr_contrasena?: string;
}

export interface Orden {
  id: number;
  id_serv: number;
  Estado: string;
  Hora: string;
  Flag: string;
  habilitado: boolean;
  detalle_orden?: Detalle_Orden[];
  usr_usuario?: string;
  usr_contrasena?: string;
}

export interface Detalle_Orden {
  id_prod: number;
  id_orden: number;
  cantidad: number;
  descripcion: string;
  p_unit: number;
  id: number;
  det_ped_ord?: Det_Ped_Ord[];
  usr_usuario?: string;
  usr_contrasena?: string;
}

export interface Det_Ped_Ord {
  id: number;
  id_do: number
  id_ingre: number;
  cantidad: number;
  usr_usuario?: string;
  usr_contrasena?: string;
}

export interface Servicio{
  id:number;
  id_res:number;
  id_emp:number;
  HE:string;
  HS:string;
  Estado:string;
  usr_usuario?: string;
  usr_contrasena?: string;
}
