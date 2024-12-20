export interface Player {
  id: number;
  name: string;
  eloScore: number;
}

export interface PositionPlayerVM{
  position: number;
  username: string;
  elo: number;
}

export interface Card {
  id: number;
  name: string;
  attack: number;
  health: number;
  cost: number;
  imageUrl: string;
  colour: string;
  cardPowers: CardPower[];
}

export interface CardPower{
  id: number;
  card : Card;
  power : Power;
  value : number;
}

export interface MatchData {
  match:Match;
  playerA: Player;
  playerB: Player;
  winningPlayerId:number;
}

export interface Match {
  id: number;
  isMatchCompleted: boolean;
  isPlayerATurn: boolean;
  playerDataA: PlayerData;
  playerDataB: PlayerData;
}

export interface PlayableCard {
  id: number;
  card: Card;
  health: number;
  ordreId:number;
}

export interface PlayerData {
  id:number;
  health: number;
  maxhealth: number;
  mana: number;
  playerId: number;
  playerName: string;
  cardsPile: PlayableCard[];
  hand: PlayableCard[];
  battleField: PlayableCard[];
  graveyard: PlayableCard[];
}

export interface Power {
  powerId: number;
  name: string;
  description: string;
  icon: string;
  hasValue: boolean;
}

export interface CardPower {
  cardPowerId: number;
  value: number;
  card: Card;
  power: Power
}
