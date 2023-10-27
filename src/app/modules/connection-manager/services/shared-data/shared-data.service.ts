import { Injectable } from '@angular/core';
import { NetworkNode } from '../../classes/network-node';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private networkNodes: NetworkNode[] = []
  private searchQuery: any;


  getNetworkNodes(): NetworkNode[] {
    return this.networkNodes;
  }

  setNetworkNodes(nodes: NetworkNode[]): void {
    this.networkNodes = nodes;    
  }

  removeNodeIndex(index: number): void {
    this.networkNodes.splice(index, 1);
  }

}
