import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkNodeService {

  public connected = false;
  private destroy = false;
  private websocketConnectedSubject = new BehaviorSubject<boolean>(false);
  public websocketConnected = this.websocketConnectedSubject.asObservable();
  localSocket: any;

  networkInfo: BehaviorSubject<any>;

  constructor() {
    this.networkInfo = new BehaviorSubject<any>([]);
  }

  sendMessage(messageType: string, messageData: any) {
    if (this.connected) {
      const message = {
        type: messageType,
        data: messageData
      };
      this.localSocket.send(JSON.stringify(message));
    } else {
      console.log("WebSocket not connected.");
    }
  }



  openWS() {
    this.localSocket = new WebSocket(environment.netMapWS);
    this.localSocket.onopen = (e:any) => this.wsOnOpen(e);
    this.localSocket.onmessage = (e:any) => this.wsOnMsg(e);
    this.localSocket.onclose = (e:any) => this.wsOnClose(e);
    this.localSocket.onerror = (e:any) => this.wsOnError(e);
    this.destroy = false
  }


  wsOnOpen(e:any) {
    console.log("[open] Connection established");
    this.connected = true;
    this.websocketConnectedSubject.next(true);
  };


 wsOnMsg(event:any) {
    //console.log(`[message] Data received from server: ${event.data}`);
    //console.log(typeof event.data);
    try {
      const rxMsg = JSON.parse(event.data);
      this.networkInfo.next(rxMsg);
    } catch (error) {
      console.log(`%c[error] ${error.message}`,"color:red; font-weight:bolder;font-size:1rem;");
    }
 };

 
 wsOnClose(event:any) {
    if (event.wasClean) {
       console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
       this.connected = false;
       this.websocketConnectedSubject.next(false);
       if (!this.destroy) {
          setTimeout(()=>this.openWS(),1000);
       }
    } else {
       // e.g. server process killed or network down
       console.log('[close] Connection died');
       this.connected = false;

       if (!this.destroy) {
         setTimeout(()=>this.openWS(),1000);
       }
    }
  };

  wsOnError(error:any) {
    console.log(`%c[error] ${error.message}`,"color:red; font-weight:bolder;font-size:1rem;");
  };

  wsDisconnect(){
    this.localSocket.close(1000);
    this.destroy = true
    //this.connected = false;
  }
}

