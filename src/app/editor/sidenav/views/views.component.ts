import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, SimpleChanges, ViewEncapsulation, HostListener } from "@angular/core";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { FlatTreeControl } from "@angular/cdk/tree";
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { cloneDeep } from 'lodash';
 
import { EditorService } from './../../service/editor.service';
import { DialogDocName, DialogDocDelete } from './../../dialogs/index';
import { Utils } from './../../helpers/utils'
import { TempData } from './../../../models/hmi'
import { HistoryService } from './../../history/history.service'

/**
 * Node for to-do item
 */
export class FileNode {
    children?: FileNode[];
    type!: string;
    name!: string;
    id!: string;
    onEdit: boolean = false;
}

/** Flat to-do item node with expandable and level information */
export class FileFlatNode {
    name!: string;
    id!: string;
    onEdit: boolean = false;
    type!: string;
    level!: number;
    expandable!: boolean;
}

@Component({
    selector: "e-sidenav-views",
    templateUrl: "./views.component.html",
    styleUrls: ["./views.component.scss"],
    encapsulation : ViewEncapsulation.None
})
export class Editor_SidenavViews implements OnInit {
    @Input() trackBy: any;
    @Input() viewsTree: any;
    @Input() hmi: any;
    @Input() currentView: any;
    @Input() panelViewHeight!: number;
    @Input() enableViewSearch: boolean = false;
    @Output() onClickDect: EventEmitter<string> = new EventEmitter<string>();
    @Output() onSelectView: EventEmitter<string> = new EventEmitter<string>();
    @Output() onPropertyView: EventEmitter<string> = new EventEmitter<string>();
    @Output() onCloneView: EventEmitter<string> = new EventEmitter<string>();
    @Output() onAddView: EventEmitter<any> = new EventEmitter(true);
    @Output() onEdition: EventEmitter<any> = new EventEmitter(true);

    virtualScrollHeight: number = 400

    previewData: any = {}

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<FileFlatNode, FileNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<FileNode, FileFlatNode>();

    treeControl: FlatTreeControl<FileFlatNode>;

    treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;

    dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;

    /* Drag and drop */
    dragNode: any;
    dragNodeExpandOverWaitTimeMs = 300;
    dragNodeExpandOverNode: any;
    dragNodeExpandOverTime!: number;
    dragNodeExpandOverArea!: string;

    @ViewChild(CdkVirtualScrollViewport, {static: false}) viewPort!: CdkVirtualScrollViewport;
    @ViewChild("emptyItem") emptyItem!: ElementRef;

    data_!: FileNode[]

    recheckIfInPreview: boolean = false;

    previewTimeout: any

    constructor(public eservice: EditorService, public dialog: MatDialog, public history: HistoryService) {
        this.treeFlattener = new MatTreeFlattener(
            this.transformer,
            this.getLevel,
            this.isExpandable,
            this.getChildren
        );
        this.treeControl = new FlatTreeControl<FileFlatNode>(this.getLevel, this.isExpandable);

        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    }

    ngOnInit(){}

    ngOnChanges(changes: SimpleChanges) {
        //console.log(changes)

        this.dataSource.data = [];
        this.dataSource.data = this.data

        // Automatically search and open folder if last selected view is whithin this one
        for (let i = 0; i < this.treeControl.dataNodes.length; ++i) {
            if((this.currentView.id === this.treeControl.dataNodes[i].id)){ 
                let ancestors = this.onNodeHierarchy(this.treeControl.dataNodes[i]).ancestors
                //console.log(ancestors)

                for (let ii = 0; ii < ancestors.length; ++ii) {

                    if (ancestors[ii].type === "folder"){

                        for (let iii = 0; iii < this.treeControl.dataNodes.length; ++iii) {

                            if(this.treeControl.dataNodes[iii].id === ancestors[ii].id){
                                // Expanding the parent folders of the view currently active
                                this.treeControl.expand(this.treeControl.dataNodes[iii])
                                break;
                            }
                        }    
                    }
                }
            }
        }

        if (changes.hasOwnProperty("panelViewHeight")){
            //console.log(changes.panelViewHeight.currentValue)
            this.virtualScrollHeight = changes["panelViewHeight"].currentValue
        }        
    }

