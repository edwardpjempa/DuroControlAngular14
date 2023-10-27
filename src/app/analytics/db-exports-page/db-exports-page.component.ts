import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { ConfigDataService } from '../../config-data.service';
import { CsvDataService } from '../../csv-data.service';

import { Utils } from '../../editor/helpers/utils'

@Component({
  selector: 'db-exports-page',
  templateUrl: './db-exports-page.component.html',
  styleUrls: ['./db-exports-page.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class ExportsMainPageComponent implements OnInit, OnDestroy {
  public currentCsv: any;

  minutesInPast: number = 2

  show_previewCSV: boolean = false
  previewCSV: boolean = false
  exportCSV: boolean = false

  csvLocalValues:any = []

  csvData:any = []

  fileName: string = "duro1_dataExport.csv"

  csvDataServiceSubscription:any
  configDataServiceSubscription:any

  COL_DEFINITIONS:any = [];
  displayedColumns:any = [];  
  dataSource:any = [];

  constructor(public configDataService: ConfigDataService, public chartsDataService: CsvDataService) {}

  ngOnInit() {
    this.chartsDataService.openWS()

    this.csvDataServiceSubscription = this.chartsDataService.csvInfo.subscribe((value) => {
      if (value){
        console.log(value)
        this.csvData = value
        if(this.previewCSV) this.buildTable(value)
        if(this.exportCSV) this.downloadCsv(value)
      }   
    });
    this.checkParams()
  }

  ngAfterViewInit(){

    setTimeout(() => {
      this.configDataServiceSubscription = this.configDataService.charts_csvConfigRcvd.subscribe((value) => {
        if(value === "true"){
          this.checkParams()
          //console.log(this.configDataService.configFile.charts)
        }else if (value === "false"){
          console.log("Error loading CSVs config from DuroControl")
        }
      });
    });
  }

  ngOnDestroy(){
    if(this.csvDataServiceSubscription) this.csvDataServiceSubscription.unsubscribe()
    if(this.configDataServiceSubscription) this.configDataServiceSubscription.unsubscribe()
    this.chartsDataService.wsDisconnect();
    
  }

  onDrop($event:any) {
    console.log("Dropped:",$event);
    $event.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    const data = $event.dataTransfer.getData("text/plain");
    console.log("Received Data:",data)
    let newTagData: any  = {}
    newTagData.tag = data;
    newTagData.axis = 'A';
    this.currentCsv?.tags.push(newTagData)

    //Asks server to start sending data of new tag
    this.sendWsMsg("read")
    //ev.target.appendChild(document.getElementById(data));
  }

  onDragOver(event:any) {
    event.stopPropagation();
    event.preventDefault();
  }

  checkParams(){
    if(this.configDataService.configFile.hasOwnProperty("csv")){
      for (var i=0 ; i<this.configDataService.configFile.csv.length;i++) {

        if(!this.configDataService.configFile.csv[i].hasOwnProperty("minutesInPast")){
          this.configDataService.configFile.csv[i]["minutesInPast"] = this.minutesInPast
        }
        if(!this.configDataService.configFile.csv[i].hasOwnProperty("id")){
          this.configDataService.configFile.csv[i]["id"] = 'csv_' + Utils.getGUID()
        }
        this.csvLocalValues.push({onEdit: false})
      }
    }
  }

  sendWsMsg(type:any){

    if (type === "read"){
      let msg = JSON.stringify({msgType: "read", readingType: "csv", msgData: this.currentCsv})

      this.chartsDataService.localSocket.send(msg)

    }else if (type === "write"){
      let msg = JSON.stringify({msgType: "write", msgData: this.currentCsv, source: "csv"})
      this.chartsDataService.localSocket.send(msg)
    }
  }

  setCurrentCsv(csvId:any) {

    for (var i = 0; i < this.configDataService.configFile.csv.length; i++) {
      if (this.configDataService.configFile.csv[i].id === csvId) {

        this.currentCsv = this.configDataService.configFile.csv[i];
        //console.log(this.currentCsv)
        console.log(this.configDataService.configFile.csv )

        this.minutesInPast = this.currentCsv["minutesInPast"]

        this.sendWsMsg("read")
      }
    }
  }

  removeTag(tag:any) {
    this.currentCsv.tags.splice(this.currentCsv.tags.indexOf(tag), 1);

    this.sendWsMsg("read")
  }

  onParamChange(){
    if(this.currentCsv){
      this.currentCsv["minutesInPast"] = this.minutesInPast
      this.sendWsMsg("write")
    } 
  }

  addCsv(){
    let c = {name: "", id: "", tags: [], minutesInPast: 2}
    if (this.configDataService.configFile.csv.length <= 0) {
       c.name = 'Main CSV';
    } else {
       c.name = Utils.defaultName(this.configDataService.configFile.csv, "CSV_", "name")
    }
    c.id = 'csv_' + Utils.getGUID();
    this.configDataService.configFile.csv.push(c);

    this.csvLocalValues.push({onEdit: false})

    this.setCurrentCsv(c.id)

    //console.log(this.configDataService.configFile.csv)
  }

  removeCsv(csvId:any){
    //console.log(chartId)
    let toselect = null;
    for (var i = 0; i < this.configDataService.configFile.csv.length; i++) {
      if (this.configDataService.configFile.csv[i].id === csvId) {
        this.configDataService.configFile.csv.splice(i, 1);

        if (i > 0 && i < this.configDataService.configFile.csv.length) {
          toselect = this.configDataService.configFile.csv[i];
        }
        this.currentCsv = null;
        if (this.configDataService.configFile.csv.length === 0) {
          this.addCsv()//if not csv left, we create one by default
        }else {
          if (toselect) {
            this.setCurrentCsv(toselect.id)
          } else if (this.configDataService.configFile.csv.length > 0) {
            this.setCurrentCsv(this.configDataService.configFile.csv[0].id);
          }
        }
      }
    }
  }

  onCsvRename(i:any, inputRename:any){
    this.csvLocalValues[i]['onEdit'] = true;
    setTimeout(() => {
       inputRename.focus()
    }, 175);
  }

  buildTable(csvData:any){
    //console.log(csvData)
    if (csvData.length > 0){
      //let headers = Object.keys(csvData[0]);
      let headers = csvData[0];
      //console.log(headers)

      let DEFINITIONS:any = []
      headers.forEach((element:any) => {

        if (element === "DateTime"){
          DEFINITIONS.push({label: element, sticky: true, style:{"padding-right": "50px"}})
        }else{
          DEFINITIONS.push({label: element})
        }
      });
      //console.log(DEFINITIONS)
      this.COL_DEFINITIONS = DEFINITIONS;
      this.displayedColumns = DEFINITIONS.map((def:any) => def.label);
      
      if(csvData[1]){
        this.dataSource = csvData[1]
      }
    }
    this.show_previewCSV = true
    this.previewCSV = false
  }

  previewCsv(){
    this.previewCSV = true
    this.sendWsMsg("read")
  }

  exportCsv(){
    this.exportCSV = true
    this.sendWsMsg("read")
  }

  downloadCsv(csvData:any){
    //let columnNames = Object.keys(this.csvData[0]);
    let columnNames = csvData[0];
    let header = columnNames.join(',');

    let csv = header;
    csv += '\r\n';

    if(csvData[1]){
      csvData[1].map((c:any) => {
        let rowData = []
        for (var i = 0; i < columnNames.length; i++) {
          rowData.push(c[columnNames[i]])
        }
        csv += rowData.join(',');
        csv += '\r\n';
      })
    }
    //console.log(csv)

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", this.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    this.exportCSV = false
  }
  
}
