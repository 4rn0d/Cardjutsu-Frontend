import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message, Player} from "../../models/models";
import {MessageService} from "../../services/messageservice";
import {MatchService} from "../../services/match.service";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  constructor(public messageService:MessageService, public matchService:MatchService, public api:ApiService) {
  }
  useremail:string = "";
  message: string = '';




  async ngOnInit(): Promise<void> {
    console.log(this.matchService.listMessage)
    this.useremail = await this.api.getUsername();
    console.log(this.useremail);
    await this.messageService.joueurRejoin();
    this.messageService.getmessage()


    //list de mute

  }

  ngOnDestroy() {
    console.log("parti")
   this.messageService.joueurQuitte()
  }

  async envoyerMessageAuService(message: string) {
    if (message != "")
    {
      message.trimEnd();
      message.trimStart();
      await this.messageService.envoyerMessage(message);
      this.message = "";
    }

  }

  voirsiMute(player:Player){

    for (let listMutedPlayerKey of this.matchService.listMutedPlayer) {
      if (player.name == listMutedPlayerKey.name) {
        return true;
        console.log(true)
      }

    }
    return false

  }


}
