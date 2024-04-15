import { Component, Input, OnInit } from '@angular/core';
import { Card, CardPower } from 'src/app/models/models';
import {animate, state, style, transition, trigger, useAnimation} from "@angular/animations";
import {DataService} from "../../services/data.service";
import {fadeIn} from "ng-animate";
import {lastValueFrom, timer} from "rxjs";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(2000, style({opacity: 1})),
        animate(2000, style({opacity: 0})),
      ])
    ])
  ]
})
export class CardComponent implements OnInit {

  @Input() card?:Card;
  @Input() show:string = "front";
  @Input() defense:number = 0;
  beautifulBackUrl = "https://static.miraheze.org/cpfanonwiki/f/f7/Formation_of_Water_Dojo.png";
  cardBorder = "/assets/card-border/Card-Jitsu_Border_"
  webp = ".webp"
  animationState = false;
  img?: string
  value?:number

  constructor(public data: DataService) { }

  ngOnInit() {

  }

  async fadeInAnimation(){
    for (let i = 0; i < this.card!.cardPowers.length; i++) {
      console.log(this.card!.cardPowers[i])
      this.animationState = true;
      this.img = this.card!.cardPowers[i].power.icone
      if (this.card!.cardPowers[i].power.hasValue){
        this.value = this.card!.cardPowers[i].value
      }
      else {
        this.value = undefined

      }
      await this.waitFor(2)
      this.animationState = false;
    }
  }

  async waitFor(delayInSeconds:number) {
    await lastValueFrom(timer(delayInSeconds * 1000));
  }

}
