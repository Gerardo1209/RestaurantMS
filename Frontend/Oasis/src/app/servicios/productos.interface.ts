export interface Categoria{
  id:number,
  nombre:string,
  descripcion:string,
  habilitado:boolean,
  imagen:string,

  //valores locales
  active:boolean
}

export interface Subcategoria{
  id:number,
  id_cat:number,
  nombre:string,
  descripcion:string,
  habilitado:boolean
}

export interface Ingrediente{
  id:number,
  nombre:string,
  descripcion:string,
  costo:number,
  habilitado:boolean,
  cantidad?:string
}

export interface Producto{
  id:number,
  Nombre:string,
  Descripcion:string,
  precio:number,
  id_subcat:number,
  id_cat?:number
  imagen:string,
  habilitado:boolean,
  tiempo:string,
  ingredientes?:Ingrediente[]
  //Variables locales
  active:boolean
}
