import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { MyPageModule } from './components/my-page/my-page.module';
import { ListExportationsModule } from './components/list-exportations/list-exportations.module';
import { ListContainersModule } from './components/list-containers/list-containers.module';
import { LoginModule } from './components/login/login.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token-interceptor.interceptor';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppLayoutModule,
    ListContainersModule,
    LoginModule,
    ListExportationsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
