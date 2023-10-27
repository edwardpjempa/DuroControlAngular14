import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { Utils } from '../../editor/helpers/utils'

@Component({
  selector: 'app-shadow-picker',
  templateUrl: './shadow-picker.component.html',
  styleUrls: ['./shadow-picker.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class ShadowPickerComponent implements OnInit {

    shadowData: any = {h_offset: 5, v_offset: 5, blur: 10, spread: 0, color: "#000000"}

    @Input() shadowInputData: string = "5px 5px 10px 0px #000000";
    @Input() suffixData: any;

    @Output() shadowOutput: EventEmitter<any> = new EventEmitter(true);
    @Output() onEdition: EventEmitter<any> = new EventEmitter(true);

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges) {

        let tempShadowData = changes['shadowInputData'].currentValue.split(" ", 5);

        this.shadowData.h_offset = parseInt(tempShadowData[0].replace("px", ""))
        this.shadowData.v_offset = parseInt(tempShadowData[1].replace("px", ""))
        this.shadowData.blur = parseInt(tempShadowData[2].replace("px", ""))
        this.shadowData.spread = parseInt(tempShadowData[3].replace("px", ""))
        this.shadowData.color = tempShadowData[4]
        //console.log(this.shadowData)
    }

    onParamChange(){
        let dataOut = this.shadowData.h_offset + "px " + this.shadowData.v_offset + "px " + this.shadowData.blur + "px " + this.shadowData.spread + "px " + this.shadowData.color
        //console.log(dataOut)

        this.shadowOutput.emit(dataOut);
    }
}