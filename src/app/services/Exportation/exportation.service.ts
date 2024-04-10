import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { Exportation, initialExportation } from 'src/app/models/exportation.model';
import { url_pro } from 'src/config/enviroment';

const url = `${url_pro}`

@Injectable({
  providedIn: 'root'
})
export class ExportationService {

  constructor(private httpClient: HttpClient) {
  }

  createExportation(body: initialExportation) {
    return new Promise((Resolve, Reject) => {
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'application/json')
      this.httpClient.post(`${url}/exportation`, body, { headers }).subscribe({
        next: (result) => Resolve(result),
        error: (err) => Reject(err)
      })
    })
  }

  getExportationByCompany(company: string): Observable<Exportation[]> {
    return this.httpClient.get(`${url}/exportation/company/${company}`) as Observable<Exportation[]>
  }
  
  getExportationByDo(numero_do: string): Observable<Exportation[]> {
    return this.httpClient.get(`${url}/exportation/${numero_do}`) as Observable<Exportation[]>
  }

  sendEmail(numero_do: string, method: string) {
    return new Promise((Resolve, Reject) => {
      this.httpClient.get(`${url}/exportation/sendMessage/${numero_do}/${method}`).subscribe({
        next: (data) => Resolve(data),
        error: (err) => Reject(err)
      })
    })
  }
}
