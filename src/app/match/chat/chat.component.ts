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

  @ViewChild('chatContainer') chatContainer: ElementRef | undefined;

  scrollToBottom(): void {
    try {
      console.log(this.chatContainer)
      this.chatContainer!.nativeElement.scrollTop = this.chatContainer!.nativeElement.scrollHeight;


    } catch(err) {
      console.log(err)
    }
  }

  async ngOnInit(): Promise<void> {

    this.useremail = await this.api.getUsername();
    console.log(this.useremail);
    await this.messageService.joueurRejoin();
    this.messageService.getmessage();
    setInterval(() => {
      this.scrollToBottom();
    }, 5000);

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

  isPlayer(message:any){

   if(message.player.isPlayer==false){
     return false
    }else{
     return true;
   }
  }

}
