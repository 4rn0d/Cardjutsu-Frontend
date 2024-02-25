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

  matchData:MatchData|null = null;

  constructor(public matchService: MatchService) { }

  async ConnectToHub(){
    this.hubConnect = new signalR.HubConnectionBuilder().withUrl(environment.apiUrl + "matchHub").build();

    this.hubConnect.start().then(()=>{
      console.log("connection au hub");

      this.hubConnect!.on('GetMatchData', (data) => {
        this.matchData = data
        console.log(data)
      });



      this.hubConnect!.on('StartMatch', (data) => {
        console.log("this is the startMatch event")
        this.matchService.applyEvent(data)
      });

      this.hubConnect!.on('endTurn', (data) =>{
        console.log('endTurn');
        console.log(data);
      })

      this.hubConnect!.on('GetMatchId', (data) => {
        this.matchService.matchId = data
        console.log('THIS IS THE FKG MATCH ID')
        console.log(this.matchService.matchId)
      });

      this.hubConnect!.on('surrender', (data) =>{
        console.log('surrender');
      })

    }).catch(err => console.log('Error connection : ' + err))
  }

}
