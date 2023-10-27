import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, SimpleChanges, OnChanges, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.scss']
})
export class ColorPaletteComponent implements AfterViewInit, OnChanges {
    @Input() hue: any;
    @Input() trackBy: any;

    @Output() color: EventEmitter<any> = new EventEmitter(true);

    @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

    private ctx!: CanvasRenderingContext2D;

    private mousedown: boolean = false;

    public selectedPosition!: { x: number; y: number };

    ngAfterViewInit() {
        this.draw();
    }

    draw() {
        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d')!;
        }
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        this.ctx.fillStyle = 'rgba(' + this.hue[0] + ',' + this.hue[1] + ',' + this.hue[2] + ',1)' || 'rgba(255,255,255,1)';
        this.ctx.fillRect(0, 0, width, height);

        const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0);
        whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
        whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

        this.ctx.fillStyle = whiteGrad;
        this.ctx.fillRect(0, 0, width, height);

        const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height);
        blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
        blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

        this.ctx.fillStyle = blackGrad;
        this.ctx.fillRect(0, 0, width, height);

        //console.log(this.selectedPosition)

        if (this.selectedPosition) {
            this.ctx.strokeStyle = 'white';
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(this.selectedPosition.x, this.selectedPosition.y, 10, 0, 2 * Math.PI);
            this.ctx.lineWidth = 5;
            this.ctx.stroke();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        //console.log(changes)

        const pos = this.selectedPosition;

        if (changes && changes.hasOwnProperty("trackBy")){
            if(changes['trackBy'].currentValue['manualChange']){

                if(pos) this.selectedPosition = {x: 0, y: 0}

                if(this.canvas) this.draw();

                this.color.emit([this.hue[0],this.hue[1],this.hue[2],this.hue[3]]);
            }else{
                if(this.canvas) this.draw();

                if (pos) {
                    this.color.emit(this.getColorAtPosition(pos.x, pos.y));
                }else{
                    this.color.emit([this.hue[0],this.hue[1],this.hue[2],this.hue[3]]);
                }
            }
        }   
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent) {
        this.mousedown = false;
    }

    onMouseDown(evt: MouseEvent) {
        this.mousedown = true;
        this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
        this.draw();
        this.color.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY));
    }

    onMouseMove(evt: MouseEvent) {
        if (this.mousedown) {
            this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
            this.draw();
            this.emitColor(evt.offsetX, evt.offsetY);
        }
    }

    emitColor(x: number, y: number) {
        const rgbaColor = this.getColorAtPosition(x, y);
        this.color.emit(rgbaColor);
        //console.log(rgbaColor)
    }

    getColorAtPosition(x: number, y: number) {
        const imageData = this.ctx.getImageData(x, y, 1, 1).data;
        //console.log(imageData)
        return [imageData[0], imageData[1], imageData[2], this.hue[3]]
        //return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    }
}