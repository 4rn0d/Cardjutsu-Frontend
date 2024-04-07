import {Component, NgIterable, OnInit} from '@angular/core';
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
  nbDeckMax:any

  ttCartesJoueur: Card[] = [];
  nbCarteMaxDeck:any
  constructor( public dialog:MatDialog, public api:ApiService) {
  }

  async ngOnInit(): Promise<void> {
    let configDeck = await this.api.GetConfigDecks();
    this.nbCarteMaxDeck = configDeck.nbCarteParDeck;
    this.nbDeckMax = configDeck.nbDecks;
    this.ListDecks = await this.api.GetDecks()
    this.ttCartesJoueur = await this.api.getPlayersCards();


  }



  async openDialog(){

    const dialogRef = this.dialog.open(DialogAddDeckComponent);


    dialogRef.afterClosed().subscribe(async (data: any) => {
      if (data) {
        console.log(data.name);
        console.log(data.selectedCards);
        this.cards = data.selectedCards;
        await this.api.PostDeck(data.name, data.selectedCards);
        await this.ngOnInit();
      }

    });
  }


  trouvercarte(card: Card, id:number):boolean{
    for (let i = 0; i < this.ListDecks.length; i++) {
      if (this.ListDecks[i].id == id){
        for (let j = 0; j < this.ListDecks[i].ownedCards.length; j++) {
          if (this.ListDecks[i].ownedCards[j].cardId == card.id){
            console.log(this.ListDecks[i].ownedCards[j].cardId)
            console.log(card.id)
            return true

          }else{
            return false
          }
        }
      }else{
        return false
      }


    }
    return false
  }
  async deleteDeck(id: number) {
    console.log(id)
    await this.api.deleteDeck(id);
    await this.ngOnInit();
  }

  async makeCourant(deckid: any) {
    console.log(deckid)
    await this.api.makeCourant(deckid);
    await this.ngOnInit();
  }

  trouverlescarte(ownedCards: any): (Promise<any> & NgIterable<any>) | undefined | null |Card[]  {
    let reponse:any[] = [];
    console.log(ownedCards)
    for (let ttCartesJoueurKey of this.ttCartesJoueur) {
      for (let ownedCard of ownedCards) {
        if (ttCartesJoueurKey.id != ownedCard.cardId){
            reponse.push(ownedCard)

        }
      }

    }

   return reponse
  }

 async ajouterCarte(card: any, deckid: any) {
   console.log("click card")
    console.log(card.card)
    console.log(deckid)
   await this.api.AjouterCarteAuDeck(card.card, deckid);
   await this.ngOnInit();

  }


}
