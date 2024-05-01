import { Component, Input, OnInit } from '@angular/core';
import {Card, PlayableCard} from 'src/app/models/models';
import {MatchService} from "../../services/match.service";
import {HubService} from "../../services/hub.service";
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-playerhand',
  templateUrl: './playerhand.component.html',
  styleUrls: ['./playerhand.component.css']
})
export class PlayerhandComponent implements OnInit {

  @Input() cards: PlayableCard[] = [];

  constructor(public matchService: MatchService, public hub: HubService, private route: ActivatedRoute,public api:ApiService,) { }

  clickedCard : PlayableCard | undefined ;
  isSpectateur:boolean = false;

  async ngOnInit() {
    const urlSegment = this.route.snapshot.url.find(segment => segment.path.includes('spectateur'));
    if (urlSegment) {
      this.isSpectateur= true;
      console.log('Spectateur');
    } else {
      this.isSpectateur= false;
      console.log('Not spectateur');
    }

  }

  click(playableCardId:any) : void {
    // TODO: Utiliser seulement une fois que l'on peut jouer des cartes (TP2)
    this.hub.hubConnect?.invoke("PlayCard", this.matchService.matchId, playableCardId);
  }
  async shouldShowWhiteBorder(cardId: number): Promise<boolean> {
    console.log("whiteBorder")
    console.log(cardId)
    const cardss:any = this.cards.find(c => c.id == cardId); // Trouver la carte correspondante à cardId
    console.log(cardss)
    if (cardss.card.cost < 3) {
      return true;
    }else{
      return false;
    }
  }
}
