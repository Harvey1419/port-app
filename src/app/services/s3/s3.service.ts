import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const url = `http://ec2-18-209-224-26.compute-1.amazonaws.com:3000`

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

  getSignedUrl(fileName: string){
    return new Promise((Resolve, Reject) => {
      return this.httpClient.get(`${url}/file/download/${fileName}`).subscribe({
        next: (data) => Resolve(data),
        error: (err) => Reject(err)
       })
    })
  }
  

}
