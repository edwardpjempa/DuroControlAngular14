import { Component, OnInit, OnDestroy } from '@angular/core';
import { HmiComponent } from '../hmi-component';

@Component({
  selector: 'app-hmi-c-camera',
  templateUrl: './hmi-c-camera.component.html',
  styleUrls: ['./hmi-c-camera.component.css']
})
export class HmiCCameraComponent extends HmiComponent implements OnInit, OnDestroy {

  camURL: string = ""

  camPingCheck: any

  nocamera: boolean = true

  noCameraTimeout: number = 4000

  streamPath = "/control/faststream.jpg?stream=full"
  cameraIP = "0.0.0.0"

  controller: any

  nextping: boolean = true

  constructor() { 
    super();
  }

  ngOnInit(): void {
    this.cameraIP = this.config["ip"]
    this.getCamPath(this.config["brand"])

    this.camURL = `http://${this.cameraIP}${this.streamPath}&time=${new Date().getTime()}`

    if(this.cameraIP!=="0.0.0.0"){
      if(this.camPingCheck === null){
        if (this.config.loadVideo==="true") {
          this.startCamCheck()
        }
      }
    }
  }

  style(){
    this.cameraIP = this.config["ip"]
    this.getCamPath(this.config["brand"])

    if(this.cameraIP==="0.0.0.0"){
      clearInterval(this.camPingCheck)
      this.camPingCheck = null
    }else{
      if(this.camPingCheck === null){
        if (this.config.loadVideo==="true") {
          this.startCamCheck()
        }else{
          var image = document.getElementById("camtest");
        }
      }
    }
    return this.config.style
  }

  ngOnDestroy(){
    if(this.camPingCheck){
      clearInterval(this.camPingCheck)
    }
  }

  ping = (url: string, timeout = this.noCameraTimeout) => {
    return new Promise((resolve, reject) => {
      const urlRule = new RegExp('(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]');
      if (!urlRule.test(url)) reject('invalid url');
      let controller_ = new AbortController();
      this.controller = controller_
      let signal = controller_.signal;
      try {
        fetch(url, { mode: 'no-cors', signal: signal})
          .then(() => resolve(true))
          .catch(() => resolve(false));
     
          setTimeout(() => {
            resolve(false);
          }, timeout);
        
      } catch (e) {
        reject(e);
      }
    });
  };

  startCamCheck(){
    this.camPingCheck = setInterval(()=>{
      if(this.nextping){
        this.nextping = false
        this.ping("http://"+this.cameraIP)
        .then(res=>{
            if(res){
              // Camera is available
              if(this.nocamera){
                this.camURL = `http://${this.cameraIP}${this.streamPath}&time=${new Date().getTime()}`
              }
              this.nocamera = false;
            }else{
              // Camera is not available
              this.nocamera = true;
              this.camURL = ""

              // Cancell pending ping request
              this.controller.abort()
            }
            // Next ping is executed after getting response from the one in progress
            this.nextping = true;
          })
        .catch(e=>{
          this.nocamera = true;

          // Cancell pending ping request
          this.controller.abort()

          // Next ping is executed after getting response from the one in progress
          this.nextping = true;
        });
      }
    },2000)
  }

  load(){
    //console.log("Loading camera's image")
  }

  getCamPath(brand: string){
    if(brand === "mobotix"){
      this.streamPath = "/control/faststream.jpg?stream=full"
    }else if(brand === "axis"){
      this.streamPath = "/mjpg/video.mjpg?Axis-Orig-Sw=true"
    }
  }
}
