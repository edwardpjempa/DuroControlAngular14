import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Overlay } from '@angular/cdk/overlay';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatRow } from '@angular/material/table';
import { Subject } from 'rxjs';
import { ModbusMappingDialogComponent } from '../components/modbus-mapping-dialog/modbus-mapping-dialog.component'
import { ResizeObserver } from '@juggle/resize-observer';
import { ModbusTcpIpStatusService } from './modbus-tcp-ip-status.service';
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
  tags = new Array<string>();
}

@Component({
  selector: 'app-modbus-tcp-ip',
  templateUrl: './modbus-tcp-ip.component.html',
  styleUrls: ['./modbus-tcp-ip.component.css']
})

export class ModbusTcpIpComponent implements OnInit, OnChanges, OnDestroy {
  @Input() config: any;
  @ViewChildren('editInput')
  inputs!: QueryList<any>;
  @ViewChildren(MatRow)
  tableRows!: QueryList<MatRow>;
  @ViewChild('blah')
  table!: ElementRef<any>;

  dataTypes: any = {
    '1': ['UINT16','REAL32', 'INT32'],
    '3': ['UINT16', 'INT32', 'REAL32'],
    '2':['UINT16', 'REAL32'],
    '4':['UINT16', 'REAL32'],
    '15':['UINT16', 'REAL32'],
    '16': ['UINT16', 'REAL32']
  }
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
    },
    {
      display: 'Input Register',
      value: 4
    },
    {
      display: "Write Multiple Holding Registers",
      value: 16
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
  problemTag = ''
  problemRow = 999
  status:any
  timer:any
  msgsOKCounter: any
  msgsErrCounter: any
  statusTag: any

  constructor(public dialog: MatDialog, private router: Router,
    private overlay: Overlay,  public modbusTCPSocket: ModbusTcpIpStatusService, public configDataService: ConfigDataService) { }

  ngOnInit(): void {
    setTimeout(()=> {
    if(this.config != undefined){
    var index = 0
    for(var i = 0; i < this.configDataService.configFile.modules.length; i++){
      if(this.configDataService.configFile.modules[i]['uniqueId'] == this.router.url.split('/').pop()){
        index = i
        break
      }
    }
    document.getElementById('TCPStatusBox')!.style.display = 'none';
    (document.getElementById('enabled') as HTMLInputElement).checked = this.configDataService.configFile.modules[index]['enabled']
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
    this.subscribeToTags()   
  }
  },1000)
  }

  ngOnChanges(){
    this.selection = new SelectionModel<any>(true, this.initialSelection);
  }

  ngOnDestroy() {
      clearInterval(this.timer)
      clearInterval(this.timer)
      clearInterval(this.timer)
      //if(this.modbusTCPSocket['unsubscribe'] !== undefined){
        this.modbusTCPSocket.disconnect()
      //}
  }

  getRegisterCount(dataType: any, numOfTags: number){
    if(dataType.includes('32')){
      return numOfTags*2;
    }
    else{
      return numOfTags;
    }
  }
  availableValues = [0,0,0,0]
  tagValues = ['','','','']
  subscribeToTags(){
    document.getElementById('TCPStatusBox')!.style.display = 'none'
    this.modbusTCPSocket.connect()
    this.modbusTCPSocket.subscribeTags([this.config['statusTag'], this.config['msgsOk'], this.config['msgsErr'], this.config['problemTag']]);
    this.timer = setInterval(() => {
      document.getElementById('TCPStatusBox')!.style.display = 'inline-block'
      for(var i = 0; i < this.modbusTCPSocket['registeredTags'].length; i++){
        if(this.modbusTCPSocket['registeredTags'][i] != ''){
          this.availableValues[i] = 1
        }else{
          this.availableValues[i] = 0
        }
      }
      var c = 1
      if(this.availableValues[0] == 1){
        c = 0
      }
      for(var i = 0; i < this.availableValues.length; i++){
        if(this.availableValues[i] == 1){
          this.tagValues[i] = Object.values(this.modbusTCPSocket.tagValues)[c] as string
          c = c + 1
        }
      }
      document.getElementById('statusTagValue')!.innerHTML = this.availableValues[0] == 1 ? this.tagValues[0] : "";
      document.getElementById('msgsOkCount')!.innerHTML = this.availableValues[1] == 1 ? this.tagValues[1] : "";
      document.getElementById('msgsErrCount')!.innerHTML = this.availableValues[2] == 1 ? this.tagValues[2] : "";
      for(var i = 0; i < this.config.mappings.length; i++){
        for(var j = 0; j < this.config.mappings[i]['tags'].length; j++){
          if(this.tagValues[3] != ''){
            if(this.config.mappings[i]['tags'][j] == this.tagValues[3]){
              this.problemRow = i
            }
          }
        }
      }
      if(this.config['statusTag'] == '' || this.config['statusTag'] == undefined || this.config['msgsOk'] == '' || 
       this.config['msgsOk'] == undefined || this.config['msgsErr'] == '' || this.config['msgsErr'] == undefined){
        document.getElementById('TCPStatusBox')!.style.display = 'inline-block'
        document.getElementById('status')!.innerHTML = 'All Status Tags are needed'
        document.getElementById('TCPStatusBox')!.style.backgroundColor = '#fc4538'
      } 
      else if(this.tagValues[0] != ''){
        document.getElementById('TCPStatusBox')!.style.display = 'inline-block'
        if(this.problemTag == 'Need Host IP and Port Number'){
          document.getElementById('status')!.innerHTML = 'Need Host IP and Port Number'
          document.getElementById('TCPStatusBox')!.style.backgroundColor = '#fc4538'
        }
        else if(Number(this.tagValues[0]) == -1){
          document.getElementById('status')!.innerHTML = 'Host is Down'
          document.getElementById('TCPStatusBox')!.style.backgroundColor = '#fc4538'
        }
        else if(Number(this.tagValues[0]) == -2){
          document.getElementById('status')!.innerHTML = 'Module Disabled'
          document.getElementById('TCPStatusBox')!.style.backgroundColor = '#fc4538'
        }
        else if(Number(this.tagValues[0]) == 1){
          document.getElementById('status')!.innerHTML = 'Good'
          document.getElementById('TCPStatusBox')!.style.backgroundColor = '#29c702'
        }
        else if(Number(this.tagValues[0]) == -10){
          document.getElementById('status')!.innerHTML = 'Row is not Completed'
          document.getElementById('TCPStatusBox')!.style.backgroundColor = '#fc4538';
          (document.getElementsByTagName('tbody')[0].children[Number(this.problemTag)-1] as HTMLElement).classList.add('highlightTableColor')
        }
        else if(Number(this.tagValues[0]) == -12){
          document.getElementById('status')!.innerHTML = 'Row has invalid tag'
          if(this.tagValues[3] != ''){
            document.getElementById('status')!.innerHTML = 'Row has invalid tag: ' + this.tagValues[3]
          }
          document.getElementById('TCPStatusBox')!.style.backgroundColor = '#fc4538';
          //(document.getElementsByTagName('tbody')[0].children[Number(this.problemTag)] as HTMLElement).classList.add('highlightTableColor')
        }
        else if(Number(this.tagValues[0]) == -13){
          document.getElementById('status')!.innerHTML = 'Row has invalid tag'
          if(this.tagValues[3] != ''){
            document.getElementById('status')!.innerHTML = 'Row has invalid tag: ' + this.tagValues[3]
          }
          document.getElementById('TCPStatusBox')!.style.backgroundColor = '#fc4538';
        }
        else if(this.tagValues[3] == '[Errno 61] Connection refused'){
          document.getElementById('status')!.innerHTML = 'Connection refused. Possible Incorrect Port'
          document.getElementById('TCPStatusBox')!.style.backgroundColor = '#fc4538'
        }
        else{
          document.getElementById('status')!.innerHTML = ''
          document.getElementById('TCPStatusBox')!.style.display = 'none'
        }
      }
    }, 1000)
  }

  addMapping(){
    var mapping = new ModBusTCPIPMapping();
    this.config.mappings.push(mapping);
    this.config.mappings = [...this.config.mappings]
  }

  regTypeChanged(event: any, index: any){
    var value = event.value;
    if(value == 1 || value == 16){
      this.config.mappings[index].direction = "Write"
    }
    else if(value == 2 || value == 3 ||value == 4){
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
    mapping['problemTag'] = this.problemTag 
    mapping['status'] = this.status
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