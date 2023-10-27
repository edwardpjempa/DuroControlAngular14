import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ConfigDataService } from '../../config-data.service';
import { ChartsDataService } from '../../charts-data.service';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ApexOptions } from 'ng-apexcharts';
import { NetworkNode } from './network-node';
import { NetworkNodeService } from 'src/app/network-node.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-network-map',
  templateUrl: './network-map.component.html',
  styleUrls: ['./network-map.component.css']
})
export class NetworkMapComponent implements OnInit, OnDestroy {
  val: any;
  subscription!: Subscription;
  statusInterval: any;
  message!: String;
  networkNodes: NetworkNode[] = []
  subnetOctets: number[] = [0, 0, 0];

  radarChartOptions: ApexOptions = {
    series: this.networkNodes.map((node, index) => ({
      name: "latency",
      data: this.networkNodes.map((_, i) => (i === index ? node.ping : 0))
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
      categories: this.networkNodes.map(node => node.name),
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
      colors: this.networkNodes.map(node => node.color),
      size: 10,
      hover: {
        size: 15
      },

      strokeWidth: 1,
      strokeColors: '#000000'
    }
  };

  networkDataServiceSubscription:any
  configDataServiceSubscription:any
  
  @ViewChild('radarChart', { static: false }) chart!: BaseChartDirective;

  
  constructor(
    public configDataService: ConfigDataService, 
    public chartsDataService: ChartsDataService, 
    public router: Router,
    private networkNodeService: NetworkNodeService
    ) {}

  updatePing() {  
    // const newData = (this.radarChartOptions.series as any[]).map((series, i) => ({
    //   ...series,
    //   data: series.data.map((value, index) => (index === i ? this.networkNodes[i].ping : 0))
    // }));
  
    // this.radarChartOptions.series = newData;

    
    const ipAddresses = this.networkNodes.map(node => node.ip_address);
    
    this.networkNodeService.localSocket.send(JSON.stringify(ipAddresses));
  }

  querySocket(subnet: string) {
    /**
     * Queries socket to scan IP Network
    */
  }
  
  pingNetwork(form: NgForm) {
    if (form.valid) {
      const subnet = this.subnetOctets.join('.');
      this.querySocket(subnet);
      
      const message = subnet + '.1-254';
      this.networkNodeService.sendMessage('ping', message);
    }
  }

  renderMap(nodes : NetworkNode[]) {
  /** 
    * Renders the entire map after a full scan
    * @param {NetworkNode[]} nodes
    */

    this.radarChartOptions = {
      series: nodes.map((node, index) => ({
        name: "latency",
        data: nodes.map((_, i) => (i === index ? node.ping : 0))
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

  applyChanges(index: number, newName: string, newColor: string) {
    /*
      Applies changes made to the Network Nodes in the details drawer
    */

    this.networkNodes[index].color = newColor;
    this.networkNodes[index].name = newName;
    
    this.radarChartOptions["series"] = this.networkNodes.map((node, index) => ({
        name: "latency",
        data: this.networkNodes.map((_, i) => (i === index ? node.ping : 0))
      }))

    this.radarChartOptions["xaxis"] = {
      categories: this.networkNodes.map(node => node.name),
    }

    this.radarChartOptions["markers"] = {
      colors: this.networkNodes.map(node => node.color),
      size: 10,
      hover: {
        size: 15
      },

      strokeWidth: 1,
      strokeColors: '#000000'
    }
  }


  toggleDetails(index: number) {
    this.networkNodes[index].detailsVisible = !this.networkNodes[index].detailsVisible;
  } 

  transformJsonToNetworkNodes(jsonData:any): NetworkNode[] {
    const nodes: NetworkNode[] = [];
  
    for (const ipAddress in jsonData) {
      const nodeData = jsonData[ipAddress];
      if (nodeData.devices.length > 0) {
        const device = nodeData.devices[0];
        const latencyValue = parseFloat(nodeData.latency) || 0;
        const name = nodeData.name || 'Unknown Name';
  
        nodes.push(
          new NetworkNode(
            ipAddress,
            device.mac_address,
            name,
            device.vendor,
            "#02fe00",
            latencyValue,
            true
          )
        );
      }
    }
    return nodes;
  }

  transformInputToNetworkNodes(jsonData:any): NetworkNode[] {
    const nodes: NetworkNode[] = [];
    const nodeArray = jsonData[0]

    for (const nodeData of nodeArray) {
      const ipAddress = nodeData.ip_address;
      const macAddress = nodeData.mac_address;
      const name = nodeData.name || 'Unknown Name';
      const vendor = nodeData.vendor;
      const color = nodeData.color || "#02fe00";
      const ping = nodeData.ping || 0;
      const display = nodeData.display || true;
      
      nodes.push(
        new NetworkNode(ipAddress, macAddress, name, vendor, color, ping, display)
      );
    }
    return nodes;
  }
  

  saveConfiguration() {
    this.networkNodeService.sendMessage('save', this.networkNodes)
  }

  loadConfiguration() {
    console.log("Loading")
    this.networkNodeService.sendMessage('load', this.networkNodes)
  }

  ngOnInit(): void {
    this.networkNodeService.openWS()

    this.networkDataServiceSubscription = this.networkNodeService.networkInfo.subscribe(response => {
      const responseType = response.response_type;
      const data = response.response_data;
      const status = response.response_status;

        // Call the function to transform JSON data into NetworkNode array
        if (responseType === 'ping_response') {
          this.networkNodes = this.transformJsonToNetworkNodes(data);
          this.renderMap(this.networkNodes);
        }
        else if (responseType === 'save_response') {
          console.log(status)
        }
        else if (responseType === 'load_response') {
          this.networkNodes = this.transformInputToNetworkNodes(data);
          this.renderMap(this.networkNodes);
          console.log(data)
        }
      });

      this.networkNodeService.websocketConnected.subscribe(connected => {
        if (connected) {
          this.loadConfiguration();
        }
      });
    }

  ngOnDestroy(){
     if(this.networkDataServiceSubscription) this.networkDataServiceSubscription.unsubscribe()
     if(this.configDataServiceSubscription) this.configDataServiceSubscription.unsubscribe()
     this.chartsDataService.wsDisconnect();
  }

}