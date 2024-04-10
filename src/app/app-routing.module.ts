import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.guard';
import { ListContainersComponent } from './components/list-containers/list-containers.component';
import { ListExportationsComponent } from './components/list-exportations/list-exportations.component';
import { LoginComponent } from './components/login/login.component';
import { MyPageComponent } from './components/my-page/my-page.component';
import { AppLayoutComponent } from './layout/app.layout.component';

const routes: Routes = [
  {
    path: '', component: AppLayoutComponent, canActivate: [AuthGuard], children: [
      { path: '', component: MyPageComponent, canActivate: [AuthGuard] },
      {
        path: 'exportation', component: ListExportationsComponent, canActivate: [AuthGuard]
      },
      { path: 'exportation/exportations/:numero_do', component: ListContainersComponent, canActivate: [AuthGuard] }

    ]
  },
  {
    path: 'login', component: LoginComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
