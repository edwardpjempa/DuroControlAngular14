import { ComponentFactoryResolver, Injectable } from '@angular/core';

import { HistoryService } from './../history/history.service'

import { Utils } from './../helpers/utils'
import { Hmi, View } from './../../models/hmi'
import { ViewProperties, HMIComponents, PropertiesFolders } from './../../models/components'

export enum Shapes {
    RECTANGLE,
    CIRCLE
}

export interface Coordinates {
    x: number;
    y: number;
}

@Injectable()
export class EditorService {

    constructor(public history: HistoryService) {}

    //For copied and pasted component
    clipboard: Array<any> = []
    showCopy:boolean = false;
    showPaste:boolean = false;

    component_toolPanel: boolean = false

    //For component deletion
    showDelete:boolean = false;

    //For canvas (lasso selection)
    ctx!: CanvasRenderingContext2D;
    previousCoordinates!: Coordinates;
    currentCoordinates!: Coordinates;
    startCoordinates!: Coordinates;
    endCoordinates!: Coordinates;
    drawingMode!: boolean;
    shapes!: Shapes;
    //

    x: number = 0
    y: number = 0
    w: number = 0
    h: number = 0
    rotationAngle: number = 0
    compId: string = ""

    copy(selections:any, currentView:any){
        this.clipboard = []
        for (var i = 0; i < selections.length; i++) {//check all selected components
            if (selections[i].childOn === true){//if one or more are active, we look for the component's id
                for (var ii = 0; ii < currentView['components'].length; ii++) {
                    if(currentView['components'][ii]['id'] === selections[i].childId){
                        this.clipboard.push(Utils.clone(currentView['components'][ii]))
                        console.log("Component copied to clipboard: ", currentView['components'][ii]['id'])
                    }
                }
            }
        }
        //console.log(currentView['components'])
    
        if(this.clipboard.length > 0){
            this.showPaste = true
        }
    }
    
    /*paste(currentView){
        //console.log('pasted');
        for (var i = 0; i < this.clipboard.length; i++) {
            let id_ = Utils.getUniqueId(2)
            //this.clipboard[i].id = id_
            this.clipboard[i].id = this.clipboard[i]['typeAbbr'] + id_//we give a new id to the copied component
    
            //we add the copied component to the list of componet currently in use
            currentView['components'].push(Utils.clone(this.clipboard[i]))
        }
    }*/

    delete(selections:any, currentView:any, hmi:any){
        //console.log("delete")
        let selectionsCopy = Utils.clone(selections)//cloning the selections array to keep a static reference 
      
        for (var i = 0; i < selectionsCopy.length; i++) {//look for all the selected components
          
            if (selectionsCopy[i].childOn === true){//if one or more are active, we proceed to remove it
        
                for (var ii = 0; ii < selections.length; ii++) {
                    if(selections[ii].childId === selectionsCopy[i].childId){
                        selections.splice(ii, 1);
                    }
                }
        
                for (var iii = 0; iii < currentView['components'].length; iii++) {
                    if(currentView['components'][iii]['id'] === selectionsCopy[i].childId){
                        currentView['components'].splice(iii, 1);
                    }
                }
        
                if (i === selectionsCopy.length - 1){//to avoid duplication, only sends to history on the last iteration
                    this.history.sendToHistory(hmi)
                    this.showDelete = false;
                    this.component_toolPanel = false;
                }
            }
        }
    }

    moveTop(selections:any, currentView:any, hmi:any){
        //console.log("move top")
        for (var i = 0; i < selections.length; i++) {
            if (selections[i].childOn === true){
                for (var ii = 0; ii < currentView['components'].length; ii++) {
                    if(currentView['components'][ii]['id'] === selections[i].childId){
            
                        let highestIndex = []
                        for (var iii = 0; iii < currentView['components'].length; iii++) {
                            highestIndex.push(currentView['components'][iii].zIndex)
                        }
                        currentView['components'][ii]['zIndex'] = Math.max(...highestIndex) + 1

                        selections[i].style.zIndex = Math.max(...highestIndex) + 1
            
                        this.history.sendToHistory(hmi)//send to history
            
                        //console.log(currentView['components'][ii]['zIndex'])
                    }
                }
            }
        }
    }
    
