import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { DragDataService } from '../../services/drag-data/drag-data.service'

@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.css']
})

export class EditableTableComponent implements OnInit {
  @Input('config') config: any;
  @Input('dataSource') dataSource!: Array<any>;
  @Input('panel') panel!: MatExpansionPanel;
  @Input('field') field!: string;
  @Output() dragUpdate = new EventEmitter<any>();
  
  initialSelection = [];
  allowMultiSelect = true;
  selection!: SelectionModel<any>;
  editState: boolean = false;
  dragging: boolean = false;
  columns = new Array<string>();

  constructor(private dragDataService: DragDataService) { }

  ngOnInit(): void {
    this.panel.closed.subscribe(()=> {
      setTimeout(() => {
        this.editState = false;
        this.selection.clear();
      }, 200)
    });

    this.selection = new SelectionModel<any>(true, this.initialSelection);
    this.columns = ['source', 'destination'];
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  inputChanged(event: any, tagIndex: number, field: string){
    this.dataSource[tagIndex][field] = event.target.value
  }

  addNewRow(){
    var newRow = {
      "source": "Source",
      "datatype": "Number",
      "destination": "Destination "
   }
   this.dataSource.push(newRow);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length == this.dataSource.length
  }

  // TODO:: Create a Subject for EditState
  changeState(){
    (this.editState) ? this.editState = false : this.editState = true;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach((row, index) => {
        row['index'] = index;
        this.selection.select(row)
      });
  }

  deleteSelected(){
      let t = this.dataSource.filter((x)=> this.non(x))
      this.dataSource = t
      this.config.tagsToWrite = this.dataSource
  }

  index = 0
  non(x:any){
    if(x == this.selection['_selected'][this.index]){
      this.index = this.index + 1
      return false
    }
    return true
  }

  finalDrop(event: any, tagIndex: number){
    event.preventDefault();
    var closestTR = event.target.closest('tr');
    closestTR.classList.remove('drag-over-item');
    // var data = this.dragDataService.getDragData();
    var data = event.dataTransfer.getData("text");

    this.dataSource[tagIndex][this.field] = data
  }

  dragLeave(event: any){
    var closestTR = event.target.closest('tr');
    var bounds = closestTR.getBoundingClientRect();
    if((event.x < bounds.x) || (event.x > bounds.x+bounds.width)  
      || (event.y < bounds.y) || (event.y > bounds.y+bounds.height))
    {
      closestTR.classList.remove('drag-over-item');
    }
  }

  dragEnter(event: any){
    var closestTR = event.target.closest('tr');
    closestTR.classList.add("drag-over-item");
  }
}
