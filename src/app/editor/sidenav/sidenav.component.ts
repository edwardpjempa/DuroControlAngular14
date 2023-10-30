import { Component, Input, Output, EventEmitter, SimpleChanges, ViewChild, OnInit, ViewEncapsulation, HostListener, ElementRef } from "@angular/core";
import { MatExpansionPanel } from '@angular/material/expansion';
import { Subscription } from 'rxjs';

import { Utils } from './../helpers/utils';
import { EditorComponent } from './../editor.component';
import { EditorService } from './../service/editor.service';
import { HMIComponents } from './../../models/components';
import { HistoryService } from './../history/history.service'
import { MatDialog } from "@angular/material/dialog"; 
import { Editor_SidenavDialogProperties } from "./propertiesDialog/propertiesDialog.component";


@Component({
  selector: "e-sidenav",
  templateUrl: "sidenav.component.html",
  styleUrls: ["sidenav.component.scss"],
  encapsulation : ViewEncapsulation.None
})

export class Editor_Sidenav implements OnInit {
  e_sidenav: any;

  objSidenav_Subscription!: Subscription;

  trackByComponents: any
  trackByViews: any
  trackByProperties: any

  parameters: any = []
  currentParameters: number = 0

  panelViewHeight: number = 0
  panelObjectHeight: number = 0

  enableViewSearch: boolean = false
  enableObjectSearch: boolean = false

  @Input() trackBy: any;
  @Input() hmi: any;
  @Input() viewsTree: any;
  @Input() selections: any;
  @Input() currentView: any;
  @Input() panelsState: any;

  //Objects Panel
  @Output() objSelectionOutput: EventEmitter<string> = new EventEmitter<string>();

  //View Panel
  @Output() public onViewsPanel: EventEmitter<any> = new EventEmitter(true);
  @Output() public onSelectView: EventEmitter<string> = new EventEmitter<string>();
  @Output() public onPropertyView: EventEmitter<string> = new EventEmitter<string>();
  @Output() public onCloneView: EventEmitter<string> = new EventEmitter<string>();
  @Output() public onAddView: EventEmitter<any> = new EventEmitter(true);

  //Properties Panel
  @Output() public onEdition: EventEmitter<any> = new EventEmitter(true);

  @ViewChild('viewPanel', {static: true}) viewPanel!: MatExpansionPanel;
  @ViewChild('objPanel', {static: true}) objPanel!: MatExpansionPanel;
  @ViewChild('propertiesPanel', {static: true}) propertiesPanel!: MatExpansionPanel;
  @ViewChild('viewPanel_', {static: true}) viewPanel_!: ElementRef;
  @ViewChild('objPanel_', {static: true}) objPanel_!: ElementRef;
  @ViewChild('propertiesPanel_', {static: true}) propertiesPanel_!: ElementRef;
  @ViewChild('viewFileImportInput') viewFileImportInput: any;

  constructor(public editor: EditorComponent, public eservice: EditorService, public history: HistoryService, public dialog: MatDialog) {}

  ngOnInit(){
    this.onResize()

    this.objPanel.open();//opens objects expansion panel
    //this.propertiesPanel.open();//opens properties expansion panel

    this.objSidenav_Subscription = this.editor.e_objSidenav.subscribe((data: any) =>{

      if(data['state'] === "open"){
        this.objPanel.open();
      }
    });
  }

  ngOnDestroy(){
    if(this.objSidenav_Subscription){this.objSidenav_Subscription.unsubscribe();}
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes)

    if(changes["trackBy"]) this.trackByComponents = changes["trackBy"].currentValue['trackComponentByLength']
    if(changes["trackBy"]) this.trackByViews = changes["trackBy"].currentValue['trackViewsByLength']
    if(changes["trackBy"]) this.trackByProperties = changes["trackBy"].currentValue['trackByProperties']

    if(this.selections.length === 1){
      this.propertiesPanel.open();
    }else if(this.selections.length === 0 || this.selections.length > 1){
      this.propertiesPanel.close();
    }
    
    this.onResize()

