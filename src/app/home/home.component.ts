import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { MatchService } from '../services/match.service';
import {HubService} from "../services/hub.service";
import {MatDialog, MatDialogState} from "@angular/material/dialog";
import {DialogWaitingComponent} from "../components/dialogWaiting/dialogWaiting.component";
import {DataService} from "../services/data.service";
import {interval} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public router: Router, public matchService: MatchService, public hubService: HubService, public data: DataService, public dialog: MatDialog) { }

  intervalLoop:any;

  dialogRef: any
  async ngOnInit() {
    await this.hubService.ConnectToHub();
  }

  async openDialog(){

    this.dialogRef = this.dialog.open(DialogWaitingComponent);
    this.hubService.hubConnect?.invoke("JoinMatch")
    console.log(this.hubService.isWaiting)
    this.intervalLoop = setInterval(async () => {
      if (!this.hubService.isWaiting){
        await this.joinMatch()
      }
    }, 500)

    this.dialogRef.afterClosed().subscribe((_: any) => {
      this.hubService.isWaiting = false;
      clearInterval(this.intervalLoop)
    })
  }

  async joinMatch() {
    // TODO: Anuglar: Afficher un dialogue qui montre que l'on attend de joindre un match
    // TODO: Hub: Se connecter au Hub et joindre un match

    this.hubService.hubConnect?.invoke("JoinMatch")
    console.log(this.hubService.matchService)
    if (this.hubService.matchData?.match != null){
      await this.router.navigate(['/match/' + this.matchService.matchId]);
      this.dialogRef.close()
    }
  }
}


