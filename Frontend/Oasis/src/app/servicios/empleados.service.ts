import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIS, ResponseObject, serverdirection } from './APIS.enum'
import { Empleado, Direccion, Estado, Municipio, Puesto } from './empleados.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  constructor(private httpClient:HttpClient) {}

  loginEmpleado(usuario:string, contrasena:string):Observable<ResponseObject<Empleado>>{
    var obj = {
      usuario: usuario,
      contrasena: contrasena
    }
    return <Observable<ResponseObject<Empleado>>>this.httpClient.post(serverdirection + APIS.POST_LOGIN_EMPLEADO, obj);
  }

}
