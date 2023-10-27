import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnInit, QueryList, ViewChildren, OnDestroy, ViewChild, ElementRef,} from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { ModbusTcpIpStatusService } from '../modbus-tcp-ip/modbus-tcp-ip-status.service';
import { ConfigDataService } from '../config-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eip-tags-config',
  templateUrl: './eip-tags-config.component.html',
  styleUrls: ['./eip-tags-config.component.css']
})

export class EipTagsConfigComponent implements OnInit, OnChanges, OnDestroy {
  @Input() config: any; 
  @Input() tagsToRead: any
  @Input() tagsToWrite: any
  @ViewChild('matTabGroup') matTabGroup!: MatTabGroup;
  @ViewChildren('groupPanel') panels!: QueryList<MatExpansionPanel>;
  pageEventRead!: PageEvent;
  pageIndexRead!:number;
  pageSizeRead!:number;
  pageEventWrite!: PageEvent;
  datasourceWrite!: null;
  pageIndexWrite!:number;
  pageSizeWrite!:number;
  lengthWrite = 0
  lengthRead:any = []
  controls!: FormArray[];
  singleGroupForm!: FormGroup;
  dragging: boolean = false;
  timeOutHandler: any;
  initialSelection = [];
  allowMultiSelect = true;
  selection!: SelectionModel<any>;
  dataSourceRead: any[] = []
  dataSourceWrite: any
  editState: boolean = false;
  totalRequests = 0
  totalResponses = 0
  totalErrors = 0
  status = ""
  status2 = ''
  tagsToReadCount = 0
  error = ''
  errorGroup = -1
  timer: any
  tagList = []
  msgsOKCounter: any 
  msgsErrCounter: any

  constructor(private router: Router, public modbusTCPSocket: ModbusTcpIpStatusService,
     public configDataService: ConfigDataService, private elementRef:ElementRef) { }

  ngOnInit(){
    for(var i = 0; i < this.tagsToRead.length; i++){
      this.lengthRead.push(this.tagsToRead[i].length)
    }
    var index = 0;
    (document.getElementById('enabled') as HTMLInputElement).checked = this.configDataService.configFile.modules[this.router.url.split('/').pop()!]
    document.getElementById('EIPStatusBox')!.style.display = 'none'
    setTimeout(() => {
      for(var i = 0; i < this.configDataService.configFile.modules.length; i++){
        if(this.configDataService.configFile.modules[i]['uniqueId'] == this.router.url.split('/').pop()){
          index = i
          break
        }
      }
      (document.getElementById('enabled') as HTMLInputElement).checked = this.configDataService.configFile.modules[index]['enabled']
      this.getTagsToReadData();
      this.getTagsToWriteData();
      this.subscribeToTag()
      
    }, 200)
  }

  ngOnChanges(){
    this.initFormControls()
    this.selection = new SelectionModel<any>(true, this.initialSelection);
  }

