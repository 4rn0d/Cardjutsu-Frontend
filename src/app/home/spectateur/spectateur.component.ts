import {Component, OnInit} from '@angular/core';
import {HubService} from "../../services/hub.service";
import {MatchService} from "../../services/match.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-spectateur',
  templateUrl: './spectateur.component.html',
  styleUrls: ['./spectateur.component.css']
})
export class SpectateurComponent implements OnInit {

  constructor(public hub: HubService, public matchService: MatchService, public router: Router) {
  }

  ngOnInit(): void {
    this.hub.GetListMatches();
  }

  async rejoindrematch(matchId: number) {
    this.hub.rejoindreMatch(matchId);
   await this.joinMatch();
  }

  async joinMatch() {
    this.hub.hubConnect!.on('GetMatchData', (data) => {
      this.router.navigate(['/match/spectateur/' + data.match.id]);
      console.log(data)
      this.matchService.playMatch(data, localStorage["currentPlayerId"])
    });

  }
}
