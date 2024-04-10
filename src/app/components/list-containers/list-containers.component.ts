import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { Subscription } from 'rxjs';
import { Container, updateContainer } from 'src/app/models/container.model';
import { Exportation } from 'src/app/models/exportation.model';
import { FileObj } from 'src/app/models/file.model';
import { ContainerService } from 'src/app/services/Containers/container.service';
import { ExportationService } from 'src/app/services/Exportation/exportation.service';
import { S3Service } from 'src/app/services/s3/s3.service';
import { TrelloService } from 'src/app/services/trello/trello.service';
interface Country {
  name: string,
  code?: string
}
@Component({
  selector: 'app-list-containers',
  templateUrl: './list-containers.component.html',
  styleUrls: ['./list-containers.component.scss']
})

export class ListContainersComponent implements OnInit {

  private routeSub: Subscription;
  exportation: Exportation
  containers: Container[];
  selectedContainer: Container[] | null;
  container: Container
  containerDialog: boolean;
  submitted: boolean;
  countries: any[];
  volumenOption: any[]
  newContainer: boolean = false;
  numero_do: string;
  selectedCountry: Country;
  filterValue = '';
  loader: boolean;
  files: FileObj[]
  initialFiles: Array<any> = []
  countryMessage: string
  moreFiles: Array<any> = []

  constructor(private exportationService: ExportationService, private route: ActivatedRoute, private containerService: ContainerService, public messageService: MessageService, public confirmationService: ConfirmationService,
    private s3Service: S3Service, private trelloService: TrelloService) {

    this.volumenOption = [
      { label: "20", value: 20 },
      { label: "40", value: 40 }
    ]
    this.countries = [
      { name: 'Australia', code: 'AU' },
      { name: 'Brazil', code: 'BR' },
      { name: 'China', code: 'CN' },
      { name: 'Egypt', code: 'EG' },
      { name: 'France', code: 'FR' },
      { name: 'Germany', code: 'DE' },
      { name: 'India', code: 'IN' },
      { name: 'Japan', code: 'JP' },
      { name: 'Spain', code: 'ES' },
      { name: 'United States', code: 'US' }
    ];

    this.initialFiles = [
      { name: 'booking' }, { name: 'factura' }, { name: 'CP' }
    ]

    this.moreFiles = [
      { name: 'SAE' }
    ]

    modifyFiles(this.initialFiles);
    modifyFiles(this.moreFiles);

    function modifyFiles(files: Array<any>) {
      files = files.map(file => {
        return {
          ...file,
          progressBar: null,
          fileUpdated: null,
          fileName: null
        };
      });
    }
  }


  ngOnInit() {
    this.loader = true
    this.routeSub = this.route.params.subscribe(params => {
      this.numero_do = params['numero_do']
      this.exportationService.getExportationByDo(this.numero_do).subscribe(data => {
        this.exportation = data[0]
          this.initialFiles.map((obj,index) => {
            const fileNameList = [this.exportation.booking,this.exportation.factura, this.exportation.CP]
            if(obj.fileName == null){
              obj.fileName = fileNameList[index]
            }
          })          
          this.moreFiles.map((obj,index) => {
            const fileNameList = [this.exportation.SAE,this.exportation.BL, this.exportation.dex]
            if(obj.fileName == null){
              obj.fileName = fileNameList[index]
            }
          })          
        this.loader = false
      })
      this.containerService.getContainersByNumeroDo(this.numero_do).subscribe(data => {
        this.containers = data
        //console.log(this.containers)
      })
    });

  }

