import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigDataService, TagNode } from 'src/app/config-data.service';
import { DbDataService } from 'src/app/db-data.service';

@Component({
   selector: 'app-database-view',
   templateUrl: './database-view.component.html',
   styleUrls: ['./database-view.component.css']
})

export class DatabaseViewComponent implements OnInit, OnDestroy {
   dataSource: any;
   public tagValues = {};

   constructor(private configDataService: ConfigDataService, public dbDataService: DbDataService) {
      this.dataSource = configDataService.databaseTagValuesTree;
   }

   test() {
      const obj = {};
      this.configDataService.getDisplayedValuesFromNode(obj,this.dataSource);
   }

   ngOnInit(): void {
      this.dbDataService.connect();
      this.treeChanged();
      this.configDataService.dbTreeChanged.subscribe(changed=>{
         this.dataSource = this.configDataService.databaseTagValuesTree;
         this.treeChanged();
      })
   }

   openDatabase = 0
   ngAfterViewChecked(){
      setTimeout(() => {
         // open db
         if(document.getElementsByTagName('mat-sidenav')[1].getAttribute('style')!.includes('visible') && this.openDatabase == 0){
            this.openDatabase = 1
            this.treeChanged()
         //close db
         }else if(this.openDatabase == 1 && document.getElementsByTagName('mat-sidenav')[1].getAttribute('style')!.includes('hidden')){
            this.openDatabase = 0
         }
      })
   }

   // Function that return a nested object object with all the value items displayed 
   // in the database view tree. The items are returned with null as value.
   // The receiving device will fill it with data to be displayed later on
   public getDisplayedValuesFromNode(tagslist: string[],currentTagPrefix: string, nodeArray: TagNode[]) {
      for (let i = 0; i < nodeArray.length; i++) {
         let nextLevelTagPrefix = currentTagPrefix + (currentTagPrefix.length==0?'':'.') + nodeArray[i].name;
         if (nodeArray[i].showChildren) {
            this.getDisplayedValuesFromNode(tagslist, nextLevelTagPrefix, nodeArray[i].children!);
         } else {
            if (nodeArray[i].dataType != 'Folder') {
               tagslist.push(nextLevelTagPrefix);
            }
         }
      }
   }

   treeChanged() {
      const tagslist: string[] = [];
      this.getDisplayedValuesFromNode(tagslist,'', this.dataSource);
      this.dbDataService.subscribeTags(tagslist);
   }

   ngOnDestroy(){
      this.dbDataService.disconnect();
   }
}
