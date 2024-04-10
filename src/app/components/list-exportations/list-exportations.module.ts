import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListExportationsComponent } from './list-exportations.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel'
import { RouterModule } from '@angular/router';
import { ListContainersModule } from '../list-containers/list-containers.module';
import { ListContainersComponent } from '../list-containers/list-containers.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    DataViewModule,
    PanelModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    HttpClientModule,
    RatingModule,
    RouterModule,
    FormsModule,
    ProgressSpinnerModule,
    ToolbarModule,
    CardModule,
    ToastModule,
    FileUploadModule
  ],
  providers: [MessageService,ConfirmationService],
  declarations: [ListExportationsComponent]
})
export class ListExportationsModule { }
