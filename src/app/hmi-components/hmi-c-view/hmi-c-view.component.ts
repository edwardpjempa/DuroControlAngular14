import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HmiComponent } from '../hmi-component';
import { ConfigDataService } from '../../config-data.service';

@Component({
   selector: 'app-hmi-c-view',
   templateUrl: './hmi-c-view.component.html',
   styleUrls: ['./hmi-c-view.component.scss']
})
export class HmiCViewComponent extends HmiComponent implements OnInit {

   // This is the full list of views. required to render nested views.
   @Input() viewInfo: any;
   @Input() scaleX!: number;
   @Input() scaleY!: number;

   constructor(public configDataService: ConfigDataService) {
      super();
   }

   ngOnInit(): void {
      //console.log("On Init of C-VIEW");
   }

   views(){
      let viewsCatalog: any = {}
      const viewArray = this.configDataService?.hmi?.views;
      if (viewArray) {
         for (let index = 0; index < viewArray.length; index++) {
            viewsCatalog[viewArray[index].id] = viewArray[index];
         }
      }
      return viewsCatalog
   }

   ngAfterViewChecked(){
      if(document.getElementsByTagName('app-hmi-c-table')[0] != undefined){
         for(var i = 0; i < document.getElementsByTagName('app-hmi-c-table').length; i++){
            document.getElementsByTagName('app-hmi-c-table')[i].parentElement!.style.overflow = 'scroll'
         }
      }
   }
}
