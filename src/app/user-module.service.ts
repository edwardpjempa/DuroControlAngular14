import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { webSocketObject, WebsocketService } from './websocket.service';

export class UserModuleStatus{
  public console: string[] = []
  public status: string = "LOADING"
  public debug: boolean = false;
  public enabled: boolean = false;
  constructor(params: Partial<UserModuleStatus>){
    Object.assign(this, params);
  }
}

@Injectable({
  providedIn: 'root'
})

export class UserModuleService {

  currentConnection: any;
  subscription = new Subscription();
  status$!: Subject<UserModuleStatus>;
  compile$!: Subject<string>;

  constructor(public webSocketService: WebsocketService) { }

  connect(){
    if(this.currentConnection != undefined){
      this.currentConnection.disconnect();
    }
      
    this.currentConnection = this.webSocketService.connect(`/userModule`);
    this.status$ = new Subject<UserModuleStatus>();
    this.compile$ = new Subject<string>();
    this.subscription = new Subscription();
    this.subscription.add(this.currentConnection.on('message').subscribe(
      (      msg: { msgData: any; msgType: string; }) => {
        if (msg.msgData.moduleId != undefined) {
          for (var i = 0; i < msg.msgData.moduleId.length; i++) {
            if (!localStorage[msg.msgData.moduleId[i]]) {
              localStorage[msg.msgData.moduleId[i]] = ""
            }
            localStorage[msg.msgData.moduleId[i] + "Status"] = msg.msgData.status[i]
            localStorage[msg.msgData.moduleId[i] + "Enabled"] = msg.msgData.enabled[i]
            localStorage[msg.msgData.moduleId[i]] += msg.msgData.console[i];
            // Check if console exceeds 1000 characters
            if (localStorage[msg.msgData.moduleId[i]].length > 1000000) {
              // Calculate how many characters to remove from the beginning
              const charactersToRemove = localStorage[msg.msgData.moduleId[i]].length - 1000;
              // Remove characters from the beginning of console
              localStorage[msg.msgData.moduleId[i]] = localStorage[msg.msgData.moduleId[i]].substring(charactersToRemove);
            }
          }
        }
        if (msg.msgType == 'status') {
          if (msg.msgData.enabled == false) {
            msg.msgData.status = (msg.msgData.status == "UNKNOWN") ? "UNKNOWN" : "DISABLED"
          }
        }
        else if (msg.msgType == 'compile') {
          this.compile$.next(msg.msgData);
        }
      }
    ));
  }

  disconnect() {
    this.status$.complete();
    this.compile$.complete();
    this.currentConnection.disconnect();
    this.subscription.unsubscribe();
    this.currentConnection = null;
  }

  stopModule() {
    const msg = {
      "msgType": "stop"
    }
    this.currentConnection.send(msg)
  }

  runModule() {
    const msg = {
      "msgType": "start"
    }
    this.currentConnection.send(msg)
  }

  compileCode(code: string) {
    const msg = {
      "msgType": "compile",
      "msgData": code
    }
    this.currentConnection.send(msg)
  }

  debugCode(code: any) {
    const msg = {
      "msgType": "debug",
      "msgData": code
    }
    this.currentConnection.send(msg);
  }

  uploadCode(code: any) {
    const msg = {
      "msgType": "upload",
      "msgData": code
    }
    this.currentConnection.send(msg);
  }

  clearConsole(moduleId: any) {
    const msg = {
      "msgType": "clear",
      "msgData": moduleId
    }
    this.currentConnection.send(msg);
  }
}
