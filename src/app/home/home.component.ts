import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { MatchService } from '../services/match.service';
import {HubService} from "../services/hub.service";
import {MatDialog, MatDialogState} from "@angular/material/dialog";
import {DialogWaitingComponent} from "../components/dialogWaiting/dialogWaiting.component";
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public router: Router, public matchService: MatchService, public hubService: HubService, public data: DataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.hubService.ConnectToHub();
  }

  async joinMatch() {
    // TODO: Anuglar: Afficher un dialogue qui montre que l'on attend de joindre un match
    // TODO: Hub: Se connecter au Hub et joindre un match

    this.hubService.hubConnect?.invoke("JoinMatch")

    const dialogRef = this.dialog.open(DialogWaitingComponent);
    if (this.matchService.matchId){
      await this.router.navigate(['/match/' + this.matchService.matchId]);
      dialogRef.close()
    }

  }
}


