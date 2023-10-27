import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Overlay } from '@angular/cdk/overlay';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatRow } from '@angular/material/table';
import { Subject } from 'rxjs';
import { ModbusMappingDialogComponent } from '../components/modbus-mapping-dialog/modbus-mapping-dialog.component'
import { ResizeObserver } from '@juggle/resize-observer';
import { ConfigDataService } from '../config-data.service';
import { Router } from '@angular/router';

export class ModBusTCPIPMapping {
  direction: string = "";
  slaveId = 0;
  regType!: number;
  startRegister = 0;
  registerCount = 0;
  enable: string = "";
  dataType: string = ""
  allowWrites = false;
  tags = new Array<string>();
}

@Component({
  selector: 'app-modbus-tcp-ip-server',
  templateUrl: './modbus-tcp-ip-server.component.html',
  styleUrls: ['./modbus-tcp-ip-server.component.css']
})

export class ModbusTcpIpServerComponent implements OnInit, OnChanges {
  @Input() config: any;
  @ViewChildren('editInput')
  inputs!: QueryList<any>;
  @ViewChildren(MatRow)
  tableRows!: QueryList<MatRow>;
  @ViewChild('blah')
  table!: ElementRef<any>;

  displayedColumns = ['select','slaveId','startRegister', 'allowWrites', 'registerType', 'dataType', 'enable', 'tags'];
  dataTypes = ['UINT8', 'INT8','INT16', 'UINT16','REAL32', 'INT32', 'UINT32']
  allowWriteOptions = [{option: "True", value: true}, {option: "False", value: false}]
  enableOptions = ['continuous', 'on change']
  registerTypes = [
    {
      display: 'Coil',
      value: 1
    },
    {
      display: 'Status',
      value: 2
    },
    {
      display: 'Holding Register',
      value: 3
    },{
      display: 'Input Register',
      value: 4
    }
  ];
  initialSelection = [];
  allowMultiSelect = true;
  selection!: SelectionModel<any>;
  editWriteState: boolean = false;
  editReadState: boolean = false;
  mappingsChange = new Subject<any>();
  writeMappings = [];
  readMappings = [];
  editMode = false;
  ro: any
  dialogRef!: MatDialogRef<any>;

  constructor(public dialog: MatDialog,
    private overlay: Overlay, private router: Router, public configDataService: ConfigDataService) { }

  ngOnInit(): void {
    this.mappingsChange.subscribe(() => {
      this.writeMappings = this.config.mappings.filter((mapping: { direction: string; }) => mapping.direction == "Write");
      this.readMappings = this.config.mappings.filter((mapping: { direction: string; }) => mapping.direction == "Read");
    })
    this.mappingsChange.next();
    this.ro = new ResizeObserver((entries, observer) => {
      if(this.dialogRef != null){
        this.dialogRef.updateSize(
          this.table.nativeElement.scrollWidth.toString() + "px"
        ),
        this.dialogRef.updatePosition(
          {
            left: this.table.nativeElement.getBoundingClientRect().x.toString() + "px"
          }
        )
      }
    });    
    var index = 0
    for(var i = 0; i < this.configDataService.configFile.modules.length; i++){
      if(this.configDataService.configFile.modules[i]['uniqueId'] == this.router.url.split('/').pop()){
        index = i
        break
      }
    }
    (document.getElementById('enabled') as HTMLInputElement).checked = this.configDataService.configFile.modules[index]['enabled']
  }

  ngOnChanges(){
    this.selection = new SelectionModel<any>(true, this.initialSelection);
  }

  getRegisterCount(dataType: any, numOfTags: number){
    if(dataType.includes('32')){
      return numOfTags*2;
    }
    else{
      return numOfTags;
    }
  }

  addMapping(){
    var mapping = new ModBusTCPIPMapping();
    this.config.mappings.push(mapping);
    this.config.mappings = [...this.config.mappings]
  }

  regTypeChanged(event: any, index: any){
    var value = event.value;
    if(value == 1 || value == 3){
      this.config.mappings[index].direction = "Write"
    }
    else if(value == 2 || value == 4){
      this.config.mappings[index].direction = "Read"
    }
    this.config.mappings = [...this.config.mappings]
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length == this.config.mappings.length;
  }
  
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.config.mappings.forEach((row: { [x: string]: any; }, index: any) => {
        row['index'] = index;
        this.selection.select(row)
      })
  }
  
  deleteSelected(){
    if(this.isAllSelected()){
      this.config.mappings = [];
    }
    else{
      this.selection.selected.forEach((selected) => {
        this.config.mappings.splice(selected.index,1)
      })
    }
    this.selection.clear();
    this.config.mappings = [...this.config.mappings]
  }

  drop(event: CdkDragDrop<string[]>){
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  openMappingDialog( trigger: any ,mapping: any){ 
    this.ro.observe(this.table.nativeElement);
    this.dialogRef = this.dialog.open(ModbusMappingDialogComponent, {
      width: this.table.nativeElement.scrollWidth.toString() + "px",
      height: '500px',
      data: mapping,
      hasBackdrop: false,
      position:{
      left: this.table.nativeElement.getBoundingClientRect().x.toString() + "px"
      }
    });
    this.dialogRef.afterClosed().subscribe(result => {
      mapping.tags = result;
      this.mappingsChange.next();
      this.ro.disconnect();
    });
  }
}