import { Component,Input, Output, EventEmitter, ViewChild, TemplateRef,ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ctl-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class InputComponent  {

  @Input() inputConfig: any;
  @Output() inputEmt: EventEmitter<string> = new EventEmitter<string>();
  
    height= 500

  constructor() {}

  ngAfterViewInit() {}

  onBtnClick(id:any) {
    var element:any = document.getElementById(id)
    console.log(element)
    this.inputEmt.emit(JSON.stringify(
      { offsets: 
        {height: element.offsetHeight, width: element.offsetWidth , left: element.offsetLeft, top: element.offsetTop},
        id: id, style:{zIndex: element.style.zIndex}
      })
    );
  }  
}