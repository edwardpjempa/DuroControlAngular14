import { Component, OnInit } from '@angular/core';
import { HmiComponent } from './../../hmi-components/hmi-component';
import { environment } from 'src/environments/environment';

@Component({
   selector: 'app-hmi-c-image',
   templateUrl: './hmi-c-image.component.html',
   styleUrls: ['./hmi-c-image.component.scss']
})
export class HmiCImageComponent extends HmiComponent implements OnInit {

   baseURL: any = environment.http
   constructor() {
      super();
   }

   ngOnInit(): void {

      if(this.eventfunctions){
         if(this.eventfunctions.hasOwnProperty("timeout")) this.eventfunctions.timeout()
      }
   }
}