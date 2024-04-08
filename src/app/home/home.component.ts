import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { MatchService } from '../services/match.service';
import {HubService} from "../services/hub.service";
import {MatDialog, MatDialogState} from "@angular/material/dialog";
import {DialogWaitingComponent} from "../components/dialogWaiting/dialogWaiting.component";
import {interval} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public router: Router, public matchService: MatchService, public hubService: HubService, public dialog: MatDialog) { }

  intervalLoop:any;

  dialogRef: any
  async ngOnInit() {
    await this.hubService.ConnectToHub();
  }

  async openDialog(){
    this.dialogRef = this.dialog.open(DialogWaitingComponent);
    this.hubService.hubConnect?.invoke("JoinMatch")
    this.joinMatch()
  }

  async joinMatch() {
    this.hubService.hubConnect!.on('GetMatchData',  (data) => {
        this.router.navigate(['/match/' + data.match.id]);
        console.log(data)
        this.matchService.playMatch(data, localStorage["currentPlayerId"])
        this.dialogRef.close()
    });
  }
}


