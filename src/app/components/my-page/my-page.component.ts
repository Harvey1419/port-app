import { Component } from '@angular/core';
import {MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { TrelloService } from 'src/app/services/trello/trello.service';

@Component({
  selector: 'app-root',
  templateUrl: './my-page.component.html',
  providers: [MessageService]
})
export class MyPageComponent { 
    cardsLength: number

    constructor(private messageService: MessageService, private primengConfig: PrimeNGConfig, private trelloAPI : TrelloService) {}

    async ngOnInit() {
      this.primengConfig.ripple = true;
      const res: any = await this.trelloAPI.getCards()
      this.cardsLength = res.length
    }

    redirectToTrello() {
      window.open("https://trello.com/b/3RCiscX2/aca",'_blank')
    }
}
