import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { User, UserLogin } from 'src/app/models/user.mode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  valCheck: string[] = ['remember'];

  password!: string;

  UserLogin: User
  loader: boolean;
  constructor(public layoutService: LayoutService, public messageService: MessageService, private router: Router, private authService: AuthService) { }

  async login(username: string, password: string) {
    const userLogin: UserLogin = {
      usuario: username,
      password: password
    }
    try {
      this.loader = true
      const res = await this.authService.login(userLogin)
      if (res) {
        console.log(res);
        this.router.navigate(['/'])
        this.messageService.add({ severity: 'Succes', summary: 'Inicio Exitoso', detail: 'BIENVENIDO' })

      }
    } catch (error: any) {
      this.messageService.add({ severity: 'error', summary: 'Fallido', detail: 'USUARIO INCORRECTO'})
      this.loader = false
    }
  }

}