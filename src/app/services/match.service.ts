import { Card, MatchData, PlayableCard } from 'src/app/models/models';
import { PlayerData } from '../models/models';
import { Injectable } from '@angular/core';
import { Match } from '../models/models';
import * as signalR from "@microsoft/signalr";
import {environment} from "../../environments/environment.development";
import {HubService} from "./hub.service";
import {PlayerhandComponent} from "../match/playerhand/playerhand.component";

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  matchId?:number;
  match:Match | null = null;
  matchData:MatchData | null = null;
  currentPlayerId:number = -1;

  playerData: PlayerData | undefined;
  adversaryData: PlayerData | undefined;
  isCompleted: boolean = false

  opponentSurrendered:boolean = false;
  isCurrentPlayerTurn:boolean = false;

  constructor() { }

  clearMatch(){
    this.match = null;
    this.matchData = null;
    this.matchId = undefined;
    this.playerData = undefined;
    this.adversaryData = undefined;
    this.opponentSurrendered = false;
    this.isCurrentPlayerTurn = false;
    this.isCompleted = false;
  }

  playMatch(matchData:MatchData, currentPlayerId:number) {

    this.matchData = matchData;
    this.match = matchData.match;
    this.currentPlayerId = currentPlayerId;

    if(this.match.playerDataA.playerId == this.currentPlayerId)
    {
      this.playerData = this.match.playerDataA!;
      this.playerData.playerName = matchData.playerA.name;
      this.adversaryData = this.match.playerDataB!;
      this.adversaryData.playerName = matchData.playerB.name;
      this.isCurrentPlayerTurn = this.match.isPlayerATurn;
    }
    else
    {
      this.playerData = this.match.playerDataB!;
      this.playerData.playerName = matchData.playerB.name;
      this.adversaryData = this.match.playerDataA!;
      this.adversaryData.playerName = matchData.playerA.name;
      this.isCurrentPlayerTurn = !this.match.isPlayerATurn;
    }
    this.playerData.maxhealth = this.playerData.health;
    this.adversaryData.maxhealth = this.adversaryData.health;
  }

  async applyEvent(event:any){
    console.log("ApplyingEvent: " + event.$type);
    switch(event.$type){
      case "StartMatch": {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("starting...")
        break;
      }

      case "PlayCard": {
        let playerData = this.getPlayerData(event.PlayerId);
        let card = playerData?.hand.find(x => x.id == event.PlayableCardId);

        if(card!.card.cost <= playerData!.mana){
          this.moveCard(playerData!.hand, playerData!.battleField, event.PlayableCardId);
        }
        console.log("HAND -- " + playerData?.hand);
        console.log("BF -- " + playerData?.battleField);
        console.log("GRAVE -- " + playerData?.graveyard);
        break;
      }

      case "Combat" : {
        break;
      }

      case "CardActivation" : {
        break;
      }

      case "CardDamage" : {
        break;
      }

      case "CardDeath" : {
        break;
      }

      case "PlayerDamage" : {
        break;
      }

      case "PlayerDeath" : {
        break;
      }

      case "Heal": {
        let playerData = this.getPlayerData(event.PlayerId);
        let card = playerData!.battleField.find(x=>x.id == event.PlayableCardId);
        if(this.hasPower(3, card, playerData!.battleField)){
          let amountHeal = this.getPowerValue(3, card, playerData!.battleField);
          this.heal(amountHeal, playerData!.battleField);
        }
        break;
      }

      case "Thorns": {
        let playerData = this.getPlayerData(event.PlayerId);
        let enemy = this.getPlayerData(this.adversaryData!.playerId);
        let card = playerData!.battleField.find(x=>x.id == event.PlayableCardId);
        let position = playerData!.battleField.indexOf(card!);
        let enemyCard = enemy?.battleField.at(position!);

        if(this.hasPower(2, enemyCard, enemy!.battleField)){
          let amount = this.getPowerValue(2, enemyCard!.id, enemy!.battleField);
          card!.health -= amount;
        }
        break;
      }

      case "Thief": {
        let playerData = this.getPlayerData(event.PlayerId);
        let enemy = this.getPlayerData(this.adversaryData!.playerId);
        let card = playerData!.battleField.find(x=>x.id == event.PlayableCardId);
        if(this.hasPower(4, card, playerData!.battleField)){
          let amountStolen = this.getPowerValue(4, card, playerData!.battleField);

          if(enemy!.mana < amountStolen){
            amountStolen = enemy!.mana;
            enemy!.mana = 0;
            playerData!.mana += amountStolen;
          }else{
            enemy!.mana -= amountStolen;
            playerData!.mana += amountStolen;
          }
        }
        break;
      }

      case "FirstStrike": {
        let playerData = this.getPlayerData(event.PlayerId);
        let enemy = this.getPlayerData(this.adversaryData!.playerId);
        let card = playerData!.battleField.find(x=>x.id == event.PlayableCardId);
        let position = playerData!.battleField.indexOf(card!);
        let enemyCard = enemy?.battleField.at(position!);

        if(this.hasPower(1, card, playerData!.battleField)){
          let amount = this.getPowerValue(1, card!.id, playerData!.battleField);
          enemyCard!.health -= amount;
        }
        break;
      }

      case "GainMana": {
        // TODO
        let playerData = this.getPlayerData(event.PlayerId);
        if(playerData)
        {
          playerData!.mana += event.Mana;
          await new Promise(resolve => setTimeout(resolve, 250));
        }
        break;
      }

      case "PlayerStartTurn" : {
        this.playerData = event.PlayerData;
        break;
      }

      case "PlayerEndTurn": {
        if(this.match)
        {
          this.match.isPlayerATurn = !this.match.isPlayerATurn;
          console.log(event.PlayerId + "  testing  " + this.currentPlayerId)
          this.isCurrentPlayerTurn = event.PlayerId != this.currentPlayerId;
          console.log(this.isCurrentPlayerTurn)
        }

        break;
      }
      case "DrawCard": {
        let playerData = this.getPlayerData(event.PlayerId);
        console.log(playerData)
        if(playerData)
        {
          this.moveCard(playerData.cardsPile, playerData.hand, event.PlayableCardId);
          await new Promise(resolve => setTimeout(resolve, 250));
        }

        break;
      }
      case "EndMatch": {
        console.log("hgashdgaskjgdsjkagdjksghadjksgadjkgjkhag")
        this.matchData!.winningPlayerId = event.WinningPlayerId;
        break;
      }
    }
    if(event.Events){
      console.log(event)
      for(let e of event.Events){
        await this.applyEvent(e);
      }

    }
  }

  getPlayerData(playerId:any) : PlayerData | null{
    if(this.match){
      if(playerId == this.match.playerDataA.playerId)
        return this.match.playerDataA;
      else if(playerId == this.match.playerDataB.playerId)
        return this.match.playerDataB;
    }
    return null;
  }

  hasPower(id:number, playableCardId : any, playableCardList : PlayableCard[]) : boolean{
    let card = playableCardList.find(x => x.id == playableCardId);
    if(card!.card.listCardPowers != undefined && card!.card.listCardPowers.find(x => x.power.id == id) != undefined){
      return true;
    }
    return false;
  }

  getPowerValue(id:number, playableCardId : any, playableCardList : PlayableCard[]):number{
    let card = playableCardList.find(x => x.id == playableCardId);
    if(this.hasPower(id, playableCardId, playableCardList )){
      return card!.card.listCardPowers.find(x => x.power.id == id)!.value;
    }
    return 0;
  }

  heal(amountHealth : number, playableCardList : PlayableCard[]){
    for(let playableCard of playableCardList){
      playableCard.health += amountHealth;
    }
  }

  moveCard(src:PlayableCard[], dst:PlayableCard[], playableCardId:any){
    let playableCard = src.find(c => c.id == playableCardId);
    console.log(playableCard);
    if(playableCard != undefined){
      let index = src.findIndex(c => c.id == playableCardId);
      src.splice(index, 1);
      dst.push(playableCard);
    }
  }
}
