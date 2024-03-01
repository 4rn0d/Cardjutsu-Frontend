import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  dialogIsOpen: boolean = false;

  closeDialog(timeout: number){
    clearTimeout(timeout)
    this.dialogIsOpen = false;
    console.log(this.dialogIsOpen)
  }

  openDialog(){
    this.dialogIsOpen = true;
  }

}
