import { Injectable } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';
import { SharedDataService } from '../shared-data/shared-data.service';
import { NetworkNode } from '../../classes/network-node';

@Injectable({
  providedIn: 'root'
})
export class ChartManagerService {

  private radarChartOptions: ApexOptions = {
    series: this.sharedDataService.getNetworkNodes().map((node, index) => ({
      name: "latency",
      data: this.sharedDataService.getNetworkNodes().map((_, i) => (i === index ? node.ping : 0)),
      animation: {
        enabled: false,
      },
      dynamicAnimation: {
        enabled: false
      }
    })),
    chart: {
      height: 750,
      type: "radar"
    },
    title: {
      text: "Network Map"
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: this.sharedDataService.getNetworkNodes().map(node => node.name),
    },
    yaxis: {
      labels: {
        formatter: (value: number) => value + " ms",
        offsetX: 30
      }
    },
    stroke: {
      show: true,
      width: 5,
      colors: ['#4799ff']
    },
    markers: {
      colors: this.sharedDataService.getNetworkNodes().map(node => node.color),
      size: 10,
      strokeWidth: 1,
      strokeColors: '#000000',
      hover: {
        size: 15
      },
    },
  };

  getChartOptions() {
    return this.radarChartOptions
  }

  setChartOptions() {
  }

  renderMap(nodes : NetworkNode[]) {
    this.radarChartOptions = {
      series: nodes.map((node, index) => ({
        name: "latency",
        data: nodes.map((_, i) => (i === index ? node.ping : 0)),
        animation: {
          enabled: false
        },
        dynamicAnimation: {
          enabled: false
        }
      })),
      chart: {
        height: 750,
        type: "radar"
      },
      title: {
        text: "Network Map"
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: nodes.map(node => node.name),
      },
      yaxis: {
        labels: {
          formatter: (value: number) => value.toFixed(3) + " ms", // Round to 3 decimal points
          offsetX: 30
        }
      },
      stroke: {
        show: true,
        width: 5,
        colors: ['#4799ff']
      },
      markers: {
        colors: nodes.map(node => node.color),
        size: 10,
        hover: {
          size: 15
        },

        strokeWidth: 1,
        strokeColors: '#000000'
      }
    };
  }


  constructor(
    private sharedDataService: SharedDataService,
  ) { }
}
