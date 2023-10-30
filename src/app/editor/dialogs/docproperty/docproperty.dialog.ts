import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ViewProperties } from './../../../models/components'

@Component({
    selector: 'dialog-doc-property',
    templateUrl: 'docproperty.dialog.html',
    styleUrls: ['./docproperty.dialog.scss'],
    encapsulation : ViewEncapsulation.None
})
export class DialogDocProperty implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<DialogDocProperty>,
        @Inject(MAT_DIALOG_DATA) public data: any) {}

    viewStyleProperties:any = new ViewProperties();
    
    vOffest = 0; hOffest = 0; spread = 0; blur = 0; shadowColor = "#000000"

    ngOnInit(){
        console.log(this.data)
        for(var property in this.data.style){
            if(this.viewStyleProperties.hasOwnProperty(property)){
                this.viewStyleProperties[property]['data'] = this.data.style[property]
            }
        }

        //console.log(this.viewStyleProperties)

        if(this.viewStyleProperties['boxShadow']['data'] !== "" && this.viewStyleProperties['boxShadow']['data'] !== "none"){
            this.viewStyleProperties['boxShadow']['data'].split(" ", 5)
            this.vOffest = this.viewStyleProperties['boxShadow']['data'].split(" ", 5)[0].replace("px","")
            this.hOffest = this.viewStyleProperties['boxShadow']['data'].split(" ", 5)[1].replace("px","")
            this.spread = this.viewStyleProperties['boxShadow']['data'].split(" ", 5)[2].replace("px","")
            this.blur = this.viewStyleProperties['boxShadow']['data'].split(" ", 5)[3].replace("px","")
            this.shadowColor = this.viewStyleProperties['boxShadow']['data'].split(" ", 5)[4]
        }
    }

    onNoClick(): void {

        this.dialogRef.close();
    }

    AlignActive(data:any, align:any){
        if(data === align){
            return true
        }else{
            return false
        }
    }

    trim(s:any) {
        return s.charAt(0) == "#" ? s.substring(1, 9) : s; //7
    }

    getTransparency(){

        if(this.viewStyleProperties.hasOwnProperty("backgroundColor")){
            let transparency: any = ((parseInt(this.trim(this.viewStyleProperties.backgroundColor.data).substring(6, 8), 16)*1)/255).toFixed(2)

            if(transparency >= 0 && transparency <= 0.5){

                return true
            }else{
                return false
            }
        }
        return false
    }

    onOkClick() {
        for(var property in this.data.style){
            if(!this.viewStyleProperties.hasOwnProperty(property)){
                delete this.data.style[property]
            }
        }
        if(this.data.style !== undefined){
            for (var property in this.viewStyleProperties){
                if(property === "boxShadow"){
                    this.data.style[property] = this.vOffest + "px " + this.hOffest + "px " + this.spread + "px " + this.blur + "px " + this.shadowColor
                }else{
                    this.data.style[property] = this.viewStyleProperties[property]['data']
                    //console.log(this.viewStyleProperties[property]['data'])
                }
            }
        }
    }
}