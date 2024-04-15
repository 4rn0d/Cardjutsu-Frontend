import { Injectable } from '@angular/core';
import {lastValueFrom, timer} from "rxjs";
import {Card, CardPower} from "../models/models";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  img?:string
  value = 0
  animationState?: boolean
  currentPowerIndex = 0;
  cardPowers: CardPower[] = []

  constructor() { }

  log(object: any){
    console.log(object)
  }

  async fadeInAnimation(card: Card){
    console.log(card)
    for (let i = 0; i < card.cardPowers.length; i++) {
      this.animationState = true;
      this.img = card.cardPowers[i].power.icone
      this.value = card.cardPowers[i].value
      console.log(card.cardPowers[i])
      await this.waitFor(2)
      this.animationState = false;
    }
  }

  async waitFor(delayInSeconds:number) {
    await lastValueFrom(timer(delayInSeconds * 1000));
  }
}