  subscribeToTag(){
    document.getElementById('EIPStatusBox')!.style.display = 'none'
    this.modbusTCPSocket.connect()
    this.modbusTCPSocket.subscribeTags([this.config['lastErr'], this.config['enable'], this.config['msgsOk'], this.config['msgsErr']]);
    this.timer = setInterval(() => {
      if(!window.location.pathname.includes('module/')){
        clearInterval(this.timer)
        return
      }
      if(document.getElementById('EIPStatusBox') == null){
        clearInterval(this.timer)
        return
      }
      this.status = Object.values(this.modbusTCPSocket.tagValues)[1] as string
      this.msgsOKCounter = Object.values(this.modbusTCPSocket.tagValues)[2] as string
      this.msgsErrCounter = Object.values(this.modbusTCPSocket.tagValues)[3] as string
      if(typeof(this.status) != 'number'){
        this.status = ''
      }
      document.getElementById('msgsOkCount')!.innerHTML = this.msgsOKCounter != undefined ? this.msgsOKCounter : ""
      document.getElementById('msgsErrCount')!.innerHTML = this.msgsErrCounter != undefined ? this.msgsErrCounter : ""
      document.getElementById('statusTagValue')!.innerHTML = this.status != undefined ? this.status : ""
      if(this.config['enable'] == '' || this.config['enable'] == undefined || this.config['msgsOk'] == '' || 
        this.config['msgsOk'] == undefined || this.config['msgsErr'] == '' || this.config['msgsErr'] == undefined ||
        this.config['lastErr'] == '' || this.config['lastErr'] == undefined){
          document.getElementById('EIPStatusBox')!.style.display = 'inline-block'
          document.getElementById('status')!.innerHTML = 'All Status Tags are needed'
          document.getElementById('EIPStatusBox')!.style.backgroundColor = '#fc4538'
          this.error = '' 
      }
      else if(this.modbusTCPSocket['registeredTags'][0] == undefined) {
        document.getElementById('EIPStatusBox')!.style.display = 'inline-block'
        document.getElementById('status')!.innerHTML = 'All Status Tags are needed'
        document.getElementById('EIPStatusBox')!.style.backgroundColor = '#fc4538'
        this.error = ''    
      }
      else if(Object.values(this.modbusTCPSocket.tagValues)[0] != undefined){
        document.getElementById('EIPStatusBox')!.style.display = 'inline-block'
        if(Object.values(this.modbusTCPSocket.tagValues)[0] == "Host is Down"){
          document.getElementById('status')!.innerHTML = 'Host is Down'
          document.getElementById('EIPStatusBox')!.style.backgroundColor = '#fc4538'
          this.error = ''
        }
        else if(!(document.getElementById('enabled') as HTMLInputElement).checked){
          document.getElementById('EIPStatusBox')!.style.display = 'inline-block'
          document.getElementById('status')!.innerHTML = 'Module Disabled'
          document.getElementById('EIPStatusBox')!.style.backgroundColor = '#fc4538'
          this.error = ''
        }
        else if(typeof(Object.values(this.modbusTCPSocket.tagValues)[0]) == 'number'){
          document.getElementById('EIPStatusBox')!.style.display = 'inline-block'
          document.getElementById('status')!.innerHTML = 'Message Error Tag must be a Text Tag'
          document.getElementById('EIPStatusBox')!.style.backgroundColor = '#fc4538'
          this.error = ''
        }
        else if(Object.values(this.modbusTCPSocket.tagValues)[0] == 'Enable Tag is 0') {
          document.getElementById('EIPStatusBox')!.style.display = 'inline-block'
          document.getElementById('status')!.innerHTML = 'Enable Tag is 0'
          document.getElementById('EIPStatusBox')!.style.backgroundColor = '#fc4538'
          this.error = ''    
        }
        else if(Object.values(this.modbusTCPSocket.tagValues)[0] == "No Connection to PLC IP"){
          document.getElementById('status')!.innerHTML = 'No Connection to PLC IP'
          document.getElementById('EIPStatusBox')!.style.backgroundColor = '#fc4538'
          this.error = ''
        }
        else if(Object.values(this.modbusTCPSocket.tagValues)[0] == "Good"){
          document.getElementById('status')!.innerHTML = 'Good'
          document.getElementById('EIPStatusBox')!.style.backgroundColor = '#29c702'
          this.error = ''
        }
        else if(Object.values(this.modbusTCPSocket.tagValues)[0] == ""){
          document.getElementById('status')!.innerHTML = 'Good'
          document.getElementById('EIPStatusBox')!.style.backgroundColor = '#29c702'
          this.error = ''
        }
        else if((Object.values(this.modbusTCPSocket.tagValues)[0] as String).includes("Invalid Source Write Tag")){
          this.error = 'write'
          document.getElementById('status')!.innerHTML = Object.values(this.modbusTCPSocket.tagValues)[0] as string
          document.getElementById('EIPStatusBox')!.style.backgroundColor = '#fc4538'
          for(var i = 0; i < this.dataSourceWrite.length; i++){
            if(this.dataSourceWrite[i]['source'] == (Object.values(this.modbusTCPSocket.tagValues)[0] as String).split(": ")[1]){
              document.getElementById('TAG'+this.dataSourceWrite[i]['source'])!.classList.add('highlightTabColor')
              break
            }
          }        
        }
        else if((Object.values(this.modbusTCPSocket.tagValues)[0] as String).includes("Invalid Destination Read Tag")){
          this.error = 'read'
          document.getElementById('status')!.innerHTML = Object.values(this.modbusTCPSocket.tagValues)[0] as string
          document.getElementById('EIPStatusBox')!.style.backgroundColor = '#fc4538'
          for(var i = 0; i < this.dataSourceRead.length; i++){
          for(var j = 0; j < this.dataSourceRead[i].length; j++){
            if(this.dataSourceRead[i][j]['destination'] == (Object.values(this.modbusTCPSocket.tagValues)[0] as String).split(": ")[1]){
              document.getElementById('TAG'+this.dataSourceRead[i][j]['source'])!.classList.add('highlightTabColor')
              this.errorGroup = i
              break
            }
          }
        }        
        }
        else if((Object.values(this.modbusTCPSocket.tagValues)[0] as String).includes("must have datatype")){
          this.error = 'read'
          document.getElementById('status')!.innerHTML = 'Destination read tag has incorrect datatype'
          document.getElementById('EIPStatusBox')!.style.backgroundColor = '#fc4538'
          for(var i = 0; i < this.dataSourceRead.length; i++){
          for(var j = 0; j < this.dataSourceRead[i].length; j++){
            if(this.dataSourceRead[i][j]['destination'] == (Object.values(this.modbusTCPSocket.tagValues)[0] as String).split("'")[1]){
              document.getElementById('TAG'+this.dataSourceRead[i][j]['source'])!.classList.add('highlightTabColor')
              this.errorGroup = i
              break
            }
          }
       }        
      }
      else if((Object.values(this.modbusTCPSocket.tagValues)[0] as String).includes("Invalid Destination Write Tag")){
        this.error = 'write'
        document.getElementById('status')!.innerHTML = 'Invalid Destination Write Tag'
        document.getElementById('EIPStatusBox')!.style.backgroundColor = '#fc4538'
        for(var i = 0; i < this.dataSourceWrite.length; i++){
          if(this.dataSourceWrite[i]['destination'] == (Object.values(this.modbusTCPSocket.tagValues)[0] as String).split(": ")[1]){
            document.getElementById('TAG'+this.dataSourceWrite[i]['source'])!.classList.add('highlightTabColor')
            break
          }
       }        
      }
      else if((Object.values(this.modbusTCPSocket.tagValues)[0] as String).includes("Invalid Source Read Tag")){
        this.error = 'read'
        document.getElementById('status')!.innerHTML = 'Invalid Source Read Tag ' + (Object.values(this.modbusTCPSocket.tagValues)[0] as string).split(': ')[1]
        document.getElementById('EIPStatusBox')!.style.backgroundColor = '#fc4538'
        for(var i = 0; i < this.dataSourceRead.length; i++){
          for(var j = 0; j < this.dataSourceRead[i].length; j++){
            if(this.dataSourceRead[i][j]['source'] == (Object.values(this.modbusTCPSocket.tagValues)[0] as String).split(": ")[1]){
              document.getElementById('TAG'+this.dataSourceRead[i][j]['source'])!.classList.add('highlightTabColor')
              this.errorGroup = i
              break
            }
          }       
        } 
      }
      else{
        this.error = ''
        document.getElementById('status')!.innerHTML = 'Error'
        document.getElementById('EIPStatusBox')!.style.backgroundColor = '#fc4538'
      }
    }
  },2000)
  }

