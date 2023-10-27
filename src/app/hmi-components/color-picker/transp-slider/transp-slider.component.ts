import { Component, ViewChild, ElementRef, AfterViewInit, Output, HostListener, EventEmitter, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-transp-slider',
  templateUrl: './transp-slider.component.html',
  styleUrls: ['./transp-slider.component.scss']
})
export class TranspSliderComponent implements AfterViewInit {
    @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

    @Input() color: any;

    @Output() transparency: EventEmitter<any> = new EventEmitter();

    public colorRBG!: string
    private color_: any
    private transpVal: number = 1
    private ctx!: CanvasRenderingContext2D;
    private mousedown: boolean = false;
    private selectedWidth!: number;

    ngAfterViewInit() {
        if(this.canvas){
            const width = this.canvas.nativeElement.width;
            this.selectedWidth = (this.color_[3]*width)/1
        }
        this.draw();
    }

    ngOnChanges(changes: SimpleChanges) {

        this.color_ = changes['color'].currentValue

        //this.colorRBG = 'rgba(' + this.color_[0] + ',' + this.color_[1] + ',' + this.color_[2] + ',1)';

        this.colorRBG = 'rgba(' + this.color_[0] + ',' + this.color_[1] + ',' + this.color_[2] + ',' + this.color_[3] + ')';

        if(this.canvas){
            const width = this.canvas.nativeElement.width;
            this.selectedWidth = (this.color_[3]*width)/1
            this.draw();
        }
       
    }

    draw() {
        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d')!;
        }
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        this.ctx.clearRect(0, 0, width, height);

        if (this.selectedWidth) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 5;
            this.ctx.rect(this.selectedWidth - 5, 0, 10, height);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent) {
        this.mousedown = false;
    }

    onMouseDown(evt: MouseEvent) {
        this.mousedown = true;
        this.selectedWidth = evt.offsetX;
        //console.log(this.selectedWidth)
        this.draw();
        let width = this.canvas.nativeElement.width;
        this.transpVal = this.selectedWidth*1/width;
        this.transparency.emit(this.transpVal.toFixed(2));
    }

    onMouseMove(evt: MouseEvent) {
        if (this.mousedown) {
            this.selectedWidth = evt.offsetX;
            //console.log(this.selectedWidth)
            this.draw();
            let width = this.canvas.nativeElement.width;
            this.transpVal = this.selectedWidth*1/width;
            this.transparency.emit(this.transpVal.toFixed(2));
        }
    }
}