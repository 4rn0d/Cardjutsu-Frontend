import {Component, OnInit} from '@angular/core';
import {HubService} from "../../services/hub.service";
import {MatchService} from "../../services/match.service";

@Component({
  selector: 'app-spectateur',
  templateUrl: './spectateur.component.html',
  styleUrls: ['./spectateur.component.css']
})
export class SpectateurComponent implements OnInit{

  constructor(public hub: HubService, public matchService : MatchService)  {
  }

  ngOnInit(): void {
      this.hub.GetListMatches();
  }

}
