import { Card, MatchData, PlayableCard } from 'src/app/models/models';
import { PlayerData } from '../models/models';
import { Injectable } from '@angular/core';
import { Match } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  match:Match | null = null;
  matchData:MatchData | null = null;
  currentPlayerId:number = -1;

  playerData: PlayerData | undefined;
  adversaryData: PlayerData | undefined;

  opponentSurrendered:boolean = false;
  isCurrentPlayerTurn:boolean = false;

  constructor() { }

  clearMatch(){
    this.match = null;
    this.matchData = null;
    this.playerData = undefined;
    this.adversaryData = undefined;
    this.opponentSurrendered = false;
    this.isCurrentPlayerTurn = false;
  }

  playTestMatch(cards:Card[]){
    let matchData:MatchData = {
      match: {
        id: -1,
        isMatchCompleted: false,
        isPlayerATurn: false,
        playerDataA: {
          id: -1,
          health: 20,
          maxhealth: 20,
          mana: 0,
          playerId: 1,
          playerName: "Adversaire",
          cardsPile: [],
          hand: [],
          battleField: [],
          graveyard: []
        },
        playerDataB: {
          id: -1,
          health: 20,
          maxhealth: 20,
          mana: 0,
          playerId: 2,
          playerName: "Joueur",
          cardsPile: [],
          hand: [],
          battleField: [],
          graveyard: []
        }
      },
      playerA: {
        id: 1,
        name: "Adversaire"
      },
      playerB: {
        id: 2,
        name: "Joueur"
      },
      winningPlayerId: -1
    }
    let playableCardId: number = 1;
    for(let c of cards){

      let playableCardA:PlayableCard = {
        id: playableCardId++,
        card: c,
        health: c.defense,
      };
      matchData.match.playerDataA.cardsPile.push(playableCardA);

      let playableCardB:PlayableCard = {
        id: playableCardId++,
        card: c,
        health: c.defense,
      };
      matchData.match.playerDataB.cardsPile.push(playableCardB);
    }
    this.playMatch(matchData, 2);
    return matchData;
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
        break;
      }

      case "GainMana": {
        // TODO
        break;
      }

      case "PlayerEndTurn": {
        if(this.match)
        {
          this.match.isPlayerATurn = !this.match.isPlayerATurn;
          this.isCurrentPlayerTurn = event.PlayerId != this.currentPlayerId;
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
        break;
      }
    }
    if(event.Events){
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
