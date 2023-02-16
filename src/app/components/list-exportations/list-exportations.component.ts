import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { Exportation } from 'src/app/models/exportation.model';
import { ExportationService } from 'src/app/services/Exportation/exportation.service';

@Component({
  selector: 'app-list-exportations',
  templateUrl: './list-exportations.component.html',
  styleUrls: ['list-exportations.component.scss']
})
export class ListExportationsComponent implements OnInit {


  constructor(private exportationService: ExportationService, private authService: AuthService) { }

  exportations: Exportation[] = [];

  sortOptions: SelectItem[] = [] 

  sortOrder: number = 0

  sortField: string = ''

  loader: boolean;

  ngOnInit(){
    this.loader = true
    this.exportationService.getExportationByCompany(this.authService.getCompany()).subscribe(data => {
    this.exportations = data
    this.loader = false
    }) 
  }
  redirect(numero_do:string){
    console.log(numero_do);
    
  }

  sendExportations(exportations: Exportation[]) {
    this.getExportations.emit(exportations);
  }

  @Output() getExportations = new EventEmitter<Exportation[]>();
}
