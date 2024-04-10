import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { Exportation } from 'src/app/models/exportation.model';
import { FileObj } from 'src/app/models/file.model';
import { ExportationService } from 'src/app/services/Exportation/exportation.service';
import { S3Service } from 'src/app/services/s3/s3.service';
import { TrelloService } from 'src/app/services/trello/trello.service';

@Component({
  selector: 'app-list-exportations',
  templateUrl: './list-exportations.component.html',
  styleUrls: ['list-exportations.component.scss']
})
export class ListExportationsComponent implements OnInit {
  initialFiles: Array<any> = []
  files: FileObj[]
  exportations: Exportation[] = [];
  exportation: Exportation;
  sortOptions: SelectItem[] = []
  sortOrder: number = 0
  sortField: string = ''
  loader: boolean;
  exportationsDialog: boolean;
  newExportation: boolean;
  submitted: boolean;
  showFilename: boolean;

  constructor(private exportationService: ExportationService, private authService: AuthService, private messageService: MessageService, private s3Service: S3Service, private trelloService: TrelloService) {
    this.files = [
      { name: 'booking' }, { name: 'factura' }, { name: 'CP' }
    ]

    this.initialFiles = this.files.map(file => {
      return {
        ...file,
        file: null,
        fileName: null
      }
    })
  }


  ngOnInit() {
    this.loader = true
    this.exportationService.getExportationByCompany(this.authService.getCompany()).subscribe(data => {
      this.exportations = data
      this.loader = false
    })
  }

  createExportation() {
    this.exportation = {}
    this.submitted = false
    this.newExportation = true
    this.exportationsDialog = true
  }

  async myUploader(event: any, form: any, file: any) {
    try {
      this.showFilename = true
      file.file = event.files[0]
      file.fileName = event.files[0].name
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Añadido con exito', life: 1000 })
      form.clear()
    } catch (error: any) {
      this.messageService.add({ severity: 'error', summary: 'Fallido', detail: error.message })
    }
  }

  async saveExportation() {
    this.loader = true
    this.submitted = true;
    this.exportation.booking = this.getFilename('booking')
    this.exportation.CP = this.getFilename('CP')
    this.exportation.factura = this.getFilename('factura')
    if (this.exportation.numero_do?.trim() && this.exportation.booking?.trim() && this.exportation.CP?.trim() && this.exportation.factura?.trim()) {
      try {
        this.exportation.empresa = this.authService.getCompany()
        this.exportation.estado = 'iniciado'
        await this.exportationService.createExportation(this.exportation)
        await this.uploadAllInitialFiles()
        const mensaje = `Generar Documento SAE para la exportación do: ${this.exportation.numero_do}`
        this.exportationService.sendEmail(this.exportation.numero_do, 'initial')
        this.exportations.push(this.exportation) 
        setTimeout(async () => {
          await this.trelloService.createCard(mensaje)
          this.loader = false
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Exportación Creada', life: 3000 });
          
        }, 3000)
        
      } catch (error: any) {
        this.messageService.add({ severity: 'error', summary: 'Fallido', detail: error.message })
      }
      this.exportations = [...this.exportations]
      this.exportationsDialog = false

    }

  }

  uploadAllInitialFiles(){
    this.initialFiles.forEach(async (file,i) => {
      setTimeout(async () => {
        if (this.exportation.numero_do != undefined) {
          await this.s3Service.uploadFilePromise(file.file, file.name, this.exportation.numero_do)
        }
      },i * 1000)
    })
  }

  getFilename(nameFile: string) {
    const findFilename = this.initialFiles.find(file => file.name === nameFile).file?.name
    if (findFilename === undefined || findFilename === null) {
      console.log(findFilename);
      
      this.messageService.add({ severity: 'error', summary: 'Fallido', detail: 'Faltan archivos por agregar', life: 1500 })
    }
    return findFilename
  }

  hideDialog() {
    this.initialFiles = this.files
    this.showFilename = false
    this.exportationsDialog = false;
    this.submitted = false;
  }
}
