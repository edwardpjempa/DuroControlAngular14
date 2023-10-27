import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfigDataService } from '../../../../config-data.service';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ApexOptions } from 'ng-apexcharts';
import { NetworkNode } from '../../classes/network-node';
import { NetworkNodeService } from '../../services/websockets/network-node.service';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { TransformNodesService } from '../../services/transform-nodes/transform-nodes.service';
import { SharedDataService } from '../../services/shared-data/shared-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-network-map',
  templateUrl: './network-map.component.html',
  styleUrls: ['./network-map.component.css']
})

export class NetworkMapComponent implements OnInit {
  @ViewChild('radarChart', { static: false })
  chart!: BaseChartDirective;
  @ViewChild('nodeListContainer', { static: false })
  nodeListContainer!: ElementRef;

  networkDataServiceSubscription: Subscription = new Subscription;
  configDataServiceSubscription!: { unsubscribe: () => void; };

  subnetOctets: number[] = [0, 0, 0];
  searchQuery: string = '';

  // Filter variables
  filterCriteria: string[] = ['MAC Address', 'Vendor', 'IP Address'];
  selectedFilter: string = 'Vendor'; // Default filter
  searchQueryControl = new FormControl();

  // Chart Initialization
  radarChartOptions: ApexOptions = {
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
      type: "radar",
      events: {
        click: (event, chartContext, config) => {
          const selectedNodeIndex = config.dataPointIndex;
          const selectedNode = this.filteredNetworkNodes[selectedNodeIndex];
          if(selectedNode != undefined) {
            this.toggleDetails(selectedNode);
            console.log('Clicked Node:', selectedNodeIndex);
          }
        }
      },
      animations: {
        enabled: false
      }
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
      width: 3,
      colors: ['#4799ff']
    },
    markers: {
      colors: this.sharedDataService.getNetworkNodes().map(node => node.color),
      strokeWidth: 1,
      strokeColors: '#000000',
      size: 10,
      hover: {
        size: 15
      },
    }
  };

  get filteredNetworkNodes(): NetworkNode[] {
    if (!this.searchQuery) {
      return this.sharedDataService.getNetworkNodes();
    }
  
    const lowerCaseQuery = this.searchQuery.toLowerCase();
    switch (this.selectedFilter) {
      case 'MAC Address':
        return this.sharedDataService.getNetworkNodes().filter(node =>
          node.mac_address.toLowerCase().includes(lowerCaseQuery)
        );
      case 'Vendor':
        return this.sharedDataService.getNetworkNodes().filter(node =>
          node.vendor.toLowerCase().includes(lowerCaseQuery)
        );
      case 'IP Address':
        return this.sharedDataService.getNetworkNodes().filter(node =>
          node.ip_address.toLowerCase().includes(lowerCaseQuery)
        );
      default:
        return [];
    }
  }

  constructor(
    public configDataService: ConfigDataService, 
    public router: Router,
    private networkNodeService: NetworkNodeService,
    private transformNodeService: TransformNodesService,
    private sharedDataService: SharedDataService,
    ) {}

  ngOnInit(): void {
    this.networkNodeService.openWS()
    this.networkDataServiceSubscription = this.networkNodeService.networkInfo.subscribe(response => {
      const responseType = response.response_type;
      const data = response.response_data;
      const status = response.response_status;
      // Call the function to transform JSON data into NetworkNode array
      if (responseType === 'ping_response') {
        this.sharedDataService.setNetworkNodes(this.transformNodeService.jsonToNodes(data));
        this.renderMap(this.sharedDataService.getNetworkNodes());
      }
      else if (responseType === 'save_response') {
        console.log(status)
      }
      else if (responseType === 'load_response') {
        this.sharedDataService.setNetworkNodes(this.transformNodeService.inputToNodes(data));
        this.renderMap(this.sharedDataService.getNetworkNodes());
        console.log(data)
      }
    });
    this.networkNodeService.websocketConnected.subscribe(connected => {
      if (connected) {
        this.loadConfiguration();
      }
    });
  }

  updatePing() {  
    const ipAddresses = this.sharedDataService.getNetworkNodes().map(node => node.ip_address);
    this.networkNodeService.localSocket.send(JSON.stringify(ipAddresses));
  }

  renderFilteredChart() {
    this.renderMap(this.filteredNetworkNodes);
  }
  
  pingNetwork(form: NgForm) {
    if (form.valid) {
      const subnet = this.subnetOctets.join('.');
      const message = subnet + '.1-254';
      this.networkNodeService.sendMessage('ping', message);
    }
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
        type: "radar",
        events: {
          click: (event, chartContext, config) => {
            const selectedNodeIndex = config.dataPointIndex;
            const selectedNode = this.filteredNetworkNodes[selectedNodeIndex];
            if(selectedNode != undefined) {
              this.toggleDetails(selectedNode);
              console.log('Clicked Node:', selectedNodeIndex);
            }
          }
        },
        animations: {
          enabled: false
        }
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
        width: this.scaleStrokes(),
        colors: ['#4799ff']
      },
      markers: {
        colors: nodes.map(node => node.color),
        size: this.scaleMarkers(),
        hover: {
          size: this.scaleMarkers() + 3
        },
        strokeWidth: 1,
        strokeColors: '#000000'
      }
    };
  }

  removeNode(index: number) {
    const removedFilteredNode = this.filteredNetworkNodes.splice(index, 1)[0]; // Remove the node from filtered list
    const correspondingIndex = this.sharedDataService.getNetworkNodes().findIndex(node => node.ip_address === removedFilteredNode.ip_address);
    if (correspondingIndex !== -1) {
      this.sharedDataService.removeNodeIndex(correspondingIndex); // Remove the corresponding node from the main array
    }
    this.renderFilteredChart()
  }

  scaleMarkers(): number {
    if (this.filteredNetworkNodes.length < 50)
      return 10
    else if (this.filteredNetworkNodes.length < 100)
      return 7
    else if (this.filteredNetworkNodes.length >= 100)
      return 5
    return 0
  }

  scaleStrokes(): number {
    if (this.filteredNetworkNodes.length < 50)
      return 5
    else if (this.filteredNetworkNodes.length < 100)
      return 2
    else if (this.filteredNetworkNodes.length >= 100)
      return 1
    return 0
  }

  applyChanges(node: NetworkNode, newName: string, newColor: string) {
    node.color = newColor;
    node.name = newName;
    this.renderFilteredChart()
  }

  toggleDetails(node: NetworkNode) {
    node.detailsVisible = !node.detailsVisible;
    if (node.detailsVisible) {
      setTimeout(() => {
        const element = document.getElementById('node-' + node.name);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  saveConfiguration() {
    this.networkNodeService.sendMessage('save', this.sharedDataService.getNetworkNodes())
  }

  loadConfiguration() {
    this.networkNodeService.sendMessage('load', this.sharedDataService.getNetworkNodes())
  }
    
  ngOnDestroy(){
    if (this.networkDataServiceSubscription) {
      this.networkDataServiceSubscription.unsubscribe();
    }
    if (this.configDataServiceSubscription) {
      this.configDataServiceSubscription.unsubscribe();
    }
    // Unsubscribe before disconnecting
    this.networkDataServiceSubscription.unsubscribe();
    this.networkNodeService.wsDisconnect();
  }
}