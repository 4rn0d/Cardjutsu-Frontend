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

    /*this.intervalLoop = setInterval(async () => {
      if (!this.hubService.isWaiting){
        clearInterval(this.intervalLoop)
        this.dialogRef.close()
      }
      else{
        await this.joinMatch()
      }
    }, 500)*/

    // this.dialogRef.afterClosed().subscribe((_: any) => {
    //   clearInterval(this.intervalLoop)
    //   this.hubService.isWaiting = false;
    // })
  }

  async joinMatch() {
    // TODO: Anuglar: Afficher un dialogue qui montre que l'on attend de joindre un match
    // TODO: Hub: Se connecter au Hub et joindre un match
    // if (!this.hubService.isWaiting){
    //   this.router.navigate(['/match/' + this.matchService.matchId]);
    //   this.matchService.playMatch(this.hubService.matchData!, localStorage["currentPlayerId"])
    //   this.dialogRef.close()
    // }

    this.hubService.hubConnect!.on('GetMatchData',  (data) => {
        this.router.navigate(['/match/' + data.match.id]);
        console.log(data)
        this.matchService.playMatch(data, localStorage["currentPlayerId"])
        this.dialogRef.close()
    });
  }
}


