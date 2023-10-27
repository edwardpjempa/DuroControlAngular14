import { EventEmitter, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Component({
   selector: 'app-database-view-header',
   templateUrl: './database-view-header.component.html',
   styleUrls: ['./database-view-header.component.css']

})
export class DatabaseViewHeaderComponent implements OnInit {
   @Input() treedata: any;
   @Input() headers!: string[];
   @Input() tagValues: any;
   @Input() data: any;
   @Input() values: any;
   @Input() header!: boolean;
   @Input() viewMode!: boolean;
   @Output() checkbox = new EventEmitter<any>();
   @Output() treeChanged = new EventEmitter<any>();
   public colwidths: number[] = [190];
   mouseMoveSubscription!: Subscription;
   mouseUpSubscription!: Subscription;
   private draggingCol = -1;
   private md: any;
   Object = Object;

   constructor() { }

   ngOnInit() {
   }

   checkSelected(event:any) {
      this.checkbox.emit(event);
   }

   cellClicked(event:any) {
   }

   onMouseDown(e:any,colNumber:any) {
      this.md = {e,
            originalX: e.clientX,
            originalY: e.clientY,
            originalW: this.colwidths[colNumber]
           };
      this.draggingCol = colNumber;
      this.mouseMoveSubscription = fromEvent(document, 'mousemove').subscribe(e => { this.onMouseMove(e) });
      this.mouseUpSubscription = fromEvent(document, 'mouseup').subscribe(e => { this.onMouseUp(e) });
   }  

   onMouseUp(e:any) {
      this.draggingCol = -1;
      this.mouseMoveSubscription.unsubscribe();
      this.mouseUpSubscription.unsubscribe();
   }  

   onMouseDrag(e:any) {
   }

   onMouseMove(e:any) {
      if (this.draggingCol >=0) {
          var delta = {x: e.clientX - this.md.originalX, y: e.clientY - this.md.originalY};
             this.colwidths[this.draggingCol] = this.md.originalW + delta.x;  
      }
   }  

   onMouseOut(e:any) {
      if (this.draggingCol >=0) {
      }
      this.draggingCol = -1;
   }  
}