  findKeysWithDataText(obj: any) {
    const keysWithTextData: any = [];
    function searchObject(object: any) {
      for (const key in object) {
        if (typeof object[key] === 'object') {
          if (object[key].datatype === 'Number' || object[key].datatype === 'Text') {
            keysWithTextData.push(key);
          }
          searchObject(object[key]);
        }
      }
    }
    searchObject(obj);
    return keysWithTextData;
  }

  initFormControls(){
    this.singleGroupForm = new FormGroup({
      enable: new FormControl(this.config.enable, Validators.required),
      PLCIP: new FormControl(this.config.PLCIP, Validators.required),
      Slot: new FormControl(this.config.Slot, Validators.required)
    })
    this.singleGroupForm.get('enable')!.valueChanges.subscribe(value => {
      this.config.enable= value;
    });
    this.singleGroupForm.get('PLCIP')!.valueChanges.subscribe(value => {
      this.config['PLCIP'] = value;
    });
    this.singleGroupForm.get('Slot')!.valueChanges.subscribe(value => {
      this.config['Slot'] = value;
    });
  }

  getControl(field: string){
    this.singleGroupForm.get(field) as FormControl;
  }

  mouseEnterHandler(event: MouseEvent, groupPanel: MatExpansionPanel) {
    if(this.dragging){
      clearTimeout(this.timeOutHandler);
      this.timeOutHandler = undefined;
      this.timeOutHandler = setTimeout( function() {
        if (event.buttons && !groupPanel.expanded) {
          groupPanel.open();
          //this.timeOutHandler = clearTimeout;
        }
      }, 500)
   }
  }

