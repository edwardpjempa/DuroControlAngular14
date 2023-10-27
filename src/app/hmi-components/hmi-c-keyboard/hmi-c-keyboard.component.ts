import { Component, OnInit, HostBinding } from '@angular/core';
import { HmiComponent } from '../hmi-component';


@Component({
  selector: 'app-hmi-c-keyboard',
  templateUrl: './hmi-c-keyboard.component.html',
  styleUrls: ['./hmi-c-keyboard.component.css']
})
export class HmiCKeyboardComponent extends HmiComponent implements OnInit {

  caretPos: number = 0;

  allClear = true
  capsLock = false
  shift = false

  keyboardFunctionsChars = [
    [' ']
  ]

  Chars = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  ]

  keyboardChars = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  ]

  keyboardChars_CAPS = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'],
  ]

  keyboardChars_Shift = [
    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', '"'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?'],
  ]

  keyboardChars_Shift1 = [
    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?'],
  ]

  lastInput: string = "0"
  cursorPosition!: number
  secureInput!: boolean
  lastInputStard!: string

  constructor() {
    super();
   }

  ngOnInit(): void {
    this.lastInput = this.animationdata.text ? this.animationdata.text : "";
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
      //if (this.lastInput === "") this.lastInput = "0"; this.allClear = true
    }else if(char === "AC"){

      this.lastInput = "0"
      this.allClear = true

    }else if(char === "caps"){

      if (this.capsLock){
        this.capsLock = false

        if (this.shift){
          this.Chars = this.keyboardChars_Shift
        }else{
          this.Chars = this.keyboardChars
        }

        
      }else{
        this.capsLock = true
        

        if (this.shift){

          this.Chars = this.keyboardChars_Shift1
        }else{
          this.Chars = this.keyboardChars_CAPS
        }
      }
    
      
    }else if(char === "shift"){

      if (this.shift){
        this.shift = false

        if (this.capsLock){
          this.Chars = this.keyboardChars_CAPS
        }else{
          this.Chars = this.keyboardChars
        }
        
      }else{
        this.shift = true
        

        if (this.capsLock){
          this.Chars = this.keyboardChars_Shift1
        }else{
          this.Chars = this.keyboardChars_Shift
        }
      }
    
      
    }else{
      if(this.allClear){
        this.lastInput = ""
        this.lastInput += char
        this.allClear = false
      }else{
        
        this.lastInput += char
        
      }
      //this.setCursor(5)
    }
    this.lastInputStard = ""
    for(var i = 0; i < this.lastInput.length; i++){
      this.lastInputStard = this.lastInputStard + "*"
    }
  }

  getSelectionCursor() {
    var text = window.getSelection()!.toString();
    var range = window.getSelection()!.getRangeAt(1);
    this.caretPos = range.startOffset;
    console.log(range);
    console.log(range.startContainer.textContent,
                range.startOffset,
                range.endOffset)
  }
  jumpCursor() {
    var range = window.getSelection()!.getRangeAt(1);
    var length = document.getElementById("text")!.textContent!.length;
    if (range.startOffset === 10 && length === 10) {
      this.setCaret()
    }
  }
  setCaret() {
    var element = document.getElementById("text")!;
    var range = document.createRange();  
    var node: any;   
    node = document.getElementById("text");  
    range.setStart(node.childNodes[0], 3);
    var sel = window.getSelection()!;
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    element.focus();    
  }


  setCursor(pos: any) {
    const editable = document.getElementById("text")!;
    var textNode = editable.childNodes[0].childNodes[0];
    console.log(textNode)
    let selection = window.getSelection()!;
    let range = document.createRange();
    range.setStart(textNode, pos);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
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