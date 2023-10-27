import { Injectable } from '@angular/core';
import { NetworkNode } from '../../classes/network-node';

@Injectable({
  providedIn: 'root'
})
export class TransformNodesService {

  jsonToNodes(jsonData: { [x: string]: any; }): NetworkNode[] {
    const nodes: NetworkNode[] = [];
  
    for (const ipAddress in jsonData) {
      const nodeData = jsonData[ipAddress];
      if (nodeData.devices && nodeData.devices.length > 0) {
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

  inputToNodes(jsonData: any[]): NetworkNode[] {
    const nodes: NetworkNode[] = [];
    const nodeArray = jsonData[0];

    if (Array.isArray(nodeArray)) {
      for (const nodeData of nodeArray) {
        const ipAddress = nodeData.ip_address || 'Unknown IP';
        const macAddress = nodeData.mac_address || 'Unknown MAC';
        const name = nodeData.name || 'Unknown Name';
        const vendor = nodeData.vendor || 'Unknown Vendor';
        const color = nodeData.color || "#02fe00";
        const ping = nodeData.ping || 0;
        const display = nodeData.display === undefined ? true : nodeData.display;
        
        nodes.push(
          new NetworkNode(ipAddress, macAddress, name, vendor, color, ping, display)
        );
      }
    } else {
      console.error("nodeArray is not an array:", nodeArray)
    }

    return nodes;
  }

  constructor() { }
}
