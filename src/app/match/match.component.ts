import { Component, OnInit } from '@angular/core';
import { MatchData, PlayerData } from '../models/models';
import { MatchService } from './../services/match.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import * as signalR from "@microsoft/signalr"
import {environment} from "../../environments/environment.development";
import {HubService} from "../services/hub.service";
import {DialogWaitingComponent} from "../components/dialogWaiting/dialogWaiting.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {


  constructor(private route: ActivatedRoute, public router: Router, public matchService:MatchService, public apiService:ApiService, public hubService: HubService, public dialog: MatDialog) { }
  isSpectateur:boolean = false;
  isLookingPlayerB = false;
  async ngOnInit() {
    const urlSegment = this.route.snapshot.url.find(segment => segment.path.includes('spectateur'));
    if (urlSegment) {
      this.isSpectateur= true;
      console.log('Spectateur');
    } else {
      this.isSpectateur= false;
      console.log('Not spectateur');
    }

  }

  endMatch() {
    this.matchService.clearMatch();
    this.router.navigate(['/'])
  }

  async endTurn() {
    // TODO Tâche Hub: Faire l'action sur le Hub
    await this.hubService.hubConnect!.invoke('EndTurn', this.matchService.matchData?.match.id)
  }

  async surrender() {
    // TODO Tâche Hub: Faire l'action sur le Hub
    console.log("surrender")
    await this.hubService.hubConnect!.invoke('Surrender', this.matchService.matchData?.match?.id)
  }

  isVictory() {
    if(this.matchService.matchData?.winningPlayerId)
      return this.matchService.matchData!.winningPlayerId === this.matchService.playerData!.playerId
    return false;
  }

  changePercpective() {
    this.isLookingPlayerB= !this.isLookingPlayerB;
  }

  QuiterMatch() {
    this.router.navigate(['/Spectateur']);
  }
}
