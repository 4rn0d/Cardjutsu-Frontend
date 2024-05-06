import { Injectable } from '@angular/core';
import {lastValueFrom, timer} from "rxjs";
import {Card, CardPower, Message} from "../models/models";
import {HubService} from "./hub.service";
import {MatchService} from "./match.service";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  listMessages:Message[]=[]
  constructor(public hub:HubService, public match:MatchService) { }

 async envoyerMessage(text:string){
   this.hub.SendMessage(text,this.match.matchId);

 }


 async joueurRejoin() {
   this.hub.JoueurSeConnectChat(this.match.matchId);
  }

  async joueurQuitte() {
    this.hub.JoueurSeDeconnectChat(this.match.matchId);
  }

  getmessage() {
    this.hub.GetMessages(this.match.matchId);
  }

  muteJoueur(PlayerName:string) {
    this.hub.MutePlayer(PlayerName,this.match.matchId);
  }

  demuteJoueur(PlayerName:string) {
    this.hub.DemutePlayer(PlayerName,this.match.matchId);
  }
  BanPlayerDuMatch(PlayerName:string){
    this.hub.BanPlayerDuMatch(PlayerName,this.match.matchId);
  }
}
