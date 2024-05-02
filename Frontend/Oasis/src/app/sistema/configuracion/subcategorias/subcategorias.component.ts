import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { ProductosService } from '../../../servicios/productos.service';
import { Categoria, Subcategoria } from '../../../servicios/productos.interface';
import { AlertasService } from '../../../servicios/alertas.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-subcategorias',
  standalone: true,
  imports: [
    SidenavComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule, //Ahora en el HTML hay que configurar el Formulario
  ],
  templateUrl: './subcategorias.component.html',
  styleUrl: './subcategorias.component.scss',
})
export class SubcategoriasComponent implements OnInit {
  formulario: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    id_categoria: new FormControl<number>(0, [Validators.required]),
  });

  loadingCategorias: boolean = true;

  categorias: Categoria[] = [];
  subcategorias: Subcategoria[] = [];
  formSubcategoria: Subcategoria | undefined;

  constructor(
    private productosService: ProductosService,
    private alertasService: AlertasService
  ) {}

  async ngOnInit() {
    await this.getCategorias();
    await this.getSubcategorias();
  }

  async getCategorias() {
    this.loadingCategorias = true;
    await this.productosService.getCategorias().forEach((res) => {
      if (res.success && typeof res.message == 'object') {
        this.categorias = res.message;
      } else {
        if (typeof res.message == 'string')
          this.alertasService.error(res.message);
      }
    });
  }

  async getSubcategorias() {
    this.loadingCategorias = true;
    await this.productosService.getSubcategorias().forEach((res) => {
      if (res.success && typeof res.message == 'object') {
        this.subcategorias = res.message;
      } else {
        if (typeof res.message == 'string')
          this.alertasService.error(res.message);
      }
    });
  }

  async nuevaSubcategoria() {
    //habilitar solo era para cuando modifico no?
    // o en este caso le pongo habilitar = true?

    // faltaria algo mas por agregar?
    //Nada más que cuando se seleccione la subcategoria se cargue, pero si ya se envía si quieres lo revisamos mañana
    // si
    // pq ahorita ando a 1/2 nucleo igual con esto podemo
    // vaa, jajaaj mañana nos vemos, descansa,
    //Con esto se me hace que es suficiente para mostrar aca un avance


    this.formSubcategoria = {
      id: 0,
      id_cat: 0,
      nombre: '',
      descripcion: '',
      habilitado: true,
    };

    if (this.formSubcategoria) {
      this.formSubcategoria.nombre = this.formulario.controls['nombre'].value;
      this.formSubcategoria.descripcion =
        this.formulario.controls['descripcion'].value;
      this.formSubcategoria.id_cat =
        this.formulario.controls['id_categoria'].value;
    }

    this.productosService.crearSubcategoria(this.formSubcategoria).subscribe(
      (response) => {
        this.alertasService.success('Subcategoría creada exitosamente');
      },
      (error) => {
        this.alertasService.error('Error al crear la subcategoría');
      }
    );
  }

}
