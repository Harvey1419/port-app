import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { url_pro } from 'src/config/enviroment';

const url = `https://api.trello.com/1/`;

@Injectable({
  providedIn: 'root'
})
export class TrelloService {

  constructor(private httpClient: HttpClient, private cookie: CookieService) { }

  getTodoListBasedOnCompany(): string {
    const company: string = this.cookie.get('company')
    const companys: any = {
      ACA: '63ffefb8e815204c9c8f3351'
    }
    return companys[company as keyof Object]
  }

  createCard(Mensaje: string) {
    return new Promise((Resolve, Reject) => {
      const listID = this.getTodoListBasedOnCompany();
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'application/json')
      const body = { listID: listID, mensaje: Mensaje }
      return this.httpClient.post(`${url_pro}/trello`,body,{headers}).subscribe({
        next: (data) => Resolve(data),
        error: (err) => Reject(err)
      })
    })
  }

  getCards() {
    return new Promise((Resolve, Reject) => {
      const listID = this.getTodoListBasedOnCompany();
      return this.httpClient.get(`${url_pro}/trello/${listID}`).subscribe({
        next: (data) => Resolve(data),
        error: (err) => Reject(err)
      })
    })
  }

}