  addNewRow(){
    var newGroup:any = [];
    this.tagsToRead.push(newGroup);
    this.dataSourceRead = this.tagsToRead
    }
    
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length == this.tagsToRead.length
  }
  
  // TODO:: Create a Subject for EditState
  changeState(){
    (this.editState) ? this.editState = false : this.editState = true;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.tagsToRead.forEach((row: any, index: any) => {
          row['index'] = index;
          this.selection.select(row)
        });
  } 

  deleteSelected(){
    if(this.isAllSelected()){
      this.tagsToRead = [];
    }
    else{
      let t = this.tagsToRead.filter((x: any)=> this.non(x))
      this.tagsToRead = t
      setTimeout(() => {
        this.getTagsToReadData()
      });
    }
  }

  non(x: any){
    if(this.selection['_selected'].includes(x)){
      return false
    }
    return true
  }

  getTagsToReadData(event?: PageEvent){
    var count = 0
    if(event != undefined){
      this.pageIndexRead = event.pageIndex;
      this.pageSizeRead = event.pageSize;
      this.dataSourceRead = this.tagsToRead.slice(this.pageIndexRead*this.pageSizeRead, this.pageSizeRead+(this.pageIndexRead*this.pageSizeRead));
    }
    else{
      this.pageIndexRead = 0;
      this.pageSizeRead = 10;
      this.dataSourceRead = this.tagsToRead.slice(0, 10);
      this.lengthRead = this.tagsToRead.length;
      for(var i = 0; i < this.tagsToRead.length; i++){
        for(var j = 0; j < this.tagsToRead[i].length; j++){
         count = count + 1
        }
      }
      this.tagsToReadCount = count
    }
  }

  getTagsToWriteData(event?: PageEvent){
    if(event != undefined){
      this.pageIndexWrite = event.pageIndex;
      this.pageSizeWrite = event.pageSize;
      this.dataSourceWrite = this.tagsToWrite.slice(this.pageIndexWrite*this.pageSizeWrite, this.pageSizeWrite+(this.pageIndexWrite*this.pageSizeWrite))
    } 
    else{
      this.pageIndexWrite = 0;
      this.pageSizeWrite = 10;
      this.dataSourceWrite = this.tagsToWrite.slice(0, 10);
      this.lengthWrite = this.tagsToWrite.length;
    }
  }

  ngOnDestroy() {
      clearInterval(this.timer)
      clearInterval(this.timer)
      clearInterval(this.timer)
      this.modbusTCPSocket.disconnect()
  }
}