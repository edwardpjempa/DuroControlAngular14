import { Component, Input, Output, EventEmitter, SimpleChanges, ViewChild, HostListener } from "@angular/core";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { FlatTreeControl } from "@angular/cdk/tree";
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { cloneDeep } from 'lodash';

import { Utils } from './../../helpers/utils'
import { HistoryService } from './../../history/history.service'

/**
 * Node for to-do item
 */
export class FileNode {
  children?: FileNode[];
  type!: string;
  name!: string;
  id!: string;
  visibility: boolean = true;
  onEdit: boolean = false;
}

/** Flat to-do item node with expandable and level information */
export class FileFlatNode {
  name!: string;
  id!: string;
  onEdit: boolean = false;
  type!: string;
  level!: number;
  visibility: boolean = true;
  expandable!: boolean;
}

@Component({
  selector: "e-sidenav-objects",
  templateUrl: "objects.component.html",
  styleUrls: ["objects.component.scss"]
})
export class Editor_SidenavObj {

  objectsTree: any;

  virtualScrollHeight: number = 400

  @Input() trackBy: any;
  @Input() selections: any;
  @Input() currentView: any;
  @Input() hmi: any;
  @Input() enableObjectSearch: boolean = false;
  @Input() panelObjectHeight!: number;
  @Output() selectionOutput: EventEmitter<string> = new EventEmitter<string>();
  @Output() onEdition: EventEmitter<any> = new EventEmitter(true);
  @Output() onClickDect: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('tree') tree:any;
  @ViewChild(CdkVirtualScrollViewport, {static: false}) viewPort!: CdkVirtualScrollViewport;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<FileFlatNode, FileNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<FileNode, FileFlatNode>();

  treeControl: FlatTreeControl<FileFlatNode>;

  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;

  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;