    moveBottom(selections:any, currentView:any, hmi:any){
        //console.log("move bottom")
        for (var i = 0; i < selections.length; i++) {
            if (selections[i].childOn === true){
                for (var ii = 0; ii < currentView['components'].length; ii++) {
                    if(currentView['components'][ii]['id'] === selections[i].childId){
            
                        for (var iii = 0; iii < currentView['components'].length; iii++) {
                            if(currentView['components'][iii]['id'] !== selections[i].childId){
                                currentView['components'][iii]['zIndex'] = currentView['components'][iii]['zIndex'] + 1
                                selections[i].style.zIndex = currentView['components'][iii]['zIndex'] + 1
                            }
                        }
                        currentView['components'][ii]['zIndex'] = 0
                        selections[i].style.zIndex = 0 
            
                        this.history.sendToHistory(hmi)//send to history
            
                        //console.log(currentView['components'][ii]['zIndex'])
                    }
                }
            }
        }
    }

    saveToPC(hmi:any){
        Utils.download("durocontrol_hmi.json",JSON.stringify(hmi, null, 2));
    }

    /**
     * Export view in a file json format
     */
    onExportView(viewId:any, hmi:any) {
        let view: any = [{}]
        for (var i = 0; i < hmi.views.length; i++) {
            if(hmi.views[i].id === viewId){
                view[0] = hmi.views[i]
            }
        }
        // get subviews
        for(var i = 0; i < view[0].components.length; i++){
            if(view[0].components[i].type == 'view'){
                for (var ii = 0; ii < hmi.views.length; ii++) {
                    console.log(hmi.views[ii].id, view[0].components[i])
                    if(hmi.views[ii].id == view[0].components[i].viewId){
                        view.push(hmi.views[ii])
                    }
                }
            }
        }
        let filename = view[0].name + ".json";

        Utils.download(filename, JSON.stringify(view, null, 2));
    }

    /**
     * Import view from file (exported in json format)
     */
    onImportView() {
        let ele = document.getElementById('viewFileUpload') as HTMLElement;
        ele.click();
    }

    /**
     * Open project(exported in json format)
     */
    onOpenProject() {
        let ele = document.getElementById('projectFileUpload') as HTMLElement;
        ele.click();
    }

    directionKeys(event:any, selections:any, currentView:any){
        //Move components around with the arrow keys (direction keys)
        //left arrow key
        if (event.key === 'ArrowLeft') {//keyCode 37
            //console.log("left")
            for (var i = 0; i < selections.length; i++) {
                if (selections[i].childOn === true){
                    selections[i].x = selections[i].x - 1
                    selections[i].x1 = selections[i].x1 - 1

                    let componentKeys = {
                        id: selections[i].childId,
                        x: selections[i].x1
                    }
                    this.updateComponent(componentKeys, selections, currentView)
                }
            }

            //up arrow key 
        }else if (event.key === 'ArrowUp') {//keyCode 38
            //console.log('up')
            for (var i = 0; i < selections.length; i++) {
                if (selections[i].childOn === true){
                    selections[i].y = selections[i].y - 1
                    selections[i].y1 = selections[i].y1 - 1

                    let componentKeys = {
                        id: selections[i].childId,
                        y: selections[i].y1
                    }
                    this.updateComponent(componentKeys, selections, currentView)
                }
            }

            //right arrow key
        }if (event.key === 'ArrowRight') {//keyCode 39
            //console.log('right')
            for (var i = 0; i < selections.length; i++) {
                if (selections[i].childOn === true){
                    selections[i].x = selections[i].x + 1
                    selections[i].x1 = selections[i].x1 + 1

                    let componentKeys = {
                        id: selections[i].childId,
                        x: selections[i].x1
                    }
                    this.updateComponent(componentKeys, selections, currentView)
                }
            }

            //down arrow key
        }else if (event.key === 'ArrowDown') {//keyCode 40
            //console.log('down')
            for (var i = 0; i < selections.length; i++) {
                if (selections[i].childOn === true){
                    selections[i].y = selections[i].y + 1
                    selections[i].y1 = selections[i].y1 + 1

                    let componentKeys = {
                        id: selections[i].childId,
                        y: selections[i].y1
                    }
                    this.updateComponent(componentKeys, selections, currentView)
                }
            }
        }
    }

