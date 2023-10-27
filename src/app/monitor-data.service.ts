import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonitorDataService {

   configFile: any;
   viewsIndex: any;


   // TODO: This has to be changed so not all configuration is loaded, but only Screens config
   MAIN_CONFIG_URL = environment.http + "/configservices"; //config/config.json";

   

   constructor(private http: HttpClient) {
      this.http.get(this.MAIN_CONFIG_URL)
      .subscribe((data: any) => { 
         this.configFile = data;
         this.buildViewsIndex();
      });
      


      //this.buildTagSelector();
      //console.log(this.tagTreeSelectorData);
      //console.log(this.configFile)
   }


   buildViewsIndex() {
      var viewsIndex: any
      const viewsArray = this.configFile?.hmi?.views;
      if (viewsArray) {
         for (let i=0; i < viewsArray.length; i++) {
            viewsIndex[viewsArray[i].id] = viewsArray[i];
         }
      }
      this.viewsIndex = viewsIndex;
      console.log("**************viewsIndex: ",viewsIndex);
   }



}
