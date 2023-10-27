import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { Utils } from './../../editor/helpers/utils'

@Component({
  selector: 'app-border-picker',
  templateUrl: './border-picker.component.html',
  styleUrls: ['./border-picker.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class BorderPickerComponent implements OnInit {

    borderData: any = {style:"none", color: "#000000", width: 0}

    @Input() borderInputData: string = "none #000000 0px";

    @Input() formOptions: any

    @Input() suffixData: any;

    @Output() bordersOutput: EventEmitter<any> = new EventEmitter(true);
    @Output() onEdition: EventEmitter<any> = new EventEmitter(true);

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges) {

        let tempBorderData = changes['borderInputData'].currentValue.split(" ", 3);

        this.borderData.style = tempBorderData[0]
        this.borderData.color = tempBorderData[1]
        this.borderData.width = parseInt(tempBorderData[2].replace("px", ""))
        //console.log(this.borderData)
    }

    onParamChange(){
        let dataOut = this.borderData.style + " " + this.borderData.color + " " + this.borderData.width + "px"
        //console.log(dataOut)

        this.bordersOutput.emit(dataOut);
    }
}