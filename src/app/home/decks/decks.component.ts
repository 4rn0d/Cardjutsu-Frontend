import {Component, OnInit} from '@angular/core';
import {DialogWaitingComponent} from "../../components/dialogWaiting/dialogWaiting.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogAddDeckComponent} from "../../components/dialog-add-deck/dialog-add-deck.component";
import {Card} from "../../models/models";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-decks',

  templateUrl: './decks.component.html',

  styleUrls: ['./decks.component.css']
})
export class DecksComponent implements OnInit{
  dialogRef: any
  cards: Card[] = []
  ListDecks:any[]=[]
  constructor( public dialog:MatDialog, public api:ApiService) {
  }

  async ngOnInit(): Promise<void> {
    this.ListDecks = await this.api.GetDecks()
  }




  async openDialog(){

    this.dialogRef = this.dialog.open(DialogAddDeckComponent);


    this.dialogRef.afterClosed().subscribe(async (data: any) => {
      if (data) {
        console.log(data.name);
        console.log(data.selectedCards);
        this.cards = data.selectedCards;
        await this.api.PostDeck(data.name, data.selectedCards);
        await this.ngOnInit();
      }

    });
  }

  async deleteDeck(id: number) {
    await this.api.deleteDeck(id);
    await this.ngOnInit();
  }

  async makeCourant(deck: any) {
    await this.api.makeCourant(deck);
    await this.ngOnInit();
  }
}
