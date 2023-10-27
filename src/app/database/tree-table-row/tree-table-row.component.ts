import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
   selector: 'app-tree-table-row',
   templateUrl: './tree-table-row.component.html',
   styleUrls: ['./tree-table-row.component.css']
})

export class TreeTableRowComponent implements OnInit {
   @Input() dbRowData: any;
   @Input() dbRowName: any;
   @Input() dbRowFullName: any;
   @Input() gap!: string[];
   @Input() dbRowValue: any;
   @Input() list: any;
   @Input() selectedTag!: string;

   @Output() clicked = new EventEmitter<any>();
   @Output() checkbox = new EventEmitter<any>();
   @Output() tagrenamed = new EventEmitter<any>();

   Object = Object;

   showChildren = false;
   selected = false;
   edittingName = false;
   edittingComment = false;
   edittingType = false;
   edittingDim = false;
   edittingDeadband = false;
   edittingValue = false;

   constructor() { }

   ngOnInit() {}

   async checkboxClick(path:any) {
      this.selected = !this.selected
      if(this.list == undefined){
         return
      }
      for(var i = 0; i < this.list.length; i++){
         if(path == this.list[i]){
            this.list.splice(i,1)
            return
         }
      }
      this.list.push(path)
   }

   rowclicked(clickedFolderOrTag:any) {
      if(!clickedFolderOrTag.hasOwnProperty("config")) clickedFolderOrTag["config"] = {}
      if (!clickedFolderOrTag["config"].hasOwnProperty("hidden")){
         clickedFolderOrTag["config"]["hidden"] = false
      }
      if (!clickedFolderOrTag["config"].hasOwnProperty("editable")){
         clickedFolderOrTag["config"]["editable"] = true
      }
      if (this.selectedTag == this.dbRowFullName) {
         this.clicked.emit('');
      } else {
         this.clicked.emit(this.dbRowFullName);
      }
   }

   onNameEdit(inputNameEdit:any){
      this.edittingName=true
      setTimeout(() => {
         inputNameEdit.focus()
      }, 400);
   }

   startEdittingName(newValue:any) {}

   finishEdittingName(newValue:any) {
      this.tagrenamed.emit({ oldName: this.dbRowName, newName: newValue });
      this.edittingName = false;
   }

   startEdittingComment(newValue:any) {}

   finishEdittingComment(newValue:any) {
      this.dbRowData.comment = newValue;
      this.edittingComment = false;
   }

   onCommentEdit(inputCommentEdit:any){
      this.edittingComment=true
      setTimeout(() => {
         inputCommentEdit.focus()
      }, 100);
   }

   renameTag(newAndOldValue:any) {
      if (newAndOldValue.newName != newAndOldValue.oldName) {
         this.dbRowData.children[newAndOldValue.newName] = this.dbRowData.children[newAndOldValue.oldName];
         delete (this.dbRowData.children[newAndOldValue.oldName]);   
      }
   }

   editDim(newDimension:any) {
      this.dbRowData.arraydim = parseInt(newDimension); 
      if (this.dbRowData.arraydim <=0) this.dbRowData.arraydim = 1;
      this.edittingDim=false;
   }

   onDimEdit(inputDimEdit:any){
      this.edittingDim=true
      setTimeout(() => {
         inputDimEdit.focus()
      }, 100);
   }

   startEdittingDeadband(newValue:any) {}

   finishEdittingDeadband(newValue:any) {
      if (newValue !== ""){
         this.dbRowData.config.deadband = parseFloat(newValue);
      }
      this.edittingDeadband = false;
   }

   onDeadbandEdit(inputDeadbandEdit:any){
      this.edittingDeadband=true
      setTimeout(() => {
         inputDeadbandEdit.focus()
      }, 100);
   }

   startEdittingValue(newValue:any) {}

   finishEdittingValue(newValue:any) {
      if (this.dbRowData.datatype === "Number"){
         this.dbRowData.value = parseFloat(newValue);
      }else{
         this.dbRowData.value = newValue;
      }
      this.edittingValue = false;
   }

   onValueEdit(inputValueEdit:any){
      this.edittingValue=true
      setTimeout(() => {
         inputValueEdit.focus()
      }, 100);
   }

   finishEdittingType(newValue:any) {
      this.edittingType = false;
   }

   onTypeEdit(inputTypeEdit:any){
      this.edittingType=true
      setTimeout(() => {
         inputTypeEdit.focus()
      }, 100);
   }

   changed(event:any, rowValue:any){
      if(event == 'Text'){
         console.log('here', event)
         rowValue['value'] = ""
      }else{
         rowValue['value'] = 0
      }
   }
}


