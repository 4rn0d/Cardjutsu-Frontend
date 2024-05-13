import {Component, NgIterable, OnInit} from '@angular/core';
import {DialogWaitingComponent} from "../../components/dialogWaiting/dialogWaiting.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogAddDeckComponent} from "../../components/dialog-add-deck/dialog-add-deck.component";
import {Card, Player} from "../../models/models";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-decks',

  templateUrl: './scoreboard.component.html',

  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {
  bestPlayers : Player[] | undefined = undefined;
  similarPlayers : Player[] | undefined = undefined;


  constructor(public api: ApiService) {
  }

  async ngOnInit(): Promise<void> {
    this.bestPlayers = await this.api.GetBestPlayersScore();
  }
}

