import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import {environment} from "../../environments/environment.development";
import {Match, MatchData} from "../models/models";
import {MatchService} from "./match.service";

@Injectable({
  providedIn: 'root'
})
export class HubService {

  isConnected: boolean = false

  hubConnect?: signalR.HubConnection;

  matchData?: MatchData

  currentPlayerId?: number

  constructor(public matchService: MatchService) { }

  async ConnectToHub(){
    this.hubConnect = new signalR.HubConnectionBuilder().withUrl(environment.apiUrl + "matchHub").build();

    this.hubConnect.start().then(()=>{
      console.log("connection au hub");
      this.isConnected = true;

      this.hubConnect!.on('GetMatchData', (data) => {
        this.matchData = data
        this.currentPlayerId = this.matchData?.playerB.id
      });

      this.hubConnect!.on('GetMatchId', (data) => {
        this.matchService.matchId = data
        console.log('MatchId:')
        console.log(this.matchService.matchId)
      });

      this.hubConnect!.on('StartMatch', (data) => {
        this.matchService.applyEvent(JSON.parse(data))
      })

      this.hubConnect!.on('EndTurn', (data) =>{
        console.log('EndTurn');
        this.matchService.applyEvent(JSON.parse(data))
      })

      this.hubConnect!.on('Surrender', (data) =>{
        console.log('Surrender');
        this.matchService.applyEvent(JSON.parse(data))
      })

    }).catch(err => console.log('Error connection : ' + err))
  }

}
