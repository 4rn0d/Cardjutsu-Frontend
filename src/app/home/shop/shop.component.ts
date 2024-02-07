import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Card} from "../../models/models";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit{

  cards:Card[] = [];
  @Input() card?:Card;
  @Input() show:string = "front";
  @Input() health:number = 0;
  constructor(public api: ApiService) {}
    async ngOnInit(): Promise<void> {
        this.cards = await this.api.getAllCards()
    }

}
