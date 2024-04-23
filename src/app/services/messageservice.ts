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


}