    if(this.panelsState.panelProperties){
      this.parameters = []
      for (var i = 0; i < this.currentView.components.length; i++) {

        if(this.selections[0].childId === this.currentView.components[i].id){
          //console.log(this.currentView.components[i].type)

          let propertiesFolders: any = {};

          let hmiComponents:any = new HMIComponents();

          if(hmiComponents.hasOwnProperty(this.currentView.components[i].type)){
            propertiesFolders = hmiComponents[this.currentView.components[i].type].properties
          }

          for(var folder in propertiesFolders){

            for(var property in propertiesFolders[folder]){

              if(propertiesFolders[folder][property]['editable']){//gets number of properties in the folder for the choosen component

                this.parameters.push(propertiesFolders[folder][property])
              }
            }
          }
        }
      }
    }
    this.panelMaxHeight()
  }

  onClickEventReceived(event: any){
    this.objSelectionOutput.emit(event);
  }

  openObjPanel(){
    //console.log("open")
    var element = document.getElementById('objPanel')!
    element.style.overflowY = "auto"
  }

  closeObjPanel(){
    //console.log("close")
    var element = document.getElementById('objPanel')!
    element.style.overflowY = ""
  }

  addFolder(){
    let nn = "Folder_";
    let idx = 1;
    for (idx = 1; idx < this.viewsTree.length + 2; idx++) {
      let found = false;
      for (var i = 0; i < this.viewsTree.length; i++) {
        if (this.viewsTree[i].name === nn + idx) {
          found = true;
          break;
        }
      }
      if (!found)
        break;
    }
    this.viewsTree.push({ name: nn + idx, type: 'folder', id: 'fold_' + Utils.getGUID(), children: Array() })

    this.hmi.general.viewsTree = this.viewsTree

    this.history.sendToHistory(this.hmi)
  }

  addProperty(property: any){

    for (var i = 0; i < this.hmi.views.length; i++) {
      if(this.currentView.id === this.hmi.views[i].id){

        for (var ii = 0; ii < this.currentView.components.length; ii++) {

          if(this.currentView.components[ii].id === this.selections[0].childId){

            if(this.currentView.components[ii].hasOwnProperty('config')){
              if(this.currentView.components[ii].config.hasOwnProperty('style')){
                this.currentView.components[ii].config.style[property.propertyName] = property.data
                this.hmi.views[i].components[ii].config.style[property.propertyName] = property.data
              }else{
                this.currentView.components[ii].config.style = {}
                this.currentView.components[ii].config.style[property.propertyName] = property.data
                this.hmi.views[i].components[ii].config.style[property.propertyName] = property.data
              }
            }else{
              this.currentView.components[ii].config = {}
              if(this.currentView.components[ii].config.hasOwnProperty('style')){
                this.currentView.components[ii].config.style[property.propertyName] = property.data
                this.hmi.views[i].components[ii].config.style[property.propertyName] = property.data
              }else{
                this.currentView.components[ii].config.style = {}
                this.currentView.components[ii].config.style[property.propertyName] = property.data
                this.hmi.views[i].components[ii].config.style[property.propertyName] = property.data
              }
            }

            this.iterate(this.hmi.views[i].components[ii])
          }
        }
        break;
      }
    }
    ///console.log(this.hmi)
    console.log(this.currentView)
  }

  iterate = (obj: any) => {
    let index = 0
    Object.keys(obj).forEach(key => {
      //console.log(`key: ${key}, value: ${obj[key]}`)

      this.currentParameters = this.currentParameters + 1
          
      if (typeof obj[key] === 'object') {
        this.iterate(obj[key])
      }
    })
  }

  //Listens to window dimensions changes
  @HostListener('window:resize', ['$event'])
  onResize() {
    let sidenav_ = document.getElementById("e_sidenav")!;
    this.e_sidenav = {h: sidenav_.offsetHeight, w: sidenav_.offsetWidth}
    //console.log(this.e_sidenav.h / 3)

    this.panelMaxHeight()
  }

  panelMaxHeight(){
    let vwPanel_add = 0
    let objPanel_add = 0
    let propertiesPanel_add = 0
    let maxHeight = ((this.e_sidenav.h / 3) - 35)

    //console.log("maxheight: " + maxHeight)
    
    //when panelViews is closed it share its space in the sidenav with objectsPanel and propertiesPanel
    if(this.panelsState.panelView === false){
        
      if(this.propertiesPanel_.nativeElement.offsetHeight < maxHeight){
        objPanel_add = maxHeight + (maxHeight - this.propertiesPanel_.nativeElement.offsetHeight)

      }else{
        objPanel_add = maxHeight / 2
      }

      if(this.objPanel_.nativeElement.offsetHeight < maxHeight){

        propertiesPanel_add = maxHeight + (maxHeight - this.objPanel_.nativeElement.offsetHeight)
      }else{
        propertiesPanel_add = maxHeight / 2
      }
    }
   
    //when panelObjects is closed it share its space in the sidenav with panelViews and propertiesPanel
    if(this.panelsState.panelObjects === false){
        
      if(this.propertiesPanel_.nativeElement.offsetHeight < maxHeight){
        vwPanel_add = maxHeight + (maxHeight - this.propertiesPanel_.nativeElement.offsetHeight)
      }else{
        vwPanel_add = maxHeight / 2
      }

      if(this.viewPanel_.nativeElement.offsetHeight < maxHeight){

        propertiesPanel_add = maxHeight + (maxHeight - this.viewPanel_.nativeElement.offsetHeight)
      }else{
        propertiesPanel_add = maxHeight / 2
      }
    }

    //when propertiesPanel is closed it share its space in the sidenav with panelViews and panelObjects
    if(this.selections.length === 0 || this.panelsState.panelProperties === false){
      
      if(this.objPanel_.nativeElement.offsetHeight < maxHeight){
        vwPanel_add = maxHeight + (maxHeight - this.objPanel_.nativeElement.offsetHeight)
      }else{
        vwPanel_add = maxHeight / 2
      }
        
      if(this.viewPanel_.nativeElement.offsetHeight < maxHeight){
        objPanel_add = maxHeight + (maxHeight - this.viewPanel_.nativeElement.offsetHeight)
      }else{
        objPanel_add = maxHeight / 2
        
      }
    }else{
      if(this.viewPanel_.nativeElement.offsetHeight <= maxHeight && this.objPanel_.nativeElement.offsetHeight <= maxHeight + 4){

        if(this.panelsState.panelObjects === true && this.panelsState.panelView === true) propertiesPanel_add = (maxHeight - this.viewPanel_.nativeElement.offsetHeight) + (maxHeight - this.objPanel_.nativeElement.offsetHeight)
      }
    }

    if(this.panelsState.panelObjects === false && this.panelsState.panelView === false) propertiesPanel_add = maxHeight * 2
    if(this.panelsState.panelObjects === false && this.panelsState.panelProperties === false) vwPanel_add = maxHeight * 2
    if(this.panelsState.panelProperties === false && this.panelsState.panelView === false) objPanel_add = maxHeight * 2

    this.viewPanel_.nativeElement.style.maxHeight = maxHeight + vwPanel_add + "px"
    this.panelViewHeight = maxHeight + vwPanel_add

    this.objPanel_.nativeElement.style.maxHeight = maxHeight + objPanel_add  + "px"
    this.panelObjectHeight = maxHeight + objPanel_add 

    this.propertiesPanel_.nativeElement.style.maxHeight = maxHeight + propertiesPanel_add  + "px"
    //console.log(objPanel_add)
    //console.log(maxHeight + objPanel_add  + "px")
  }

  onMouseOver(event:any){
    this.onViewsPanel.emit(true)
  }

  onMouseOut(event:any){
    this.onViewsPanel.emit(false)
  }

  viewSearch(){

    if(this.enableViewSearch){
      //console.log("Closing view search bar")
      this.enableViewSearch = false
    }else{
      //console.log("Opening view search bar")
      this.enableViewSearch = true
      let element = document.getElementById("viewFilter")!;
      setTimeout(() => {
        element.focus()
      }, 175);
    }
  }

  objectSearch(){

    if(this.enableObjectSearch){
      //console.log("Closing view search bar")
      this.enableObjectSearch = false
    }else{
      //console.log("Opening view search bar")
      this.enableObjectSearch = true
      let element = document.getElementById("objectFilter")!;
      setTimeout(() => {
        element.focus()
      }, 175);
    }
  }

  expandWindow(){
    let dialogRef = this.dialog.open(Editor_SidenavDialogProperties, {maxWidth: "60vw", height: "95vh", panelClass: 'custom-modalbox'})
    let instance = dialogRef.componentInstance
    instance.config = { currentView: this.currentView, selections: this.selections, hmi: this.hmi, trackBy: this.trackBy, onEdition: this.onEdition}

  }
}