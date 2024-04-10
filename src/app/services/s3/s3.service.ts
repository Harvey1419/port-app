import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { url_pro } from 'src/config/enviroment';

const url = `${url_pro}`

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  constructor(private httpClient: HttpClient) { }


  uploadFile(file: File, method: string, numero_do:string): Observable<any> {
      const formData = new FormData()
      formData.append('file',file)
      const req = new HttpRequest('POST', `${url}/file/upload/${method}/${numero_do}`, formData, {
        reportProgress: true,
        responseType: 'json'
      });
      return this.httpClient.request(req);
  }

  uploadFilePromise(file: File, method: string, numero_do:string){
    return new Promise((Resolve, Reject) => {
      const formData = new FormData()
      formData.append('file',file)
      return this.httpClient.post(`${url}/file/upload/${method}/${numero_do}`,formData).subscribe({
        next: (data) => Resolve(data),
        error: (err) => Reject(err)
       })
    })
  }

  getSignedUrl(fileName: string){
    return new Promise((Resolve, Reject) => {
      return this.httpClient.get(`${url}/file/download/${fileName}`).subscribe({
        next: (data) => Resolve(data),
        error: (err) => Reject(err)
       })
    })
  }
  

}