  deleteSelectedContainers() {
    this.confirmationService.confirm({
      message: '¿Estás seguro que deseas eliminar este contenedor?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.containers = this.containers.filter(val => !this.selectedContainer?.includes(val));
        this.selectedContainer = null;
        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Contenedores Eliminados', life: 3000 });
      }
    });
  }

  deleteSelectedContainer(container: Container) {
    this.confirmationService.confirm({
      message: '¿Estás seguro que deseas eliminar este contenedor?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.containers = this.containers.filter(val => val.numero_contenedor !== container.numero_contenedor);
        if (container.numero_do && container.numero_contenedor) this.containerService.deleteContainer(container.numero_do, container.numero_contenedor)
        this.container = {};
        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Contenedores Eliminados', life: 3000 });
      }
    });
  }

  async saveContainer() {
    this.submitted = true;
    if (this.validationModal()) {
      if (this.container.numero_contenedor && this.container.numero_do) {
        try {
          this.selectedCountry.name
          this.container.destino = this.selectedCountry.name
          this.containers[this.getContainerByNumber(this.container.numero_contenedor)] = this.container
          const body: updateContainer = this.createBodyToUpdateContainer(this.container);
          await this.containerService.editContainerBycontainerNumber(this.container.numero_do, this.container.numero_contenedor, body)
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Contenedor Actualizado', life: 3000 });
        } catch (error: any) {
          this.messageService.add({ severity: 'error', summary: 'Fallido', detail: error.message })
        }
      }
      else {
        try {
          if (this.newContainer) {
            this.container.destino = this.selectedCountry.name
            await this.containerService.createContainer(this.numero_do, this.container)
            this.container.numero_do = this.numero_do
            this.containers.push(this.container)
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Contenedor Actualizado', life: 3000 });
          }
        } catch (error: any) {
          this.messageService.add({ severity: 'error', summary: 'Fallido', detail: error.message })
        }
      }
      this.containers = [...this.containers]
      this.containerDialog = false;
      this.newContainer = false
      this.container = {};
    } else {
      this.messageService.add({ severity: 'error', summary: 'Fallido', detail: 'Faltan Campos por llenar' })

    }
  }

  getContainerByNumber(numero_contenedor: string) {
    return this.containers.findIndex(num => num.numero_contenedor == numero_contenedor);
  }

  validationModal() {
    if (this.container.numero_contenedor?.trim() && this.container.estado?.trim() && this.container.volumen && this.container.material?.trim() && this.container.tara && this.container.naviera?.trim() && this.container.sellos?.trim()) {
      return true
    } else { return false }
  }

  createContainer() {
    this.container = {}
    this.submitted = false
    this.newContainer = true
    this.containerDialog = true
    this.messageCountry()
  }

  editContainer(container: Container) {
    this.newContainer = false
    this.container = { ...container };
    this.selectedCountry = {
      name: this.container.destino as string
    }
    this.containerDialog = true;
    this.messageCountry()
  }

  messageCountry(){
    if(this.newContainer){
      this.countryMessage = "Selecciona un pais"
    }else if(!this.newContainer){
      this.countryMessage = this.selectedCountry.name
    }

  }

  hideDialog() {
    this.containerDialog = false;
    this.submitted = false;
  }

  private createBodyToUpdateContainer(container: updateContainer): updateContainer {
    return {
      estado: container.estado,
      volumen: container.volumen,
      tara: container.tara,
      naviera: container.naviera,
      sellos: container.sellos,
      destino: container.destino,
      ETA: container.ETA,
      material: container.material
    };
  }

  myResetFunction(options: DropdownFilterOptions) {
    options.reset?.();
    this.filterValue = '';
  }

  async myUploader(event: any, form: any, file: any) {
    console.log('Archivo',file);
    file.progressBar = true
    try {
      await this.s3Service.uploadFile(event.files[0], file.name, this.numero_do).subscribe({
        next: async (event: any) => {
          if (event instanceof HttpResponse) {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: event.body.Mensaje, life: 3000 })
              await this.sendSAEemail(file);
              if(file.name === "SAE") await this.trelloService.createCard(`Solicitud de solicitud de transporte a puerto orden: ${this.numero_do}`)
              file.fileUpdated = true
              file.progressBar = false
          }
        }
      }) 
      
      file.fileName = event.files[0].name
      form.clear()
    } catch (error: any) {
      this.messageService.add({ severity: 'error', summary: 'Fallido', detail: error.message })
    }
  }

  private async sendSAEemail(file: any) {
      try {
        await this.exportationService.sendEmail(this.numero_do, file.name);
      } catch (error: any) {
        this.messageService.add({ severity: 'error', summary: 'Fallido', detail: error.message });
      }
  }

  async getSignedUrl(fileName: string){
    const signedUrl: any = await this.s3Service.getSignedUrl(fileName)
    window.open(signedUrl.URL,'_blank')
    
  }
}   
