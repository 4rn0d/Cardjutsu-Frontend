import { Card, MatchData, PlayableCard } from 'src/app/models/models';
import { PlayerData } from '../models/models';
import { Injectable } from '@angular/core';
import { Match } from '../models/models';
import * as signalR from "@microsoft/signalr";
import {environment} from "../../environments/environment.development";
import {HubService} from "./hub.service";
import {PlayerhandComponent} from "../match/playerhand/playerhand.component";
import {DataService} from "./data.service";

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

  constructor(public Data:DataService) { }

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

        console.log(event);
        let card = playerData?.hand.find(x => x.id == event.PlayableCardId);
        console.log(card);
        console.log(event.PlayerId);
        card!.ordreId = event.OrderId

        //mettre de l'ordre dans les playableCard dans battleField
        playerData?.battleField.sort((a, b) => a.ordreId - b.ordreId);


        console.log(playerData?.hand)
        console.log("BF -- " + playerData?.battleField);
        if(card!.card.cost <= playerData!.mana){
          this.moveCard(playerData!.hand, playerData!.battleField, event.PlayableCardId);
          playerData!.mana = event.Mana;
          console.log(event.Mana)
        }
        console.log("HAND -- ");
        console.log(playerData?.hand)
        console.log("BF -- " + playerData?.battleField);
        console.log(playerData?.battleField)
        console.log("GRAVE -- " + playerData?.graveyard);
        console.log(playerData?.graveyard)
        break;
      }

      case "CardDamage" : {
        setTimeout(() => {
          let playerData = this.getPlayerData(event.PlayerId);
          console.log(playerData?.playerName + " "+playerData?.playerId + " ___ damage event")
          console.log(event.PlayableCardId)
          let card = playerData?.battleField.find(x => x.id == event.PlayableCardId);
          console.log(card?.card.name);
          if (event.PlayerId == this.currentPlayerId){
            this.attackAnimationBot(event.OpposingCardId);
          } else {
            this.attackAnimationTop(event.OpposingCardId);
          }
          setTimeout(() => {
            this.cardDamageAnimation(event.PlayableCardId);
            console.log(card)
            card!.health -= event.Damage;
          }, 1000);
        }, 1000);
        break;
      }

      case "CardDeath" : {
        setTimeout(() => {
          let playerData = this.getPlayerData(event.PlayerId);
          let card = playerData?.battleField.find(x => x.id == event.PlayableCardId);
          if (event.PlayerId == this.currentPlayerId){
            this.deathAnimationPlayer(event.PlayableCardId);
          } else {
            this.deathAnimationOpponent(event.PlayableCardId);
          }
          setTimeout(() => {
            this.moveCard(playerData!.battleField, playerData!.graveyard, event.PlayableCardId);
            console.log(playerData?.battleField.length)
            console.log(playerData?.hand.length)
          }, 500);
        }, 2000);

        break;
      }

      case "PlayerDamage" : {
        let playerData = this.getPlayerData(event.PlayerId);
        console.log(playerData)
        if (event.PlayerId == this.currentPlayerId){
          this.attackAnimationBot(event.AttackingCardId);
        } else {
          this.attackAnimationTop(event.AttackingCardId);
        }
        setTimeout(() => {
          playerData!.health -= event.Damage;
        }, 500);
        break;
      }

      case "PlayerDeath" : {
        console.log(event)
        this.isCompleted = true
        this.matchData!.winningPlayerId = event.WinningPlayerId;
        break;
      }

      case "Heal": {
        console.log(event)
        let playerData = this.getPlayerData(event.PlayerId);
        let card = playerData!.battleField.find(x=>x.id == event.PlayableCardId);
        console.log(card)
        console.log(playerData!)
        if(this.hasPower(3, card?.id, playerData!.battleField)){
          let amountHeal = this.getPowerValue(3, card?.id, playerData!.battleField);
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

        if(this.hasPower(2, enemyCard!.id, enemy!.battleField)){
          let amount = this.getPowerValue(2, enemyCard!.id, enemy!.battleField);
          if (event.PlayerId == this.currentPlayerId){
            this.attackAnimationBot(event.PlayableCardId);
          } else {
            this.attackAnimationTop(event.PlayableCardId);
          }
          card!.health -= amount;
        }
        break;
      }

      case "Thief": {
        let playerData = this.getPlayerData(event.PlayerId);
        let enemy = this.getPlayerData(event.EnemyId);
        console.log("Thief is " + playerData?.playerName);
        console.log("victim is " + enemy?.playerName);
        let card = playerData!.battleField.find(x=>x.id == event.PlayableCardId);
        if(this.hasPower(4, card?.id, playerData!.battleField)){
          let amountStolen = this.getPowerValue(4, card?.id, playerData!.battleField);

          if(enemy!.mana < amountStolen){
            amountStolen = enemy!.mana;
            enemy!.mana = 0;
            playerData!.mana += amountStolen;
          }else{
            enemy!.mana -= amountStolen;
            playerData!.mana += amountStolen;
          }
          console.log("THIEF FROM -- " + playerData?.playerName);
          console.log(playerData?.playerName + " ___ " + playerData?.mana);
          console.log(enemy?.playerName + " ___ " + enemy?.mana);

        }
        break;
      }

      // case "Thief": {
      //
      //   let playerData = this.getPlayerData(event.PlayerId);
      //   console.log("CURRENT IS " + playerData?.playerName);
      //   console.log(this.adversaryData!.playerName);
      //   let enemy = this.getPlayerData(this.adversaryData!.playerId);
      //   console.log("ENEMY IS " + enemy?.playerName);
      //   let card = playerData!.battleField.find(x=>x.id == event.PlayableCardId);
      //
      //   console.log(card?.card.name + " from player " + playerData?.playerName);
      //
      //   let amountStolen = this.getPowerValue(4, card?.id, playerData!.battleField);
      //
      //   if(playerData?.battleField.indexOf(card!) == -1){
      //
      //   }
      //
      //
      //
      //   if(this.hasPower(4, card?.id, playerData!.battleField)){
      //
      //
      //     if(enemy!.mana < amountStolen){
      //       amountStolen = enemy!.mana;
      //       enemy!.mana = 0;
      //       playerData!.mana += amountStolen;
      //     }else{
      //       enemy!.mana -= amountStolen;
      //       playerData!.mana += amountStolen;
      //     }
      //     console.log("THIEF FROM -- " + playerData?.playerName);
      //     console.log(playerData?.playerName + " ___ " + playerData?.mana);
      //     console.log(enemy?.playerName + " ___ " + enemy?.mana);
      //
      //   }
      //   break;
      // }

      case "FirstStrike": {
        console.log(event)
        let playerData = this.getPlayerData(event.PlayerId);
        console.log(playerData?.playerName + " has first strike")
        let enemy = this.getPlayerData(this.adversaryData!.playerId);
        let card = playerData!.battleField.find(x=>x.id == event.PlayableCardId);
        console.log(card)
        let position = playerData!.battleField.indexOf(card!);
        let enemyCard = enemy?.battleField.at(position!);

        break;
      }

      case "GainMana": {
        // TODO
        setTimeout(() => {
          let playerData = this.getPlayerData(event.PlayerId);
          if(playerData)
          {
            playerData!.mana += event.Mana;
            // await new Promise(resolve => setTimeout(resolve, 250));
          }
        }, 500)
        break;
      }

      case "PlayerStartTurn" : {
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
        if(playerData)
        {
          this.moveCard(playerData.cardsPile, playerData.hand, event.PlayableCardId);
          await new Promise(resolve => setTimeout(resolve, 250));
        }

        break;
      }
      case "EndMatch": {
        this.matchData!.winningPlayerId = event.WinningPlayerId;
        this.isCompleted = true;
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
      if(playerId == this.match.playerDataA.playerId){
        return this.match.playerDataA;
      }
      else if(playerId == this.match.playerDataB.playerId){
        return this.match.playerDataB;
      }
    }
    return null;
  }

  hasPower(id:number, playableCardId : any, playableCardList : PlayableCard[]) : boolean{
    let card = playableCardList.find(x => x.id == playableCardId);
    if (card!.card.cardPowers != undefined && card!.card.cardPowers.find(x => x.power.powerId == id) != undefined){
      return true;
    }
    return false;
  }

  getPowerValue(id:number, playableCardId : any, playableCardList : PlayableCard[]):number{
    let card = playableCardList.find(x => x.id == playableCardId);
    if(this.hasPower(id, playableCardId, playableCardList )){
      return card!.card.cardPowers.find(x => x.power.powerId == id)!.value;
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

  attackAnimationTop(cardId:number){
    var doc = document.getElementById(""+cardId);
    console.log(doc)
    doc?.firstElementChild!.classList.add("attack-top");
    setTimeout(() => {
      doc?.firstElementChild!.classList.remove("attack-top");
    }, 1000);
  }
  attackAnimationBot(cardId:number){
    var doc = document.getElementById(""+cardId);
    console.log(doc)
    doc?.firstElementChild!.classList.add("attack-bot");
    setTimeout(() => {
      doc?.firstElementChild!.classList.remove("attack-bot");
    }, 1000);
  }

  cardDamageAnimation(cardId:number){
    var doc = document.getElementById(""+cardId);
    console.log(doc)
    doc?.firstElementChild!.classList.add("damage");
    setTimeout(() => {
      doc?.firstElementChild!.classList.remove("damage");
    }, 1000);
  }

  deathAnimationPlayer(cardId:number){
    var doc = document.getElementById(""+cardId);
    console.log(doc!.firstElementChild)
    doc?.firstElementChild!.classList.add("death-player");
    setTimeout(() => {
      doc?.firstElementChild!.classList.remove("death-player");
    }, 1000);
  }

  deathAnimationOpponent(cardId:number){
    var doc = document.getElementById(""+cardId);
    console.log(doc!.firstElementChild)
    doc?.firstElementChild!.classList.add("death-opponent");
    setTimeout(() => {
      doc?.firstElementChild!.classList.remove("death-opponent");
    }, 1000);
  }
}
