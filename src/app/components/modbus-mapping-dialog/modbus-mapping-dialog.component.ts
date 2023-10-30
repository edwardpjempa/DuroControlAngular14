import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DbDataService } from 'src/app/db-data.service';

enum DataType {
  EightBit,
  SixteenBit,
  ThirtyTwoBit
}

export class RegisterMapping {
  registers = new Array<any>();
  tags = new Array<any>();
  indices = new Array<any>();
  constructor(params?: Partial<RegisterMapping>){
    Object.assign(this, params);
  }
}

@Component({
  selector: 'app-modbus-mapping-dialog',
  templateUrl: './modbus-mapping-dialog.component.html',
  styleUrls: ['./modbus-mapping-dialog.component.css']
})

export class ModbusMappingDialogComponent implements OnInit {
  width: any;
  count: any;
  countPerRow = 8;
  tagPerRow = 8;
  numOfCols = 0;
  selectMode = false;
  mappingLists = [];
  tagSelectorControl = new FormControl();
  tagSelectorControl2 = new FormControl();

  filteredOptions!: Observable<any>;
  tagData: any;
  selectedTags = [];
  currentData: any;

  initialSelection = [];
  allowMultiSelect = true;

  model = new SelectionModel(true,);

  selection!: SelectionModel<any>;

  @ViewChild('menuTrigger') matMenuTrigger!: MatMenuTrigger

  constructor(public dbDataService: DbDataService, @Inject(MAT_DIALOG_DATA) public data: any) {}

  numOfMappingsPerGroup: any;
  numOfItems: any;
  numOfTagsPerColumn: any
  numOfColumns: any;
  columnList = new Array<any>();
  problemTag = ''
  status:any

  ngOnInit(): void {
    this.tagData = this.dbDataService.getTagNames();
    this.selection = new SelectionModel<any>(true, this.initialSelection);
    this.numOfTagsPerColumn = (this.data.dataType.includes('32')) ? 4 : 8;
    this.updateColumns();

    this.filteredOptions = this.tagSelectorControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.problemTag = this.data.problemTag
    this.status = this.data.status
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tagData.filter((option:any) => option.toLowerCase().includes(filterValue));
  }
  
  drop(event: CdkDragDrop<string[]>){
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } 
    else {
      transferArrayItem(event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex);
    }

    this.updateData();
    this.updateColumns();
  }

  tagDropped(event: any){
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    this.data.tags.push(data);
    this.updateColumns();
  }

  tagSelected(event: any){
    event.stopPropagation()
    if (event.keyCode === 13) {
      this.data.tags.push(this.tagSelectorControl.value);
      this.updateColumns();
      this.tagSelectorControl.setValue("")
    }
  }

  enterPressed(event: any){
    event.preventDefault();
    this.data.tags.push(this.tagSelectorControl.value);
    this.updateColumns();
    setTimeout(()=>{
      this.tagSelectorControl.setValue("")
    }, 700)
  }

  cancelSelect(){
    this.selection.clear();
    this.selectMode = false;
  }

  handleDelete(){
    if(this.selectMode){
      this.selection.selected.forEach((selected) => {
        delete this.data.tags[selected];
      })

      this.data.tags = this.data.tags.filter((x:any) => x != null);

      this.updateColumns();
      this.selection.clear();
    }
    this.selectMode = !this.selectMode;
  }

  tagClicked(event: any, index: any){
    if(this.selectMode){
      event ? this.selection.toggle(index) : null;
    }
  }

  updateColumns(){
    var numOfColumns =  Math.ceil(this.data.tags.length/this.numOfTagsPerColumn)
    this.columnList = [];
    for(var i = 0; i  < numOfColumns; i++){
      this.columnList.push(this.createColumns(this.numOfTagsPerColumn, i));
    }
    this.updateData();
  }

  createColumns(numOfColumns: any, index: any){
    var dataType = this.data.dataType.includes('32') ? DataType.ThirtyTwoBit : (this.data.dataType.includes('16')) ? DataType.SixteenBit : DataType.EightBit;
    var numOfTagsInMapping = this.data.dataType.includes('8') ? 2 : 1;
    var startIndex = index*numOfColumns;
    var endIndex = (index*numOfColumns)+numOfColumns;
    var mapping = this.data.tags.slice(startIndex, endIndex);
    var num = (dataType == DataType.EightBit) ? 4 : 8;
    var startRegister = this.data.startRegister + (index*num);

    var numOfMappingItems = (dataType == DataType.ThirtyTwoBit) ? mapping.length : (dataType == DataType.EightBit) ? Math.ceil(mapping.length / 2 ) : mapping.length;

    var mappings = new Array<RegisterMapping>();
      for(var i = 0; i < numOfMappingItems; i++){
      mappings.push(new RegisterMapping());
    }

    var j = 0;
    if(dataType == DataType.ThirtyTwoBit){
      for(var i = 0; i < mappings.length; i++){
        mappings[i].registers = [startRegister+j, startRegister+j+1];
        j +=2;
        mappings[i].tags = [mapping[i]];
        mappings[i].indices = [ (index*this.numOfTagsPerColumn) + (numOfTagsInMapping * i)]
      }
    }

    j = 0;
    if(dataType == DataType.EightBit){
      for(var i = 0; i < mappings.length; i++){
        mappings[i].registers = [startRegister+i];
        mappings[i].tags = [mapping[j], mapping[j+1]];
        mappings[i].indices = [ (index*this.numOfTagsPerColumn) + (numOfTagsInMapping * i), (index*this.numOfTagsPerColumn) + (numOfTagsInMapping * i) + 1]
        j +=2;
      }
    }

    if(dataType == DataType.SixteenBit){
      for(var i = 0; i < mappings.length; i++){
        mappings[i].registers = [startRegister+i];
        mappings[i].tags = [mapping[i]];
        mappings[i].indices = [ (index*this.numOfTagsPerColumn) + (numOfTagsInMapping * i)]
      }
    }
    return mappings;
  }

  updateData(){
    let tags:any = [];
    this.columnList.map(column => {
      column.map((mapping:any) => {
         mapping.tags.map((tag:any) => {
           if(tag != undefined){
            tags.push(tag)
           }
        })
      })
    });
    this.data.tags = [].concat(tags)
  }

  p(e:any, index:any){
    this.data.tags[index] = e.target.value
    this.updateData()
    if(e.keyCode == 13){
      e.preventDefault();
      if(index == this.data.tags.length-1){
        this.data.tags.push("")
      }else{
        this.data.tags.splice(index+1, 0, "")
      }
      
      this.updateColumns();
      setTimeout(()=>document.getElementsByTagName('input')[document.getElementsByTagName('input').length-1].focus(),400)
    }
  }

  pp(e:any, index:any){
    this.data.tags[index] = e.option.value
    this.updateData()
  }

  trackByFn(index: any, item: any) {
    return index;
 }
}
