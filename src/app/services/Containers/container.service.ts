import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { updateContainer } from 'src/app/models/container.model';
import { url_pro } from 'src/config/enviroment';

const url = `${url_pro}`

@Injectable({
  providedIn: 'root'
})
export class ContainerService {

  constructor(private httpClient: HttpClient) { }

  getContainersByNumeroDo(numero_do: string): Observable<any> {
    return this.httpClient.get(`${url}/container/${numero_do}`)
  }

  createContainer(numero_do: string, body: updateContainer) {
    return new Promise((Resolve, Reject) => {
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'application/json')
      this.httpClient.post(`${url}/container/createContainer/${numero_do}`, body, { headers }).subscribe({
        next: (result) => Resolve(result),
        error: (err) => Reject(err)
      })
    })
  }


  editContainerBycontainerNumber(numero_do: string, numero_contenedor: string, body: updateContainer) {
    return new Promise((Resolve, Reject) => {
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'application/json')
      this.httpClient.put(`${url}/container/${numero_do}/${numero_contenedor}`, body, { headers }).subscribe({
        next: (result) => Resolve(result),
        error: (err) => Reject(err)
      })
    })
  }

  deleteContainer(numero_do: string, numero_contenedor: string) {
    return new Promise((Resolve, Reject) => {
      this.httpClient.delete(`${url}/container/${numero_do}/${numero_contenedor}`).subscribe({
        next: (result) => Resolve(result),
        error: (err) => Reject(err)
      })
    })
  }

}
