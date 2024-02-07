import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { MatchService } from '../services/match.service';
import {MatDialog} from "@angular/material/dialog";
import {MaterialModule} from "../material.module";
import {DialogComponent} from "../components/dialog/dialog.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public router: Router, public match: MatchService, public dialog: MatDialog) { }

  ngOnInit() {

  }

  joinMatch() {
    // TODO: Anuglar: Afficher un dialogue qui montre que l'on attend de joindre un match
    // TODO: Hub: Se connecter au Hub et joindre un match
    const dialogRef = this.dialog.open(DialogComponent);

    setTimeout(() => {
      dialogRef.close();
      let matchId = -1;
      this.router.navigate(['/match/' + matchId]);
    }, 10000);

  }

}