    backspace(hmi:any, currentView:any, selections:any){
        let selectionsCopy = Utils.clone(selections)//cloning the selections array to keep a static reference  
        for (var i = 0; i < selectionsCopy.length; i++) {//look for all the selected components
        
            if (selectionsCopy[i].childOn === true){//if one or more are active, we proceed to remove it
    
                for (var ii = 0; ii < selections.length; ii++) {
                    if(selections[ii].childId === selectionsCopy[i].childId){
                        selections.splice(ii, 1);
                    }
                }
    
                for (var iii = 0; iii < currentView['components'].length; iii++) {
                    if(currentView['components'][iii]['id'] === selectionsCopy[i].childId){
                        currentView['components'].splice(iii, 1);
                    }
                }
    
                if (i === selectionsCopy.length - 1){//to avoid duplication, only sends to history on the last iteration
                    this.history.sendToHistory(hmi)
                    this.showDelete = false;
                    this.component_toolPanel = false;
                }
            }
        }
    }

    updateComponent(data:any, selections:any, currentView:any){
        //console.log(data)
        for (var keys in data) {
            if (data[keys] !== 'id'){
                for (var i = 0; i < currentView['components'].length; i++) {
                    if(currentView['components'][i]['id'] === data.id){
                        currentView['components'][i][keys] = data[keys]
                    }
                }
            }
        }
        this.w = selections[0].width; this.h = selections[0].height;
        this.x = selections[0].x1; this.y = selections[0].y1;

        this.rotationAngle = selections[0].rotationAngle;
    }

    /**
     * The following functions creates a rectangle for lasso selection
     */
    getCoordinatesOnCanvas(canvas:any, e:any) : Coordinates {

        let rect = canvas.getBoundingClientRect();
        let xpos:any; let ypos:any;

        if (e) {
            xpos = (e.pageX - rect.left) / (rect.right - rect.left) * canvas.width
            ypos = (e.pageY - rect.top) / (rect.bottom - rect.top) * canvas.height
        }

        //console.log('x: ', xpos, ',y: ', ypos);
        return { x: xpos, y: ypos };
    }

    createShape(shape: Shapes, context: CanvasRenderingContext2D,
        start: Coordinates, end: Coordinates, prev: Coordinates,
        dotted: boolean) {

        if(start && prev){
            const borderWidth = 1;
            const x = Math.min(start.x, prev.x) - borderWidth;
            const y = Math.min(start.y, prev.y) - borderWidth;
            const width = Math.abs(start.x - prev.x) + (2 * borderWidth);
            const height = Math.abs(start.y - prev.y) + (2 * borderWidth);

            context.clearRect(x, y, width, height);
        }
        
        if (shape === Shapes.RECTANGLE && start && end) {
            if (dotted) {
                context.setLineDash([5, 3]);
            } else {
                context.setLineDash([]);
            }
            context.strokeRect(start.x, start.y, (end.x - start.x), (end.y - start.y));
        }
    }

    startDraw() {
        if (!this.drawingMode) {
            this.drawingMode = true;
            this.startCoordinates = this.currentCoordinates;
            
        } else {
            this.drawingMode = false;
            
            // Shape
            this.createShape(Shapes.RECTANGLE, this.ctx, this.startCoordinates, this.endCoordinates, this.previousCoordinates, false);
        }
    }

