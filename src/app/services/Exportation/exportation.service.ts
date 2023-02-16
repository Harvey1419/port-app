import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { Exportation } from 'src/app/models/exportation.model';

const url = `http://localhost:3000`

@Injectable({
  providedIn: 'root'
})
export class ExportationService {

  constructor(private httpClient: HttpClient) {
  }

  getExportationByCompany(company: string): Observable<Exportation[]> {
    return this.httpClient.get(`${url}/exportation/company/${company}`) as Observable<Exportation[]>
  }
  
  getExportationByDo(numero_do: string): Observable<Exportation[]> {
    return this.httpClient.get(`${url}/exportation/${numero_do}`) as Observable<Exportation[]>
  }
}
