import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpResponse, HttpEventType, HttpHeaderResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { first, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

export interface FileElement {
  id?: string;
  isFolder: boolean;
  name: string;
  parent?: string;
  size?: number;
  parentObj?: any;
}

@Component({
  selector: 'app-sd-exports-page',
  templateUrl: './sd-exports-page.component.html',
  styleUrls: ['./sd-exports-page.component.css']
})
export class SdExportsPageComponent implements OnInit {

  isLoading:boolean = true;

  canNavigateUp = false;
  path!: String;

  sdLogsUrl: any = "/sdlogslist";

  logs: FileElement[] = []

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.navigateUp();
  }

  encodeData(data:any) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
  }

  navigateUp(){
    
    let params: any = {task: "getlogsfolder"}
    this.isLoading = true
    this.http.get(environment.http + this.sdLogsUrl + "?" + this.encodeData(params), { observe: 'response' })
      .pipe(first()).subscribe((resp:any) => {
        if (resp.status === 200) {
          let logslist = resp["body"]["logslist"]
          this.logs = []
          for(let i in logslist){
            this.logs.push({name:logslist[i], isFolder: true})
          }
        } else {}
        this.canNavigateUp = false
        this.path = ''
        this.isLoading = false
      }), (err:any) => {};
  }

  openMenu(event: MouseEvent, element: FileElement, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }

  navigate(element: FileElement) {
    if (element.isFolder) {
    
      let params: any = {task: "getlogrecords", logfolder: element.name}
      this.isLoading = true
      this.http.get(environment.http + this.sdLogsUrl + "?" + this.encodeData(params), { observe: 'response' })
        .pipe(first()).subscribe((resp:any) => {
          if (resp.status === 200) {
            let logrecords = resp["body"]["listLogRecords"]
            this.logs = []
            for(let i in logrecords){
              this.logs.push({name:logrecords[i]["recordName"], isFolder: false, id: logrecords[i]["recordName"].replace(".csv",""), parent:element.name, size: logrecords[i]["recordSize"], parentObj: element})
            }
          } else {}
          this.canNavigateUp = true
          this.path = element.name
          this.isLoading = false
        }), (err:any) => {};

    }else{
      this.downloadLogRecord(element.parent, element.id)
    }
  }

  refresh(path:any){
    if(path){
      for (var i = 0; i < this.logs.length; i++) {
        if(this.logs[i]["parent"] == path){
          this.navigate(this.logs[i]["parentObj"])
        }
      }
    }else{
      this.navigateUp()
    }
  }

  downloadLogRecord(folderName:any, file:any){
    let params: any = {task: "downloadlogrecord", logdate: file, logfolder: folderName}
    this.http.get(environment.http + this.sdLogsUrl + "?" + this.encodeData(params), { reportProgress: true, observe: 'response', responseType: 'blob'})
      .pipe(first()).subscribe((resp:any) => {
        //console.log(resp)
        if (resp.status === 200) {
          var a = document.createElement("a");
          a.href = URL.createObjectURL(resp.body);
          a.download = folderName+"_"+file+".csv";
          // start download
          a.click();
        } else {}
      }), (err:any) => {};
  }

  delete(element: FileElement){
    let params: any = {}

    if (element.isFolder){
      params["deleteType"] = "logfolder"
      params["folderName"] = element.name
    }else{
      params["deleteType"] = "logrecord"
      params["folderName"] = element.parent
      params["recordName"] = element.name
    }

    this.http.delete(environment.http + this.sdLogsUrl + "?" + this.encodeData(params), {responseType: "text"}).subscribe((data) => {
      //console.log(data)
      
      for (var i = 0; i < this.logs.length; i++) {

        if(this.logs[i]["name"] == element.name){
          this.logs.splice(i, 1)
        }
      }

    }, error => {
      console.error('There was an error deleting the log file!', error);
    });
  }

  formatBytes(a:any,b=2){
    if(0===a)return"0 Bytes";
    
    const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));
    
    return parseFloat((a/Math.pow(1024,d)).toFixed(c))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]
  }
}
