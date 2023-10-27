import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef, ViewEncapsulation } from '@angular/core';
import { Subscription, fromEvent, Subject } from "rxjs";
import { MainNavComponent } from './../main-nav/main-nav.component';
import { MatSidenav } from '@angular/material/sidenav';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CdkDrag } from '@angular/cdk/drag-drop';

import { Utils } from './helpers/utils'
import { HistoryService } from './history/history.service'
import { EditorService } from './service/editor.service'
import { ViewProperties, HMIComponents } from './../models/components'
import { Hmi, View, Components, SAMPLE_HMI_CONFIG, DocProfile, ViewStyle, TempData } from './../models/hmi'
import { DialogDocProperty, DialogLayoutSettings } from './dialogs/index';
import { ConfigDataService } from '../config-data.service';

@Component({
   selector: 'app-editor',
   templateUrl: './editor.component.html',
   styleUrls: ['./editor.component.scss'],
   encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit, OnDestroy {
   isLoading: boolean = true;

   //For component resizing
   resizer!: Function;
   //

   //Component selection
   ctrlKey: boolean = false
   selections: Array<any> = []//holds the components that have been selected
   //

   //Holds dimensions of editor's main container 
   mainContainer:any = {}; content_main:any = {};
   //

   //For zoom
   zoomCanvas: string = "Fit to canvas"
   zoomVal = 100; zoomMin = 25; zoomMax = 180;
   zoomScales = [{rawVal: "zoom" + this.zoomMax, viewVal: this.zoomMax + "%"}, 
      {rawVal: "zoom150", viewVal: "150%"}, 
      {rawVal: "zoom100", viewVal: "100%"},
      {rawVal: "zoom75", viewVal: "75%"},
      {rawVal: "zoom50", viewVal: "50%"},
      {rawVal: "zoom" + this.zoomMin, viewVal: this.zoomMin + "%"},
      {rawVal: "fitCanvas", viewVal: "Fit to canvas"}
   ]
   scale = 100; top = 0; left = 0;
   //

   //Subscriptions
   sidenav_Subscription!: Subscription;
   wheelZoom_Subscription!: Subscription;
   //
   e_objSidenav = new Subject();

   panelsState = {
      enable: true,
      panelView: false,
      panelObjects: false,
      panelProperties: false,
      propertiesOnEdition: false
   }

   propertiesOnEdit: boolean = false
   onViewsPanel: boolean = false

   public currentView!: View;

   view: any = {config: new DocProfile()}

   editor_sidenav: boolean = false; editorBorder: boolean = true; editorBackgd: boolean = true;

   workspace_!: HTMLElement

   hmiDefaultData: any = {}

   viewProperties: any = {};

   dragConstrainPoint = (point:any, dragRef:any) => {
      let zoomMoveXDifference = 0; let zoomMoveYDifference = 0;
     //console.log(point)
     //console.log(dragRef)

      if ((this.zoomVal/100) != 1) {
         zoomMoveXDifference = (1 - (this.zoomVal/100)) * dragRef.getFreeDragPosition().x;
         zoomMoveYDifference = (1 - (this.zoomVal/100)) * dragRef.getFreeDragPosition().y;
      }
      //console.log(point.x + zoomMoveXDifference)
      //console.log(point.y + zoomMoveYDifference)
      return {
         x: point.x + zoomMoveXDifference,
         y: point.y + zoomMoveYDifference
      };
   }

   prev_mainContainer_dimen = 0
   prev_content_main_dimen = 0


   @ViewChild('canvas', { static: true }) canvas!: ElementRef;
   @ViewChild('parentSelect') parentSelect!: ElementRef;
   @ViewChild('e_sidenav', { static: true }) e_sidenav!: MatSidenav;
   @ViewChild('projectFileOpenInput') projectFileOpenInput: any;
   @ViewChild('workspace', { static: true }) workspace!: ElementRef;
   
   constructor(public configDataService: ConfigDataService, private mainNav: MainNavComponent, public history: HistoryService, 
      public dialog: MatDialog, public eservice: EditorService) {}

   ngOnInit() {
      this.hmiDefaultData = new Hmi()
      //this.hmiDefaultData = SAMPLE_HMI_CONFIG

      this.workspace_ = this.workspace.nativeElement;

      //Gets initial dimensions from main container
      this.mainContainer = { h: document.getElementById("mainContainer")!.offsetHeight, w: document.getElementById("mainContainer")!.offsetWidth }

      this.content_main = { h: document.getElementById("content_main")!.offsetHeight, w: document.getElementById("content_main")!.offsetWidth }

      //Subscribes and listens to state (open/close) changes of the main sidebar
      this.sidenav_Subscription = this.mainNav.sidenavState.subscribe((data:any) => {
         //console.log(data['state'])
         
         if (data['state'] === 'closed' && data['sidenav'] === 'leftnav') {

            this.e_sidenav.open()
         } else if (data['state'] === 'opened' && data['sidenav'] === 'leftnav') {

            this.e_sidenav.close()

         } else if (data['state'] === 'opened' && data['sidenav'] === 'rightnav') {

            this.prev_mainContainer_dimen = this.mainContainer['w']
            this.prev_content_main_dimen = this.content_main['w']
            this.onResize()
            
         } else if (data['state'] === 'closed' && data['sidenav'] === 'rightnav') {

            this.onResize()
         } else if (data['state'] === 'resize' && data['sidenav'] === 'rightnav') {
            //console.log(data['data'])

            this.mainContainer['w'] = this.prev_mainContainer_dimen - data['data']
            this.content_main['w'] = this.prev_content_main_dimen  - data['data']
         }
      });
      //Closing main navigation and database sidebars
      this.mainNav.closeSidenav(); this.mainNav.closeDBnav();

      //Initialize view
      this.getViews()

      this.wheelZoomInit()
   }

   ngAfterViewChecked() {
      this.eservice.ctx = this.canvas.nativeElement.getContext('2d');
      this.mainNav.sidenavOpen = false
   }

   ngAfterViewInit(){

      setTimeout(() => {

         this.configDataService.hmiDataRcvd.subscribe((value) => {

            if(value === "true"){
               this.history.clearHistory();
               //sessionStorage.removeItem("duroControl.webeditor.tempData");
               this.history.sendToHistory(this.configDataService.hmi)
               this.initializeView();
               this.isLoading = false;
            }else if (value === "false"){
               console.log("Error loading HMI data from DuroControl")
               this.isLoading = false;
            }
         });
      });
   }

   ngOnDestroy() {
      let tempdata: any = sessionStorage.getItem("duroControl.webeditor.tempData");
      if(tempdata !== null) tempdata = JSON.parse(tempdata)
      if(tempdata === null) tempdata = new TempData();

      if(this.currentView){
         if(tempdata['views'].hasOwnProperty(this.currentView.id)){

            if(tempdata['views'][this.currentView.id].hasOwnProperty("zoom")) tempdata['views'][this.currentView.id]['zoom'] = this.zoomVal
            if(tempdata['views'][this.currentView.id].hasOwnProperty("transform-origin")) tempdata['views'][this.currentView.id]['transform-origin'] = this.workspace_.style.transformOrigin
         }
      }

      if(tempdata.hasOwnProperty("lastView")){
         tempdata["lastView"] = this.currentView.id
      }else{
         tempdata["lastView"] = this.currentView.id
      }

      sessionStorage.setItem("duroControl.webeditor.tempData", JSON.stringify(tempdata));

      if (this.sidenav_Subscription) { this.sidenav_Subscription.unsubscribe(); }
      if (this.wheelZoom_Subscription) { this.wheelZoom_Subscription.unsubscribe(); }
      this.history.dataCurrentHistory = [];//clears the user history in the editor
   }

   /**
    * View Initialization
    */
   initializeView() {
      this.currentView = new View;
      //console.log(this.configDataService)
      // Check if hmi config exists in config file
      if(this.configDataService.hasOwnProperty("hmi") && this.configDataService.hmi){

         if (this.configDataService.hmi.views.length === 0) {
            this.onAddView();
            this.onSelectView(this.configDataService.hmi.views[0].id);

         } else if (this.configDataService.hmi.views.length > 0) {
            let tempdata: any = sessionStorage.getItem("duroControl.webeditor.tempData");

            if(tempdata !== null) {
               tempdata = JSON.parse(tempdata)
            }else if (tempdata === null) {
               tempdata = new TempData();
            }

            if(tempdata.hasOwnProperty("lastView")){
               if(tempdata["lastView"] !== null){
                  let lastViewFound = false
                  for (var i = 0; i < this.configDataService.hmi.views.length; i++) {

                     if(this.configDataService.hmi.views[i].id === tempdata["lastView"]){
                        this.onSelectView(this.configDataService.hmi.views[i].id);
                        lastViewFound = true
                        break;
                     }
                     if(i === this.configDataService.hmi.views.length-1 && lastViewFound === false){
                        this.onSelectView(this.configDataService.hmi.views[0].id);
                     }
                  }
               }else{
                  this.onSelectView(this.configDataService.hmi.views[0].id);
               }
            }else{
               this.onSelectView(this.configDataService.hmi.views[0].id);
            }
         }
      }else{
         // If not hmi config exists, create one by default
         this.configDataService.hmi = new Hmi()

         this.onAddView();
         this.onSelectView(this.configDataService.hmi.views[0].id);
      }
   }


   /**
    * If available, gets view from hmi views list
    */
   getViews() {
      if (this.hmiDefaultData.hasOwnProperty("views")) {
         for (var i = 0; i < this.hmiDefaultData['views'].length; i++) {
            this.configDataService.hmi.views.push(this.hmiDefaultData['views'][i]['view'])
            this.configDataService.hmi.general.viewsTree.push(this.hmiDefaultData['general']['viewsTree'][i])
         }
      }
      this.initializeView();
   }


   /**
    * Sort list of views
    */
   getViewsSorted() {
      return this.configDataService.hmi.views.sort((a, b) => {
         if (a.name > b.name) { return 1; }
         return -1;
      });
   }


   /**
    * Add View to Project with a default name View_[x]
    */
   onAddView() {
      //console.log("Adding new view")
      if (this.configDataService.hmi.views) {

         let v = new View();
         if (this.configDataService.hmi.views.length <= 0) {
            v.name = 'MainView';
         } else {
            v.name = Utils.defaultName(this.configDataService.hmi.views, "View_", "name")
         }
         v.id = 'vw_' + Utils.getGUID();
         this.configDataService.hmi.views.push(v);
         this.configDataService.hmi.general.viewsTree.push({ name: v.name, type: 'view', id: v.id })
         this.onSelectView(v.id);
         //console.log(this.hmi.views)
      }
   }


   /**
    * On view selection
    */
   onSelectView(viewId:any) {
      //console.log(viewId)
      this.history.updateButtons(viewId)
      if(this.currentView){
         if(this.currentView.id === viewId) return
      }
      this.selections = [];
      this.e_objSidenav.next({ state: 'open' })

      let tempdata: any = sessionStorage.getItem("duroControl.webeditor.tempData");
      if(tempdata !== null) tempdata = JSON.parse(tempdata)
      if(tempdata === null) tempdata = new TempData();

      //we check if there is temp editor data from previous view
      if(this.currentView){
         if(tempdata['views'].hasOwnProperty(this.currentView.id)){

            if(tempdata['views'][this.currentView.id].hasOwnProperty("zoom")) tempdata['views'][this.currentView.id]['zoom'] = this.zoomVal
            if(tempdata['views'][this.currentView.id].hasOwnProperty("transform-origin")) tempdata['views'][this.currentView.id]['transform-origin'] = this.workspace_.style.transformOrigin
         }
      }

      this.currentView = this.configDataService.hmi.views.find(x => x.id === viewId)!

      this.eservice.viewPropertiesCheck(this.currentView, this.configDataService.hmi)

      //console.log(tempdata)

      if(!tempdata['views'].hasOwnProperty(viewId)){
         tempdata['views'][viewId] = {}
         if(!tempdata['views'][viewId].hasOwnProperty("zoom")) tempdata['views'][viewId]['zoom'] = 100
         if(!tempdata['views'][viewId].hasOwnProperty("transform-origin")) tempdata['views'][viewId]['transform-origin'] = "unset"
      }

      sessionStorage.setItem("duroControl.webeditor.tempData", JSON.stringify(tempdata));

      this.loadView(this.currentView);
      //console.log(this.currentView)
   }


   /**
    * Load view and set intial workspace configuration
    */
   loadView(view:any) {
      if (view) {
         this.view.config.height = view.config.height
         this.view.config.width = view.config.width

         //console.log(view)

         this.workspace_.style.transform = "translate(-50%, -50%) scale(1)"
         this.workspace_.style.transformOrigin = "unset"

         this.view.config.style['backgroundColor'] = new ViewStyle()['backgroundColor'];
         
         if(view.hasOwnProperty("config") && view.config.hasOwnProperty("style")){
            let viewproperties:any = new ViewProperties();
            for (var property in viewproperties){
               this.view.config.style[property] = viewproperties[property]['data']
            }
            for (var property in view.config.style){
               if(viewproperties.hasOwnProperty(property)){

                  this.view.config.style[property] = view.config.style[property]
               }else{
                  //delete view.config.style[property]
               }
            }
         }else if(!view.config.hasOwnProperty("style")){
            view.config['style'] = {}
         }
         //console.log(this.view.config.style)

         this.view_BorderBackgdSelection()

         let tempdata: any = sessionStorage.getItem("duroControl.webeditor.tempData");
         if(tempdata !== null) {
            tempdata = JSON.parse(tempdata)
            this.onZoomChange(tempdata['views'][view.id]['zoom']);
            this.workspace_.style.transformOrigin = tempdata['views'][view.id]['transform-origin']
         }

         //check for the default properties of the components
         this.eservice.propertiesCheck(this.currentView, this.configDataService.hmi.views)

         //this.history.sendToHistory(this.configDataService.hmi)

         //console.log( this.configDataService.hmi.views)
      }
   }


   /**
    * Open View event, file imported
    */
   onViewFileChangeListener(event:any, viewFileImportInput:any) {
      let text = [];
      let files = event.srcElement.files;
      let input = event.target;
      let reader:any = new FileReader();
      reader.onload = (data:any) => {
         let view = JSON.parse(reader.result.toString());
         //console.log(view)
         for (var i = 0; i < view.length; i++){
            if (view[i]) {
               let idx = 1;
               let startname = view[i].name;
               let existView = null;
               while (existView = this.configDataService.hmi.views.find((v) => v.name === view[i].name)) {
                  view[i].name = startname + '_' + idx++;
               }
               view[i].id = 'vw_' + Utils.getGUID();
               this.configDataService.hmi.views.push(view[i]);
               this.configDataService.hmi.general.viewsTree.push({ name: view[i].name, type: 'view', id: view[i].id })
               this.onSelectView(view[i].id);
            }
         }
         
      }
      reader.onerror = function () {
         let msg = 'Unable to read ' + input.files[0];
         alert(msg);
      };
      reader.readAsText(input.files[0]);
      viewFileImportInput.value = null;
      //viewFileImportInput.nativeElement.value = null;
   }


   /**
    * Edit View property (height, width)
    */
   onPropertyView(viewId:any) {
      this.panelsState.propertiesOnEdition = true
      let view: any = {}
      for (var i = 0; i < this.configDataService.hmi.views.length; i++) {
         if(this.configDataService.hmi.views[i].id === viewId){
            view = this.configDataService.hmi.views[i]
            break;
         }
      }

      let dialogRef = this.dialog.open(DialogDocProperty, {
         position: { top: '60px' },
         data: { name: view.name, width: view.config.width, height: view.config.height, sizeMode: view.config.sizeMode, 
            style: view.config.style, editorBorder: this.editorBorder, editorBackgd: this.editorBackgd
         }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result && result.width && result.height) {

            this.editorBorder = result.editorBorder
            this.editorBackgd = result.editorBackgd

            if(view.hasOwnProperty("config") && view.config.hasOwnProperty("style")){
               let viewproperties = new ViewProperties();
               for (var property in view.config.style){
                  if(viewproperties.hasOwnProperty(property)){
                    
                     this.view.config.style[property] = view.config.style[property]
                  }
               }
            }
            //console.log(this.editorBackgd)
            this.view_BorderBackgdSelection()

            view.config.width = parseInt(result.width); view.config.height = parseInt(result.height);
            view.config.sizeMode = result.sizeMode;

            this.view.config.height = result.height; this.view.config.width = result.width;
         }
         this.panelsState.propertiesOnEdition = false
      });
   }


   /**
    * Layout settings
    */
   layoutSettings(view:any) {
      let dialogRef = this.dialog.open(DialogLayoutSettings, {
         position: { top: '60px' },
         data: { defaultViewId: this.configDataService.hmi.general.defaultViewId, views: this.configDataService.hmi.views }
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result) {
            //console.log(result.defaultViewId)
            this.configDataService.hmi.general.defaultViewId = result.defaultViewId
            //console.log(this.configDataService.hmi)
         }
      });
   }


   /**
    * Clone the View, copy and change all ids
    */
   onCloneView(viewId:any){
      let view: any = {}
      for (var i = 0; i < this.configDataService.hmi.views.length; i++) {
         if(this.configDataService.hmi.views[i].id === viewId){
            view = this.configDataService.hmi.views[i]
            break;
         }
      }

      if (view) {
         let clonedView: View = Utils.clone(view)

         // change all gauge ids
         for (var i = 0; i < clonedView.components.length; i++) {

            let id_ = Utils.getUniqueId(2)
            //clonedView.components[i].id = id_
            clonedView.components[i]['id'] = clonedView.components[i]['typeAbbr'] + id_//we give a new id to the copied component
         }
         let v: View = Utils.clone(clonedView);
         v.id = 'vw_' + Utils.getGUID();

         v.name = Utils.defaultName(this.configDataService.hmi.views, "View_", "name")
         this.configDataService.hmi.views.push(v);
         this.configDataService.hmi.general.viewsTree.push({ name: v.name, type: 'view', id: v.id })
         this.onSelectView(v.id);
      }
   }

   saveProject() {
      //console.log(this.currentView)
      //localStorage.setItem("duroControl.webeditor.project", JSON.stringify(this.configDataService.hmi));
      this.configDataService.saveConfig1()
   }

   /**
    * Open Project event, file imported
    */
   onProjectFileChangeListener(event:any) {
      let text = [];
      let files = event.srcElement.files;
      let input = event.target;
      let reader:any = new FileReader();
      reader.onload = (data:any) => {
         let hmi = JSON.parse(reader.result.toString());
         console.log(hmi)

         this.configDataService.hmi = hmi
         this.onSelectView(this.configDataService.hmi.views[0].id);
      }
      reader.onerror = function () {
         let msg = 'Unable to read ' + input.files[0];
         alert(msg);
      };
      reader.readAsText(input.files[0]);
      this.projectFileOpenInput.nativeElement.value = null;
   }

   newProject(){
      this.configDataService.hmi = new Hmi();
      sessionStorage.removeItem("duroControl.webeditor.tempData");
      this.initializeView();
   }

   /**
    * Dragging
    */
   onComponentSelection(event: MouseEvent) {
      for (var index = 0; index < this.selections.length; index++) {
         this.selections[index].draggingWindow = true;
         this.selections[index].px = event.clientX;
         this.selections[index].py = event.clientY;

         event.preventDefault();
         event.stopPropagation();
      }
   }

   dragStarted(event:any, index:any) {
      this.selections[index].draggingAttr = true;

      (<HTMLDivElement>this.parentSelect.nativeElement).style.pointerEvents = 'auto';
      (<HTMLDivElement>this.parentSelect.nativeElement).style.cursor = 'grabbing';

      //event.source._dragRef._initialTransform = `rotate(${this.selections[index].rotationAngle}deg)`

      //event.source._dragRef._initialTransform = `translate3d(${this.selections[index].translate.x}px, ${this.selections[index].translate.y}px, 0px) rotate(${this.selections[index].rotationAngle}deg)`

      //event.source._dragRef._initialTransform = `translate3d(${this.selections[index].translate.x}px, ${this.selections[index].translate.y}px, 0px)`
   }

   dragEnded(event:any, index:any) {
      this.selections[index].draggingAttr = false;

      (<HTMLDivElement>this.parentSelect.nativeElement).style.pointerEvents = 'auto';
      (<HTMLDivElement>this.parentSelect.nativeElement).style.cursor = 'grab';

      if ((this.zoomVal/100) != 1) {
         const elementMoving = event.source.getRootElement(); 
         const elementMovingRect: ClientRect = elementMoving.getBoundingClientRect(); 
         //let div = document.getElementById('parentSelect'); 
         let xpos = (elementMovingRect.left-elementMoving.parentElement.getBoundingClientRect().left) / (this.zoomVal/100); 
         //div.style.left = Utils.round(xpos,0) + "px";
         let ypos = (elementMovingRect.top-elementMoving.parentElement.getBoundingClientRect().top) / (this.zoomVal/100); 
         //div.style.top = Utils.round(ypos,0) + "px";
         
         const cdkDrag = event.source as CdkDrag; 
         cdkDrag.reset(); 

         this.selections[index].x = Utils.round(xpos,0)
         this.selections[index].y = Utils.round(ypos,0)

         this.selections[index].x1 = Utils.round(xpos-1,0)
         this.selections[index].y1 = Utils.round(ypos-1,0)
      }
      //this.selections[index].translate.x = event.source._dragRef._passiveTransform.x
      //this.selections[index].translate.y = event.source._dragRef._passiveTransform.y

      //event.source._dragRef._initialTransform = `translate3d(0px, 0px, 0px) rotate(${this.selections[index].rotationAngle}deg)`

      event.source._dragRef.reset();

      this.selections[index].x = this.selections[index].x1
      this.selections[index].y = this.selections[index].y1
   }


   onDragging(event:any, i:any) {
      for (var index = 0; index < this.selections.length; index++) {

         let zoomMoveXDifference = 0; let zoomMoveYDifference = 0;

         if ((this.zoomVal/100) != 1) {
            zoomMoveXDifference = (1 - (this.zoomVal/100)) * event.source.getFreeDragPosition().x;
            zoomMoveYDifference = (1 - (this.zoomVal/100)) * event.source.getFreeDragPosition().y;
         }

         let x = (event.event.clientX) + zoomMoveXDifference
         let y = (event.event.clientY) + zoomMoveYDifference

         let offsetX = x - this.selections[index].px;
         let offsetY = y - this.selections[index].py;

         this.selections[index].x1 += offsetX;
         this.selections[index].y1 += offsetY;
         this.selections[index].px = x;
         this.selections[index].py = y;

         if (this.selections[index].draggingAttr === false) {
            this.selections[index].x += offsetX;
            this.selections[index].y += offsetY;
         }

         let component = {
            id: this.selections[index].childId,
            y: this.selections[index].y1, x: this.selections[index].x1,
            h: this.selections[index].height, w: this.selections[index].width
         }
         this.eservice.updateComponent(component, this.selections, this.currentView)
      }
   }

   /**
    * Component resizing
    */
   topLeftResize(offsetX: number, offsetY: number) {
      for (var index = 0; index < this.selections.length; index++) {
         this.selections[index].x1 += offsetX;
         this.selections[index].y1 += offsetY;
         this.selections[index].x += offsetX;
         this.selections[index].y += offsetY;

         this.selections[index].width -= offsetX;
         this.selections[index].height -= offsetY;

         let component = {
            id: this.selections[index].childId,
            y: this.selections[index].y1, x: this.selections[index].x1,
            h: this.selections[index].height, w: this.selections[index].width
         }
         this.eservice.updateComponent(component, this.selections, this.currentView)
      }
   }

   topRightResize(offsetX: number, offsetY: number) {
      for (var index = 0; index < this.selections.length; index++) {
         this.selections[index].y1 += offsetY;
         this.selections[index].y += offsetY;
         this.selections[index].width += offsetX;
         this.selections[index].height -= offsetY;

         let component = {
            id: this.selections[index].childId,
            y: this.selections[index].y1, x: this.selections[index].x1,
            h: this.selections[index].height, w: this.selections[index].width
         }
         this.eservice.updateComponent(component, this.selections, this.currentView)
      }
   }

   bottomLeftResize(offsetX: number, offsetY: number) {
      for (var index = 0; index < this.selections.length; index++) {
         this.selections[index].x1 += offsetX;
         this.selections[index].x += offsetX;
         this.selections[index].width -= offsetX;
         this.selections[index].height += offsetY;

         let component = {
            id: this.selections[index].childId,
            y: this.selections[index].y1, x: this.selections[index].x1,
            h: this.selections[index].height, w: this.selections[index].width
         }
         this.eservice.updateComponent(component, this.selections, this.currentView)
      }
   }

   bottomRightResize(offsetX: number, offsetY: number) {
      for (var index = 0; index < this.selections.length; index++) {
         this.selections[index].width += offsetX;
         this.selections[index].height += offsetY;

         let component = {
            id: this.selections[index].childId,
            y: this.selections[index].y1, x: this.selections[index].x1,
            h: this.selections[index].height, w: this.selections[index].width
         }
         this.eservice.updateComponent(component, this.selections, this.currentView)
      }
   }

   onCornerClick(event:any, resizer: Function) {
      for (var index = 0; index < this.selections.length; index++) {
         this.selections[index].draggingCorner = true;
         this.selections[index].px = event.clientX/ (this.zoomVal/100);
         this.selections[index].py = event.clientY/ (this.zoomVal/100);
         this.resizer = resizer;
         event.preventDefault(); event.stopPropagation();
      }
   }

   area() {
      for (var index = 0; index < this.selections.length; index++) {
         return this.selections[index].width * this.selections[index].height;
      }
      return 0
   }

   rotateClick(event:any, canvas:any){
      for (var index = 0; index < this.selections.length; index++) {

         this.selections[index].rotating = true;
         event.preventDefault(); event.stopPropagation();

         // Convert radians to degrees
         let R2D = 180 / Math.PI 

         let center = { x: this.selections[index].x + (this.selections[index].width/2),
            y: this.selections[index].y + (this.selections[index].height/2)
         }

         let rect = canvas.getBoundingClientRect();
         let xpos; let ypos;

         xpos = (event.pageX - rect.left) / (rect.right - rect.left) * canvas.width
         ypos = (event.pageY - rect.top) / (rect.bottom - rect.top) * canvas.height

         let x = xpos - center.x; let y = ypos - center.y;

         if(!isNaN(this.selections[index]['rotationAngle'])){
            this.selections[index].startAngle = (R2D * Math.atan2(y, x)) - this.selections[index]['rotationAngle'] 
         }else{
            this.selections[index].startAngle = (R2D * Math.atan2(y, x)) 
         }
         //console.log("Object start angle: ",this.selections[index].startAngle)
      }
   }

   /**
    * Workspace event listeners
    */
   @HostListener('document:mousemove', ['$event'])
   onCornerMove(event: MouseEvent) {
      if (this.selections.length > 0) {
         for (var index = 0; index < this.selections.length; index++) {
            //Resizing
            if (this.selections[0].draggingCorner) {
               let x = event.clientX / (this.zoomVal/100); let y = event.clientY / (this.zoomVal/100)

               let offsetX = x - this.selections[0].px; let offsetY = y - this.selections[0].py;

               let lastX1 = this.selections[0].x1; let lastY1 = this.selections[0].y1;
               let lastX = this.selections[0].x; let lastY = this.selections[0].y;
               let pWidth = this.selections[0].width; let pHeight = this.selections[0].height;

               this.resizer(offsetX, offsetY);
               if (this.area() < this.selections[0].minArea) {
                  this.selections[0].x1 = lastX1; this.selections[0].y1 = lastY1;
                  this.selections[0].x = lastX; this.selections[0].y = lastY;
                  this.selections[0].width = pWidth; this.selections[0].height = pHeight;

                  let component = {
                     id: this.selections[index].childId,
                     y: this.selections[index].y1, x: this.selections[index].x1,
                     h: this.selections[index].height, w: this.selections[index].width
                  }
                  this.eservice.updateComponent(component, this.selections, this.currentView)
               }
               this.selections[0].px = x; this.selections[0].py = y;
            }

            //Rotation
            if (this.selections[0].rotating) {

               let R2D = 180 / Math.PI 

               let center = { x: this.selections[index].x + (this.selections[index].width/2),
                  y: this.selections[index].y + (this.selections[index].height/2)
               }

               let rect = this.canvas.nativeElement.getBoundingClientRect();
               let xpos; let ypos;

               xpos = (event.pageX - rect.left) / (rect.right - rect.left) * this.canvas.nativeElement.width
               ypos = (event.pageY - rect.top) / (rect.bottom - rect.top) * this.canvas.nativeElement.height

               let x = xpos - center.x; let y = ypos - center.y;
               let d = (R2D * Math.atan2(y, x)) 

               let rotation = d - this.selections[index].startAngle
               //console.log(rotation)

               this.selections[index]['rotationAngle'] = rotation

               let component = {
                  id: this.selections[index].childId,
                  rotationAngle: rotation
               }
               this.eservice.updateComponent(component, this.selections, this.currentView)
            }
         }
      }
   }

   //The following function gets called when the user release the left button of the mouse
   @HostListener('document:mouseup', ['$event'])
   mouseClickRelease(event:any) {
      //console.log("mouseup")

      //Lasso component selection
      if (this.eservice.drawingMode && (this.eservice.endCoordinates !== undefined && this.eservice.startCoordinates !== undefined)) {

         for (var index = 0; index < this.selections.length; index++) {
            if (this.selections[index].childOn) {
               this.selections[index].hovered = false;
               this.selections[index].outside = true;
            }
         }

         for (var i = 0; i < this.currentView['components'].length; i++) {
            if (this.currentView['components'][i]['visibility']) {
               let comptFound: boolean = false

               let component:any = this.currentView['components'][i]

               let _canvas:any = this.canvas.nativeElement
               _canvas.style.position = "unset";
               _canvas.style.zIndex = "unset";

               //top left mouse selection
               if ((component.x >= this.eservice.startCoordinates.x) && (component.x + component.w) <= this.eservice.endCoordinates.x) {

                  if (component.y >= this.eservice.startCoordinates.y && (component.y + component.h) <= this.eservice.endCoordinates.y) {
                     //console.log("top left mouse selection")
                     comptFound = true
                  }
               }

               //bottom right mouse selection
               if ((component.x >= this.eservice.endCoordinates.x) && (component.x + component.w) <= this.eservice.startCoordinates.x) {

                  if (component.y >= this.eservice.endCoordinates.y && (component.y + component.h) <= this.eservice.startCoordinates.y) {
                     //console.log("bottom right mouse selection")
                     comptFound = true
                  }
               }

               //top right mouse selection
               if ((component.x >= this.eservice.endCoordinates.x) && (component.x + component.w) <= this.eservice.startCoordinates.x) {

                  if (component.y >= this.eservice.startCoordinates.y && (component.y + component.h) <= this.eservice.endCoordinates.y) {
                     //console.log("top right mouse selection")
                     comptFound = true
                  }
               }

               //bottom left mouse selection
               if ((component.x >= this.eservice.startCoordinates.x) && (component.x + component.w) <= this.eservice.endCoordinates.x) {

                  if (component.y >= this.eservice.endCoordinates.y && (component.y + component.h) <= this.eservice.startCoordinates.y) {
                     //console.log("bottom left mouse selection")
                     comptFound = true
                  }
               }

               if(comptFound){
                  this.selections.push({
                     x: component.x, y: component.y, x1: component.x, y1: component.y, px: 0, py: 0, 
                     width: component.w, height: component.h, minArea: 1000, draggingCorner: false,
                     draggingWindow: false, childOn: true, childId: component['id'], hovered: false, 
                     outside: false, draggingAttr: false, viewId: component['viewId'],
                     style: { zIndex: 999999 }, //component.zIndex
                     type: component['type'], sizeMode: component['sizeMode'], rotating: false,
                     startAngle: 0, rotationAngle: component['rotationAngle'], translate: {x : 0, y: 0, z: 0}
                  })
                  this.eservice.showDelete = true;
               }
            }
         }
         if (this.selections.length > 0) this.eservice.component_toolPanel = true
         //if (this.selections.length > 0 && this.selections.length < 2) this.eservice.component_toolPanel = true
      }

      //Clears lasso selection after click releasing 
      this.eservice.ctx.clearRect(0, 0, this.view.config.width, this.view.config.height);
      this.eservice.drawingMode = false;

      if (this.selections.length > 0) {
         for (var index = 0; index < this.selections.length; index++) {
            if (this.selections[index].draggingWindow) {

               if (index === this.selections.length - 1) {//to avoid duplication, only sends to history on the last iteration
                  this.history.sendToHistory(this.configDataService.hmi)
               }
            }
            if (this.selections[index].draggingCorner) {
               if (index === this.selections.length - 1) {//to avoid duplication, only sends to history on the last iteration
                  this.history.sendToHistory(this.configDataService.hmi)
               }
            }
            this.selections[index].draggingWindow = false;
            this.selections[index].draggingCorner = false;
            this.selections[index].rotating = false;
         }
      }
   }

   //The following function gets called by the left button (click) of the mouse
   @HostListener('document:mousedown', ['$event'])
   mouseClick(event:any) {
      //console.log(event.target.id)

      if(event.target.id === "canvas"){
         if (!this.onViewsPanel) {

            this.eservice.startDraw()
         }

         if (this.selections.length > 0) {
            this.eservice.showCopy = true;
         } else {
            this.eservice.showCopy = false;
            this.eservice.showDelete = false;
         }
         if (this.eservice.clipboard.length > 0) {
            this.eservice.showPaste = true;
         } else {
            this.eservice.showPaste = false;
         }

         if (this.selections.length === 0) {
            this.eservice.component_toolPanel = false;
         }
      }
   }

   clickdown(event:any, zoomVal:any){
      //console.log(event)

      let scale:any = zoomVal / 100

      let x:any = (event.clientX - this.workspace_.getBoundingClientRect().x) / scale
      let y:any = (event.clientY - this.workspace_.getBoundingClientRect().y) / scale

      //console.log("x: " + x  + " y: "+ y)

      let foundCmpts:any = []; let selectdCompt:any = {};

      for (var i = 0; i < this.currentView.components.length; i++) {

         if ((x >= this.currentView.components[i].x!) &&  x <= (this.currentView.components[i].x! + this.currentView.components[i].w!)) {

            if (y >= this.currentView.components[i].y! &&  y <= (this.currentView.components[i].y! + this.currentView.components[i].h!)) {
               //console.log(this.currentView.components[i].id)

               if(this.currentView.components[i]['visibility']) foundCmpts.push(this.currentView.components[i])
            }
         }
      }
      //console.log(foundCmpts)

      let zIndexes_0 = 0
      for (var i = 0; i < foundCmpts.length; i++) {

         if(foundCmpts[i]['zIndex'] !== 0) zIndexes_0 += 1

         if(i === foundCmpts.length-1){

            if(zIndexes_0 === 0){

               //console.log(foundCmpts[i].id)
               selectdCompt = foundCmpts[i]
            }else{
               let highestIndex:any = []
               for (var ii = 0; ii < foundCmpts.length; ii++) {

                  highestIndex.push(foundCmpts[ii].zIndex)
               }
               for (var ii = 0; ii < foundCmpts.length; ii++) {

                  if(foundCmpts[ii]['zIndex'] === Math.max(...highestIndex)){
                     //console.log(foundCmpts[ii].id)
                     selectdCompt = foundCmpts[ii]
                  }
               }
            }
         }
      }

      //console.log(selectdCompt)

      if(selectdCompt.hasOwnProperty("id")){
         
         let data = JSON.stringify({h: selectdCompt['h'],w: selectdCompt['w'],x: selectdCompt['x'],y: selectdCompt['y'],
            id: selectdCompt['id'],viewId: selectdCompt['viewId'],
            type: selectdCompt['type'],style:{zIndex: selectdCompt['zIndex']}, 
            rotationAngle: selectdCompt['rotationAngle'],
            sizeMode: selectdCompt['sizeMode']})
         this.onSlectdComp(data)
      }
   }

   //The following function gets called by the pressing of a key on the keyboard
   @HostListener('window:keydown', ['$event'])
   onKeyPressDown(event:any) {
      //console.log(event.key)
      const htmlElement = event.target as HTMLInputElement
      //For multiple component selection
      if ((event.ctrlKey || event.metaKey)) {
         //console.log('CTRL key down');
         this.ctrlKey = true
      }

      if (!this.panelsState.propertiesOnEdition) {
         //Copy single or multiple components at a time
         if ((event.ctrlKey || event.metaKey) && event.key === 'c' && htmlElement.tagName != "INPUT") {//C keyCode 67
            //console.log('copied');
            this.eservice.copy(this.selections, this.currentView)
         }

         //Paste copied components in the work area
         if ((event.ctrlKey || event.metaKey) && event.key === 'v' && htmlElement.nodeName != "INPUT") {//V keyCode 86
            //console.log('pasted');
            //this.eservice.paste(this.currentView)
            this.paste(this.currentView)
         }

         //Move components around with the arrow keys (direction keys)
         if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            this.eservice.directionKeys(event, this.selections, this.currentView)
         }

         //remove components from the workspace
         if (event.key === 'Backspace') {//keyCode 8
            if(event.srcElement.localName == "input"){
               return
            }
            this.eservice.backspace(this.configDataService.hmi, this.currentView, this.selections)
         }
      }
   }

   //The following function gets called by the releasing of a key on the keyboard
   @HostListener('window:keyup', ['$event'])
   onKeyPressUp($event: KeyboardEvent) {
      if (this.ctrlKey) {
         //console.log('CTRL key up');
         this.ctrlKey = false
      }
   }

   //Listens to window dimensions changes
   @HostListener('window:resize', ['$event'])
   onResize() {
      this.mainContainer = { h: document.getElementById("mainContainer")!.offsetHeight, w: document.getElementById("mainContainer")!.offsetWidth }
      //console.log(this.mainContainer)
      this.content_main = { h: document.getElementById("content_main")!.offsetHeight, w: document.getElementById("content_main")!.offsetWidth }
      //console.log(this.content_main)
   }

   @HostListener('window:beforeunload', ['$event'])
   unloadHandler(event: Event) {
      // Your logic on beforeunload
      let tempdata: any = sessionStorage.getItem("duroControl.webeditor.tempData");
      if(tempdata !== null) tempdata = JSON.parse(tempdata)
      if(tempdata === null) tempdata = new TempData();

      //remove from session storage old data of views that are not in the current config
      let viewTempData_: any = {}
      for (var i = 0; i < this.configDataService.hmi.views.length; i++) {
         if(tempdata['views'].hasOwnProperty(this.configDataService.hmi.views[i].id)){
            //console.log(this.configDataService.hmi.views[i].id)
            viewTempData_[this.configDataService.hmi.views[i].id] = tempdata['views'][this.configDataService.hmi.views[i].id]
         }
      }
      tempdata['views'] = viewTempData_

      //save settings and id from the last seen view before unloading the page
      if(this.currentView){
         if(tempdata['views'].hasOwnProperty(this.currentView.id)){

            if(tempdata['views'][this.currentView.id].hasOwnProperty("zoom")) tempdata['views'][this.currentView.id]['zoom'] = this.zoomVal
            if(tempdata['views'][this.currentView.id].hasOwnProperty("transform-origin")) tempdata['views'][this.currentView.id]['transform-origin'] = this.workspace_.style.transformOrigin
         }
      }
      if(tempdata.hasOwnProperty("lastView")){
         tempdata["lastView"] = this.currentView.id
      }else{
         tempdata["lastView"] = this.currentView.id
      }
      sessionStorage.setItem("duroControl.webeditor.tempData", JSON.stringify(tempdata));
   }

   //The following function gets called by all clicks on the page
   clickout(event:any, zoomVal:any) {
      //console.log(event)
      
      for (var i = 0; i < this.selections.length; i++) {
         if (!this.ctrlKey) {
            //console.log("Outside: ", this.selections[i].outside, " Hovered: ", this.selections[i].hovered)
            if (this.selections[i].outside === true && this.selections[i].hovered !== true) {
               this.selections[i].childOn = false;
               this.selections[i].outside = false;
               this.selections = [];
               this.eservice.component_toolPanel = false;
               this.eservice.showDelete = false;
            }
         }
      }
      if (this.selections.length > 0) {
         this.eservice.showCopy = true
      } else {
         this.eservice.showCopy = false
      }
      if (this.eservice.clipboard.length > 0) {
         this.eservice.showPaste = true
      } else {
         this.eservice.showPaste = false
      } 
   }

   onMouseOver(event:any) {
      for (var index = 0; index < this.selections.length; index++) {
         if(!this.selections[index].draggingAttr){
            if (this.selections[index].childOn) {
               this.selections[index].hovered = true;

               (<HTMLDivElement>this.parentSelect.nativeElement).style.pointerEvents = 'auto';
               (<HTMLDivElement>this.parentSelect.nativeElement).style.cursor = 'grab';
            } else {
               (<HTMLDivElement>this.parentSelect.nativeElement).style.pointerEvents = 'auto';
               (<HTMLDivElement>this.parentSelect.nativeElement).style.cursor = 'default';
            }
         }
      }
   }

   onMouseOut(event:any) {
      for (var index = 0; index < this.selections.length; index++) {
         if(!this.selections[index].draggingAttr){
            this.selections[index].hovered = false;
            this.selections[index].outside = true;
         }
      }
   }


   isComponentActive(componentID:any) {//check if component is active
      for (var i = 0; i < this.selections.length; i++) {
         if (this.selections[i].childId === componentID) return true
      }
      return false
   }


   onSlectdComp(event:any) {
      //console.log(event)
      var json: any;
      if (typeof event === "string") json = JSON.parse(event);
      if (typeof event === "object") json = event;
      //console.log(json)

      let selectCompt: boolean = false
      if (!this.ctrlKey && typeof event === "string") {
         if (!this.isComponentActive(json.id)) {
            this.selections = []; selectCompt = true; this.eservice.component_toolPanel = true;
         }
      } else if (this.ctrlKey) {
         let componentID: string
         if (json.hasOwnProperty("childId")) {
            componentID = json["childId"];
         } else if (json.hasOwnProperty("id")) {
            componentID = json["id"];
         }
         else{
            componentID = ''
         }

         if (this.isComponentActive(componentID)) {//if ctrlKey is pressed and componet is active, we deseletect the component
            for (var i = 0; i < this.selections.length; i++) {
               if (componentID === this.selections[i].childId) {
                  this.selections.splice(i, 1);
               }
            }
         } else {
            if (typeof event === "string") selectCompt = true; this.eservice.component_toolPanel = true;
         }
      }

      if(selectCompt){
         this.selections.push({
            x: json.x, y: json.y, x1: json.x, y1: json.y, px: 0, py: 0, 
            width: json.w, height: json.h, minArea: 1000, draggingCorner: false,
            draggingWindow: false, childOn: true, childId: json.id, hovered: false, outside: false, draggingAttr: false, 
            style: { zIndex: 999999 }, //json.style.zIndex
            viewId: json.viewId, type: json.type, sizeMode: json.sizeMode, rotating: false, startAngle: 0,
            rotationAngle: json.rotationAngle, translate: {x : 0, y: 0, z: 0}
         });
         this.eservice.showDelete = true;
         this.eservice.compId = this.selections[0].childId;
      }
      //console.log(this.selections)

      if (this.eservice.clipboard.length > 0) this.eservice.showPaste = true;
      if (this.selections.length > 0) this.eservice.showCopy = true;
   }

   paste(currentView:any){
      for (var i = 0; i < this.eservice.clipboard.length; i++) {
         let id_ = Utils.getUniqueId(2)

         this.eservice.clipboard[i].id = this.eservice.clipboard[i]['typeAbbr'] + id_ // We give a new id to the copied component
         this.eservice.clipboard[i].x = this.eservice.clipboard[i].x + 6
         this.eservice.clipboard[i].y = this.eservice.clipboard[i].y + 6

         console.log('New component(s) pasted: ', this.eservice.clipboard[i].id);

         //console.log(this.eservice.clipboard[i])

         // We add the copied component to the list of componet currently in use
         currentView['components'].push(Utils.clone(this.eservice.clipboard[i]))

         // Multiple components in clipboard
         if(this.eservice.clipboard.length > 1){
            // Just in the first iteration of the main loop, delete previous selected components
            // Also activate control key to simulate phisical key press and highlight new pasted components
            if (i === 0){
               this.ctrlKey = true
               this.selections = []
            }
            // Selected pasted component
            this.onSlectdComp(JSON.stringify(this.eservice.clipboard[i]))
            // Disable control key in the last iteration of the main loop
            if (i === this.eservice.clipboard.length-1){
               this.ctrlKey = false
            }

          // Single component in clipboard
         }else{
            this.selections = []
            this.onSlectdComp(JSON.stringify(this.eservice.clipboard[i]))
         }
      }
   }


   addComponent(type:any, data:any) {
      let hmiComponents:any = new HMIComponents();
      if(hmiComponents.hasOwnProperty(type)){

         let component = new Components()

         component.typeAbbr = hmiComponents[type].typeAbbr
         component.id = component.typeAbbr + Utils.getUniqueId(2)

         if(type === "view") {
            component.viewId = data.id

            if(data.config.sizeMode === "normal"){
               component.w = data.config.width
               component.h = data.config.height
               component.sizeMode = data.config.sizeMode
            }
         }else if(type === "dropdown"){
            component.w = 160
            component.h = 40
         }else if(type === "table"){
            component.w = 185
            component.h = 150
          }else if(type === "lineChart" || type === 'barChart'){
            component.w = 300
            component.h = 250
         }
         component.type = type

         component.comptName = Utils.defaultName(this.currentView.components, hmiComponents[type].name, "comptName")

         component.config = hmiComponents[type].config
         component.animation = hmiComponents[type].animation
         component.events = hmiComponents[type].events
         if(hmiComponents[type].hasOwnProperty("logic")){
            component.logic = hmiComponents[type].logic
         }

         this.currentView['components'].push(component)
         this.history.sendToHistory(this.configDataService.hmi)
         //console.log(component)
      }
   }

   /**
    * Zoom
    */
   /*
   wheelZoomInit() {
      const wheelZoom = fromEvent(document.getElementById('content_main'), 'wheel')
      this.wheelZoom_Subscription = wheelZoom.subscribe((ev: WheelEvent) => {
         console.log('lol')
         let newScale = this.scale - ev.deltaY * 0.2;
         if(newScale <= this.zoomMax){
            this.scale = Math.max(newScale, 25);
            //console.log(this.scale)
         
            this.top = ev.clientY; this.left = ev.clientX;

            this.workspace_.style.transform = "translate(-50%, -50%) scale(" + this.scale / 100 + ")"
            this.workspace_.style.transformOrigin = (this.left-(this.e_sidenav._getWidth()+100)) + 'px ' + (this.top-((window.innerHeight-this.content_main['h'])+0)) + 'px'
            
            this.zoomVal = Utils.round(this.scale, 1);
         }
      });
   }
*/

   scalee = 1
   posX = -600
   posY = -400
   rotation = 0
   wheelZoomInit(){
      document.getElementById('content_main')!.addEventListener('wheel', (e) => {
         e.preventDefault();
         if (e.ctrlKey) {
           this.scalee -= e.deltaY * 0.01;
         } else {
            //console.log(this.posX, this.posY)
           this.posX -= e.deltaX * 2;
           this.posY -= e.deltaY * 2;
         }
         this.render();
       });
   }

   render = () => {
        var val = `translate3D(${this.posX}px, ${this.posY}px, 0px) rotate(${this.rotation}deg) scale(${this.scalee})`;
        this.workspace_.style.transform = val;

        this.zoomVal = Utils.round((this.scalee * 100) / 1, 1)
    };
   
   zoomSelect(event:any) {
      if(event.indexOf("zoom") === 0){
      
         let zoomval = parseInt(event.replace("zoom", ""))
         //console.log(zoomval)
         
         if(zoomval >= this.zoomMin && zoomval <= this.zoomMax){

            this.workspace_.style.transform = "translate(-50%, -50%) scale(" + (zoomval * 1) / 100 + ") "
            this.workspace_.style.transformOrigin = "unset"
            this.zoomCanvas = "Fit to canvas"
            this.zoomVal = zoomval
   
            this.scale = this.zoomVal ; this.top = 0; this.left = 0;
         }
      }else{
         if (event === 'fitCanvas') {
   
            var scale = Math.min(this.content_main['w'] / this.currentView.config.width, this.content_main['h'] / this.currentView.config.height);
            scale = scale - 0.04
            //console.log(scale)
            if(scale*100 <= this.zoomMax){
               this.workspace_.style.transform = "translate(-50%, -50%) scale(" + scale + ") "
               this.workspace_.style.transformOrigin = "unset"
   
               this.zoomCanvas = ((scale * 100) / 1).toString() + "%"
               this.zoomVal = Utils.round((scale * 100) / 1, 1)
               //console.log(this.zoomVal)
   
               this.scale = scale*100; this.top = 0; this.left = 0;
            }else{
               scale = this.zoomMax/100
               this.workspace_.style.transform = "translate(-50%, -50%) scale(" + scale + ") "
               this.workspace_.style.transformOrigin = "unset"
   
               this.zoomCanvas = ((scale * 100) / 1).toString() + "%"
               this.zoomVal = Utils.round((scale * 100) / 1, 1)
               //console.log(this.zoomVal)
   
               this.scale = scale*100; this.top = 0; this.left = 0;
            }
         }
      }
   }

   onZoomChange(zoomVal:any) {
      //console.log(zoomVal)
      var val = `translate3D(${this.posX}px, ${this.posY}px, 0px) rotate(${this.rotation}deg) scale(${(zoomVal * 1) / 100})`;
      this.workspace_.style.transform = val
      this.workspace_.style.transformOrigin = "unset"
      this.zoomVal = zoomVal
      this.scalee = this.zoomVal/100; this.top = 0; this.left = 0;
   }

   undo(view:any) {
      this.configDataService.hmi = this.history.undo(view)
      for (var i = 0; i < this.configDataService.hmi.views.length; i++) {

         if (this.currentView.id === this.configDataService.hmi.views[i].id) {

            this.currentView = this.configDataService.hmi.views[i]
            this.selections = []
            break;
         }
      }
   }

   redo(view:any) {
      this.configDataService.hmi = this.history.redo(view)
      for (var i = 0; i < this.configDataService.hmi.views.length; i++) {

         if (this.currentView.id === this.configDataService.hmi.views[i].id) {

            this.currentView = this.configDataService.hmi.views[i]
            this.selections = []
            break;
         }
      }
   }

   viewsRecursionChk(view:any){
      let notRecursive: boolean = false
      for (var i = 0; i < view.components.length; i++) {
         if(view.components[i].viewId === this.currentView.id) notRecursive =  true
      }
      return view.id !== this.currentView.id && !notRecursive
   }


   view_BorderBackgdSelection(){
      let properties = Utils.clone(this.view.config.style)
      if(this.view.config.style.hasOwnProperty("borderStyle") && this.view.config.style.hasOwnProperty("borderWidth.px")){

         if(this.editorBorder && (this.view.config.style["borderStyle"] === "none" || this.view.config.style["borderWidth.px"] === 0)){

            properties["borderStyle"] = "solid"
            properties["borderWidth.px"] = 2
            properties["borderColor"] = "#000000"
            this.viewProperties = properties

         }else if(!this.editorBorder){

            properties["borderStyle"] = "none"
            properties["borderWidth.px"] = 0
            properties["borderColor"] = "#00000000"
            this.viewProperties = properties

         }else if(this.editorBorder && (this.view.config.style["borderStyle"] !== "none" || this.view.config.style["borderWidth.px"] !== 0)){

            this.viewProperties = properties
         }
      }else if (!this.view.config.style.hasOwnProperty("borderStyle") || !this.view.config.style.hasOwnProperty("borderWidth.px")){

         properties["borderStyle"] = "solid"
         properties["borderWidth.px"] = 2
         properties["borderColor"] = "#000000"
         this.viewProperties = properties
      }

      if(this.view.config.style.hasOwnProperty("backgroundColor")){

         let color = this.view.config.style['backgroundColor']
         if(color.charAt(0) == "#" ){
            color = color.substring(1, 9)
         }
         let transparency: any = ((parseInt(color.substring(6, 8), 16)*1)/255).toFixed(2)

         if(this.editorBackgd && (transparency >= 0 && transparency <= 0.5)){

            properties["backgroundColor"] = "#ffffff"
            this.viewProperties = properties

         }else if(!this.editorBackgd && (transparency >= 0 && transparency <= 0.5)){

            properties["backgroundColor"] = "#00000000"
            this.viewProperties = properties

         }else if(this.editorBackgd && transparency > 0.5){
            this.viewProperties = properties
            
         }else if(!this.editorBackgd && transparency > 0.5){
            this.viewProperties = properties
         }
      }else if(!this.view.config.style.hasOwnProperty("backgroundColor")){

         properties["backgroundColor"] = "#ffffff"
         this.viewProperties = properties
      }
   }

   move(e:any, type:any){
      e.preventDefault()
      if(type == 'down'){
         this.posY -= 10;
      }
      else if(type == 'up'){
         this.posY += 10
      }
      else if(type == 'left'){
         this.posX += 10
      }
      else if(type == 'right'){
         this.posX -= 10
      }
      this.render();
   }
}