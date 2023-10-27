import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav-resize',
  templateUrl: './sidenav-resize.component.html',
  styleUrls: ['./sidenav-resize.component.css']
})

export class SidenavResizeComponent implements OnInit {
   md: any;
   @ViewChild("dragger", { static: false }) dragger!: ElementRef;
   @Output() resized = new EventEmitter();
   @Output() onResize = new EventEmitter();

   mouseMoveSubscription!: Subscription;
   mouseUpSubscription!: Subscription;
   moving = false;
   width = 370;

  constructor() {}

   ngOnInit(): void {}

   onMouseDown(e:any) {
      this.md = {e,
         offsetLeft:  this.dragger.nativeElement.offsetLeft,
         offsetTop:   this.dragger.nativeElement.offsetTop,
         originalX: e.clientX,
         originalY: e.clientY,
         originalW: this.width
      };
      this.moving = true;
      this.mouseMoveSubscription = fromEvent(document, 'mousemove').subscribe(e => { this.onMouseMove(e) });
      this.mouseUpSubscription = fromEvent(document, 'mouseup').subscribe(e => { this.onMouseUp(e) });
   }  

   ngOnDestroy() {
      this.mouseMoveSubscription.unsubscribe();
      this.mouseUpSubscription.unsubscribe();
    }

   onMouseUp(e:any) {
      this.moving = false;
      this.mouseMoveSubscription.unsubscribe();
      this.mouseUpSubscription.unsubscribe();
      this.resized.emit();
   }  

   onMouseMove(e:any) {
      if (this.moving) {
         var delta = {x: e.clientX - this.md.e.clientX,
         y: e.clientY - this.md.e.clientY};
         this.width =  this.md.originalW - delta.x ;  
         this.onResize.emit(this.width)
      }
   }  

   onMouseOut(e:any) {
      if (this.moving) {
         this.moving = false;
         this.resized.emit();
      }
   }  
}
