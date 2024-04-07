import { Component, Input, OnInit } from '@angular/core';
import {Card, PlayableCard} from 'src/app/models/models';
import {MatchService} from "../../services/match.service";

@Component({
  selector: 'app-playerhand',
  templateUrl: './playerhand.component.html',
  styleUrls: ['./playerhand.component.css']
})
export class PlayerhandComponent implements OnInit {

  @Input() cards: PlayableCard[] = [];

  constructor(public matchService: MatchService) { }

  clickedCard : PlayableCard | undefined ;

  ngOnInit() {
  }

  click(playableCardId:any) : void {
    // TODO: Utiliser seulement une fois que l'on peut jouer des cartes (TP2)
    this.clickedCard = this.cards.find(x => x.id == playableCardId);
  }
}
