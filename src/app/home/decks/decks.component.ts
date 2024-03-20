import { Component } from '@angular/core';
import {DialogWaitingComponent} from "../../components/dialogWaiting/dialogWaiting.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogAddDeckComponent} from "../../components/dialog-add-deck/dialog-add-deck.component";
import {Card} from "../../models/models";

@Component({
  selector: 'app-decks',

  templateUrl: './decks.component.html',

  styleUrls: ['./decks.component.css']
})
export class DecksComponent {
  dialogRef: any
  cards: Card[] = []
  constructor( public dialog:MatDialog) {
  }




  async openDialog(){

    this.dialogRef = this.dialog.open(DialogAddDeckComponent);


    this.dialogRef.afterClosed().subscribe((selectedCards: any) => {
      console.log(selectedCards);
      this.cards = selectedCards;

    });
  }
}
