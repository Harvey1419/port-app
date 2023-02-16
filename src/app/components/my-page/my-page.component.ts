import { Component } from '@angular/core';
import {MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './my-page.component.html',
  providers: [MessageService]
})
export class MyPageComponent { 
    constructor(private messageService: MessageService, private primengConfig: PrimeNGConfig) {}

    ngOnInit() {
      this.primengConfig.ripple = true;
    }
}
