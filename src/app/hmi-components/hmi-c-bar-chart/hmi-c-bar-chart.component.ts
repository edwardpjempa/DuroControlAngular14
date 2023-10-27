import { HmiComponent } from '../hmi-component';
import { Component, ViewChild, OnInit, ChangeDetectorRef, Input } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexYAxis,
  ApexPlotOptions,
  ApexGrid,
  ApexLegend
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors: any;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: [ApexYAxis];
  grid: ApexGrid;
  title: any;
  legend: ApexLegend;
};

@Component({
  selector: 'app-hmi-c-bar-chart',
  templateUrl: './hmi-c-bar-chart.component.html',
  styleUrls: ['./hmi-c-bar-chart.component.css']
})

export class HmiCBarChartComponent extends HmiComponent implements OnInit {
  @ViewChild('chart', { static: false }) chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  backgroundColor = '#000000' as String
  fontColor = '#000000' as String
  color1 = '#000000' as String
  color2 = '#000000' as String
  yMin!: Number
  yMax!: Number
  tickAmount: any
  columnWidth: any
  title: any
  yAxisLabel: any
  names: any
  colorss: any
  @Input() id: any;
  barChartId = ''
  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.barChartId = 'bar'+ this.id
    var dataLength = this.config.barChartData.tagValues.length
    var data = []
    for (var i = 0; i < dataLength; i++) {
      data.push(20)
    }
    this.chartOptions = {
      series: [
        {
          name: 'basic',
          data: data
        },
      ],
      chart: {
        animations: {
          enabled: false,
        },
        type: 'bar',
        height: '100%',
        foreColor: this.config.style.color,
        toolbar: {
          show: false
        },
        background: this.config.style.backgroundColor
      },
      plotOptions: {
        bar: {
          horizontal: false,
          distributed: true,
          columnWidth: String(this.config.style.columnWidth) + '%'
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: this.config.barChartData.names
      },
      yaxis: [{
        min: this.config.style.min,
        max: this.config.style.max,
        tickAmount: this.config.style.tickAmount,
        title: {
          text: this.config.style.yAxisLabel,
          offsetX: 8
        }
      }],
      grid: {
        row: {
          colors: [this.config.style.color1, this.config.style.color2], // takes an array which will be repeated on columns
          opacity: 0.6
        }
      },
      title: {
        text: this.config.style.title,
        align: 'center',
        margin: 0,
        offsetY: 15
      },
      legend: { show: false },
      colors: this.config.barChartData.colors
    };
    this.backgroundColor = this.config.style.backgroundColor
    this.fontColor = this.config.style.color
    this.color1 = this.config.style.color1
    this.color2 = this.config.style.color2
    this.yMin = Number(this.config.style.min)
    this.yMax = this.config.style.max
    this.tickAmount = this.config.style.tickAmount
    this.columnWidth = this.config.style.columnWidth
    this.title = this.config.style.title
    this.yAxisLabel = this.config.style.yAxisLabel
    this.names = this.config.barChartData.names
    this.colorss = this.config.barChartData.colors.slice()
  }

  arraysAreEqual(arr1: string | any[], arr2: string | any[]) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  ngAfterViewChecked() {
    if(this.config.style['borderRadius.px'] != undefined){
      document.getElementById(this.barChartId)!.style.borderRadius = String(this.config.style['borderRadius.px']) + 'px'
    }
    var colorsMatch = this.arraysAreEqual(this.colorss, this.config.barChartData.colors)
    if (this.backgroundColor != this.config.style.backgroundColor ||
      this.color1 != this.config.style.color1 || this.color2 != this.config.style.color2 ||
      this.yMin != this.config.style.min || this.yMax != this.config.style.max ||
      this.tickAmount != this.config.style.tickAmount || this.title != this.config.style.title ||
      this.columnWidth != this.config.style.columnWidth || this.yAxisLabel != this.config.style.yAxisLabel ||
      !colorsMatch || this.fontColor != this.config.style.color) {
      this.chartOptions.chart!.background = this.config.style.backgroundColor
      this.chartOptions.grid!.row!.colors = [this.config.style.color1, this.config.style.color2]
      this.chartOptions.yaxis![0].max = this.config.style.max
      this.chartOptions.yaxis![0].tickAmount = this.config.style.tickAmount
      this.chartOptions.plotOptions!.bar!.columnWidth = String(this.config.style.columnWidth) + "%"
      this.chartOptions.title.text = this.config.style.title
      this.chartOptions.yaxis![0].title!.text = this.config.style.yAxisLabel
      this.chartOptions.colors = this.config.barChartData.colors
      this.chartOptions.chart!.foreColor = this.config.style.color

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
      this.backgroundColor = this.chartOptions.chart!.background!
      this.color1 = this.chartOptions.grid!.row!.colors[0]
      this.color2 = this.chartOptions.grid!.row!.colors[1]
      this.yMin = this.config.style.min
      this.yMax = this.config.style.max
      this.tickAmount = this.config.style.tickAmount
      this.columnWidth = this.config.style.columnWidth
      this.title = this.config.style.title
      this.yAxisLabel = this.config.style.yAxisLabel
      this.colorss = this.config.barChartData.colors.slice()
      this.fontColor = this.chartOptions.chart!.foreColor!

      this.cdr.detectChanges()
    }
  }
}


