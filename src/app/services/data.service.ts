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

}
