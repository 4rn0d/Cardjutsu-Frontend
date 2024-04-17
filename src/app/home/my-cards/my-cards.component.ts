import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Card} from "../../models/models";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-my-cards',
  templateUrl: './my-cards.component.html',
  styleUrls: ['./my-cards.component.css']
})
export class MyCardsComponent implements OnInit, OnDestroy{

  cards: Card[] = [];

  constructor(public api:ApiService, public data: DataService) {}

  async ngOnInit() {
    this.data.isInMyCards = true
    this.cards = await this.api.getPlayersCards();
    console.log(this.cards)
  }

  ngOnDestroy(): void {
    this.data.isInMyCards = false
  }

}
