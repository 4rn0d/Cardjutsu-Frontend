import { Component } from '@angular/core';
import {HubService} from "../../services/hub.service";

@Component({
  selector: 'app-dialogWaiting',
  templateUrl: './dialogWaiting.component.html',
  styleUrls: ['./dialogWaiting.component.css']
})
export class DialogWaitingComponent {

  constructor(public hubService: HubService) {}

}
