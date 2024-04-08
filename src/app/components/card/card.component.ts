import { Component, Input, OnInit } from '@angular/core';
import { Card, CardPower } from 'src/app/models/models';
import {animate, style, transition, trigger, useAnimation} from "@angular/animations";
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

  constructor(public data: DataService) { }

  ngOnInit() {

  }

}
