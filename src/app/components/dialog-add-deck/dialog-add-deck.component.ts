import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
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
  nbCarteMaxDeck:any;
  async ngOnInit(): Promise<void> {
    let configDeck = await this.api.GetConfigDecks();
    this.nbCarteMaxDeck = configDeck.nbCarteParDeck;

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
    if (index === -1 && this.selectedCards.length < this.nbCarteMaxDeck) {
      this.selectedCards.push(card);

      // Retirer la carte sélectionnée de la liste this.cards
      const cardIndex = this.cards.findIndex(c => c.id === card.id);
      if (cardIndex !== -1) {
        this.cards.splice(cardIndex, 1);
      }

    } else if (index !== -1) {
      this.selectedCards.splice(index, 1);

      // Ajouter la carte désélectionnée à la liste this.cards
      this.cards.push(card);
    }
    console.log(this.selectedCards)
  }

  isCardSelected(card: any): boolean {
    return this.selectedCards.includes(card);
  }
  closeDialog() {
    const data = {
      name: this.deckName,
      selectedCards: this.selectedCards
    };
    console.log(data.name)
    this.dialogRef.close(data);
  }
}
