import { Component } from '@angular/core';
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-dialogWaiting',
  templateUrl: './dialogWaiting.component.html',
  styleUrls: ['./dialogWaiting.component.css']
})
export class DialogWaitingComponent {

  constructor(public data:DataService) {}

}
