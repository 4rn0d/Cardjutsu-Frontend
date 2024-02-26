import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import {environment} from "../../environments/environment.development";
import {Match, MatchData} from "../models/models";
import {MatchService} from "./match.service";

@Injectable({
  providedIn: 'root'
})
export class HubService {

  hubConnect?: signalR.HubConnection;

  matchData?: MatchData

  currentPlayerId?: number

  StartMatchEvent: any;

  SurrenderEvent: any;

  EndTurnEvent: any;

  constructor(public matchService: MatchService) { }

  async ConnectToHub(){
    this.hubConnect = new signalR.HubConnectionBuilder().withUrl(environment.apiUrl + "matchHub").build();

    this.hubConnect.start().then(()=>{
      console.log("connection au hub");

      this.hubConnect!.on('GetMatchData', (data) => {
        this.matchData = data
      });

      this.hubConnect!.on('GetMatchId', (data) => {
        this.matchService.matchId = data
        console.log('MatchId:')
        console.log(this.matchService.matchId)
      });

      this.hubConnect!.on('StartMatch', (data) => {
        console.log('StartMatchEvent: ')
        console.log(data)
        this.matchService.applyEvent(data)
      })

      this.hubConnect!.on('EndTurn', (data) =>{
        console.log('EndTurn');
        this.EndTurnEvent = data
        this.matchService.applyEvent(data)
        console.log(data);
      })

      this.hubConnect!.on('Surrender', (data) =>{
        console.log('Surrender');
        this.SurrenderEvent = data
        this.matchService.applyEvent(data)
        console.log(data);
      })

    }).catch(err => console.log('Error connection : ' + err))
  }

}
