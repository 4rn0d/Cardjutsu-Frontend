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
    let matchId:number  = parseInt(this.route.snapshot.params["id"]);
    // TODO Tâche Hub: Se connecter au Hub et obtenir le matchData
    await this.hubService.hubConnect?.invoke("GetMatchData", matchId)

    this.matchService.playMatch(this.hubService.matchData!, this.hubService.currentPlayerId!)

    await this.hubService.hubConnect!.invoke("StartMatch", this.matchService.userId, this.matchService.matchData?.match)

    // await this.matchService.applyEvent(this.hubService.StartMatchEvent)

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
    // Pour TEST

    // let events = this.createDrawCardEventsForTest(this.matchService.adversaryData!, 1);
    // events.push({
    //   $type: "GainMana",
    //   Mana: 3,
    //   PlayerId: this.matchService.adversaryData?.playerId
    // });
    //
    // let fakeStartTurnEvent = {
    //   $type: "PlayerStartTurn",
    //   PlayerId: this.matchService.adversaryData?.playerId,
    //   Events: events
    // }
    //
    // let fakeEndTurnEvent = {
    //   $type: "PlayerEndTurn",
    //   PlayerId: this.matchService.playerData?.playerId,
    //   Events: [fakeStartTurnEvent]
    // }
    // await this.matchService.applyEvent(fakeEndTurnEvent);
    //
    // // On attend 3 secondes pour faire semblant que l'autre joueur attend pour terminer son tour
    // await new Promise(resolve => setTimeout(resolve, 3000));
    // events = this.createDrawCardEventsForTest(this.matchService.playerData!, 1);
    // events.push({
    //   $type: "GainMana",
    //   Mana: 3,
    //   PlayerId: this.matchService.playerData?.playerId
    // });
    //
    // fakeStartTurnEvent = {
    //   $type: "PlayerStartTurn",
    //   PlayerId: this.matchService.playerData?.playerId,
    //   Events: events
    // }
    //
    // fakeEndTurnEvent = {
    //   $type: "PlayerEndTurn",
    //   PlayerId: this.matchService.adversaryData?.playerId,
    //   Events: [fakeStartTurnEvent]
    // }
    // await this.matchService.applyEvent(fakeEndTurnEvent);
  }

  async surrender() {
    // TODO Tâche Hub: Faire l'action sur le Hub
    console.log("surrender")
    await this.hubService.hubConnect!.invoke('Surrender', this.matchService.userId, this.matchService.matchData?.match?.id)
    this.endMatch()
    // let fakeEndMatchEvent = {
    //   $type: "EndMatch",
    //   WinningPlayerId: this.matchService.adversaryData?.playerId
    // }
  }

  isVictory() {
    if(this.matchService.matchData?.winningPlayerId)
      return this.matchService.matchData!.winningPlayerId === this.matchService.playerData!.playerId
    return false;
  }
}
