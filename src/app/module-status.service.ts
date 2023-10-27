import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { webSocketObject, WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleStatusService {

  constructor( public webSocketService: WebsocketService) { }
  currentConnection!: webSocketObject;
  subscription!: Subscription;
  status!: Subject<any>;

  connect(path:any){
    this.status = new Subject<any>();
    this.currentConnection = this.webSocketService.connect(`/moduleConfigDb?module=${path}`)
    this.currentConnection.on('message').subscribe(
      msg => {
        this.status.next(msg);
      }
    )
    return this.status
  }

  getAttributes(attributes:any){
    this.currentConnection.send(attributes);
  }

  disconnect(){
    this.status.complete();
    this.currentConnection.disconnect();
  }

}
