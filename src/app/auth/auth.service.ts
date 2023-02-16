import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from 'ngx-cookie-service';
import { UserLogin } from "../models/user.mode";

const url = `http://127.0.0.1:3000`

@Injectable({
    providedIn: 'root'
})

export class AuthService {
 
    constructor(private httpClient: HttpClient, private cookie: CookieService) { }

    login(username: UserLogin){
        return new Promise((Resolve,Reject) => {
            this.httpClient.post(`${url}/usuarios/login`, username).subscribe({
                next: (data: any) => {
                    this.cookie.set('token', data.token)
                    this.cookie.set('company',data.empresa)
                    this.cookie.set('role', data.role)
                    Resolve(data)
                },
                error: (err) => Reject(err)
            })
        })
    }

    getCompany(){
        return this.cookie.get('company')
    }


}
