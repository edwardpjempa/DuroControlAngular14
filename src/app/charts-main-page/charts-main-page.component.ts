import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ConfigDataService } from '../config-data.service';
import {formatDate} from '@angular/common';

import { ChartsDataService } from '../charts-data.service';

import { Utils } from '../editor/helpers/utils'
import { Router } from '@angular/router';

import { ChartDataSets, Chart } from 'chart.js';
import { Color, BaseChartDirective } from 'ng2-charts';

import { FormGroup,FormControl} from '@angular/forms';

@Component({
   selector: 'app-charts-main-page',
   templateUrl: './charts-main-page.component.html',
   styleUrls: ['./charts-main-page.component.css']
})
export class ChartsMainPageComponent implements OnInit, OnDestroy {
   public currentChart: any;

   chartsLocalValues:any = []

   minutesInPast: number = 2

   refreshTime: number = 5
   refreshStopped: boolean = false

   prevDatasets_lines = 0

   testForm! : FormGroup;

   date = new Date((new Date().getTime() ));

   time = "12:00"

   chartDataSet: ChartDataSets[] = [
      {
         data: [
            { t: 2, y: 7 },
            { t: 10, y: 24 },
            { t: 15, y: 11 },
            { t: 20, y: 57 },
            { t: 25, y: 4 }
         ]
      }
   ];

   lineChartData: ChartDataSets[] = [];

   //lineChartLabels: Label[] = [];
  
   lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
         xAxes: [{
            type: 'time',
            position: "bottom"
         }],
         yAxes: [
            {
              id: 'A',
              position: 'left',
            },
            {
              id: 'B',
              position: 'right',
            }
         ]
      }
   };

   lineChartLegend = true;
   lineChartPlugins = [];
   lineChartType:any = 'line';

   /*lineChartColors: Color[] = [
      {
         borderColor: 'black',
         backgroundColor: 'rgba(255,255,0,0.28)',
      },
   ];*/

   public lineChartColors: Color[] = [
      { // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
      { // red
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      }
   ];

   chartsDataServiceSubscription:any
   configDataServiceSubscription:any

   @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

   constructor(public configDataService: ConfigDataService, public chartsDataService: ChartsDataService, public router: Router) {}

   ngOnInit() {
      this.chartsDataService.openWS()

      this.chartsDataServiceSubscription = this.chartsDataService.chartsInfo.subscribe((value) => {
         if (value){
            //console.log(value)
            this.chartData3(value)
         }   
      });
      this.checkParams()


      this.testForm = new FormGroup({
         date:new FormControl(this.date),
       })
   }

   ngAfterViewInit(){

      setTimeout(() => {
         this.configDataServiceSubscription = this.configDataService.charts_csvConfigRcvd.subscribe((value) => {
            if(value === "true"){
               this.checkParams()
               //console.log(this.configDataService.configFile.charts)
            }else if (value === "false"){
               console.log("Error loading CHARTS config from DuroControl")
            }
         });
      });
   }

   ngOnDestroy(){
      if(this.chartsDataServiceSubscription) this.chartsDataServiceSubscription.unsubscribe()
      if(this.configDataServiceSubscription) this.configDataServiceSubscription.unsubscribe()
      this.chartsDataService.wsDisconnect();
   }

   checkParams(){
      if(this.configDataService.configFile.hasOwnProperty("charts")){
         for (var i=0 ; i<this.configDataService.configFile.charts.length;i++) {

            if(!this.configDataService.configFile.charts[i].hasOwnProperty("minutesInPast")){
               this.configDataService.configFile.charts[i]["minutesInPast"] = this.minutesInPast
            }
            if(!this.configDataService.configFile.charts[i].hasOwnProperty("refreshTime")){
               this.configDataService.configFile.charts[i]["refreshTime"] = this.refreshTime
            }
            if(!this.configDataService.configFile.charts[i].hasOwnProperty("id")){
               this.configDataService.configFile.charts[i]["id"] = 'chart_' + Utils.getGUID()
            }
            this.chartsLocalValues.push({onEdit: false})
         }
      }
      //console.log(this.configDataService.configFile.charts)
   }

   setCurrentChart(chartId:any) {

      for (var i = 0; i < this.configDataService.configFile.charts.length; i++) {
         if (this.configDataService.configFile.charts[i].id === chartId) {

            this.currentChart = this.configDataService.configFile.charts[i];
            //console.log(this.currentChart)
            console.log(this.configDataService.configFile.charts )

            this.minutesInPast = this.currentChart["minutesInPast"]
            this.refreshTime = this.currentChart["refreshTime"]

            this.sendWsMsg("read")

            this.prevDatasets_lines = 0
         }
      }
   }

   sendWsMsg(type:any){

      if (type === "read"){
         let msg = JSON.stringify({msgType: "read", readingType: "chart", msgData: this.currentChart})

         this.chartsDataService.localSocket.send(msg)

      }else if (type === "write"){
         let msg = JSON.stringify({msgType: "write", msgData: this.currentChart, source: "chart"})
         this.chartsDataService.localSocket.send(msg)
         console.log(msg)
      }
   }

   onParamChange(){
      if(this.currentChart){
         this.currentChart["minutesInPast"] = this.minutesInPast
         this.currentChart["refreshTime"] = this.refreshTime
         this.sendWsMsg("write")
      } 
   }

   changeAxis(tag:any) {
      if (tag.axis=='A') {
         tag.axis='B';
      } else {
         tag.axis='A';
      }
      for (var i=0 ; i<this.lineChartData.length;i++) {
         if(tag.tag === this.lineChartData[i].label){
            this.lineChartData[i]['yAxisID'] = tag.axis
            this.chart.update()
         }
      }
   }

   removeTag(tag:any) {
      this.currentChart.tags.splice(this.currentChart.tags.indexOf(tag), 1);

      this.sendWsMsg("read")

      // Removes tag from the chart
      for (var i=0 ; i<this.lineChartData.length;i++) {
         if ( this.lineChartData[i].label === tag['tag']){
            this.lineChartData.splice(i,1)
            this.prevDatasets_lines = this.lineChartData.length
         }
      }
   }

   onDrop($event:any) {
      console.log("Dropped:",$event);
      $event.preventDefault();
      // Get the id of the target and add the moved element to the target's DOM
      const data = $event.dataTransfer.getData("text/plain");
      console.log("Received Data:",data)

      //Checking is tag exists already
      let component = this.currentChart['tags'].find((x:any) => x.tag === data)
      //console.log(component)
      if(!component){
         let newTagData: any  = {}
         newTagData.tag = data;
         newTagData.axis = 'A';
         this.currentChart?.tags.push(newTagData)

         //Asks server to add and start sending data of new tag
         this.sendWsMsg("read")
      }
         
      //ev.target.appendChild(document.getElementById(data));
   }

   onDragOver(event:any) {
      event.stopPropagation();
      event.preventDefault();
   }

   addChart(){
      let c = {name: "", id: "", tags: [], minutesInPast: 2, refreshTime: 5}
      if (this.configDataService.configFile.charts.length <= 0) {
         c.name = 'Main Chart';
      } else {
         c.name = Utils.defaultName(this.configDataService.configFile.charts, "Chart_", "name")
      }
      c.id = 'chart_' + Utils.getGUID();
      this.configDataService.configFile.charts.push(c);

      this.chartsLocalValues.push({onEdit: false})

      this.setCurrentChart(c.id)

      //console.log(this.configDataService.configFile.charts)
   }

   onChartRename(i:any, inputRename:any){
      this.chartsLocalValues[i]['onEdit'] = true;
      setTimeout(() => {
         inputRename.focus()
      }, 175);
   }

   removeChart(chartId:any){
      console.log(chartId)
      let toselect = null;
      for (var i = 0; i < this.configDataService.configFile.charts.length; i++) {
         if (this.configDataService.configFile.charts[i].id === chartId) {
            this.configDataService.configFile.charts.splice(i, 1);

            if (i > 0 && i < this.configDataService.configFile.charts.length) {
               toselect = this.configDataService.configFile.charts[i];
            }
            this.currentChart = null;
            if (this.configDataService.configFile.charts.length === 0) {
               this.addChart()//if not charts left, we create one by default
            } else {
               if (toselect) {
                  this.setCurrentChart(toselect.id)
               } else if (this.configDataService.configFile.charts.length > 0) {
                  this.setCurrentChart(this.configDataService.configFile.charts[0].id);
               }
            }
         }
      }
   }

   onParamChange1(event:any){
      console.log(event.target.value)
   }

   start_stopRefresh(action:any){
      let msg = JSON.stringify({msgType: "write", refreshAction: action, source: "chart"})
      this.chartsDataService.localSocket.send(msg)
   }

   setDate(date: string) {
      let date1 = date ? date : '';
      console.log(date1)
      console.log(formatDate(date1, 'yyyy-MM-dd', 'en-US'))
   }

   chartData3(datasetsObj:any){
      //console.log(datasetsObj)

      if ((this.prevDatasets_lines !== this.lineChartData.length) && (datasetsObj.length > 0)){
         //this.prevDatasets_lines = this.lineChartData.length
         this.lineChartData = []
         console.log("Clear all charts")
      }else if (datasetsObj.length === 0 && this.currentChart){
         console.log("Clear all charts and create one by default")
         this.lineChartData = []
         this.lineChartData.push({data:[{}], label: "Tag Name", yAxisID: "A"})
         //this.prevDatasets_lines = this.lineChartData.length
      }

      for (var i=0 ; i<datasetsObj.length;i++) {

         for (var j=0 ; j<datasetsObj[i].data.length;j++) {
            //console.log(new Date(datasetsObj[i].data[j].t).getTime())
            datasetsObj[i].data[j].t = new Date(datasetsObj[i].data[j].t).getTime()
         }

         let yAxisID = ""
         if(this.currentChart){
            for (var k=0 ; k<this.currentChart['tags'].length;k++) {
               if (this.currentChart.tags[k].tag === datasetsObj[i]['label']){
                  yAxisID = this.currentChart.tags[k].axis 
               }
            }
         }

         if (this.lineChartData[i]){
            this.lineChartData[i].data = datasetsObj[i].data
            this.lineChartData[i].label = datasetsObj[i]['label']
            this.lineChartData[i].yAxisID = yAxisID

            this.chart.update()
         }else{
            //console.log(datasetsObj[i])
            this.lineChartData.push({data: datasetsObj[i].data, label: datasetsObj[i]['label'], yAxisID: yAxisID})
         }
      }
      this.prevDatasets_lines = this.lineChartData.length
      //console.log(this.lineChartData)
   }


  /*chartData3(datasetsObj){
   //this.lineChartData = []
   console.log(this.lineChartData[0])

  //this.datasets_lines = [];
   for (var i=0 ; i<datasetsObj.length;i++) {

      for (var j=0 ; j<datasetsObj[i].data.length;j++) {
         console.log(new Date(datasetsObj[i].data[j].t).getTime())
         datasetsObj[i].data[j].t = new Date(datasetsObj[i].data[j].t).getTime()
      }
      
      this.lineChartData.push({data:datasetsObj[i].data, label: datasetsObj[i]['label']})//, borderColor: datasetsObj[i]['borderColor']

      //console.log(datasetsObj[i]['label'])
   }
   console.log(this.lineChartData)
   //console.log(this.chart.chart.config.data)
  }*/




   chartData(datasetsObj:any) {
      console.log("just testing")
      //datasetsObj = JSON.parse(datasetsObj)
      console.log(datasetsObj)
      console.log(datasetsObj[1])

      for (var i=0 ; i<datasetsObj.length;i++) {
         for (var j=0 ; j<datasetsObj[i].data.length;j++) {
            //console.log(datasetsObj[i])
            datasetsObj[i].data[j].t = new Date(datasetsObj[i].data[j].t)
         }
      }
      console.log(datasetsObj)


      var canvas = <HTMLCanvasElement> document.getElementById("examChart")
      var ctx:any = canvas.getContext("2d");
      //console.log("Context:",ctx)
      var myChart = new Chart(ctx, {
         type: 'line',
         //responsive: true,
      //maintainAspectRatio: false,

         data: {
            datasets: datasetsObj
         },
         options: {
            scales: {
               xAxes: [{
                  type: 'time'
               }]
            }
         }
      });
   }
}