    updateDraw(e: MouseEvent, canvas:any, currentView:any) {
        this.previousCoordinates = this.currentCoordinates;
        this.currentCoordinates = this.getCoordinatesOnCanvas(canvas, e);
        if (this.drawingMode) {
        
            //puts the lasso selection on top of the components by sending them to the back
            for (var i = 0; i < currentView['components'].length; i++) {
                let  _canvas = canvas
                _canvas.style.position = "relative";
                _canvas.style.zIndex = 999999
            }
        
            this.createShape(Shapes.RECTANGLE, this.ctx, this.startCoordinates,
            this.currentCoordinates, this.previousCoordinates, true);
            this.endCoordinates = this.currentCoordinates;
        }
    }

    selectionDimen(selection:any, type:any, hmi:any){
        
        if(selection.type === "view"){
            
            for (var i = 0; i < hmi.views.length; i++) {
                
                if(hmi.views[i]['id'] === selection['viewId']){
                    
                    
                    if(hmi.views[i].hasOwnProperty("config") && hmi.views[i]['config'].hasOwnProperty("style")){
    
                        if(hmi.views[i]['config']['style'].hasOwnProperty('borderWidth.px')){
                            if (type === "width") return selection.width + hmi.views[i]['config']['style']['borderWidth.px'] * 2
                            if (type === "height") return selection.height + hmi.views[i]['config']['style']['borderWidth.px'] * 2
                        }else{
                            if (type === "width") return selection.width
                            if (type === "height") return selection.height
                        }
                    }else{
                        if (type === "width") return selection.width
                        if (type === "height") return selection.height
                    }
                }
            }
        }else{
           if (type === "width") return selection.width
           if (type === "height") return selection.height
        }
    }

    folderCheck(component:any, propertiesFolders:any){

        Object.keys(propertiesFolders).forEach(key => {
            if(key !== "root" && key !== "style"){
                if(!component.hasOwnProperty(key)) component[key]={}
            }
        })
        console.log(component)
    }

    propertiesCheck(currentView:any, hmiviews:any){
        for (var i = 0; i < currentView.components.length; i++) {

            let comptProperties = {}
            let folder = "root"
            let folders = new PropertiesFolders()
            let component = currentView.components[i]

            let propertiesFolders = {};
            let hmiComponents:any = new HMIComponents();

            if(hmiComponents.hasOwnProperty(component.type)){
                propertiesFolders = hmiComponents[component.type].properties
            }

            //this.folderCheck(component, propertiesFolders)
            
            this.iterateProperties(currentView.components[i], component, folder, folders, comptProperties, currentView)

            for(var fol in comptProperties){
                this.addProperties(component, comptProperties, currentView, fol, propertiesFolders, hmiComponents, hmiviews)
            }
            //console.log(comptProperties)
        }
    }

    iterateProperties = (obj:any, component:any, folder:any, folders:any, comptProperties:any, currentView:any) => {
        Object.keys(obj).forEach(key => {
            //console.log(`key: ${key}, value: ${obj[key]}`)

            for (var foldName in folders){
                //console.log(foldName)

                if(folder === foldName && !comptProperties.hasOwnProperty(folder)) comptProperties[folder] = {}

                if(folder === foldName) {
                    //console.log(folder)
                    if(!folders.hasOwnProperty(key)) comptProperties[foldName][key] = obj[key]
                }
            }

            /*if(folder === "root" && !comptProperties.hasOwnProperty(folder)) comptProperties[folder] = {}
            if(folder === "style" && !comptProperties.hasOwnProperty(folder)) comptProperties[folder] = {}
            if(folder === "config" && !comptProperties.hasOwnProperty(folder)) comptProperties[folder] = {}
            if(folder === "events" && !comptProperties.hasOwnProperty(folder)) comptProperties[folder] = {}
            if(folder === "animation" && !comptProperties.hasOwnProperty(folder)) comptProperties[folder] = {}

            if(folder === "root") {
                //console.log(folder)
                if(!folders.hasOwnProperty(key)) comptProperties['root'][key] = obj[key]
            }else if(folder === "style") {
                //console.log(folder)
                if(!folders.hasOwnProperty(key)) comptProperties['style'][key] = obj[key]
            }else if(folder === "config"){
                //console.log(folder)
                if(!folders.hasOwnProperty(key)) comptProperties['config'][key] = obj[key]
            }else if(folder === "animation"){
                //console.log(folder)
                if(!folders.hasOwnProperty(key)) comptProperties['animation'][key] = obj[key]
            }else if(folder === "events"){
                //console.log(folder)
                if(!folders.hasOwnProperty(key)) comptProperties['events'][key] = obj[key]
            }*/
            if (typeof obj[key] === 'object') this.iterateProperties(obj[key], component, key, folders, comptProperties, currentView)
        })
    }

