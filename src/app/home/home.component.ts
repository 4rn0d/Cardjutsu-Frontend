import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { MatchService } from '../services/match.service';
import {HubService} from "../services/hub.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public router: Router, public matchService: MatchService, public hubService: HubService) { }

  ngOnInit() {

  }

  async joinMatch(user1:boolean) {
    // TODO: Anuglar: Afficher un dialogue qui montre que l'on attend de joindre un match
    // TODO: Hub: Se connecter au Hub et joindre un match
    this.matchService.userId = user1 ? "User1Id" : "User2Id";
    if(user1)
      localStorage.setItem("playerId", "1");
    else
      localStorage.setItem("playerId", "2");

    this.hubService.hubConnect?.invoke("JoinMatch", this.matchService.userId)

    await this.router.navigate(['/match/' + this.matchService.matchId]);
  }
}


