import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, HostListener, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})
export class ColorSliderComponent implements AfterViewInit {
    @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

    @Input() hue: any;

    @Output() color: EventEmitter<any> = new EventEmitter();

    private hue_: any
    private ctx!: CanvasRenderingContext2D;
    private mousedown: boolean = false;
    private selectedWidth!: number;

    ngAfterViewInit() {
        this.draw();
    }

    ngOnChanges(changes: SimpleChanges) {
        //console.log(changes)

        //if(this.canvas) this.draw();

        //if(this.selectedWidth) this.selectedWidth = undefined

        this.hue_ = changes['hue'].currentValue
    }

    draw() {
        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d')!;
        }
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        this.ctx.clearRect(0, 0, width, height);

        const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
        gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
        gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
        gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
        gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

        this.ctx.beginPath();
        this.ctx.rect(0, 0, width, height);

        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.closePath();

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
        this.draw();
        this.emitColor(evt.offsetX, evt.offsetY);
    }

    onMouseMove(evt: MouseEvent) {
        if (this.mousedown) {
            this.selectedWidth = evt.offsetX;
            this.draw();
            this.emitColor(evt.offsetX, evt.offsetY);
        }
    }

    emitColor(x: number, y: number) {
        const rgbaColor = this.getColorAtPosition(x, y);
        this.color.emit(rgbaColor);
    }

    getColorAtPosition(x: number, y: number) {
        const imageData = this.ctx.getImageData(x, y, 1, 1).data;
        //return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';

        return [imageData[0], imageData[1], imageData[2], this.hue_[3]]
    }
}