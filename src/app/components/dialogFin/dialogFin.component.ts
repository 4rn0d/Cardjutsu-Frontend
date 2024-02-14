import {Component, Input} from '@angular/core';
import {Card} from "../../models/models";

@Component({
  selector: 'app-dialogFin',
  templateUrl: './dialogFin.component.html',
  styleUrls: ['./dialogFin.component.css']
})
export class DialogFinComponent {
  @Input() win:boolean = false;
}
