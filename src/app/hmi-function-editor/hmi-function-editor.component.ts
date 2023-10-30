
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { Subscription, fromEvent } from 'rxjs';
import { UserModuleService, UserModuleStatus } from '../user-module.service';
import { ConfigDataService } from '../config-data.service';
import { DbDataService } from '../db-data.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ComponentPortal } from '@angular/cdk/portal';
import { filter, take } from 'rxjs/operators';
import { HmiEditorContextMenuComponent } from '../components/hmieditor-context-menu/hmieditor-context-menu.component';

const DEFAULT_EDITOR_HEIGHT = 100;
declare var ace: any;

@Component({
  selector: 'app-hmi-function-editor',
  templateUrl: './hmi-function-editor.component.html',
  styleUrls: ['./hmi-function-editor.component.css']
})
export class HmiFunctionEditorComponent {

  @ViewChild('editorWindow') editorWindow!: ElementRef;
  @Input() config: any;
  @Input() moduleId: any;
  @Input() data: any;

  editor: any;
  mouseEventSub!: Subscription;
  mouseMoveSubscription!: Subscription;
  mouseUpSubscription!: Subscription;
  subs!: Subscription;
  overlayRef!: OverlayRef | null;
  snackBarRef!: MatSnackBarRef<SimpleSnackBar>;
  consoleVisible = true;
  moving = false;
  md: any;
  darkMode = false;
  errorShown = false
  index = 0
  @Input() inputValue!: string;
  @Output() inputValueChange = new EventEmitter<string>();

  constructor(private overlay: Overlay,
    public configService: ConfigDataService,
    private snackBar: MatSnackBar,
    public userModuleService: UserModuleService,
    public dbDataService: DbDataService,
    public matDialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
    ) {
    } 

  ngOnit(){
    
  }

  ngAfterViewInit() {      
    this.initAceEditor();
    this.editorHeight = DEFAULT_EDITOR_HEIGHT
    this.editor.setValue(this.inputValue)
    this.editor.on("change", () => {
      this.inputValueChange.emit(this.editor.getValue());
    });
  }

  ngAfterViewChecked(){
    this.cdr.detectChanges();
    //document.getElementById('string').innerHTML = this.editor.getValue()
  }



  get editorHeight(){
    return parseInt(this.editorWindow.nativeElement.style.height.match(/\d*/g)[0])
  }

  set editorHeight(value: number){
    this.editorWindow.nativeElement.style.height = value.toString() + 'px';
  }

  ngOnDestroy() {
  }


  initAceEditor(){
    ace.config.set("basePath", "assets/js/ace-editor");
    this.editor = ace.edit("editor", {
      theme: "ace/theme/eclipse",
      mode: "ace/mode/python",
      wrap: false,
      autoScrollEditorIntoView: true,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      showPrintMargin: false
    });
  }

  run(){
    this.errorShown = false;
    this.userModuleService.runModule();
  }
  stop(){
    this.errorShown = false;
    this.userModuleService.stopModule();
  }

  drop(event: any) {
    // Prevent default action on drop
    event.preventDefault();
    // Get the data from the element
    var data = event.dataTransfer.getData("text");
    // Add data to editor
    this.editor.insert(` = getTag(\"${data}\")\n`)
  }

  openActionsMenu(event: any) {
    event.preventDefault();
    var x = event.x;
    var y = event.y
    this.closeActionMenu();
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo({ x, y })
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        }
      ]);
    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });
    const compRef = this.overlayRef.attach(new ComponentPortal(HmiEditorContextMenuComponent));
    // Send the editor reference to the component
    compRef.instance.editor = this.editor;
    compRef.instance.onAction.subscribe(event => {
      switch(event){
        case 'console':
          if(!this.consoleVisible){
          }
          break;
      }
    })

    // NEED ANOTHER WAY OF GETTING THESE TAGS
    // compRef.instance.tagData = this.configService.databaseTagValuesTree[1].children;
    compRef.instance.tagData = this.dbDataService.getTagNames();
    this.mouseEventSub = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => {
          const clickTarget = event.target as HTMLElement;
          return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget);
        }),
        take(1)
      ).subscribe(() => this.closeActionMenu())
  }

  closeActionMenu() {
    this.mouseEventSub && this.mouseEventSub.unsubscribe();
    if (this.overlayRef) {
          this.overlayRef.dispose();
          this.overlayRef = null;
    }
  }

  onMouseDown(e: any){
    e.preventDefault();
    this.moving = true;
    this.md = {
      originalY: e.clientY,
      originalH: this.editorHeight,
    }
    this.mouseMoveSubscription = fromEvent(document, 'mousemove').subscribe(e => { this.onMouseMove(e) });
    this.mouseUpSubscription = fromEvent(document, 'mouseup').subscribe(e => { this.onMouseUp(e) });
  }

  onMouseMove(e: any){
    if (this.moving) {
      var delta = e.clientY - this.md.originalY;
      this.editorHeight = delta + this.md.originalH
      this.editor.resize();
    }
  }

  onMouseUp(e: any){
    this.moving = false;
    this.mouseMoveSubscription.unsubscribe();
    this.mouseUpSubscription.unsubscribe();
  }

  setTheme(){
    if(this.darkMode){
      this.editor.setTheme("ace/theme/eclipse");
      this.darkMode = false;
    }
    else{
      this.editor.setTheme("ace/theme/visual_studio_dark");
      this.darkMode = true;
    }
  }
}
