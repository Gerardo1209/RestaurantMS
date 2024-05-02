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
    nombre: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    descripcion: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    id_categoria: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
    id: new FormControl<number>(0, [Validators.required]),
    habilitado: new FormControl<boolean>(false)
  });

  loadingCategorias: boolean = true;
  loadingSubcategorias: boolean = false;

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

  subcatChange(){
    this.loadingSubcategorias = true;
    if(this.formulario.controls['id'].value == 0){
      this.formulario.controls['id_categoria'].setValue(0);
      this.formulario.controls['nombre'].setValue('');
      this.formulario.controls['descripcion'].setValue('');
      this.formulario.controls['habilitado'].setValue(false);
      this.loadingSubcategorias = false;
    }else{
      this.productosService.getSubcategoria(this.formulario.controls['id'].value).forEach((res) => {
        if(res.success && typeof res.message == 'object'){
          this.formulario.controls['id_categoria'].setValue(res.message.id_cat);
          this.formulario.controls['nombre'].setValue(res.message.nombre);
          this.formulario.controls['descripcion'].setValue(res.message.descripcion);
          this.formulario.controls['habilitado'].setValue(res.message.habilitado);
        }else{
          if(typeof res.message == 'string') this.alertasService.error(res.message)
        }
        this.loadingSubcategorias = false;
      });
    }

  }

  findCategoria(subcat:Subcategoria){
    return this.categorias.find((a) => {return a.id == subcat.id_cat})?.nombre;
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
      this.formSubcategoria.id = this.formulario.controls['id'].value;
      this.formSubcategoria.nombre = this.formulario.controls['nombre'].value;
      this.formSubcategoria.descripcion = this.formulario.controls['descripcion'].value;
      this.formSubcategoria.id_cat = this.formulario.controls['id_categoria'].value;
    }

    if(this.formSubcategoria.id != 0){
      this.productosService.editarSubcategoria(this.formSubcategoria).forEach(
        (res) => {
          if(res.success && typeof res.message == 'string'){
            this.alertasService.success(res.message);
            this.getSubcategorias();
          }else{
            if(typeof res.message == 'string') this.alertasService.error(res.message)
          }
        }
      );
    }else{
      this.productosService.crearSubcategoria(this.formSubcategoria).forEach(
        (res) => {
          if(res.success && typeof res.message == 'string'){
            this.alertasService.success(res.message);
            this.getSubcategorias();
          }else{
            if(typeof res.message == 'string') this.alertasService.error(res.message)
          }
        }
      );
    }
  }

  habdeshab(){
    this.formSubcategoria = {
      id: 0,
      id_cat: 0,
      nombre: '',
      descripcion: '',
      habilitado: true,
    };

    if (this.formSubcategoria) {
      this.formSubcategoria.id = this.formulario.controls['id'].value;
      this.formSubcategoria.nombre = this.formulario.controls['nombre'].value;
      this.formSubcategoria.descripcion = this.formulario.controls['descripcion'].value;
      this.formSubcategoria.id_cat = this.formulario.controls['id_categoria'].value;
    }

    if(this.formSubcategoria.id != 0 && this.formulario.controls['habilitado'].value){
      this.formSubcategoria.habilitado = false;
      this.productosService.eliminarSubcategoria(this.formSubcategoria).forEach(
        (res) => {
          if(res.success && typeof res.message == 'string'){
            this.alertasService.success(res.message);
            this.getSubcategorias();
            this.subcatChange();
          }else{
            if(typeof res.message == 'string') this.alertasService.error(res.message)
          }
        }
      );
    }else if(this.formSubcategoria.id != 0){
      this.formSubcategoria.habilitado = true;
      this.productosService.activarSubcategoria(this.formSubcategoria).forEach(
        (res) => {
          if(res.success && typeof res.message == 'string'){
            this.alertasService.success(res.message);
            this.getSubcategorias();
            this.subcatChange();
          }else{
            if(typeof res.message == 'string') this.alertasService.error(res.message)
          }
        }
      );
    }
  }

}