    /**
     * The following adds missing properties into a component
     */
    addProperties(component:any, comptProperties:any, currentView:any, folder:any, propertiesFolders:any, hmiComponents:any, hmiviews:any){
        let properties:any = {};
        //console.log(component)
        //console.log(comptProperties)

        if(propertiesFolders.hasOwnProperty(folder)){
            properties = propertiesFolders[folder]
            
            for(var property in properties){
                //console.log(property)

                // Add Missing Root Properties
                if(comptProperties.hasOwnProperty('root') && !comptProperties['root'].hasOwnProperty(property) && properties[property]['editable'] === false && properties[property]['folder'] === "root"){
                    //console.log(property)

                    // If missing, add 'name' property to the component
                    if(property === "comptName"){
                        component[property] = Utils.defaultName(currentView.components, hmiComponents[component.type].name, property)
                    
                    // If missing and the component is a view, use the same size mode of the parent view
                    }else if(property === "sizeMode"){

                        for (var i in hmiviews){
                            //console.log(hmiviews[i])
                            if (hmiviews[i]['id'] === component['viewId']){
                                component[property] = hmiviews[i]['config']['sizeMode']
                            }
                        }
                    }else{
                        component[property] = properties[property]['data']
                    }
                }else{
                    // Update data of some properties of a component
                    if(comptProperties.hasOwnProperty('root') && comptProperties['root'].hasOwnProperty(property) && properties[property]['editable'] === false && properties[property]['folder'] === "root"){
                        if(property === "sizeMode" && component.type === "view"){
                            for (var i in hmiviews){
                                //console.log(hmiviews[i])
                                if (hmiviews[i]['id'] === component['viewId']){
                                    component[property] = hmiviews[i]['config']['sizeMode']
                                }
                            }
                        }else if(property === "w" && component.type === "view"){
                            for (var i in hmiviews){
                                //console.log(hmiviews[i])
                                if (hmiviews[i]['id'] === component['viewId']){
                                    if (hmiviews[i]['config']['sizeMode'] === "normal") component[property] = hmiviews[i]['config']['width']
                                }
                            }
                        }else if(property === "h" && component.type === "view"){
                            for (var i in hmiviews){
                                //console.log(hmiviews[i])
                                if (hmiviews[i]['id'] === component['viewId']){
                                    if (hmiviews[i]['config']['sizeMode'] === "normal") component[property] = hmiviews[i]['config']['height']
                                }
                            }
                        }
                    }
                }
                // Add Missing Config Properties
                if(comptProperties.hasOwnProperty('config') && !comptProperties['config'].hasOwnProperty(property) && properties[property]['editable'] === false && properties[property]['folder'] === "config"){
                    if(!component.hasOwnProperty("config")) component['config'] = {}
                    
                    component['config'][property] = properties[property]['data']
                }
                // Add Missing Animation Properties
                if(comptProperties.hasOwnProperty('animation') && !comptProperties['animation'].hasOwnProperty(property) && hmiComponents[component.type]["animation"].hasOwnProperty(property) && properties[property]['editable'] === false && properties[property]['folder'] === "animation"){
                    if(!component.hasOwnProperty("animation")) component['animation'] = {}

                    component['animation'][property] = properties[property]['data']
                }
                if(comptProperties.hasOwnProperty('events') && !comptProperties['events'].hasOwnProperty(property) && hmiComponents[component.type]["events"].hasOwnProperty(property) && properties[property]['editable'] === false && properties[property]['folder'] === "events"){
                    //console.log(property)

                    if(!component.hasOwnProperty("events")) component['events'] = {}

                    component['events'][property] = properties[property]['data']
                }
                
                //LOGIC
                // Add Missing Logic Properties
                if(comptProperties.hasOwnProperty('logic') && !comptProperties['logic'].hasOwnProperty(property) && hmiComponents[component.type]["logic"].hasOwnProperty(property) && properties[property]['editable'] === false && properties[property]['folder'] === "logic"){
                    //console.log(property)
                    if(!component.hasOwnProperty("logic")) component['logic'] = {}

                    component['logic'][property] = properties[property]['data']
                }
            }
        }
    }