    ngAfterViewInit() {
        setTimeout(() => {
            //console.log(this.viewPort)

            // Automatically scroll to the last selected view
            if (this.viewPort) {
                for (let i = 0; i < this.treeControl.dataNodes.length; ++i) {
                    if((this.currentView.id === this.treeControl.dataNodes[i].id)){ 
                        //console.log(this.currentView.id)
                        //console.log(i)
                        this.viewPort.scrollToIndex(i, 'smooth');
                        this.onClickDect.emit();
                        break;
                    }
                }
            }
        },500);
    }

    filter(event: any) {
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

    // Resize sidenav hegiht on a view click
    sidenavResize(){
        this.onClickDect.emit();
        setTimeout(() => {
            this.onClickDect.emit();
        },100);
    }
    

    scrollToView(node: any){
        
        for (let i = 0; i < this.treeControl.dataNodes.length; ++i) {
            if((node.id === this.treeControl.dataNodes[i].id)){ 
                console.log(node.id)
                console.log(i)
                this.viewPort.scrollToIndex(i, 'smooth');
                break;
            }
        }
    }

    getAncestors(array:any, id: any) {
        if (typeof array != "undefined") {
            for (let i = 0; i < array.length; i++) {
            if (array[i].id === id) {
                return [array[i]];
            }
            const a: any = this.getAncestors(array[i].children, id);
            if (a !== null) {
                a.unshift(array[i]);
                return a;
            }
            }
        }
        return null;
    }

    onNodeHierarchy(node: FileNode){
        const ancestors = this.getAncestors(this.dataSource.data, node.id);
        //console.log("ancestors ", ancestors);
    
        let directParent = ancestors[ancestors.length - 2]
        //console.log("direct parent  ", directParent);

        let breadcrumbs = "";
        ancestors.forEach((ancestor: { name: any; }) => {
            breadcrumbs += `${ancestor.name}/`;
        });
        //console.log("breadcrumbs ", breadcrumbs);

        return { ancestors, directParent, breadcrumbs }
    }

    get data(): FileNode[] {
        //console.log(this.viewsTree)
        return this.viewsTree;
    }

    getLevel = (node: FileFlatNode) => node.level;

    isExpandable = (node: FileFlatNode) => node.expandable;

    getChildren = (node: FileNode): FileNode[] => node.children as FileNode[];

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
        flatNode.level = level;
        flatNode.expandable = node.children! && node.children.length > 0;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    };

    handleDragStart(event: any, node: any) {
        event.stopPropagation();
        // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
        event.dataTransfer.setData("foo", "bar");
        event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
        this.dragNode = node;
        this.treeControl.collapse(node);
    }

    handleDragOver(event: any, node: any) {
        event.preventDefault();
        event.stopPropagation();

        // Handle node expand
        if (node === this.dragNodeExpandOverNode) {
            if (this.dragNode !== node && !this.treeControl.isExpanded(node)) {
                if (new Date().getTime() - this.dragNodeExpandOverTime > this.dragNodeExpandOverWaitTimeMs){
                    this.treeControl.expand(node);
                }
            }
        } else {
            this.dragNodeExpandOverNode = node;
            this.dragNodeExpandOverTime = new Date().getTime();
        }

        // Handle drag area
        const percentageX = event.offsetX / event.target.clientWidth;
        const percentageY = event.offsetY / event.target.clientHeight;
        if (percentageY < 0.25) {
        this.dragNodeExpandOverArea = "above";
        } else if (percentageY > 0.75) {
        this.dragNodeExpandOverArea = "below";
        } else {
        this.dragNodeExpandOverArea = "center";
        }
    }

