import { Component, Input, OnInit } from '@angular/core';
import {Card, PlayableCard} from 'src/app/models/models';
import {MatchService} from "../../services/match.service";
import {HubService} from "../../services/hub.service";
import {ActivatedRoute, Router, Routes} from "@angular/router";

@Component({
  selector: 'app-playerhand',
  templateUrl: './playerhand.component.html',
  styleUrls: ['./playerhand.component.css']
})
export class PlayerhandComponent implements OnInit {

  @Input() cards: PlayableCard[] = [];

  constructor(public matchService: MatchService, public hub: HubService, private route: ActivatedRoute,) { }

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
  shouldShowWhiteBorder(cardId: number): boolean {

    return true;
  }
}
