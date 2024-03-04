import { Component } from '@angular/core';
import {DataService} from "../../services/data.service";
import {HubService} from "../../services/hub.service";

@Component({
  selector: 'app-dialogWaiting',
  templateUrl: './dialogWaiting.component.html',
  styleUrls: ['./dialogWaiting.component.css']
})
export class DialogWaitingComponent {

  constructor(public data:DataService, public hubService: HubService) {}

}