    handleDrop(event: any, node: any) {
        event.preventDefault();
        event.stopPropagation();
        if (node !== this.dragNode) {
            let newItem: FileNode;
            if (this.dragNodeExpandOverArea === "above") {
                newItem = this.copyPasteItemAbove(
                this.flatNodeMap.get(this.dragNode)!,
                this.flatNodeMap.get(node)!
                );
            } else if (this.dragNodeExpandOverArea === "below") {
                newItem = this.copyPasteItemBelow(
                this.flatNodeMap.get(this.dragNode)!,
                this.flatNodeMap.get(node)!
                );
            } else {
                newItem = this.copyPasteItem(
                this.flatNodeMap.get(this.dragNode)!,
                this.flatNodeMap.get(node)!
                );
            }
            this.deleteItem(this.flatNodeMap.get(this.dragNode)!);

            this.treeControl.expandDescendants(this.nestedNodeMap.get(newItem)!);
        }
        this.dragNode = null;
        this.dragNodeExpandOverNode = null;
        this.dragNodeExpandOverTime = 0;
    }

    handleDragEnd(event: any) {
        event.stopPropagation();
        this.dragNode = null;
        this.dragNodeExpandOverNode = null;
        this.dragNodeExpandOverTime = 0;
    }

    /** Add an item to to-do list */
    insertItem(parent: FileNode, name: string, type: string, id: string): FileNode {
        if (!parent.children) {
            parent.children = [];
        }

        const newItem = { name: name, type: type, id: id } as FileNode;
        parent.children.push(newItem);
        //this.dataChange.next(this.data);
        this.dataSource.data = this.data;
        this.hmi.general.viewsTree = this.data
        return newItem;
    }

    insertItemAbove(node: FileNode, name: string, type: string, id: string): FileNode {
        const parentNode = this.getParentFromNodes(node);
        const newItem = { name: name, type: type, id: id } as FileNode;
        if (parentNode != null) {
            parentNode.children.splice(parentNode.children.indexOf(node), 0, newItem);
        } else {
            this.data.splice(this.data.indexOf(node), 0, newItem);
        }
        this.dataSource.data = this.data;
        this.hmi.general.viewsTree = this.data

        //this.dataChange.next(this.data);
        return newItem;
    }

    insertItemBelow(node: FileNode, name: string, type: string, id: string): FileNode {
        const parentNode = this.getParentFromNodes(node);
        const newItem = { name: name, type: type, id: id } as FileNode;
        if (parentNode != null) {
            parentNode.children.splice(parentNode.children.indexOf(node) + 1,0,newItem);
        } else {
            this.data.splice(this.data.indexOf(node) + 1, 0, newItem);
        }
        this.dataSource.data = this.data;
        this.hmi.general.viewsTree = this.data

        //this.dataChange.next(this.data);
        return newItem;
    }

    getParentFromNodes(node: FileNode) {
        for (let i = 0; i < this.data.length; ++i) {
            //console.log(i)
            const currentRoot = this.data[i];
            const parent = this.getParent(currentRoot, node);
            if (parent != null) {
                return parent;
            }
        }
        return null;
    }

    getParent(currentRoot: FileNode, node: FileNode) {
        if (currentRoot.children && currentRoot.children.length > 0) {
            for (let i = 0; i < currentRoot.children.length; ++i) {
                const child = currentRoot.children[i];
                if (child === node) {
                    return currentRoot;
                } else if (child.children && child.children.length > 0) {
                const parent: any = this.getParent(child, node);
                    if (parent != null) {
                        return parent;
                    }
                }
            }
        }
        return null;
    }

    deleteItem(node: FileNode) {
        this.deleteNode(this.data, node);
        this.dataSource.data = this.data;
        this.hmi.general.viewsTree = this.data
    }

    copyPasteItem(from: FileNode, to: FileNode): FileNode {
        const newItem = this.insertItem(to, from.name, from.type, from.id);
        if (from.children) {
            from.children.forEach(child => {
                this.copyPasteItem(child, newItem);
            });
        }
        return newItem;
    }

    copyPasteItemAbove(from: FileNode, to: FileNode): FileNode {
        const newItem = this.insertItemAbove(to, from.name, from.type, from.id);
        if (from.children) {
            from.children.forEach(child => {
                this.copyPasteItem(child, newItem);
            });
        }
        return newItem;
    }

