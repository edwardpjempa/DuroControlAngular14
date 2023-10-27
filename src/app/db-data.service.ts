import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigDataService, TagNode } from './config-data.service';
import { webSocketObject, WebsocketService } from './websocket.service';

@Injectable()
export class DbDataService {
   private registeredTags:any =  [];
   public deviceData: any = [];
   public connected = false;
   private destroy = false;
   private subscriptionId = 0;
   localSocket: any;
   public tagValues:any = {};
   currentConnection!: webSocketObject;
   subscription!: Subscription;
   
   constructor( public webSocketService: WebsocketService,
      private configDataService: ConfigDataService ) {
   }

   connect(){
      this.subscription = new Subscription();
      this.currentConnection = this.webSocketService.connect("/db/");
      this.subscription.add(this.currentConnection.on('message').subscribe(
         msg => {
            switch (msg.msgType) {
               case 'readupdate':
                  // Only if we received data for the current subscription
                  if (msg.msgId == this.subscriptionId) {
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
      this.currentConnection.send(msg);
   }

   modifyTagValue(tagname: string,value: any) {
      const msg = {
         "msgType": "write",
         "msgData":  {
            "tagName": tagname,
            "value": value
         }
      }
      this.currentConnection.send(msg);
   }

   getTagNames(){
      var funct = function(children: TagNode[], parent?: string) {
         var d:any = [];
         children.forEach((node:any) => {
           var s = (parent == undefined) ? "" : parent;
           s += node.name
           if(node.dataType == "Folder"){
             s+= "."
             d = d.concat(funct(node.children, s));
           }
           else{
             d.push(s);
           }
         })
         return d;
      }
      return funct(this.configDataService.databaseTagValuesTree);
   }

   openWS() {
      this.localSocket = new WebSocket("ws://127.0.0.1:5556/db/");
      this.localSocket.onopen = (e: any) => this.wsOnOpen(e);
      this.localSocket.onmessage = (e: any) => this.wsOnMsg(e);
      this.localSocket.onclose = (e: any) => this.wsOnClose(e);
      this.localSocket.onerror = (e: any) => this.wsOnError(e);
   }


   wsOnOpen(e:any) {
      console.log("[open] Connection established");
      this.connected = true;
      this.subscribeTags(this.registeredTags);
      
   };

   wsOnMsg(event:any) {
      try {
         const rxMsg = JSON.parse(event.data);
         switch (rxMsg.msgType) {
            case 'readupdate':
               // Only if we received data for the current subscription
               if (rxMsg.msgId == this.subscriptionId) {
                  for (let i=0;i<this.registeredTags.length;i++) {
                     this.tagValues[this.registeredTags[i]] = rxMsg.msgData[i]; 
                  }
               }
         }
      } catch (error) {
         console.log(`%c[error] ${error.message}`,"color:red; font-weight:bolder;font-size:1rem;");

      }
   };

   wsOnClose(event:any) {
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

   wsOnError(error:any) {
      console.log(`%c[error] ${error.message}`,"color:red; font-weight:bolder;font-size:1rem;");
   };
}