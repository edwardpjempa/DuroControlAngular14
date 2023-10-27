import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { Utils } from './../../editor/helpers/utils'

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class ColorPickerComponent implements OnInit {
    @Input() colorInput: any;
  
    @Output() colorOutput: EventEmitter<any> = new EventEmitter(true);


    @Output() onEdition: EventEmitter<any> = new EventEmitter(true);

    menuOpened = false

    public hue: any = [255,255,255,1]//= "rgba(100,242,20,1)"
    public color!: string;

    public manualChange: boolean = false

    colors = [];
    inicial = "#FFD600";

    colorFieldType = "hex"

    hex_: string = "ffffff"
    r!: number
    g!: number
    b!: number
    a!: number

    ngOnInit() {

        //this.colors = this.generateColor("#00000", this.inicial, 5);
    }

    ngOnChanges(changes: SimpleChanges) {
        //console.log(changes.colorInput.currentValue)

        if(!this.menuOpened) this.hue = this.convertToRGB(changes['colorInput'].currentValue)
        this.manualChange = false
    }

    menuIsOpened(){
        this.menuOpened = true
        this.onEdition.emit(true)
    }
    menuIsClosed(){
        this.menuOpened = false
        this.onEdition.emit(false)
    }

    hex(c: any) {
        var s = "0123456789abcdef";
        var i = parseInt(c);
        if (i == 0 || isNaN(i)) return "00";
        i = Math.round(Math.min(Math.max(0, i), 255));
        return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
    }

    /* Convert an RGB triplet to a hex string */
    convertToHex(rgb: any[]) {
        if(rgb[3] === 1){
            return "#" + this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]);
        }else{
            return "#" + this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]) + this.hex(((rgb[3]*255)/1));
        }
        
    }

    /* Remove '#' in color hex string */
    trim(s: string) {
        return s.charAt(0) == "#" ? s.substring(1, 9) : s; //7
    }

    /* Convert a hex string to an RGB triplet */
    convertToRGB(hex: any) {
        var colorRGB = [];
        let hex_ = hex

        hex_ = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m: any, r: string, g: string, b: string) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map((x: string) => parseInt(x, 16))

        //console.log(hex_)
        //colorRGB[0] = parseInt(this.trim(hex).substring(0, 2), 16);
        //colorRGB[1] = parseInt(this.trim(hex).substring(2, 4), 16);
        //colorRGB[2] = parseInt(this.trim(hex).substring(4, 6), 16);

        colorRGB[0] = hex_[0];
        colorRGB[1] = hex_[1];
        colorRGB[2] = hex_[2];
        colorRGB[3] = ((parseInt(this.trim(hex).substring(6, 8), 16)*1)/255).toFixed(2);
        if (isNaN(colorRGB[3])) colorRGB[3] = 1;
        //console.log(colorRGB)
        return colorRGB;
    }

    generateColor(colorStart: any, colorEnd: any, colorCount: any) {
        // The beginning of your gradient
        var start = this.convertToRGB(colorStart);

        // The end of your gradient
        var end = this.convertToRGB(colorEnd);

        // The number of colors to compute
        var len = colorCount;

        //Alpha blending amount
        var alpha = 0.1;

        var saida = [];

        for (let index = 0; index < len; index++) {
        var c = [];
        alpha += 1.0 / len;

        c[0] = start[0] * alpha + (1 - alpha) * end[0];
        c[1] = start[1] * alpha + (1 - alpha) * end[1];
        c[2] = start[2] * alpha + (1 - alpha) * end[2];

        saida.push(this.convertToHex(c));
        }
        return saida;
    }

    fieldType(){
        if(this.colorFieldType === "hex"){
            this.colorFieldType = "rgb"
        }else if(this.colorFieldType === "rgb"){
            this.colorFieldType = "hex"
        }
    }

    onSliColorChange(event: any){
        //console.log(event)
        this.hue = event;
        this.manualChange = false
        //this.color = 'rgba(' + event[0] + ',' + event[1] + ',' + event[2] + ',1)';
        //this.r = event[0]
        //this.g = event[1]
        //this.b = event[2]
        //this.hex_ = this.convertToHex(event)
    }

    onSliTranspChange(event: any){
        //console.log(event)
        this.hue[3] = Number(event)
        this.hue = Utils.clone(this.hue)

        this.manualChange = false
    }

    onPltColorChange(event: any[]){
        this.color = 'rgba(' + event[0] + ',' + event[1] + ',' + event[2] + ',' + event[3] + ')';
        this.r = event[0]
        this.g = event[1]
        this.b = event[2]
        this.a = event[3]
        this.hex_ = this.convertToHex(event)
        if(this.menuOpened )this.colorOutput.emit(this.hex_);

        this.manualChange = false
    }


    Rchange(event: any){
        //console.log(event.target.value)
        if(event.target.value >= 255){
            this.hue[0] = Number(255)
            this.hue = Utils.clone(this.hue)
        }else if (event.target.value <= 0){
            this.hue[0] = Number(0)
            this.hue = Utils.clone(this.hue)
        }else{
            this.hue[0] = Number(this.r)
            this.hue = Utils.clone(this.hue)
        }
        this.manualChange = true
    }

    Gchange(event: any){
        //console.log(event.target.value)
        if(event.target.value >= 255){
            this.hue[1] = Number(255)
            this.hue = Utils.clone(this.hue)
        }else if(event.target.value <= 0){
            this.hue[1] = Number(0)
            this.hue = Utils.clone(this.hue)
        }else{
            this.hue[1] = Number(this.g)
            this.hue = Utils.clone(this.hue)
        }
        this.manualChange = true
    }

    Bchange(event: any){
        //console.log(event.target.value)
        if(event.target.value >= 255){
            this.hue[2] = Number(255)
            this.hue = Utils.clone(this.hue)
        }else if(event.target.value <= 0){
            this.hue[2] = Number(0)
            this.hue = Utils.clone(this.hue)
        }else{
            this.hue[2] = Number(this.b)
            this.hue = Utils.clone(this.hue)
        }
        this.manualChange = true
    }

    Achange(event: any){
        //console.log(event.target.value)
         if(event.target.value >= 1){
            this.hue[3] = Number(1)
            this.hue = Utils.clone(this.hue)
        }else if(event.target.value <= 0){
            this.hue[3] = Number(0)
            this.hue = Utils.clone(this.hue)
        }else{
            this.hue[3] = Number(this.a)
            this.hue = Utils.clone(this.hue)
        }
        this.manualChange = true
    }

    hexChange(event: any){
        //console.log(event.target.value)
        this.hue = this.convertToRGB(event.target.value)
        //this.color = 'rgba(' + this.hue[0] + ',' + this.hue[1] + ',' + this.hue[2] + ',1)';
        //this.r = this.hue[0]
        //this.g = this.hue[1]
        //this.b = this.hue[2]

        this.manualChange = true
    }

    getContrastYIQ(hexcolor: string){
        //console.log(hexcolor)
        hexcolor = hexcolor.replace("#", "");
        var r = parseInt(hexcolor.substr(0,2),16);
        var g = parseInt(hexcolor.substr(2,2),16);
        var b = parseInt(hexcolor.substr(4,2),16);
        var a = (parseInt(hexcolor.substr(6,2),16)*1)/255;
        var yiq = ((r*299)+(g*587)+(b*114))/1000;

        if(a >= 0 && a < 0.3){
            return 'black'
        }else{
            return (yiq >= 128) ? 'black' : 'white';
        }
    }
}