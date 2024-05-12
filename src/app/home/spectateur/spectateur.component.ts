import {Component, OnInit} from '@angular/core';
import {HubService} from "../../services/hub.service";
import {MatchService} from "../../services/match.service";
import {Router} from "@angular/router";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-spectateur',
  templateUrl: './spectateur.component.html',
  styleUrls: ['./spectateur.component.css']
})
export class SpectateurComponent implements OnInit {

  constructor(public hub: HubService, public matchService: MatchService, public router: Router, public api :ApiService) {
  }
  useremail:string = "";
  listBan :any
  async ngOnInit(): Promise<void> {
    this.hub.GetListMatches();
    this.useremail = await this.api.getUsername();
    this.listBan=this.matchService.listMatchBanPlayer;
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

/* async EstBannis(match: any) {
    if (match){
      for (let ma of match.spectateurBannis) {
        if (this.useremail.includes(ma.name)){
          return true;
          console.log("true")
        }
      }
      console.log("fakse")
      return false;
    }
return;
  }*/
}
