import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigDataService } from '../config-data.service';

@Component({
   selector: 'app-module-config',
   templateUrl: './module-config.component.html',
   styleUrls: ['./module-config.component.css']
})

export class ModuleConfigComponent implements OnInit {
  moduleIndex!: number;
  moduleConfigRoot: any = {}
  modulesURL = "/user_modules"
  private sub: any;
  config:any 
  tagsToRead = []
  tagsToWrite = []
  module = ''
  moduleType = ''
  moduleName = ''
  moduleComment = ''
  showComponent = false
  constructor(private http: HttpClient, private route: ActivatedRoute, public configDataService: ConfigDataService, private cdr: ChangeDetectorRef) {
    setTimeout(()=> {
      this.sub = this.route.params.subscribe(params => { 
        //if(params['index'] > this.configDataService.configFile.modules.length)
        //  return
        //this.moduleIndex = +params['index'];
        for(var i = 0; i < this.configDataService.configFile.modules.length; i++){
          if(this.configDataService.configFile.modules[i]['uniqueId'] == params['index']){
            this.module = this.configDataService.configFile.modules[i]['module']
            this.moduleType = this.configDataService.configFile.modules[i]['type']
            this.moduleName = this.configDataService.configFile.modules[i]['name']
            this.moduleComment = this.configDataService.configFile.modules[i]['comment']
            this.moduleIndex = i
          }
        }
        this.getModule()
       })
    }, 180)
  }

  ngOnInit(): void {
    setTimeout(()=> (document.getElementById('enabled') as HTMLInputElement).checked = false, 500)
    setTimeout(()=> (document.getElementById('enabled') as HTMLInputElement).checked =  this.configDataService.configFile.modules[Number(this.moduleIndex)]['enabled'], 600)
  }

  ngAfterViewInit(){
    document.getElementsByClassName('mat-form-field-wrapper')[1].setAttribute('style', 'padding-bottom: 0')
    document.getElementsByClassName('mat-form-field-underline')[1].setAttribute('style', 'bottom: 0')
  }
   
  ngAfterViewChecked(){
    var header = document.getElementsByClassName("mat-tab-header")[0] as HTMLElement
    if(this.moduleType == 'user' || this.moduleType == 'Comm'){
      header.style.display = 'none'
    }else{
      header.style.display = 'flex'
    }
    if(window.innerWidth < 950 && this.module=='EIPComm' || this.module=='EIPComm2' || this.module=='EIPComm3'){
      document.getElementById('title')!.innerHTML = 'EIP Communications'
    }else if(this.module=='EIPComm' || this.module=='EIPComm2' || this.module=='EIPComm3'){
      document.getElementById('title')!.innerHTML = 'EtherNet/IP Communications'
    }
    if(this.configDataService.configFile.modules[this.moduleIndex] != undefined){
      if(this.configDataService.configFile.modules[this.moduleIndex]['module'].substring(0,3) == "EIP"){ 
        if(this.moduleConfigRoot['config'] != undefined){
          this.moduleConfigRoot['config']['name'] = this.config['name']
          this.moduleConfigRoot['config']['enable'] = this.config['enable']
          this.moduleConfigRoot['config']['Slot'] = this.config['Slot']
          this.moduleConfigRoot['config']['mainTag'] = this.config['mainTag']
          this.moduleConfigRoot['config']['msgsOk'] = this.config['msgsOk']
          this.moduleConfigRoot['config']['msgsErr'] = this.config['msgsErr']
          this.moduleConfigRoot['config']['lastErr'] = this.config['lastErr']
        }
      }  
    }
  }


  
  onChanged(property: string){
    if(property == 'name'){
      this.moduleConfigRoot[property] = this.moduleName
    }
    else if(property == 'comment'){
      this.moduleConfigRoot[property] = this.moduleComment
    }
    this.cdr.detectChanges();
  }

  click(){
    this.configDataService.configFile.modules[Number(this.moduleIndex)]['enabled'] = (document.getElementById('enabled') as HTMLInputElement).checked
  }

  getModule(){
    var count = 0 
    var moduleLength = 0
    var interval = setInterval(()=> 
      {
        count++;
        moduleLength = this.configDataService.configFile.modules.length; 
        if(count == 100 || moduleLength != 0){
          if(this.configDataService.configFile.modules[this.moduleIndex]['module'].substring(0,3) == "EIP"){   
            this.config = { 
              'PLCIP': this.configDataService.configFile.modules[this.moduleIndex]['config']['PLCIP'],
              'lastErr': this.configDataService.configFile.modules[this.moduleIndex]['config']['lastErr'],
              'enable': this.configDataService.configFile.modules[this.moduleIndex]['config']['enable'],
              'msgsOk': this.configDataService.configFile.modules[this.moduleIndex]['config']['msgsOk'],
              'msgsErr': this.configDataService.configFile.modules[this.moduleIndex]['config']['msgsErr']
            }
            this.tagsToRead = this.configDataService.configFile.modules[this.moduleIndex]['config']['tagsToRead']
            this.tagsToWrite = this.configDataService.configFile.modules[this.moduleIndex]['config']['tagsToWrite']
           this.moduleConfigRoot = this.configDataService.configFile.modules[this.moduleIndex]
          }
          else if(this.configDataService.configFile.modules[this.moduleIndex]['module'] == "modbusTCPServer"){
            this.moduleConfigRoot = this.configDataService.configFile.modules[this.moduleIndex]
          }
          else if(this.configDataService.configFile.modules[this.moduleIndex]['module'] == "modbusTCPClient"){
            this.moduleConfigRoot = this.configDataService.configFile.modules[this.moduleIndex]
          }  
          else{
            this.moduleConfigRoot = this.configDataService.configFile.modules[this.moduleIndex]
          }
          this.showComponent = true
          if(this.moduleConfigRoot.type == "CustomModule"){
             let params = {task: "download", id: this.moduleConfigRoot.uniqueId}
             this.http.get(this.modulesURL + "?" + this.encodeData(params),{
               responseType: 'arraybuffer'} 
              ).subscribe(response =>{
                let blob = new Blob([response], { type: "text/x-python-script"});
                let url = window.URL.createObjectURL(blob);
                this.moduleConfigRoot.url = url
              });
             }
             clearInterval(interval)
        }
      }, 10)
  }

  encodeData(data: { [x: string]: any; task?: string; id?: any; }) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
  }

  downloadFile(){
    var link = document.createElement("a"); // Or maybe get it from the current document
    link.href = this.moduleConfigRoot.url;
    link.download = this.moduleConfigRoot.module + ".py"
    link.click();
  }

  hasProp(o: { hasOwnProperty: (arg0: any) => any; }, name: any) {
    return o.hasOwnProperty(name);
  }
}
