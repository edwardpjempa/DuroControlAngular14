import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { webSocketObject, WebsocketService } from '../websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ModbusTcpIpStatusService {
   
      private registeredTags: string[] =  [
      ]
      public deviceData: any = [];
      public connected = false;
      private destroy = false;
      private subscriptionId = 0;
      localSocket: any;
   
      public tagValues: any
      currentConnection!: webSocketObject;
      subscription!: Subscription;
      
      constructor( public webSocketService: WebsocketService ) {
      }
   
      connect(){
         this.subscription = new Subscription();
         this.currentConnection = this.webSocketService.connect("/communications/");
         this.subscription.add(this.currentConnection.on('message').subscribe(
            msg => {
               switch (msg.msgType) {
                  case 'readupdate':
                     // Only if we received data for the current subscription
                     if (msg.msgId == this.subscriptionId) {
                        this.tagValues = {}
                        for (let i=0;i<this.registeredTags.length;i++) {
                           this.tagValues[this.registeredTags[i]] = msg.msgData[i]; 
                        }
                     }
               }
            }
         ));
         this.subscription.add(this.currentConnection.on('open').subscribe(msg => {
            this.subscribeTags(this.registeredTags)
         }));
      }
      disconnect(){
         this.subscription.unsubscribe();
         this.currentConnection.disconnect();
      }
   
      subscribeTags(tagsList: string[]) {
         this.subscriptionId = Math.floor(Math.random() * 1000000);
         const msg = {
            "msgType": "read",
            "msgId": this.subscriptionId,
            "msgData":  tagsList
         }
         this.registeredTags = tagsList;
         //this.tagValues = {};
         this.currentConnection.send(msg);
      }
   
   
      modifyTagValue(tagname: string,value: any) {
         //this.subscriptionId = Math.floor(Math.random() * 1000000);
         const msg = {
            "msgType": "write",
            //"msgId": this.subscriptionId,
            "msgData":  {
               "tagName": tagname,
               "value": value
            }
         }
         this.currentConnection.send(msg);
      }
   
   
      openWS() {
         this.localSocket = new WebSocket("ws://127.0.0.1:5556/db/");
         this.localSocket.onopen = (e: any) => this.wsOnOpen(e);
         this.localSocket.onmessage = (e: any) => this.wsOnMsg(e);
         this.localSocket.onclose =  (e: any) => this.wsOnClose(e);
         this.localSocket.onerror = (e: any) => this.wsOnError(e);
      }
   
   
      wsOnOpen(e: any) {
         console.log("[open] Connection established");
         this.connected = true;
         //alert("Sending to server");
         //this.localSocket.send("My name is John");
   
         this.subscribeTags(this.registeredTags);
         
      };
   
      wsOnMsg(event: { data: string; }) {
         //console.log(`[message] Data received from server: ${event.data}`);
         //console.log(typeof event.data);
         try {
            const rxMsg = JSON.parse(event.data);
            //this.deviceData = rxMsg;
            switch (rxMsg.msgType) {
               case 'readupdate':
                  // Only if we received data for the current subscription
                  if (rxMsg.msgId == this.subscriptionId) {
                     for (let i=0;i<this.registeredTags.length;i++) {
                        this.tagValues[this.registeredTags[i]] = rxMsg.msgData[i]; 
                     }
                  }
            }
            
            // Do this later
            // switch (rxMsg.msgType) {
            //    case 'devicesData':
            //       this.deviceData = rxMsg.msgData;
            //       this.devices = Object.keys(this.deviceData);
            //       break;
            //    default:
            //       console.log(`%c[warning] Undefined Message Received: ${rxMsg.msgType}`,"color:yellow; font-weight:bolder;font-size:1rem;");
            //    }
         } catch (error: any) {
            console.log(`%c[error] ${error.message}`,"color:red; font-weight:bolder;font-size:1rem;");
   
         }
      };
   
      wsOnClose(event: { wasClean: any; code: any; reason: any; }) {
         if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            this.connected = false;
            if (!this.destroy) {
               setTimeout(()=>this.openWS(),1000);
            }
         } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died');
            this.connected = false;
   
            if (!this.destroy) {
               setTimeout(()=>this.openWS(),1000);
            }
         }
      };
   
      wsOnError(error: { message: any; }) {
         console.log(`%c[error] ${error.message}`,"color:red; font-weight:bolder;font-size:1rem;");
      };
   }
   