import { Injectable } from '@angular/core';
import {lastValueFrom, timer} from "rxjs";
import {Card} from "../models/models";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  img?:string
  value?:number
  animationState?: boolean

  constructor() { }

  log(object: any){
    console.log(object)
  }

  async fadeInAnimation(card: Card){
    this.animationState = true;
    card.cardPowers.forEach((value, index) => {
      this.img = value.power.icone
      this.value = value.value
      console.log(value)
      console.log(this.animationState)
    })
  }
  async waitFor(delayInSeconds:number) {
    await lastValueFrom(timer(delayInSeconds * 1000));
  }
}
