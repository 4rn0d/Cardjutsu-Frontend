import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/models/models';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() card?:Card;
  @Input() show:string = "front";
  @Input() defense:number = 0;
  beautifulBackUrl = "https://static.miraheze.org/cpfanonwiki/f/f7/Formation_of_Water_Dojo.png";
  cardBorder = "/assets/card-border/Card-Jitsu_Border_"
  webp = ".webp"

  constructor() { }

  ngOnInit() {

  }

}
