import { Component,Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ctl-dropdown',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class SelectComponent  {

  @Input() dropdownConfig: any;
  @Output() dropdownEmt: EventEmitter<string> = new EventEmitter<string>();
  
  constructor() {}

  ngAfterViewInit() {}

  onBtnClick(id:any) {
    var element:any = document.getElementById(id)
    console.log(element)
    this.dropdownEmt.emit(JSON.stringify(
      { offsets: 
        {height: element.offsetHeight, width: element.offsetWidth , left: element.offsetLeft, top: element.offsetTop},
        id: id, style:{zIndex: element.style.zIndex}
      })
    );
  }  
}