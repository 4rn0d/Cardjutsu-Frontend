import { Component, OnInit } from '@angular/core';
import { MatchData, PlayerData } from '../models/models';
import { MatchService } from './../services/match.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import * as signalR from "@microsoft/signalr"
import {environment} from "../../environments/environment.development";
import {HubService} from "../services/hub.service";

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {


  constructor(private route: ActivatedRoute, public router: Router, public matchService:MatchService, public apiService:ApiService, public hubService: HubService) { }

  async ngOnInit() {
    //let matchId:number  = parseInt(this.route.snapshot.params["id"]);
    // TODO Tâche Hub: Se connecter au Hub et obtenir le matchData

    this.matchService.playMatch(this.hubService.matchData!, this.hubService.currentPlayerId!)
  }

  async initTest() {
    // Pendant les tests, on est le joueur B
    let cards = await this.apiService.getPlayersCards();
    let matchData = this.matchService.playTestMatch(cards);
    let nbCardsToDraw = 3;
    let drawCardEvents = this.createDrawCardEventsForTest(matchData.match.playerDataA, nbCardsToDraw);
    drawCardEvents = drawCardEvents.concat(this.createDrawCardEventsForTest(matchData.match.playerDataB, nbCardsToDraw + 1));
    drawCardEvents.push(
      {
        $type: "GainMana",
        Mana: 3,
        PlayerId: this.matchService.playerData?.playerId
      }
    );

    let fakeStartMatchEvent = {
      $type: "StartMatch",
      Events: drawCardEvents
    }
    console.log(fakeStartMatchEvent)
  }

  createDrawCardEventsForTest(playerData:PlayerData, nbCards:number) : any[]{
    let drawCardEvents:any[] = [];
    for(let i = 0; i < nbCards; i++){
      drawCardEvents.push(
        {
          $type: "DrawCard",
          PlayerId: playerData.playerId,
          PlayableCardId: playerData.cardsPile[i].id
        }
      )
    }
    return drawCardEvents;
  }

  endMatch() {
    this.matchService.clearMatch();
    this.router.navigate(['/'])
  }

  async endTurn() {
    // TODO Tâche Hub: Faire l'action sur le Hub
    await this.hubService.hubConnect!.invoke('EndTurn', this.matchService.userId, this.matchService.matchData?.match.id)
  }

  async surrender() {
    // TODO Tâche Hub: Faire l'action sur le Hub
    console.log("surrender")
    await this.hubService.hubConnect!.invoke('Surrender', this.matchService.userId, this.matchService.matchData?.match?.id)
    this.endMatch()
  }

  isVictory() {
    if(this.matchService.matchData?.winningPlayerId)
      return this.matchService.matchData!.winningPlayerId === this.matchService.playerData!.playerId
    return false;
  }
}
