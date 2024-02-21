import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { MatchService } from '../services/match.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public router: Router, public matchService: MatchService) { }

  ngOnInit() {

  }

  joinMatch(user1:boolean) {
    // TODO: Anuglar: Afficher un dialogue qui montre que l'on attend de joindre un match
    // TODO: Hub: Se connecter au Hub et joindre un match
    this.matchService.userId = user1 ? "User1Id" : "User2Id";
    if(user1)
      localStorage.setItem("playerId", "1");
    else
      localStorage.setItem("playerId", "2");
    this.matchService.hubConnect?.invoke("JoinMatch", this.matchService.userId)
    let matchId = -1;
    this.router.navigate(['/match/' + matchId]);
  }
}


