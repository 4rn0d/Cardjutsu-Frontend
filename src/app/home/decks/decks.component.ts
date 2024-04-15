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
  uniqueNameCard:string[] = []
  constructor( public dialog:MatDialog, public api:ApiService) {
  }

  async ngOnInit(): Promise<void> {

    let configDeck = await this.api.GetConfigDecks();
    this.nbCarteMaxDeck = configDeck.nbCarteParDeck;
    this.nbDeckMax = configDeck.nbDecks;
    this.ListDecks = await this.api.GetDecks()


    this.ttCartesJoueur = await this.api.getPlayersCards();
    let uniqueCardName:any[] = [];
    this.ttCartesJoueur = this.ttCartesJoueur.filter(card => {
      if (!uniqueCardName.includes(card.name)) {
        uniqueCardName.push(card.name);
        return true;
      }
      return false;
    });
    this.uniqueNameCard = uniqueCardName;
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

  trouverlescarte(ownedCards: any[]): (Promise<any> & NgIterable<any>) | undefined | null |string[]  {
    let reponse = []
    let cards:string[] = []
    for (let ownedCard of ownedCards) {
      cards.push(ownedCard.card.name);
    }
    for (let name of this.uniqueNameCard) {
      if (!cards.includes(name)) {
        reponse.push(name)
      }
    }
    console.log(reponse)
      return reponse;







  }

 async ajouterCarte(cardName: string, deckid: any) {
   for (let card of this.ttCartesJoueur) {
     if (card.name === cardName){
       console.log("click card")
       console.log(card)
       console.log(deckid)
       await this.api.AjouterCarteAuDeck(card, deckid);
       await this.ngOnInit();
       return;
     }
   }

   //await this.api.AjouterCarteAuDeck(card.card, deckid);
   //await this.ngOnInit();

  }


  async deleteCard(card: any, deckid: any) {

    await this.api.DeleteCardDuDeck(card, deckid)
    await this.ngOnInit();
  }
}
