import { Component, OnInit, HostBinding } from '@angular/core';
import { HmiComponent } from '../hmi-component';


@Component({
  selector: 'app-hmi-c-numeric-input',
  templateUrl: './hmi-c-numeric-input.component.html',
  styleUrls: ['./hmi-c-numeric-input.component.css']
})
export class HmiCNumericInputComponent extends HmiComponent implements OnInit {

  allClear = true

  keyboardFunctionsChars = [
    ['AC']
  ]

  keyboardChars = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['.', '0', '←'],
  ]

  lastInput: string = "0"
  cursorPosition!: number
  secureInput!: boolean
  lastInputStard!: string

  constructor() {
    super();
   }

  ngOnInit(): void {
    this.lastInput = this.animationdata.text
    if(this.config.secureInput === 'true'){
      this.secureInput = true
    }else{
      this.secureInput = false
    }
  }

  enterCharacter(char: string) {
    console.log(char)
    if(char === "←"){
      this.lastInput = this.lastInput.slice(0, -1)
      if (this.lastInput === "") {
        this.lastInput = ""
        this.allClear = true
      }
    }else if(char === "AC"){

      this.lastInput = ""
      this.allClear = true

    }else{
      if(this.allClear){
        this.lastInput = ""
        this.lastInput += char
        this.allClear = false
      }else{
        this.lastInput += char
      }
      
    }
    this.lastInputStard = ""
    for(var i = 0; i < this.lastInput.length; i++){
      this.lastInputStard = this.lastInputStard + "*"
    }
  }

  dispStyle(){
    let style:any = {}

    if(this.config.style.hasOwnProperty("dispBkgdColor")){
      style["backgroundColor"] = this.config.style["dispBkgdColor"]
    }else{
      style["backgroundColor"] = "#adadad"
    }

    if(this.config.style.hasOwnProperty("dispTxtColor")){
      style["color"] = this.config.style["dispTxtColor"]
    }

    return style
  }
}


