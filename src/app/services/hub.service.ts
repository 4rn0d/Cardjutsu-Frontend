import {Injectable} from '@angular/core';
import * as signalR from "@microsoft/signalr";
import {HubConnectionState} from "@microsoft/signalr";
import {environment} from "../../environments/environment.development";
import {MatchData} from "../models/models";
import {MatchService} from "./match.service";

@Injectable({
  providedIn: 'root'
})
export class HubService {

  isConnected: boolean = false

  hubConnect?: signalR.HubConnection;

  matchData?: MatchData

  currentPlayerId?: number

  isWaiting: boolean = true

  constructor(public matchService: MatchService) { }

  async ConnectToHub(){
    if(this.hubConnect?.state == HubConnectionState.Connected)
      return;

    this.hubConnect = new signalR.HubConnectionBuilder().withUrl(environment.apiUrl + "matchHub").build();

    this.hubConnect.start().then(()=>{
      console.log("connection au hub");
      this.isConnected = true;

      this.hubConnect!.on('IsWaiting', (data) => {
        this.isWaiting = data
        console.log("Is Waiting result : " + data)
      })

      this.hubConnect!.on('GetMatchData',  (data) => {
        this.matchData = data
        this.matchService.matchId = this.matchData?.match.id
      });

      this.hubConnect!.on('PlayCard',  (data) => {
        console.log('PlayCard')
        console.log(data)
        this.matchService.applyEvent(JSON.parse(data))
      });

      this.hubConnect!.on('StartMatch', (data) => {
        console.log("joinMatch")
        this.matchService.applyEvent(JSON.parse(data))
      })

      this.hubConnect!.on('EndTurn', (data) =>{
        console.log('EndTurn');
        this.matchService.applyEvent(JSON.parse(data))
      })

      this.hubConnect!.on('Surrender', (data) =>{
        console.log('Surrender');
        this.matchService.applyEvent(JSON.parse(data))
        this.matchService.isCompleted = true
      })

    }).catch(err => console.log('Error connection : ' + err))
  }

  disconnect(){
    this.hubConnect?.stop()
  }

}