    viewPropertiesCheck(view:any, hmi:any){
        let viewProperties = new View()
        for (var property in viewProperties){
            if (!view.hasOwnProperty(property)){
                if(property === "name") view[property] = Utils.defaultName(hmi.views, "View_", "name")
                if(property === "type") view[property] = viewProperties[property]
                if(property === "config") view[property] = viewProperties[property]
                if(property === "components") view[property] = viewProperties[property]
            }
        }
    }

    alignComponent(event:any, selections:any, currentView:any){
        //console.log("Align component(s) to ", event)

        // Just one component is selected
        if (selections.length === 1){
            if (event === 'left'){

                selections[0].x = 0
                selections[0].x1 = 0

                let component = {
                    id: selections[0].childId, x: selections[0].x1
                }
                this.updateComponent(component, selections, currentView)
                
            }else if (event === 'center'){

                selections[0].x = (currentView.config.width/2) - (selections[0].width/2)
                selections[0].x1 = (currentView.config.width/2) - (selections[0].width/2)

                let component = {
                    id: selections[0].childId, x: selections[0].x1
                }
                this.updateComponent(component, selections, currentView)

            }else if (event === 'right'){

                selections[0].x = currentView.config.width - selections[0].width
                selections[0].x1 = currentView.config.width - selections[0].width

                let component = {
                    id: selections[0].childId, x: selections[0].x1
                }
                this.updateComponent(component, selections, currentView)

            }else if (event === 'top'){

                selections[0].y = 0
                selections[0].y1 = 0

                let component = {
                    id: selections[0].childId, y: selections[0].y1
                }
                this.updateComponent(component, selections, currentView)

            }else if (event === 'middle'){

                selections[0].y = (currentView.config.height/2) - (selections[0].height/2)
                selections[0].y1 = (currentView.config.height/2) - (selections[0].height/2)

                let component = {
                    id: selections[0].childId, y: selections[0].y1
                }
                this.updateComponent(component, selections, currentView)

            }else if (event === 'bottom'){

                selections[0].y = currentView.config.height - selections[0].height
                selections[0].y1 = currentView.config.height - selections[0].height

                let component = {
                    id: selections[0].childId, y: selections[0].y1
                }
                this.updateComponent(component, selections, currentView)
            }

         // When more than one components are selected  
        }else if (selections.length > 1){

            if (event === 'left'){

                let objs_x_pos = []

                for (var i = 0; i < selections.length; i++) {

                    objs_x_pos.push(selections[i].x1)
                }
                //console.log(Math.min(...objs_x_pos) )

                for (var i = 0; i < selections.length; i++) {

                    selections[i].x = Math.min(...objs_x_pos) 
                    selections[i].x1 = Math.min(...objs_x_pos) 

                    let component = {
                        id: selections[i].childId, x: selections[i].x1
                    }
                    this.updateComponent(component, selections, currentView)
                }
            }else if (event === 'center'){
                /*let objs_x_pos = []

                // Gets the width of all components in the current view
                for (var i = 0; i < this.selections.length; i++) {
                    objs_x_pos.push(this.selections[i].width)
                }
                //console.log(this.selections[i].width)

                for (var i = 0; i < this.selections.length; i++) {

                    // Look for the x position of the biggest component
                    for (var ii = 0; ii < this.selections.length; ii++) {

                    if(Math.max(...objs_x_pos) === this.selections[ii].width){

                        // Update the rest of the components based on the x position of the biggest one
                        this.selections[i].x = (this.selections[ii].x + (Math.max(...objs_x_pos)/2)) - (this.selections[i].width/2)
                        this.selections[i].x1 = (this.selections[ii].x1 + (Math.max(...objs_x_pos)/2))- (this.selections[i].width/2)

                        let component = {
                            id: this.selections[i].childId, x: this.selections[i].x1
                        }
                        this.eservice.updateComponent(component, this.selections, this.currentView)
                        break;
                    }
                    }
                }*/


                let objs_x_pos_min = []
                let objs_x_pos_max = []

                for (var i = 0; i < selections.length; i++) {

                    objs_x_pos_min.push(selections[i].x1)

                    objs_x_pos_max.push(selections[i].x1 + selections[i].width)
                }
                //console.log(Math.max(...objs_x_pos_max) - Math.min(...objs_x_pos_min))

                let centerPoint = ((Math.max(...objs_x_pos_max) - Math.min(...objs_x_pos_min)) / 2) + Math.min(...objs_x_pos_min)

                for (var i = 0; i < selections.length; i++) {

                    selections[i].x = centerPoint - (selections[i].width/2)
                    selections[i].x1 = centerPoint - (selections[i].width/2)

                    let component = {
                        id: selections[i].childId, x: selections[i].x1
                    }
                    this.updateComponent(component, selections, currentView)
                }

            }else if (event === 'right'){

                let objs_x_pos = []

                for (var i = 0; i < selections.length; i++) {

                    objs_x_pos.push(selections[i].x1 + selections[i].width)
                }
                //console.log(Math.max(...objs_x_pos))

                for (var i = 0; i < selections.length; i++) {

                    selections[i].x = Math.max(...objs_x_pos) - selections[i].width
                    selections[i].x1 = Math.max(...objs_x_pos) - selections[i].width

                    let component = {
                        id: selections[i].childId, x: selections[i].x1
                    }
                    this.updateComponent(component, selections, currentView)
                }

            }else if (event === 'top'){

                let objs_y_pos = []

                for (var i = 0; i < selections.length; i++) {

                    objs_y_pos.push(selections[i].y1)
                }
                //console.log(Math.min(...objs_y_pos) )

                for (var i = 0; i < selections.length; i++) {

                    selections[i].y = Math.min(...objs_y_pos) 
                    selections[i].y1 = Math.min(...objs_y_pos) 

                    let component = {
                        id: selections[i].childId, y: selections[i].y1
                    }
                    this.updateComponent(component, selections, currentView)
                }
            }else if (event === 'middle'){

                let objs_y_pos_min = []
                let objs_y_pos_max = []

                for (var i = 0; i < selections.length; i++) {

                    objs_y_pos_min.push(selections[i].y1)

                    objs_y_pos_max.push(selections[i].y1 + selections[i].height)
                }

                let middlePoint = ((Math.max(...objs_y_pos_max) - Math.min(...objs_y_pos_min)) / 2) + Math.min(...objs_y_pos_min)

                for (var i = 0; i < selections.length; i++) {

                    selections[i].y = middlePoint - (selections[i].height/2)
                    selections[i].y1 = middlePoint - (selections[i].height/2)

                    let component = {
                        id: selections[i].childId, y: selections[i].y1
                    }
                    this.updateComponent(component, selections, currentView)
                }

            }else if (event === 'bottom'){

                let objs_y_pos = []

                for (var i = 0; i < selections.length; i++) {

                    objs_y_pos.push(selections[i].y1 + selections[i].height)
                }
                //console.log(Math.max(...objs_y_pos))

                for (var i = 0; i < selections.length; i++) {

                    selections[i].y = Math.max(...objs_y_pos) - selections[i].height
                    selections[i].y1 = Math.max(...objs_y_pos) - selections[i].height

                    let component = {
                        id: selections[i].childId, y: selections[i].y1
                    }
                    this.updateComponent(component, selections, currentView)
                }
            }
        }
    }
}