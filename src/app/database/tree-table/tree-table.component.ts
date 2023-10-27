import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.css']
})

export class TreeTableComponent implements OnInit {
  @Input() headers!: string[];
  @Input() data: any;
  @Input() values: any;
  @Input() header!: boolean;
  @Input() viewMode!: boolean;
  @Input() selectedTag!: string;
  @Input() list = []

  @Output() checkbox = new EventEmitter<any>();
  @Output() tagSelected = new EventEmitter<string>();

  Object = Object;

  constructor() { }

  ngOnInit() {}

  checkSelected(event:any) {
    this.checkbox.emit(event);
  }

  cellClicked(event:any) {
    this.tagSelected.emit(event);
  }

  renameTag(newAndOldValue:any) {
   if (newAndOldValue.newName != newAndOldValue.oldName) {
      this.data[newAndOldValue.newName] = this.data[newAndOldValue.oldName];
      delete(this.data[newAndOldValue.oldName]);   
   }
  }
}
