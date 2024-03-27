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
  deckName: string = '';
  async ngOnInit(): Promise<void> {
    this.cards = await this.api.getPlayersCards();
    let uniqueCardIds:any[] = [];
    this.cards = this.cards.filter(card => {
      if (!uniqueCardIds.includes(card.id)) {
        uniqueCardIds.push(card.id);
        return true;
      }
      return false;
    });
    console.log(this.cards)
  }


  toggleCardSelection(card: Card) {
    const index = this.selectedCards.indexOf(card);
    if (index === -1 && this.selectedCards.length < 5) {

      this.selectedCards.push(card);
    } else if (index !== -1) {
      this.selectedCards.splice(index, 1);
    }
  }

  isCardSelected(card: any): boolean {
    return this.selectedCards.includes(card);
  }
  closeDialog() {
    const data = {
      name: this.deckName,
      selectedCards: this.selectedCards
    };
    this.dialogRef.close(data);
  }
}
