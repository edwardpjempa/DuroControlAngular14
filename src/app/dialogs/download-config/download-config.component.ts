import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpResponse, HttpEventType, HttpHeaderResponse } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';

import { environment } from 'src/environments/environment';

import { MainNavComponent } from '../../main-nav/main-nav.component';
import { ConfigDataService } from '../../config-data.service';

import { DbDataService } from '../../db-data.service';

@Component({
  selector: 'app-download-config',
  templateUrl: './download-config.component.html',
  styleUrls: ['./download-config.component.scss']
})
export class DownloadConfigComponent implements OnInit, OnDestroy {

  url: any = "/softwareupdate";

  configFileName: string = '';

  configFile: any = null;

  upload_progress: boolean = false;
  upload_status: number = 0;
  
  uploadSuccess_timer_id: any

  percentDone!: number;

  disableCloseBtn: boolean = false

  webSocketOpenSubs!: Subscription
  webSocketCloseSubs!: Subscription


  constructor(private http: HttpClient, public configDataService: ConfigDataService, public dbService: DbDataService, //public mainNav: MainNavComponent
    public dialogRef: MatDialogRef<DownloadConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.webSocketOpenSubs = this.dbService.currentConnection.on('open').subscribe(msg => {
      //console.log(msg)

      // Wait while duro1 restarts to continue with config update 
      if (this.upload_status === 3){

        this.upload_status = 4

        this.disableCloseBtn = false;

        this.uploadSuccess_timer_id = setTimeout(() => {
          this.uploadSuccess_timer_id = null

          this.upload_status = 0
          this.configFile = null
          this.configFileName = ''

          this.dialogRef.close(true);

          window.location.reload()

        }, 4000)
      }
    })

    this.webSocketCloseSubs = this.dbService.currentConnection.on('close').subscribe(msg => {
      //console.log(msg)
    })
  }

  ngOnDestroy() {
    if(this.webSocketOpenSubs){
      this.webSocketOpenSubs.unsubscribe()
    }
    if(this.webSocketCloseSubs){
      this.webSocketCloseSubs.unsubscribe()
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  uploadConfig(files: File[]){
    this.disableCloseBtn = true; this.upload_status = 1; //this.mainNav.disableBtns = true;

    this.uploadAndProgressConfig(files);
  }

  uploadAndProgressConfig(files:any){
    //console.log(files)

    const file = files[0]

    this.configFileName = file.name;
   
    let params: any = {}
    params['filename'] = file.name;
    params['task'] = "config";

    let MAIN_CONFIG_URL = environment.http + "/configservices";

    this.http.post(environment.http + this.url + "?" + this.encodeData(params), file, {reportProgress: true, observe: 'events'})
      .subscribe((event:any) => {
        //console.log(event)

        //this.mainNav.disableBtns = false

        if (event.type === HttpEventType.UploadProgress) {

          this.percentDone = Math.round(100 * event.loaded / event.total);
          //console.log(this.percentDone)

        } else if (event instanceof HttpResponse || event instanceof HttpHeaderResponse ) {
          //console.log(event)

          if (event.status === 200){
            this.upload_status = 2
            
            //this.mainNav.disableBtns = false

            //this.uploadSuccess_timer_id = setTimeout(() => {
            //  this.uploadSuccess_timer_id = null

              this.upload_status = 3

            //}, 2200)
          }else{
            //this.mainNav.disableBtns = false
            this.upload_status = 5

            this.disableCloseBtn = false;

            this.uploadSuccess_timer_id = setTimeout(() => {
              this.uploadSuccess_timer_id = null

              this.upload_status = 0
              this.configFile = null
              this.configFileName = ''

              //this.disableCloseBtn = false;
            }, 5000)
          }
        }
    });
  }

  encodeData(data:any) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
  }  

  formatBytes(a:any,b=2){
    if(0===a)return"0 Bytes";
    
    const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));
    
    return parseFloat((a/Math.pow(1024,d)).toFixed(c))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]
  }
}

            /*this.http.get(MAIN_CONFIG_URL).subscribe((data: any) => {
              //console.log(data)

              // Update GUI config
              this.configDataService.configFile = data
              this.configDataService.hmi = data["hmi"]

              console.log(this.configDataService.hmi)
            }, error => {
              console.log(error.message)
            })*/