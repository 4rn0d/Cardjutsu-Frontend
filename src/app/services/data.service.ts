import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  isToggled = true;
  index=-1
  states=[false,false,false]

  toggle() {
    this.isToggled = !this.isToggled;
  }

  animationStart()
  {
    this.states=[false,false,false]
    setTimeout(()=>{
      this.index=0
      this.states[0]=true;

    })
  }

  animationDone()
  {
    this.index++
    if (this.index<this.states.length)
      this.states[this.index]=true
  }
}
