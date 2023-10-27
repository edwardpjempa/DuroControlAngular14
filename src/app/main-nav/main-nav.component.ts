import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ConfigDataService } from '../config-data.service';
import { MatSidenav} from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError'; 
import { AboutComponent } from '../about/about.component';
import { DownloadConfigComponent } from "../dialogs/download-config/download-config.component";
import { FirmwareUpgradeComponent } from "../dialogs/firmware-upgrade/firmware-upgrade.component";
import { Utils } from '../editor/helpers/utils';
import { version } from '../../../package.json';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})

export class MainNavComponent {
  @ViewChild('sidenav', {static: false}) sidenav!: MatSidenav;
  @ViewChild('databaseNav', {static: false}) databaseNav!: MatSidenav;

  url: any = "/softwareupdate";
  sidenavState = new Subject();
  sidenavOpen: boolean = true;
  hideToolbar_: boolean = false;
  hideSidebar_: boolean = false;
  disableBtns: boolean = false;
  uploadFilesList: any = []
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );
  initialModules:any = []
  prevWidth = 0
  
  constructor(private breakpointObserver: BreakpointObserver, private http: HttpClient, public configDataService: ConfigDataService, 
    public router: Router, public dialog: MatDialog) {
      setTimeout(()=>  {this.initialModules = [...this.configDataService.configFile.modules];
      }, 500)
  }

  ngOnInit(){
    //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    setTimeout(()=>{
      if(window.location.pathname.includes('module') && window.innerWidth < 940){
        this.closeSidenav()
      }
    })
  }

  onResize(event: any) {
    if(event.target.innerWidth < this.prevWidth && event.target.innerWidth < 940){
      this.closeSidenav()
    }
    else if(event.target.innerWidth > this.prevWidth && event.target.innerWidth >= 940){
      this.openSidenav()
    }
    this.prevWidth = event.target.innerWidth
  }

  filteredModules(){
    return this.configDataService.configFile.modules.filter((item: { module: string; }) => item.module != 'EIPCComm' && item.module != 'httpClient' && item.module != 'modbusRTUClient');
  }

  goToMonitor() {
    window.location.href = '/monitor'
  }

  drag(event: any){
    event.dataTransfer.setData("text", event.target.textContent);
  }

  onOpenSidenav(){
    this.sidenavState.next({state: 'opened', sidenav: 'leftnav'})
  }

  onCloseSidenav(){
    this.sidenavState.next({state:'closed', sidenav: 'leftnav'})
  }

  onOpenDBnav(){
    this.sidenavState.next({state: 'opened', sidenav: 'rightnav'})
  }

  onCloseDBnav(){
    this.sidenavState.next({state: 'closed', sidenav: 'rightnav'})
  }

  closeSidenav(){
    this.sidenav.close()
  }

  openSidenav(){
    this.sidenav.open()
  }

  hideSidebar(){
    this.hideSidebar_ = true
  }

  hideToolbar(){
    this.hideToolbar_ = true
  }

  showToolbar(){
    this.hideToolbar_ = false
  }

  DBresize(event: any){
    this.sidenavState.next({state: 'resize', sidenav: 'rightnav', data: event})
  }

  closeDBnav(){
    if(this.databaseNav) this.databaseNav.close()
  }

  uploadConfig(){
    let filename_ = "duroControl-" + new Date().toLocaleString() + ".config"
    let filename = filename_.toString().replace(/\s/g, "")
    let uploadId = Utils.getShortGUID()
    let params: any = {task: "getCurrentConfig", uploadId: uploadId}
    this.uploadFilesList.push({uploadId: uploadId, filename: filename, status: "In Progress"})
    this.http.get(this.url + "?" + this.encodeData(params),{
      responseType: 'text', observe: 'response'} 
    ).pipe(catchError((err) => {
      let uploadId_ = this.getQueryString("uploadId", err.url)
      const fileId = (element: { uploadId: string | null; }) => element.uploadId === uploadId_;
      const index = this.uploadFilesList.findIndex(fileId);
      if(index !== -1){
        this.uploadFilesList[index]["status"] = "Failed"
      }
      //Handle the error here
      return throwError(err);    //Rethrow it back to component
    })).subscribe(response =>{
      let currentConfig = this.base64toBlob(response.body || '', "application/gzip;charset=binary")
      this.downloadFile(filename, currentConfig)
      let uploadId_ = this.getQueryString("uploadId", response.url)
      const fileId = (element: { uploadId: string | null; }) => element.uploadId === uploadId_;
      const index = this.uploadFilesList.findIndex(fileId);
      if(index !== -1){
        this.uploadFilesList[index]["status"] = "Completed"
      }
    });
  }

  downloadFile(filename: string, file: Blob | MediaSource){
    var link = document.createElement("a"); // Or maybe get it from the current document
    link.href =  window.URL.createObjectURL(file);
    link.download = filename
    link.click();
  }

  uploadsMenuClosed(){
    let selectionsCopy = Utils.clone(this.uploadFilesList)//cloning the selections array to keep a static reference  
    for (var i = 0; i < selectionsCopy.length; i++) {
      for (var ii = 0; ii < this.uploadFilesList.length; ii++) {
        if(this.uploadFilesList[ii].uploadId === selectionsCopy[i].uploadId){
          if(this.uploadFilesList[ii]["status"] === "Completed" || this.uploadFilesList[ii]["status"] === "Failed"){
            this.uploadFilesList.splice(ii,1)
          }
        }
      }
    }
  }

  getQueryString = function ( field: string, url: string | null ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
  };

  encodeData(data: { [x: string]: any; }) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
  }  

  base64toBlob(base64Data: string, contentType: string) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  downloadConfig(){
    let dialogRef = this.dialog.open(DownloadConfigComponent, {
      position: { top: '60px' },
      data: {  },
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {}
    });
  }

  firmwareUpgrade(){
    let dialogRef = this.dialog.open(FirmwareUpgradeComponent, {
      position: { top: '60px' },
      data: {  },
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {}
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AboutComponent, {
      height: '200px',
      width: '270px', // Set the width of the dialog
      data: { version: "version" }, // Pass any required data to the dialog component
      panelClass: 'my-panel-class'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }
}