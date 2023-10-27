import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NetworkMapComponent } from './components/network-map/network-map.component';
import { NodeInfoComponent } from './components/node-info/node-info.component';
import { RadarChartComponent } from './components/radar-chart/radar-chart.component';


@NgModule({
  declarations: [
    // NetworkMapComponent,
    NodeInfoComponent, 
    RadarChartComponent, 
  ],
  imports: [
    CommonModule
  ]
})
export class ConnectionManagerModule { }
