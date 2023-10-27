import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export class webSocketObject {
  public wsMessages$: Subject<any>;
  private forceClose = false;
  private webSocket: any;

  constructor() {
    this.wsMessages$ = new Subject<any>();
  }

  public connect(url: string){

    this.webSocket= new WebSocket(environment.ws + url);
    this.forceClose = false;

    this.webSocket.onopen = (event: any) => {
      this.wsMessages$.next(event);
    }
    this.webSocket.onmessage = (event: any) => {
      this.wsMessages$.next(event);
    }
    this.webSocket.onclose = (event: { wasClean: any; code: any; reason: any; }) => {

      this.wsMessages$.next(event);

      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);

      }else{
        if(!this.forceClose){
          this.connect(url);

        }else {
          console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        }
      }
    }
    this.webSocket.onerror = (event: any) => {
      this.wsMessages$.next(event);
      //console.log(`%c[error]`,"color:red; font-weight:bolder;font-size:1rem;");
    }
  }

  public disconnect(){
    this.forceClose = true;
    this.webSocket.close(1000);
  }

  public send(msg: any){
    if (this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(JSON.stringify(msg));
    }
  }

  public on (event: string): Observable<any> {
      if (event == "message") {
        return this.wsMessages$.pipe (
        filter ((message: any) => message.type === event),
        map ((message:any) => JSON.parse(message.data))
        );
      }
      else {
        return this.wsMessages$.pipe (
          filter ((message: any) => message.type === event)
          );
      }
    }
}

@Injectable({
   providedIn: 'root'
})
export class WebsocketService {

    constructor() {}

    connect(url: string) : webSocketObject{
        var x = new webSocketObject();
        x.connect(url)
        return x;
    }
}