import {Component, OnInit} from '@angular/core';
import {Message} from "../../models/models";
import {MessageService} from "../../services/messageservice";
import {MatchService} from "../../services/match.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{

  constructor(public messageService:MessageService, public matchService:MatchService) {
  }
listMessage:Message[] = []
  message: string = '';
  ngOnInit(): void {

  }

  async envoyerMessageAuService(message: string) {
    await this.messageService.envoyerMessage(message);
    this.message = "";
  }
}
