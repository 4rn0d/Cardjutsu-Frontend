import {Injectable} from '@angular/core';
import * as signalR from "@microsoft/signalr";
import {HubConnectionState} from "@microsoft/signalr";
import {environment} from "../../environments/environment.development";
import {MatchData} from "../models/models";
import {MatchService} from "./match.service";
import {ChatComponent} from "../match/chat/chat.component";
import {MessageService} from "./messageservice";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class HubService {

  isConnected: boolean = false

  hubConnect?: signalR.HubConnection;

  matchData?: MatchData

  currentPlayerId?: number

  isWaiting: boolean = true

  constructor(public matchService: MatchService, public router:Router) { }

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


      //MESSAGERIE
      this.hubConnect!.on('GetMessagerie', (data) =>{
        console.log('GetMessagerie');
        console.log(data)
        this.matchService.listMessage = data;
        console.log(this.matchService.listMessage)
      });

      this.hubConnect!.on('ListMutedPlayer', (data) =>{
        console.log('ListMutedPlayer');
        console.log(data)
        this.matchService.listMutedPlayer = data;
        console.log(this.matchService.listMutedPlayer)
      });

      //LISTMATCH
      this.hubConnect!.on('ListMatch', (data) =>{
        console.log('ListMatch');
        console.log(data)
        this.matchService.listMatchDisponible = data;
        console.log(this.matchService.listMutedPlayer)
      });
      //Ban
      this.hubConnect!.on('ListBanPlayer', (data) =>{
        console.log('ListBanPlayer');
        this.matchService.listMatchBanPlayer = data;
        console.log(this.matchService.listMutedPlayer)

      });
      this.hubConnect!.on('BanJoueurDuMatch', (data) =>{
        console.log('BanJoueurDuMatch');
        this.router.navigate(['/Spectateur']);

      });

    }).catch(err => console.log('Error connection : ' + err))
  }

  disconnect(){
    this.hubConnect?.stop()
  }

  JoueurSeConnectChat(matchId:number|undefined) {
    this.hubConnect!.invoke('JoueurSeConnectChat', matchId);
  }
  JoueurSeDeconnectChat(matchId:number|undefined) {
    this.hubConnect!.invoke('JoueurSeDeconnectChat', matchId);
  }
  SendMessage(MessageText: string, matchId:number|undefined) {
    this.hubConnect!.invoke('SendMessage', MessageText, matchId);
  }
  GetMessages( matchId:number|undefined) {
    this.hubConnect!.invoke('UpdateMessagerie', matchId);
  }

  MutePlayer(PlayerName:string,matchId:number|undefined) {
    this.hubConnect!.invoke('MutePlayer',PlayerName, matchId, );
  }
  DemutePlayer(PlayerName:string,matchId:number|undefined) {
    this.hubConnect!.invoke('DemutePlayer',PlayerName, matchId, );
  }

  GetListMatches() {
    this.hubConnect!.invoke('GetListMatchs');
  }

  rejoindreMatch(id:number) {
    this.hubConnect!.invoke('RejoindreMatchSpectateur',id);
  }
  BanPlayerDuMatch(PlayerName:string,matchId:number|undefined){
  this.hubConnect!.invoke('BanPlayerDuMatch',PlayerName,matchId);
}
}
