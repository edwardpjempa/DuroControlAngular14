import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewEncapsulation, ViewChild } from "@angular/core";
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
import { Inject } from '@angular/core';

@Component({
    selector: "properties-function-modal",
    templateUrl: "./propertiesFunctionModal.component.html",
    styleUrls: ["./propertiesFunctionModal.component.scss"],
})
export class propertiesFunctionModal implements OnInit {
    show = false
    help:any = {
        'if': "if(tag: Tag, trueEvent: Text|Number|Tag, falseEvent: Text|Number|Tag)",
        'Borders': 'if(conditional, "borderType borderHexColor borderWidth", "borderType borderHexColor borderWidth")\nblink(conditional, id: Text, interval_ms:Number, "borderType borderHexColor borderWidth", "borderType borderHexColor borderWidth")',
        'Background Color': 'if(conditional, trueHexColor:Text, falseHexColor:Text)\nblink(conditional, id: Text, interval_ms:Number, hexColor:Text, secondhexColor:Text)\n__passedVar__',
        'Text Color': 'if(conditional, trueHexColor:Text, falseHexColor:Text)\nblink(conditional, id: Text, interval_ms:Number, hexColor:Text, secondhexColor:Text)',
        'Text': "tag\nif(conditional, true:Text|Variable, false:Text|Variable)\ntoFixed(tag, precisionDigit:Number)\npassedVariable:Variable",
        "Visibility": "conditional\npassedVariable:Variable",
        "Click": "writeTag(tag:Text, value:Text|Number)\nwriteTagIf(conditional, tag:Text, trueValue:Text|Number)\nwriteTagIfElse(conditional, tag:Text, trueValue:Text|Number, falseValue:Text|Number)\nwriteTagOnIncrement(tag:Text, minValue:Number, maxValue:Number, incrementValue:Number)\nblink(conditional, id:Text, interval_ms:Number, hexColor:Text, secondHexColor:Text)\nopenDialog(view:Text, style:Text, variable:Text, value:Text|Function)\nopenDialogIf(conditional, view:Text, style:Text, variable:Text, value:Text)\ncloseDialog()\nrefresh()\nfollowLink(view:Text)\nfollowLinkIf(conditional, view:Text)\nfollowLinkIfElse(conditional, view:Text, view:Text)"
    }
    
    helpExample:any = [
        [["if(numberTag, 'true', 'false')",  "if(numberTag, 1, 0)",  "if(tag, newTag, newTag2)"]],
        [['if(numberTag == 1, "solid #000000 2px", "solid #00fe00 2px")', 'if(textTag == "", "solid #000000 2px", "solid #00fe00 2px")'], ['blink(1 == 1, "blinkID", 1000, "solid #000000 2px", "solid #00fe00 2px")']],
        [['if(textTag == "tag", "#ffffff", "#000000")', 'if(textTag == "example", "#000000")', 'if(numberTag == 2, "#ffffff", "#000000")', 'if(numberTag == 2, __passedVar__, __passedVar2__)'], ['blink(1 == 1, "blinkID", 1000, "#000000", "#00fe00")'], ['__passedVar__', 'if(numberTag == 2, __passedVar__)']],
        [['if(textTag == "tag", "#ffffff", "#000000")', 'if(numberTag == 100, "#ffffff", "#000000")'], ['blink(1 == 1, "blinkID", 1000, "#000000", "#00fe00")']],
        [['tag'], ['if(1 == 1, "True", "False")', 'if(1 == 1, __passedVar__, __passedVar2__)', 'if(1 == 1, __passedVar__, "False")'], ['toFixed(tag, 2)'], ['__passedVar__', '__passedVariable__']],
        [['numberTag == 1', 'numberTag'], ['__passedVar__', '__passedVariable__']],
        [['writeTag("textTag", "1")', 'writeTag("numberTag", 1)'],
         ['writeTagIf(1 == 1, "textTag", "1")', 'writeTagIf(1 == 1, "example",)'],
         ['writeTagIfElse(tag == "tag Value", "exampleTextTag", "TrueValue", "FalseValue")'],
         ['writeTagOnIncrement("numberTag", 1, 100, 1)'],
         ['blink(1 == 1, "blinkID", 1000, "#000000", "#ffffff")'],
         ['openDialog("view2", "", "passingTextVarEx", "text", "passingFunctionVarEx", "writeTag(\'TextTag\', \'valueEx\')"'],
         ['openDialogIf(conditional, "view2", "", "passingTextVarEx", "text", "passingFunctionVarEx", "writeTag(\'TextTag\', \'valueEx\')"'],
         ['closeDialog()'],
         ['refresh()'],
         ['followLink("exampleView")'],
         ['followLinkIf(1 == 1, "exampleView")'],
         ['followLinkIfElse(1 == 1, "exampleView", "exampleView2")']],

    ]
    helpindex = 1
    i = 0
    timer: any
    example = 0
    inputValue: string = '';
    ex = 0

    constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<propertiesFunctionModal>){
        dialogRef.beforeClosed().subscribe(
            result => dialogRef.close(this.inputValue.replace('/\n/g', '+'))); 
    }

    ngOnInit(){
        this.example = 0
        this.inputValue = this.data['data'].replace(/\+/g, '\n')
    }

    ngAfterViewChecked(){
        this.data['data'] = this.inputValue
    }
   
   openDialog = () => {
        if(this.show == true){
            this.show = false
            this.example = 0
            this.ex = 0
        }
        else{
            this.show = true
            this.listFunctions()
            
        }
        this.showExample()
    }

    showExample(){
        this.timer = setTimeout(()=> {
            document.getElementById("additionalHelp")!.innerHTML = ""
            this.typeText(performance.now(), 0)
        },10)
    }

    listFunctions(){
        setTimeout(()=> {
            for (const [index, [key, value]] of Object.entries(Object.entries(this.help))) {
                if (this.data['type'] == key) {
                    let arr = this.help[key].split('\n')
                    for(var i = 0; i < arr.length; i++){
                        var span = document.createElement('span')
                        span.id = String(i)
                        span.addEventListener('click', () => this.clickOnLine)
                        span.style.display = 'block'
                        if(i % 2 == 0){
                            span.style.backgroundColor = '#a8abb6'
                        }else{
                            span.style.backgroundColor = '#e3e4e7'
                        }
                        span.innerHTML = arr[i]
                        document.getElementById('help')!.appendChild(span)
                        this.helpindex = Number(index)
                    }
                }
            }
        })
    }

    typeText(startTime:any, index:any) {
        const currentTime = performance.now();
        if (index <= this.helpExample[this.helpindex][this.example][this.ex].length) {
            const elapsed = currentTime - startTime;
            const charIndex = Math.floor(elapsed / 100); // Adjust typing speed here
            document.getElementById("example")!.innerHTML = this.helpExample[this.helpindex][this.example][this.ex].slice(0, charIndex)
            requestAnimationFrame(() => {
                this.typeText(startTime, charIndex);
            });
        }
    }

    anotherExample(){
        if(this.ex < this.helpExample[this.helpindex][this.example].length-1){
            this.ex = this.ex + 1
        }
        else{
            this.ex = 0
        }
        this.showExample()
    }

    clickOnLine(e:any){
        if(e.target.id != this.example){
            this.ex = 0
        }
        else if(this.ex < this.helpExample[this.helpindex][this.example].length-1){
            this.ex = this.ex + 1
        }
        else{
            this.ex = 0
        }
        let id = e.target.id
        this.example = Number(id)
        this.typeText(performance.now(), 0)
    }
}

