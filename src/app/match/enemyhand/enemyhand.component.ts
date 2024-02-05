import { Component, Input, OnInit } from '@angular/core';
import { PlayableCard } from 'src/app/models/models';

@Component({
  selector: 'app-enemyhand',
  templateUrl: './enemyhand.component.html',
  styleUrls: ['./enemyhand.component.css']
})
export class EnemyhandComponent implements OnInit {

  @Input() cards: PlayableCard[] = [];

  constructor() { }

  ngOnInit() {
  }

}