    copyPasteItemBelow(from: FileNode, to: FileNode): FileNode {
        const newItem = this.insertItemBelow(to, from.name, from.type, from.id);
        if (from.children) {
            from.children.forEach(child => {
                this.copyPasteItem(child, newItem);
            });
        }
        return newItem;
    }

    deleteNode(nodes: FileNode[], nodeToDelete: FileNode) {
        const index = nodes.indexOf(nodeToDelete, 0);
        if (index > -1) {
            nodes.splice(index, 1);
        } else {
            nodes.forEach(node => {
                if (node.children && node.children.length > 0) {
                this.deleteNode(node.children, nodeToDelete);
                }
            });
        }
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

    /**
     * Rename the View (only name)
     */
    onRenameView(node: any) {
        this.onEdit(true,false)
        let view: any = {}
        for (var i = 0; i < this.hmi.views.length; i++) {
            if(this.hmi.views[i].id === node.id){
                view = this.hmi.views[i]
            }
        }
        let exist = this.hmi.views.filter((v:any) => v.id !== view.id).map((v:any) => { return v.name });
        let dialogRef = this.dialog.open(DialogDocName, {
            minWidth: '250px',
            position: { top: '60px' },
            data: { name: view.name, exist: exist, id: view.id, renameType: "View Rename" }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.name) {
                for (var i = 0; i < this.hmi.views.length; i++) {
                    
                    if(this.hmi.views[i]['id'] === result.id){

                        let node_ = this.flatNodeMap.get(node)!;

                        node.name = result.name; node_.name = result.name;

                        if(this.hmi.views[i]['name'] !== node.name) this.history.sendToHistory(this.hmi)

                        this.updateNode(this.data, node_);
                        this.hmi.views[i]['name'] = result.name
                    }
                }
            }
            this.onEdit(false, false)
        });
    }

    onRenameView2(node: any) {
        if(node.type === "view"){
            for (var i = 0; i < this.hmi.views.length; i++) {
                        
                if(this.hmi.views[i]['id'] === node.id){

                    let node_ = this.flatNodeMap.get(node)!;

                    node.name = node.name; node_.name = node.name;

                    if(this.hmi.views[i]['name'] !== node.name) this.history.sendToHistory(this.hmi)

                    this.updateNode(this.data, node_);
                    this.hmi.views[i]['name'] = node.name
                }
            }
        }else if(node.type === "folder"){
            let node_ = this.flatNodeMap.get(node)!;

            node.name = node.name; node_.name = node.name;

            //if(this.hmi.views[i]['name'] !== node.name) this.history.sendToHistory(this.hmi)

            this.updateNode(this.data, node_);
            this.hmi.general.viewsTree = this.data
        }
    }
    

