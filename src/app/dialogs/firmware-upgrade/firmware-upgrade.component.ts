import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { HttpClient, HttpResponse, HttpEventType, HttpHeaderResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { first, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError'; 

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-firmware-upgrade',
  templateUrl: './firmware-upgrade.component.html',
  styleUrls: ['./firmware-upgrade.component.scss']
})
export class FirmwareUpgradeComponent implements OnInit, OnDestroy {

  url: any = "/softwareupdate";

  firmwareFileName: string = '';

  firmwareFile: any = null;

  upload_progress: boolean = false;
  upload_status: number = 0;

  restart_timer_firmware: number = 5;
  
  restart_timer_id: any
  restarted_timer_id: any
  uploadSuccess_timer_id: any
  check_upgrade_timeout_error_id: any
  upgrade_timeout_error_id: any

  percentDone!: number;

  upgrading: boolean = false
  upgraded: boolean = false

  firmwareVerSubs!: Subscription


  firmwareVer: string = "Not Available"

  disableCloseBtn: boolean = false

  constructor(private http: HttpClient,
    public dialogRef: MatDialogRef<FirmwareUpgradeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    let params: any = {task: "firmwareVer"}
    this.http.get(environment.http + this.url + "?" + this.encodeData(params), { observe: 'response' })
      .pipe(first()).subscribe((resp: any) => {
        //console.log(resp)
        if (resp.status === 200) {
          if(resp.body!.hasOwnProperty("version_major") && resp.body!.hasOwnProperty("version_minor") && resp.body!.hasOwnProperty("release")){
            this.firmwareVer = resp.body["version_major"] + "." + resp.body["version_minor"]  + "." + (resp.body["release"])
          }
        } else {}
      }), (err: any) => {};


    /*let params: any = {task: "firmwareVer"}
    this.firmwareVerSubs = interval(2000).subscribe(() => {
      this.http.get(this.url + "?" + this.encodeData(params))
      .pipe(
        catchError((err) => {
          console.log('error caught in service')
          console.error(err);
 
          //Handle the error here
 
          return throwError(err);    //Rethrow it back to component
        })
        ).subscribe((resp) => {
          console.log(resp)
        }), (err) => {
          console.log(err)
          console.log("test")
        };
    });*/
  }

  onNoClick(): void {
    this.dialogRef.close();
    if (this.upgraded){
      window.location.reload()
    }
  }

  uploadFirmware(files: File[]){
    this.disableCloseBtn = true; this.upload_status = 1; //this.mainNav.disableBtns = true;

    this.uploadAndProgressFirmware(files);
  }

  uploadAndProgressFirmware(files: any[]){
    //console.log(files)

    const file = files[0]

    this.upgrading = true

    this.firmwareFileName = file.name;

    let params: any = {}
    params['filename'] = file.name;
    params['task'] = "firmware";
    
    this.http.post(environment.http + this.url + "?" + this.encodeData(params), file, {reportProgress: true, observe: 'events', responseType: 'text'})
      .subscribe((event:any) => {
        //console.log(event)

        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round(100 * event.loaded / event.total);
          //console.log(this.percentDone)

        } else if (event instanceof HttpHeaderResponse || event instanceof HttpResponse) {
          //console.log(event)

          if (event.status === 200){
            this.upload_status = 2

            this.uploadSuccess_timer_id = setTimeout(() => {
              this.uploadSuccess_timer_id = null

              this.upload_status = 3

              // Countdown timer to restar duro1
              this.restart_timer_id = setInterval(() => {

                --this.restart_timer_firmware
                if (this.restart_timer_firmware === 0) {
                  this.upload_status = 4
                  this.restart_timer_firmware = 5
                  clearInterval(this.restart_timer_id)
                  this.restart_timer_id = null
                  //this.mainNav.disableBtns = false

                  let params: any = {}
                  params['filename'] = "none"
                  params['task'] = "reboot";

                  this.http.post(environment.http + this.url + "?" + this.encodeData(params),{}, {responseType: 'text'}).subscribe(res => {
                    //console.log(res)
                  })

                  this.restarted_timer_id = setTimeout(() => {
                    this.restarted_timer_id = null

                    this.upload_status = 6

                    setTimeout(() => {
                      //this.disableCloseBtn = false;

                      this.checkForDuro1()

                    },5000)

                    //this.dialogRef.close(true);
                  },16000)
                }
              }, 1000)

            }, 3000)
          }else{

            this.upgrading = false
            //this.mainNav.disableBtns = false
            this.upload_status = 5

            this.restarted_timer_id = setTimeout(() => {
              this.restarted_timer_id = null

              this.upload_status = 0
              this.firmwareFile = null
              this.firmwareFileName = ''

              this.disableCloseBtn = false;
            },5000)
          }
        }
    });
  }

  checkForDuro1(){
    let params: any = {task: "firmwareVer"}
    this.firmwareVerSubs = interval(1500).subscribe(() => {
      this.http.get(environment.http + this.url + "?" + this.encodeData(params), { observe: 'response' })
        .pipe(catchError((err) => {
          //console.log('error caught in service')
          //console.error(err);

          this.check_upgrade_timeout_error_id = setTimeout(() => {
            clearTimeout(this.check_upgrade_timeout_error_id);
            this.upload_status = 8

            this.firmwareFile = null
            this.firmwareFileName = ''

            this.upgrading = false
            this.upgraded = false

            this.disableCloseBtn = false;

            this.upgrade_timeout_error_id = setTimeout(() => {
              clearTimeout(this.upgrade_timeout_error_id);
              this.upload_status = 0
              this.dialogRef.close(true);
              window.location.reload()
            },4000)

          },120000)
 
          //Handle the error here
          return throwError(err);    //Rethrow it back to component
        })).subscribe((resp:any) => {
          console.log(resp)
          if (resp.status === 200) {
            if(resp.body.hasOwnProperty("version_major") && resp.body.hasOwnProperty("version_minor") && resp.body.hasOwnProperty("release")){
              this.firmwareVer = resp.body["version_major"] + "." + resp.body["version_minor"]  + "." + resp.body["release"]
            }
            if (this.firmwareVerSubs) this.firmwareVerSubs.unsubscribe()

            clearTimeout(this.check_upgrade_timeout_error_id);
            clearTimeout(this.upgrade_timeout_error_id);

            if(!this.upgraded){
              this.upload_status = 7

              this.firmwareFile = null
              this.firmwareFileName = ''

              this.upgrading = false
              this.upgraded = true
            }
            this.disableCloseBtn = false;

            setTimeout(() => {
              this.upload_status = 0
              this.upgraded = false
              this.dialogRef.close(true);
              window.location.reload()
            },5000)
          }
        })
    });
  }

  encodeData(data: { [x: string]: any; }) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
  }  

  formatBytes(a: number,b=2){
    if(0===a)return"0 Bytes";
    
    const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));
    
    return parseFloat((a/Math.pow(1024,d)).toFixed(c))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]
  }

  ngOnDestroy() {
    if (this.firmwareVerSubs) this.firmwareVerSubs.unsubscribe()
  }
}