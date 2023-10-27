import { HmiComponent } from '../hmi-component';

import { Component, ViewChild, OnInit, ChangeDetectorRef, Input } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexYAxis
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  yaxis: ApexYAxis;
};

@Component({
  selector: 'app-hmi-c-line-chart',
  templateUrl: './hmi-c-line-chart.component.html',
  styleUrls: ['./hmi-c-line-chart.component.css']
})

export class HmiCLineChartComponent extends HmiComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  title = ''
  yAxisLabel = ''
  originalColor1 = "#F3F3F3"
  originalColor2 = "#ffffff05"
  originalColor = "#000000"
  yMin!: Number
  yMax!: Number
  tickAmount = 0
  @Input() id: any;
  lineChartId = ''
  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.lineChartId = 'line'+ this.id
    this.chartOptions = {
      series: [
        {
          name: "My-series",
          data: []
        }
      ],
      chart: {
        height: '100%',
        type: "line",
        foreColor: this.config.style.color,
        toolbar: {
          show: false
        }
      },
      grid: {
        row: {
          colors: [this.originalColor1, this.originalColor2], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.config.lineChartData.xAxis
      },
      yaxis: {
        min: this.config.style.min,
        max: this.config.style.max,
        tickAmount: this.config.style.tickAmount,
        title: {
          text: this.config.style.yAxisLabel,
          offsetX: 8
        }
      },
      title: {
        text: this.config.style.title,
        align: 'center',
        margin: 0,
        offsetY: 15
      },
    };
    this.originalColor1 = this.config.style.color1
    this.originalColor2 = this.config.style.color2
    this.originalColor = this.config.style.color
    this.tickAmount = this.config.style.tickAmount
    this.yMin = this.config.style.min
    this.yMax = this.config.style.max
    this.title = this.config.style.title
    this.yAxisLabel = this.config.style.yAxisLabel
  }
  

  
  ngAfterViewChecked() {
    if(this.config.style['borderRadius.px'] != undefined){
      document.getElementById(this.lineChartId)!.style.borderRadius = String(this.config.style['borderRadius.px']) + 'px'
    }
    if (this.title != this.config.style.title || this.yAxisLabel != this.config.style.yAxisLabel || this.originalColor1 != this.config.style.color1 
      || this.originalColor2 != this.config.style.color2 || this.originalColor != this.config.style.color
      || this.tickAmount != this.config.style.tickAmount || this.yMin != this.config.style.min || this.yMax != this.config.style.max) {
        //console.log('lol', this.title, this.config.style.title, '\n', this.yAxisLabel, this.config.style.yAxisLabel, '\n', this.originalColor1, this.config.style.color1 
        //, '\n', this.originalColor2, this.config.style.color2 , '\n', this.originalColor, this.config.style.color
        //, '\n', this.tickAmount, this.config.style.tickAmount , '\n', this.yMin, this.config.style.min , '\n', this.yMax, this.config.style.max)
        //return)
        this.chartOptions.grid!.row!.colors![0] = this.config.style.color1
        this.chartOptions.grid!.row!.colors![1] = this.config.style.color2
        this.chartOptions.chart!.foreColor = this.config.style.color
        this.chartOptions.title!.text = this.config.style.title
        if (this.yMin != this.config.style.min || this.yMax != this.config.style.max ||
          this.tickAmount != this.config.style.tickAmount) {
          this.chart.updateOptions({
            yaxis: [{
              min: this.config.style.min, max: this.config.style.max,
              tickAmount: this.config.style.tickAmount, title: { text: this.config.style.yAxisLabel, offsetX: 8 }
            }]
          })
        }
        else {
          this.chart.updateOptions(this.chartOptions)
        }
        this.title = this.config.style.title
        this.yAxisLabel = this.config.style.yAxisLabel
        this.originalColor1 = this.chartOptions.grid!.row!.colors![0]
        this.originalColor2 = this.chartOptions.grid!.row!.colors![1]
        this.originalColor = this.chartOptions.chart!.foreColor!
        this.tickAmount = this.config.style.tickAmount
        this.yMin = this.config.style.min
        this.yMax = this.config.style.max
        this.cdr.detectChanges()
    }
  }
}


