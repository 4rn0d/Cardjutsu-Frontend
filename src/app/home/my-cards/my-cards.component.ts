import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Card} from "../../models/models";

@Component({
  selector: 'app-my-cards',
  templateUrl: './my-cards.component.html',
  styleUrls: ['./my-cards.component.css']
})
export class MyCardsComponent implements OnInit{

  cards: Card[] = [];

  constructor(public api:ApiService) {}

  async ngOnInit() {
    this.cards = await this.api.getPlayersCards();
  }

}
