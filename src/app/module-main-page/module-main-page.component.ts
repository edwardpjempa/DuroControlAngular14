import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute } from '@angular/router';
import { EipModule , EipModule2, EipModule3} from '../classes/modules/eip-module';
import { ModbusTcpIpModule } from '../classes/modules/modbus-tcp-ip-module';
import { ModbusTCPServer } from '../classes/modules/modbus-tcpserver';
import { UserCodeModule } from '../classes/modules/user-code-module';
import { ModuleUploadComponent } from '../components/module-upload/module-upload.component';
import { ConfigDataService } from '../config-data.service';

@Component({
  selector: 'app-module-main-page',
  templateUrl: './module-main-page.component.html',
  styleUrls: ['./module-main-page.component.css']
})

export class ModuleMainPageComponent implements OnInit {
  moduleType: any;
  modulesURL = "/user_modules"
  modules = new Array<any>();
  moduleConfig: any;
  initialSelection = [];
  allowMultiSelect = true;
  selection!: SelectionModel<any>;
  editState: boolean = false;
  path = '/module-home/user'

  constructor(private http: HttpClient, private route: ActivatedRoute, public configDataService: ConfigDataService, private dialog: MatDialog) {  }

  ngOnInit(): void {
    this.route.params.subscribe(params => { 
      this.moduleType = params['moduleType']; 
      this.selection = new SelectionModel<any>(true, this.initialSelection);
      this.editState = false;
    })
    setTimeout(()=> this.modules = this.filteredModules(), 1000)
  }
  
  ngAfterContentChecked(){
    this.path = window.location.pathname
  }

  filteredModules(){
    if(this.moduleType == 'user'){
      return this.configDataService.configFile.modules
    }
    return this.configDataService.configFile.modules.filter((item: { type: any; module: string; }) => item.type == this.moduleType && item.module != 'EIPCComm' && item.module != 'httpClient' && item.module != 'modbusRTUClient');
  }

  createNew(type: any){
    let newModule;
    switch(type){
      case "user":
        newModule = new UserCodeModule();
        break;
      case "EIPComm":
        newModule = new EipModule();
        break;
      case "EIPComm":
        newModule = new EipModule2();
        break;
      case "EIPComm3":
        newModule = new EipModule3();
        break;
      case "modbusTCPClient":
        newModule = new ModbusTcpIpModule();
        break;
      case "modbusTCPServer":
        newModule = new ModbusTCPServer();
        break;
    }
    this.configDataService.configFile.modules.push(newModule);
  }

  isAllSelected() {
    return this.selection.selected.length == this.modules.length
  }

  // TODO:: Create a Subject for EditState
  changeState(){
    if(this.editState){
      this.editState = false;
      this.selection.clear();
    }
    else{this.editState = true;
    } 
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.modules.forEach((row, index) => {
        row['index'] = index;
        this.selection.select(row)
      });
  }

  deleteSelected(){
    let params: any = {id:[]}
    this.selection.selected.forEach(module => {
      for(var i = 0; i < this.configDataService.configFile.modules.length; i++){
        if(module == this.configDataService.configFile.modules[i]){
          this.configDataService.configFile.modules.splice(i, 1)
        }
      }
    })
    this.selection.clear();
    if(this.moduleType == 'CustomModule'){
      this.http.delete(this.modulesURL + "?" + this.encodeData(params), {responseType: "text"}).subscribe((data) => {
        }, error => {
            console.error('There was an error deleting the module!', error);
        }
      );
    }
  }

  inputChanged(event: any, index: number){
    this.modules[index].name = event.target.value;
  }

  openModuleUpload(){
    let dialogRef = this.dialog.open(ModuleUploadComponent);
  }

  encodeData(data: { [x: string]: any; task?: string; id?: any; }) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
  }

  downloadModules(){
    this.selection.selected.forEach(module => {
      let params = {task: "download", id: module.uniqueId}
      this.http.get(this.modulesURL + "?" + this.encodeData(params),{
        responseType: 'arraybuffer'} 
       ).subscribe(response => this.downLoadFile(module,response, "text/x-python-script"));
    })
  }

  downLoadFile(module: any,data: any, type: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    var link = document.createElement("a"); // Or maybe get it from the current document
    link.href = url;
    link.download = module.module + ".py"
    link.click();
  }

  preventClick(event: { stopPropagation: () => void; }){
    event.stopPropagation()
  }
}