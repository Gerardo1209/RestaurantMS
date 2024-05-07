import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../servicios/productos.service';
import { Categoria, Producto, Subcategoria } from '../../servicios/productos.interface';
import { AlertasService } from '../../servicios/alertas.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  @Input() pedidos: boolean = false;
  @Output() productoAgregar: EventEmitter<Producto> = new EventEmitter<Producto>()

  loading: boolean = true;
  loadingCategorias: boolean = true;
  categorias: Categoria[] = [];
  showCategorias: Categoria[] = [];
  activeCategoria: Categoria | undefined;
  activeSubcategorias: Subcategoria[] = [];
  productosMap: { [key: number]: Producto[] } = {};
  productosMostrar: Producto[] = [];
  detailProducto: Producto | undefined;

  constructor(
    private productosService: ProductosService,
    private alertasService: AlertasService
  ) { }

  async ngOnInit() {
    await this.getCategorias();
  }

  async getCategorias() {
    this.loadingCategorias = true;
    await this.productosService.getCategorias().forEach((res) => {
      if (res.success && typeof res.message == 'object') {
        this.categorias = res.message;
        this.changeActive(this.categorias[0]) //Activar la primera categoria
      } else {
        if (typeof res.message == 'string') this.alertasService.error(res.message)
      }
    })
  }

  prodTemp = [
    { nombre: "Alas", active: false, precio: 50 },
    { nombre: "Haburguesa", active: true, precio: 50 },
    { nombre: "Pizza", active: false, precio: 50 },
    { nombre: "Burrito", active: false, precio: 50 },
    { nombre: "Sandwich", active: false, precio: 50 }
  ]

  async changeActive(item: Categoria) {
    this.loading = true;
    var active = this.categorias.find((a) => { return a.active == true });
    if (active) active.active = false
    var find = this.categorias.find((a) => { return a.nombre == item.nombre });
    if (find) {
      find.active = true;
      //Recupera toda la información de la categoria
      await this.productosService.getCategoria(item.id).forEach((res) => {
        if (res.success && typeof res.message == 'object') {
          this.activeCategoria = res.message;
        } else {
          if (typeof res.message == 'string') this.alertasService.error(res.message)
        }
      })
      this.loading = false;
      this.loadingCategorias = false;
      this.activeSubcategorias = this.activeCategoria?.subcategorias || [];
    } else {
      this.loadingCategorias = false;
      this.loading = false;
    }

  }

  getActiveItem(): string {
    var active = this.categorias.find((a) => { return a.active == true });
    if (active) {
      return active.nombre;
    } else {
      return ""
    }
  }

  showProducto(producto: Producto, subcat: Subcategoria) {
    var active = subcat.productos?.find((a) => { return a.active == true });
    if (active) active.active = false;
    producto.active = true;
    this.productosService.getProducto(producto.id).subscribe(res => {
      if (res.success && res.message) {
        const detalles: Producto = res.message as Producto;
        detalles.ingredientes = detalles.ingredientes || [];
        detalles.ingredientes = detalles.ingredientes.map(ing => ({
          ...ing,
          seleccionado: ing.habilitado
        }));

        this.detailProducto = detalles;
      } else {
        this.alertasService.error('Error: Datos del producto incompletos o incorrectos.');
      }
    }, error => {
      this.alertasService.error('Error al obtener detalles del producto: ' + error.message);
    });


  }

  scrollToCat(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
