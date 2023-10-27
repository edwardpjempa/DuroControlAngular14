import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs";
import { ConfigDataService } from '../config-data.service';
import { MonitorDataService } from '../monitor-data.service';

import { MainNavComponent } from './../main-nav/main-nav.component';

@Component({
    selector: 'app-monitor',
    templateUrl: './monitor.component.html',
    styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit, OnDestroy{

    hmi:any
    currentView = {}
    components = []

    hmiContainer_!: HTMLElement;

    showSideNav: boolean = false
    showSideNavBtn: boolean = true

    noHmiContent: boolean = false

    viewName: any;
    viewData: any = {};
    viewConfig: any = {};

    sidenav_Subscription!: Subscription;

    @ViewChild('hmiContainer', { static: true })
    hmiContainer!: ElementRef;

    constructor(private mainNav: MainNavComponent,private route: ActivatedRoute, public monitorDataService: MonitorDataService) {
      this.mainNav.hideToolbar()//closing main toolbar
      //console.log("****** ROUTE PARAMS: ",this.route.params);


        //this.mainNav.closeSidenav()//closing main navigation bar
        //this.mainNav.hideToolbar()//closing main toolbar
        //this.mainNav.hideSidebar()//closing main toolbar
        //this.mainNav.closeDBnav()//closing main navigation bar
    }

    ngOnInit() {
      this.route.paramMap.subscribe(params => {
         this.viewName =  params.get("view");
         //this.viewConfig = this.monitorDataService.viewsIndex[this.viewName];
      });


      //   this.hmiContainer_ = this.hmiContainer.nativeElement

      //   this.hmi = JSON.parse(localStorage.getItem("duroControl.webeditor.project"));
        
      //   if(this.hmi !== undefined && this.hmi !== null){
      //       console.log(this.hmi)
      //       this.showSideNavBtn = this.hmi['general']['mainNavBtn']

      //       for (var i = 0; i < this.hmi['views'].length; i++) {

      //           if (this.hmi['general']['mainView'] === this.hmi['views'][i].name){
      //               this.hmiContainer_.style.width = this.hmi['views'][i].config.width + "px"
      //               this.hmiContainer_.style.height = this.hmi['views'][i].config.height + "px"

      //               //this.components = this.hmi['views'][i].components

      //               this.currentView = this.hmi['views'][i]
      //           }else{
      //               this.hmiContainer_.style.width = this.hmi['views'][0].config.width + "px"
      //               this.hmiContainer_.style.height = this.hmi['views'][0].config.height + "px"

      //               //this.components = this.hmi['views'][0].components
      //               this.currentView = this.hmi['views'][0]
      //           }
      //       }
      //   }else{
      //       this.noHmiContent = true
      //       this.mainNav.openSidenav()//opens main navigation bar
      //       //this.mainNav.showToolbar()//shows main toolbar
      //       this.showSideNavBtn = false
      //   }
      //   //Subscribes and listens to state (open/close) changes of the main sidebars
      //   this.sidenav_Subscription = this.mainNav.sidenavState.subscribe((data) =>{
      //       //console.log(data['state'])
      //       if((data['state'] === 'closed' && data['sidenav'] === 'leftnav') || (data['state'] === 'closed' && data['sidenav'] === 'rightnav')){
                
      //           this.onScaleChange(document.getElementById("mainContainer").offsetHeight, document.getElementById("mainContainer").offsetWidth)
      //           this.showSideNav = false
      //       }else if ((data['state'] === 'opened' && data['sidenav'] === 'leftnav') || (data['state'] === 'opened' && data['sidenav'] === 'rightnav')){
                
      //           this.onScaleChange(document.getElementById("mainContainer").offsetHeight, document.getElementById("mainContainer").offsetWidth)
      //           this.showSideNav = true
      //       }
      //   });
    }




    
    ngOnDestroy() {
        if(this.sidenav_Subscription){this.sidenav_Subscription.unsubscribe();}
    }

    //Listens to window dimensions changes
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.onScaleChange(document.getElementById("mainContainer")!.offsetHeight, document.getElementById("mainContainer")!.offsetWidth)
    }

    onScaleChange(container_H: number, continer_W: number){

        if(this.hmi !== undefined && this.hmi !== null){
            var scale = Math.min(continer_W / this.hmi['views'][0].config.width, container_H / this.hmi['views'][0].config.height );

            //console.log(scale)
            //console.log(container_H)
            //console.log(continer_W)

            this.hmiContainer_.style.transform = "scale(" + (scale - 0.009) + ") translate(-50%, -50%)" 
        }
    }

    mainSideNav(){

        if(this.showSideNav){
            this.mainNav.closeSidenav()//closing main navigation bar
        }else{
            this.mainNav.openSidenav()//opening main navigation bar
        }
    }
}