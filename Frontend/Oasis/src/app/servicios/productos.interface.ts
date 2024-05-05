export interface Categoria {
  id: number,
  nombre: string,
  descripcion: string,
  habilitado: boolean,
  imagen: string,
  subcategorias?: Subcategoria[];
  usr_usuario?: string;
  usr_contrasena?: string;
  //valores locales
  active: boolean
}

export interface Subcategoria {
  id: number,
  id_cat: number,
  nombre: string,
  descripcion: string,
  habilitado: boolean
  productos?: Producto[];
  usr_usuario?: string;
  usr_contrasena?: string;
}

export interface Ingrediente {
  id: number,
  nombre: string,
  descripcion: string,
  costo: number,
  habilitado: boolean,
  cantidad?: string
  usr_usuario?: string;
  usr_contrasena?: string;
}

export interface Producto {
  id: number,
  Nombre: string,
  Descripcion: string,
  precio: number,
  id_subcat: number,
  id_cat?: number
  imagen: string,
  habilitado: boolean,
  tiempo: string,
  ingredientes?: Ingrediente[]
  usr_usuario?: string;
  usr_contrasena?: string;
  //Variables locales
  active: boolean
  cantidad: number
}