  constructor(public history: HistoryService) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<FileFlatNode>(
      this.getLevel,
      this.isExpandable
    );

    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
  }

  get data(): FileNode[] {
    this.objectsTree = this.renderSidenavObjs2(this.currentView)
    //console.log(this.objectsTree)
    return this.objectsTree;
  }

  ngAfterViewInit() {
    //this.tree.treeControl.expandAll();

    setTimeout(() => {
      this.onClickDect.emit();

    },1000);
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes)

    if(this.currentView !== undefined){
      this.dataSource.data = this.data
      this.treeControl.expandAll();
    }

    /*if(this.tree !== undefined){
      this.tree.treeControl.expandAll();
    }*/

    if (changes.hasOwnProperty("selections")){
      
      if(changes["selections"].currentValue.length > 0){
        for (let i = 0; i < this.treeControl.dataNodes.length; ++i) {
          if((changes["selections"].currentValue[0]["childId"] === this.treeControl.dataNodes[i].id)){ 
            //console.log(changes.selections.currentValue[0]["childId"])
            //console.log(i)
            this.viewPort.scrollToIndex(i, 'auto');
            break;
          }
        }
      }else{
        if(this.viewPort) this.viewPort.scrollToIndex(0, 'auto');
      }
    }

    if (changes.hasOwnProperty("panelObjectHeight")){
      //console.log(changes.panelViewHeight.currentValue)
      this.virtualScrollHeight = changes["panelObjectHeight"].currentValue
  }   
  }

  renderSidenavObjs2(currentView:any){
    //console.log(currentView)
    if (currentView.type === "view"){

      let components = []
      for (var i = 0; i < this.currentView.components.length; i++) {
        components.push({
          id: currentView.components[i].id,
          name: currentView.components[i].comptName,
          visibility: currentView.components[i].visibility,
        })
      }

      let data = [{
        id: currentView.id,
        type: "folder",
        name: currentView.name,
        children: [{
          id: Utils.getGUID(),
          type: "folder",
          name: "Components", //name: "components",
          children: components
        }]
      }]
      return data
    }
    return [] 
  }

  getLevel = (node: FileFlatNode) => node.level;
  isExpandable = (node: FileFlatNode) => node.expandable;
  getChildren = (node: FileNode): FileNode[] => node.children!;
  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;
  hasNoContent = (_: number, _nodeData: FileFlatNode) => _nodeData.name === "";
  isFolder = (_: number, _nodeData: FileFlatNode) => _nodeData.type ===  "folder";

 /**
  * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
  */
  transformer = (node: FileNode, level: number) => {
    //console.log(node)
    //console.log(level)
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
    existingNode && existingNode.name === node.name
        ? existingNode
        : new FileFlatNode();
    flatNode.name = node.name;
    flatNode.type = node.type;
    flatNode.id = node.id;
    flatNode.onEdit = node.onEdit;
    flatNode.visibility = node.visibility;
    flatNode.level = level;
    flatNode.expandable = (node.children && node.children.length > 0) as boolean;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  filter(event:any) {
    //console.log(event.value)
    const clonedTreeLocal = cloneDeep(this.data);
    this.recursiveNodeEliminator(clonedTreeLocal, event.value);
    this.dataSource.data = clonedTreeLocal;
    this.treeControl.expandAll();
  }

  recursiveNodeEliminator(tree: Array<FileNode>, searchString: string): boolean {
    for (let index = tree.length - 1; index >= 0; index--) {
      const node = tree[index];
      if (node.children) {
        const parentCanBeEliminated = this.recursiveNodeEliminator(node.children, searchString);
        if (parentCanBeEliminated) {
            
          if ((node.name.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) === -1) && 
            (node.id.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) === -1)) {
            tree.splice(index, 1);
          }
        }
      } else {
        // Its a leaf node. No more branches.
        if ((node.name.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) === -1) && 
          (node.id.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) === -1)) {
          tree.splice(index, 1);
        }
      }
    }
    return tree.length === 0;
  }

  onComponentSelection(componentId:any){
    let component = this.currentView['components'].find((x:any) => x.id === componentId)
    if(component){
      //console.log(component)
      var element:any = document.getElementById(component.id)
      this.selectionOutput.emit(JSON.stringify(
        { 
          h: element.offsetHeight, w: element.offsetWidth , x: element.offsetLeft, y: element.offsetTop,
          id: component.id, style:{zIndex: element.style.zIndex}, viewId: component['viewId'], type: component['type'],
          sizeMode: component['sizeMode'], rotationAngle: component['rotationAngle']
        })
      );
    }
  }

  onComponentVisibility(node:any){
    let component = this.currentView['components'].find((x:any) => x.id === node.id)
    if (component){
      if (component['visibility']) {
        //console.log("hide component")
        node.visibility = false
        component['visibility'] = false;
        for (var ii = 0; ii < this.selections.length; ii++) {
          if (this.selections[ii].childId === node.id) {
            this.selections.splice(ii, 1);
            break;
          }
        }
      } else {
        //console.log("show component")
        node.visibility = true
        component['visibility'] = true;
      }
    }
  }

  isComponentActive(componentId:any){//check if component is active
    let selection = this.selections.find((x:any) => x.childId === componentId)
    if(selection) return true
    return false
  }

  onComponentName(componentId:any){//check if component is active
    let component = this.currentView['components'].find((x:any) => x.id === componentId)
    if(component) return component['comptName']
  }

  onComponentRename(node:any, inputRename:any){
    node.onEdit = true;
    setTimeout(() => {
        inputRename.focus()
    }, 175);
  }

  updateNode(nodes: FileNode[], nodeToUpdate: FileNode){
    const index = nodes.indexOf(nodeToUpdate, 0);
    if (index > -1) {
        nodes[index] = nodeToUpdate
    } else {
        nodes.forEach(node => {
            if (node.children && node.children.length > 0) {
            this.updateNode(node.children, nodeToUpdate);
            }
        });
    }
  }

  onRenameComponent(node:any) {
    for (var i = 0; i < this.currentView.components.length; i++) {
                
      if(this.currentView.components[i]['id'] === node.id){

        let node_:any = this.flatNodeMap.get(node);

        //node.name = node.name; node_.name = node.name;

        if(this.currentView.components[i]['comptName'] !== node.name) this.history.sendToHistory(this.hmi)

        this.updateNode(this.data, node_);
        this.currentView.components[i]['comptName'] = node.name
        break;

      }
    }
  }
  

  onEdit(event:any){
    if(event === true){
        this.onEdition.emit(true)
    }else if (event === false){
        this.onEdition.emit(false)
    }
  }
}