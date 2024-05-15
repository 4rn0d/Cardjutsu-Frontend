import {Component, NgIterable, OnInit} from '@angular/core';
import {DialogWaitingComponent} from "../../components/dialogWaiting/dialogWaiting.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogAddDeckComponent} from "../../components/dialog-add-deck/dialog-add-deck.component";
import {Card, Player, PositionPlayerVM} from "../../models/models";
import {ApiService} from "../../services/api.service";
import {MatchService} from "../../services/match.service";

@Component({

  templateUrl: './scoreboard.component.html',

  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {
  currentusername : string | undefined;
  bestPlayers : Player[] | undefined;
  similarPlayers : PositionPlayerVM[] | undefined;
  // positionIndex : number[] | undefined;


  constructor(public api: ApiService) {
  }

  async ngOnInit(): Promise<void> {
    this.currentusername = await this.api.getUsername();

    this.bestPlayers = await this.api.GetBestPlayersScore();
    this.similarPlayers = await this.api.GetSimilarPlayersScore(this.currentusername!);
    console.log(this.bestPlayers);
    console.log(this.similarPlayers);


    // for (let p of this.bestPlayers){
    //   let index = this.bestPlayers.indexOf(p)
    // }
  }
}

