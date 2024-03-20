import {Component, OnInit} from '@angular/core';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {HubService} from "../../services/hub.service";
import {ApiService} from "../../services/api.service";
import {Card} from "../../models/models";
import {NgForOf} from "@angular/common";
import {AppModule} from "../../app.module";
import {CardComponent} from "../card/card.component";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-dialog-add-deck',
  templateUrl: './dialog-add-deck.component.html',
  styleUrls: ['./dialog-add-deck.component.css']
})
export class DialogAddDeckComponent implements OnInit{
  constructor(public api:ApiService,private dialogRef: MatDialogRef<DialogAddDeckComponent>) {
  }
  cards: Card[] = [];
  selectedCards: any[] = [];
  async ngOnInit(): Promise<void> {
    this.cards = await this.api.getPlayersCards();

  }


  toggleCardSelection(card: any) {
    if (this.selectedCards.includes(card)) {
      this.selectedCards = this.selectedCards.filter(c => c !== card);
      console.log(this.selectedCards)
    } else if (this.selectedCards.length < 5) {
      this.selectedCards.push(card);
      console.log(this.selectedCards)
    }
  }

  isCardSelected(card: any): boolean {
    return this.selectedCards.includes(card);
  }
  closeDialog() {
    this.dialogRef.close(this.selectedCards); // Pass selected cards back to the main page
  }
}
