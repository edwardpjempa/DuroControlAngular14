import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DbDataService } from 'src/app/db-data.service';

@Component({
   selector: 'app-database-view-row',
   templateUrl: './database-view-row.component.html',
   styleUrls: ['./database-view-row.component.css']
})
export class DatabaseViewRowComponent implements OnInit {



   @Input() colwidths!: number[];
   @Input() tagValues: any;
   @Input() treenode: any;
   @ViewChild('editinput') input:any;

   //   Object = Object;

   showChildren = false;
   selected = false;

   editMode = false;
   edittedValue = "";

   @Input() dbRowData: any;
   @Input() dbRowName: any;
   @Input() gap!: string[];
   @Input() dbRowValue: any;


   @Output() clicked = new EventEmitter<any>();
   @Output() checkbox = new EventEmitter<any>();

   @Output() treeChanged = new EventEmitter<any>();

   constructor(public dbDataService: DbDataService) { }

   ngOnInit(): void {
   }

   toggleNode() {
      this.treenode.showChildren = !this.treenode.showChildren
      this.treeChanged.emit();
   }

   startedit() {
      if (this.treenode.editable === true) {
         console.log("Start Edit Requested");
         if (this.treenode.dataType != 'Folder') {
            console.log("***** This cell can be edited *****")
            this.editMode = true;
            this.edittedValue = this.tagValues[this.gap.join('.')];
            setTimeout(() => { // this will make the execution after the above boolean has changed
               this.input.nativeElement.focus();
               this.input.nativeElement.select();
            }, 0);
         }
      }else{
         console.log("Edition denied");
      }
   }

   canceledit() {
      this.editMode = false;
      console.log("Edition Cancelled");
   }
   changededit() {
      this.dbDataService.modifyTagValue(this.gap.join('.'),this.input.nativeElement.value)
      this.editMode = false;
      console.log("++++++ Changed");

   }

   drag(event: any,gap: string[]){
      console.log(event)
      event.dataTransfer.setData("text", gap.join('.'));
   }
}