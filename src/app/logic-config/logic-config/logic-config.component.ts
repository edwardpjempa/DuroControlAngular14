import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';
import { fromEvent, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ConfigDataService } from '../../config-data.service';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarRef as MatSnackBarRef, LegacySimpleSnackBar as SimpleSnackBar } from '@angular/material/legacy-snack-bar';
import { EditorContextMenuComponent } from '../../components/editor-context-menu/editor-context-menu.component'
import { UntilDestroy } from '@ngneat/until-destroy';
import { UserModuleService, UserModuleStatus } from 'src/app/user-module.service';
import { DbDataService } from 'src/app/db-data.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { PopupComponent } from '../../components/popup/popup.component';
import {ActivatedRoute} from '@angular/router';

const DEFAULT_CONSOLE_HEIGHT = 170;
const DEFAULT_EDITOR_HEIGHT = 370;
declare var ace: any;

@UntilDestroy({ checkProperties: true })

@Component({
  selector: 'app-logic-config',
  templateUrl: './logic-config.component.html',
  styleUrls: ['./logic-config.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LogicConfigComponent implements OnDestroy, AfterViewInit, OnChanges, OnInit {
  @ViewChild('matTabGroup') matTabGroup!: MatTabGroup;
  @ViewChild('consoleWindow') consoleWindow!: ElementRef;
  @ViewChild('editorWindow') editorWindow!: ElementRef;
  @ViewChild('dragger') dragger!: ElementRef;
  @ViewChild('themeSpan') themeSpan!: ElementRef;
  @ViewChild('consoleText') consoleText!: ElementRef;
  @Input() config: any;
  @Input() moduleId: any;

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

  console:any

  status = new UserModuleStatus({
    console: [],
    status: "LOADING",
    enabled: false,
    debug: false
  })

  sessions: { [key: string]: any } = {
    'startCode': {},
    'runCode': {},
    'stopCode': {}
  }

  constructor(private overlay: Overlay,
    public configService: ConfigDataService,
    private snackBar: MatSnackBar,
    public userModuleService: UserModuleService,
    public dbDataService: DbDataService,
    public matDialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
    ) {

    activateRoute.params.subscribe(params => {
      setTimeout(()=>{
        let uniqueId = window.location.pathname.split('/')[2]
        var index = 0
        console.log(configService.configFile['modules'])
        for(var i = 0; i < configService.configFile['modules'].length; i++){
          if(uniqueId == configService.configFile['modules'][i]['uniqueId']){
            index = i
            break;
          }
        }
        if(configService.configFile['modules'][index]['type'] == 'user'){
          this.initTabEvent();
          this.initAceEditor();
          this.connectModuleService()

        }
      }, 900
    )
  })
  }
  
  ngOnInit(){
    this.console = localStorage.getItem(this.moduleId)
  }

  ngAfterViewInit() {
    this.consoleHeight = DEFAULT_CONSOLE_HEIGHT
    this.editorHeight = DEFAULT_EDITOR_HEIGHT
  }

  ngAfterViewChecked(){
    this.status.status = localStorage.getItem(this.moduleId+"Status")!
    this.console = localStorage.getItem(this.moduleId)
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(()=> {
      if (!changes['config'].firstChange) {
        if (this.snackBarRef != undefined) {
          this.snackBarRef.dismiss();
        }
        this.console = localStorage.getItem(this.moduleId)
      }
    },1200)
  }

  connectModuleService(moduleId?: number){
    this.subs = new Subscription();
    var id = (moduleId != undefined) ? moduleId : this.moduleId;
    this.userModuleService.connect();
    this.subs.add(this.userModuleService.compile$.subscribe(compileStr => {
      var snackBarStr = "" 
        if(compileStr == "Success"){
          snackBarStr = "Compiled Successfully!"

        }
        else{
          snackBarStr = "Compiled Failed. Check console for details"
          //this.status.console = compileStr;
        }
        
        this.snackBarRef = this.snackBar.open(snackBarStr, 'Close', { duration: 5000 });
    }))
    this.subs.add(this.userModuleService.status$.subscribe(
      status => {
        this.status
        console.log(status)
        this.console = ''
        for(var i = 0; i < status.console.length; i++){
          if(status.console[i]['moduleId' as any] == this.moduleId){
            this.console = this.console + status.console[i]['console' as any] + '\n'
          }
        }
        this.status.debug = status.debug;
        this.status.status = status.status
        this.status.enabled = status.enabled;
        if(this.status.status == "ERROR"){
          if(this.errorShown == false && this.snackBarRef == null){
          this.snackBarRef = this.snackBar.open("Error has occured. Check console for details.", 'Close', {  });
          this.snackBarRef.afterDismissed().subscribe(event => {
            //this.snackBarRef = null;
            this.errorShown = true;
          })
          }
        }
      },
      () => {},
      () => {
        this.status.debug = false;
        this.status.status = "LOADING"
      }
    ))
  }

  disconnectModuleService(){
    this.userModuleService.disconnect();
    this.subs.unsubscribe();
  }

  get consoleHeight(){
    return parseInt(this.consoleWindow.nativeElement.style.height.match(/\d*/g)[0])
  }

  set consoleHeight(value: number){
    this.consoleWindow.nativeElement.style.height = value.toString() + 'px';
  }

  get editorHeight(){
    return parseInt(this.editorWindow.nativeElement.style.height.match(/\d*/g)[0])
  }

  set editorHeight(value: number){
    this.editorWindow.nativeElement.style.height = value.toString() + 'px';
  }

  popUpHandler(popup: string){
    var dialogRef = this.matDialog.open(PopupComponent, {
      width: '250px',
      data: popup
    })
    dialogRef.afterClosed().subscribe(action => {
      switch(action){
        case 'stop':
          this.userModuleService.stopModule();
          break;
        case 'stop_debug':
          break;
        case 'upload':
          let code: any = {};
          Object.keys(this.sessions).forEach(value => {
            var session = this.sessions[value]
            code[value] = session.getValue();
          })
          this.userModuleService.uploadCode(code);
          break;
      }
    })
  }

  ngOnDestroy() {
    this.disconnectModuleService();
    if (this.snackBarRef)
      this.snackBarRef.dismiss();
  }

  getCurrentTab() {
    var index = this.matTabGroup.selectedIndex;
    switch (index) {
      case 0:
        return 'startCode';
      case 1:
        return 'runCode';
      case 2:
        return 'stopCode';
      default: 
      return ''
    }
  }

  initAceEditor(){
    ace.config.set("basePath", "assets/js/ace-editor");
    this.sessions["startCode"] = ace.createEditSession(this.config.startCode, "ace/mode/python")
    this.sessions["runCode"] = ace.createEditSession(this.config.runCode, "ace/mode/python")
    this.sessions["stopCode"] = ace.createEditSession(this.config.stopCode, "ace/mode/python")
    this.editor = ace.edit("editor", {
      theme: "ace/theme/eclipse",
      mode: "ace/mode/python",
      wrap: true,
      autoScrollEditorIntoView: true,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      showPrintMargin: false
    });
  }

  initTabEvent() {
    /* Subscribe to the tab change event and set the editor's session
       to the current tab being.*/
    this.matTabGroup.selectedTabChange.subscribe((event: any) => {
      setTimeout(()=>this.editor.setSession(this.sessions[this.getCurrentTab()]),600);
    });
    // Emit the tab change event to set the initial editor session
    this.matTabGroup.selectedTabChange.emit();
  }

  compile() {
    let totalCode = ""
    Object.keys(this.sessions).forEach(value => {
      var session = this.sessions[value] as any;
      totalCode += session.getValue();
      totalCode += "\n"
    })
    this.userModuleService.compileCode(totalCode);
  }

  debug(){
    if(this.status.status == "RUNNING"){
      this.popUpHandler("debug_running")
    }
    else{
      let code: any = {};
      Object.keys(this.sessions).forEach(value => {
        var session = this.sessions[value] as any;
        code[value] = session.getValue();
      })
      this.userModuleService.debugCode(code)
      this.errorShown = false;
    }
  }

  run(){
    this.errorShown = false;
    this.userModuleService.runModule();
  }
  stop(){
    this.errorShown = false;
    this.userModuleService.stopModule();
  }

  upload(){
    switch(this.status.status){
      case "UNKNOWN":
        this.popUpHandler("upload_new")
        break;
      case "STOPPED":
        this.popUpHandler("upload_saved_stopped")
        break;
      case "RUNNING":
        this.popUpHandler("upload_saved_running")
        break;
      case "STARTING":
        this.popUpHandler("upload_saved_running")
        break;
      case "STOPPING":
        this.popUpHandler("upload_saved_running")
        break;
      case "DISABLED":
        this.popUpHandler("upload_saved_stopped")
        break;
    }
  }

  save() {
    // Create backup of config so if changes are discarded
    var temp: any = {}
    Object.assign(temp, this.config);

    // Save the config with each editor session
    Object.keys(this.config).forEach(key => {
      try {
        this.config[key] = this.sessions[key].getValue()
      } catch (e) { }
    })

    // Create snackbar
    this.snackBarRef = this.snackBar.open('Saved', 'Discard', { duration: 5000 });
    this.snackBarRef.afterDismissed().subscribe((event) => {
      //Discard Changes
      if (event.dismissedByAction) {
        Object.keys(this.config).forEach(key => {
          try {
            this.config = temp;
            this.sessions[key].setValue(temp[key])
          } catch (e) { }
        })
      }
      //this.snackBarRef = null;
    });
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
    const compRef = this.overlayRef.attach(new ComponentPortal(EditorContextMenuComponent));
    // Send the editor reference to the component
    compRef.instance.editor = this.editor;
    compRef.instance.onAction.subscribe(event => {
      switch(event){
        case 'console':
          if(!this.consoleVisible){
            this.showConsole();
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
      consoleH:  this.consoleHeight
    }
    this.mouseMoveSubscription = fromEvent(document, 'mousemove').subscribe(e => { this.onMouseMove(e) });
    this.mouseUpSubscription = fromEvent(document, 'mouseup').subscribe(e => { this.onMouseUp(e) });
  }

  onMouseMove(e: any){
    if (this.moving) {
      var delta = e.clientY - this.md.originalY;
      this.editorHeight = delta + this.md.originalH
      this.consoleHeight = this.md.consoleH - delta
      this.editor.resize();
    }
  }

  onMouseUp(e: any){
    this.moving = false;
    this.mouseMoveSubscription.unsubscribe();
    this.mouseUpSubscription.unsubscribe();
  }

  closeConsole(){
    this.consoleWindow.nativeElement.style.display = 'none'
    this.dragger.nativeElement.style.display = 'none'
    this.editorWindow.nativeElement.style.maxHeight = "800px";
    this.editorHeight += this.consoleHeight;
    this.consoleVisible = false;

  }

  showConsole(){
    this.consoleVisible = true;
    this.consoleWindow.nativeElement.style.display = 'block'
    this.dragger.nativeElement.style.display = 'block'
    this.editorHeight = DEFAULT_EDITOR_HEIGHT
    this.consoleHeight = DEFAULT_CONSOLE_HEIGHT
  }

  clearConsole(){
    localStorage.setItem(this.moduleId, '')
    this.console = "";
    this.userModuleService.clearConsole(this.moduleId)
    localStorage.setItem('console', '')
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