    /**
     * Rename the Folder (only name)
     */
    onRenameFolder(node: any) {
        this.onEdit(true,false)
        let exist = this.data.filter((n) => n.id !== node.id).map((n) => { return n.name });
        let dialogRef = this.dialog.open(DialogDocName, {
            minWidth: '250px',
            position: { top: '60px' },
            data: { name: node.name, exist: exist, id: node.id, renameType: "Folder Rename"}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.name) {
                
                let node_ = this.flatNodeMap.get(node)!;

                node.name = result.name; node_.name = result.name;

                this.updateNode(this.data, node_);
                this.hmi.general.viewsTree = this.data

                this.history.sendToHistory(this.hmi)
            }
            this.onEdit(false,false)
        });
    }

    /**
     * Delete the View from hmi.views list
     */
    onDeleteView(node: any) {
        let comptDepencency = false
        let view: any = {}
        for (var i = 0; i < this.hmi.views.length; i++) {
            if(this.hmi.views[i].id === node.id){
                view = this.hmi.views[i]
            }
        }
        for (var i = 0; i < this.hmi.views.length; i++) {
            for (var ii = 0; ii < this.hmi.views[i].components.length; ii++) {
                if(this.hmi.views[i].components[ii].viewId === view.id){
                    comptDepencency = true       
                }
            }
        }

        let msg; let msg2;
        if(comptDepencency){
            msg = "Warning: One or more components from other views depend on View '" + view.name + "'."
            msg2 = "Would you like to continue deleting '" + view.name + "' view."
        }else{
            msg = "Would you like to remove View '" + view.name + "'.";
            msg2 = null
        }
        
        let dialogRef = this.dialog.open(DialogDocDelete, {
            data: { msg: msg, msg2: msg2, deletionType: "View Delete" }, position: { top: '60px' }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && this.hmi.views) {
                for (var i = 0; i < this.hmi.views.length; i++) {
                    if (this.hmi.views[i].id === view.id) {

                        let node_ = this.flatNodeMap.get(node)!;

                        this.deleteNode(this.data, node_);

                        this.dataSource.data = this.data;
                        this.hmi.general.viewsTree = this.data

                        let toselect = null;
                        //remove any temporal data of the view from the session storage
                        let tempdata: any = sessionStorage.getItem("duroControl.webeditor.tempData");

                        if(tempdata !== null) tempdata = JSON.parse(tempdata)
                        if(tempdata === null) tempdata = new TempData();

                        if (tempdata['views'].hasOwnProperty(this.hmi.views[i].id)) delete tempdata['views'][this.hmi.views[i].id]
                        if (tempdata['lastView'] === this.hmi.views[i].id) tempdata['lastView'] = null
                        sessionStorage.setItem("duroControl.webeditor.tempData", JSON.stringify(tempdata));

                        //deleting any view components from other views that depend on the selected view to be deleted
                        for (var ii = 0; ii < this.hmi.views.length; ii++) {

                            let componentsCopy = Utils.clone(this.hmi.views[ii].components)
                            for (var iii = 0; iii < componentsCopy.length; iii++) {

                            if(componentsCopy[iii].viewId === this.hmi.views[i].id){

                                for (var iv = 0; iv < this.hmi.views[ii].components.length; iv++) {

                                    if(this.hmi.views[ii].components[iv].viewId === componentsCopy[iii].viewId){
                                        this.hmi.views[ii].components.splice(iv, 1);
                                    }
                                }
                            }
                            }
                        }

                        //deleting selected view from HMI views
                        this.hmi.views.splice(i, 1);

                        if (i > 0 && i < this.hmi.views.length) {
                            toselect = this.hmi.views[i];
                        }
                        this.currentView = null;
                        if (this.hmi.views.length === 0) {
                            this.onAddView.emit()//if not views left, we create one by default
                        } else {
                            if (toselect) {
                            this.onSelectView.emit(toselect.id);
                            } else if (this.hmi.views.length > 0) {
                            this.onSelectView.emit(this.hmi.views[0].id);
                            }
                        }

                        this.history.sendToHistory(this.hmi)
                    }
                }
            }
        });
    }

    /**
     * Delete the Folder from hmi.views list
     */
    onDeleteFolder(node: any) {
        let node_: any = this.flatNodeMap.get(node);

        let msg; let msg2;
        if(node_.children && node_.children.length > 0){
            msg = "Warning: The current folder '" +  node.name + "' is NOT empty.";
            msg2 = "Would you like to continue deleting Folder '" + node.name + "' and all files on it."
        }else{
            msg = "Would you like to remove Folder '" + node.name + "'."
            msg2 = null
        }

        let dialogRef = this.dialog.open(DialogDocDelete, {
            data: { msg: msg, msg2: msg2, deletionType: "Folder Delete" }, position: { top: '60px' }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteNode(this.data, node_);

                let viewsToDel = [];
                if(node_.children && node_.children.length > 0){

                    for (var i = 0; i < node_.children.length; i++) {

                        if(node_.children[i].type === "view"){
                            viewsToDel[i] = {viewName: node_.children[i].name, viewId: node_.children[i].id}
                        }
                    }
                    if(viewsToDel.length > 0){
                        //this.hmiOutput.emit(JSON.stringify({fold_viewsDelete: viewsToDel}));

                        let toselect = null;
                        let views = viewsToDel
                        let tempdata: any = sessionStorage.getItem("duroControl.webeditor.tempData");

                        if(tempdata !== null) tempdata = JSON.parse(tempdata)
                        if(tempdata === null) tempdata = new TempData();

                        for (var i = 0; i < views.length; i++) {

                            for (var ii = 0; ii < this.hmi.views.length; ii++) {

                            if (this.hmi.views[ii].id === views[i].viewId) {

                                //remove any temporal data of the view from the session storage
                                if (tempdata['views'].hasOwnProperty(this.hmi.views[ii].id)) delete tempdata['views'][this.hmi.views[ii].id]
                                if (tempdata['lastView'] === this.hmi.views[ii].id) tempdata['lastView'] = null
                                
                                //deleting any view components from other views that depend on the selected view to be deleted
                                for (var iii = 0; iii < this.hmi.views.length; iii++) {

                                    let componentsCopy = Utils.clone(this.hmi.views[iii].components)
                                    for (var iv = 0; iv < componentsCopy.length; iv++) {
                        
                                        if(componentsCopy[iv].viewId === this.hmi.views[ii].id){
                        
                                        for (var v = 0; v < this.hmi.views[iii].components.length; v++) {
                        
                                            if(this.hmi.views[iii].components[v].viewId === componentsCopy[iv].viewId){
                                                this.hmi.views[iii].components.splice(v, 1);
                                            }
                                        }
                                        }
                                    }
                                }
                                //deleting selected view from HMI views
                                this.hmi.views.splice(ii, 1);
                            }
                            }
                        }

                        if (i > 0 && i < this.hmi.views.length) {
                            toselect = this.hmi.views[i];
                        }

                        if (this.hmi.views.length === 0) {
                            this.onAddView.emit()//if not views left, we create one by default

                        } else {
                            this.currentView = null;
                            if (toselect) {
                            this.onSelectView.emit(toselect.id);
                            } else if (this.hmi.views.length > 0) {
                            this.onSelectView.emit(this.hmi.views[0].id);
                            }
                        }
                        sessionStorage.setItem("duroControl.webeditor.tempData", JSON.stringify(tempdata));
                    }
                }
                this.dataSource.data = this.data;
                this.hmi.general.viewsTree = this.data

                this.history.sendToHistory(this.hmi)
            }
        });
    }

    onViewRename(node: any, inputRename: any){
        node.onEdit = true;
        setTimeout(() => {
            inputRename.focus()
        }, 175);
    }

    
    /**
     * The following funcitons are for view preview
     */
    openPreview(trigger:any, node:any) {
        if(node.id !== this.currentView.id){
            this.onLoadPreview(node.id);
            this.previewTimeout = setTimeout(() => {
                this.recheckIfInPreview = true
                trigger.openMenu();
                
            }, 1100);
        }
    }
    
    closePreview(trigger:any) {
        setTimeout(() => {
          //if (this.recheckIfInPreview === false) {
            trigger.closeMenu();
            this.onClosePreview();
          //}
        }, 175);
    }

    onLoadPreview(viewId:any){
        for (var i = 0; i < this.hmi.views.length; i++) {
            if(this.hmi.views[i].id === viewId){
                this.previewData['view'] = this.hmi.views[i]
                this.previewData['scale'] = this.scalePreview(this.hmi.views[i])
                break;
            }
        }
        //console.log(this.previewData)
    }

    scalePreview(view:any){
        let scale =  Math.min(200 / view.config.width, 130 / view.config.height);
        return "scale(" + scale + ")"
    }

    @HostListener('document:click', ['$event'])
    onClosePreview() {
        if(this.recheckIfInPreview === true){
            //console.log("View preview closed")
            this.recheckIfInPreview = false
            this.previewTimeout = null
        }
    }

    clearTimer(){
        clearTimeout(this.previewTimeout)
    }

    onEdit(event:any, menu:any){
        //console.log(event)
        if(event === true){
            this.onEdition.emit(true)
        }else if (event === false && menu === false){
            this.onEdition.emit(false)
        }
    }
}