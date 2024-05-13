import { Component, OnInit } from '@angular/core';
import { MatchData, PlayerData } from '../models/models';
import { MatchService } from './../services/match.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import * as signalR from "@microsoft/signalr"
import {environment} from "../../environments/environment.development";
import {HubService} from "../services/hub.service";
import {DialogWaitingComponent} from "../components/dialogWaiting/dialogWaiting.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {


  constructor(private route: ActivatedRoute, public router: Router, public matchService:MatchService, public apiService:ApiService, public hubService: HubService, public dialog: MatDialog) { }

  async ngOnInit() {
  }

  endMatch() {
    this.matchService.clearMatch();
    this.router.navigate(['/'])
  }

  async endTurn() {
    // TODO Tâche Hub: Faire l'action sur le Hub
    await this.hubService.hubConnect!.invoke('EndTurn', this.matchService.matchData?.match.id)
  }

  async surrender() {
    // TODO Tâche Hub: Faire l'action sur le Hub
    console.log("surrender")
    await this.hubService.hubConnect!.invoke('Surrender', this.matchService.matchData?.match?.id)
  }

  isVictory() {

    let currentID = this.matchService.currentPlayerId;

    console.log("currentID", currentID)
    console.log("player a : " + this.matchService.matchData?.playerA.id + " elo : " + this.matchService.matchData?.playerA.elo);
    console.log("player b : " + this.matchService.matchData?.playerB.id + " elo : " + this.matchService.matchData?.playerB.elo);

    // if(this.matchService.matchData?.playerA.id === currentID){
    //   this.matchService.elo = this.matchService.matchData!.playerA.elo;
    // }else{
    //   this.matchService.elo  = this.matchService.matchData!.playerB.elo;
    // }


    // if(this.matchService.matchData?.winningPlayerId == this.matchService.matchData!.playerA.id){
    //   this.elo = this.matchService.matchData.playerA.elo;
    // }
    // else{
    //   this.elo = this.matchService.matchData!.playerB.elo;
    // }

    // this.elo = this.matchService.matchData!.playerA.elo; //test

    if(this.matchService.matchData?.winningPlayerId){
      return this.matchService.matchData!.winningPlayerId === this.matchService.playerData!.playerId
    }
    return false;
  }
}
