import { Component, Input, OnInit } from '@angular/core';
import { PlayableCard } from 'src/app/models/models';
import {animate, style, transition, trigger, useAnimation} from "@angular/animations";
import {rubberBand} from "ng-animate";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-battlefield',
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.css']
})
export class BattlefieldComponent implements OnInit {

  @Input() cards: PlayableCard[] = [];
  @Input() align: string = 'top';

  constructor(public data:DataService) { }

  ngOnInit() {
  }

}
