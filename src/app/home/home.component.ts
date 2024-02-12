import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatDialogState} from "@angular/material/dialog";
import {DialogWaitingComponent} from "../components/dialogWaiting/dialogWaiting.component";
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public router: Router, public data: DataService, public dialog: MatDialog) { }

  ngOnInit() {

  }

  joinMatch() {
    // TODO: Anuglar: Afficher un dialogue qui montre que l'on attend de joindre un match
    // TODO: Hub: Se connecter au Hub et joindre un match
    const dialogRef = this.dialog.open(DialogWaitingComponent);

    console.log(this.data.dialogIsOpen)

    let timeout : number

    dialogRef.afterOpened().subscribe(_ => {
      timeout = setTimeout(() => {
        dialogRef.close()
        let matchId = -1;
        this.router.navigate(['/match/' + matchId]);
      }, 5000)
    })

    dialogRef.afterClosed().subscribe(_ => {
      clearTimeout(timeout)
    })

  }

}


