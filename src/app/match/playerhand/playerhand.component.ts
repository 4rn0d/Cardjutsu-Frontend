import { Component, Input, OnInit } from '@angular/core';
import { PlayableCard } from 'src/app/models/models';

@Component({
  selector: 'app-playerhand',
  templateUrl: './playerhand.component.html',
  styleUrls: ['./playerhand.component.css']
})
export class PlayerhandComponent implements OnInit {

  @Input() cards: PlayableCard[] = [];

  constructor() { }

  ngOnInit() {
  }

  click(playableCardId:any){
    // TODO: Utiliser seulement une fois que l'on peut jouer des cartes (TP2)
  }
}
