import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewEncapsulation, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { DialogImageManager } from './../../dialogs/index';
import { HMIComponents, PropertiesTabs } from './../../../models/components';
import { HistoryService } from './../../history/history.service'
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { propertiesFunctionModal } from "../propertiesFunctionModal/propertiesFunctionModal.component";

@Component({
    selector: "e-sidenav-properties",
    templateUrl: "./properties.component.html",
    styleUrls: ["./properties.component.scss"],
    encapsulation : ViewEncapsulation.None
})
export class Editor_SidenavProperties  implements OnInit {

    @Input() trackBy: any;
    @Input() hmi: any;
    @Input() selections: any;
    @Input() currentView: any
    @Output() onEdition: EventEmitter<any> = new EventEmitter(true);
    @Output() imgSelected: EventEmitter<any> = new EventEmitter(true);

    currentParameters: number = 0;

    properties: Array<any> = [];

    displayedColumns: string[] = ['name', 'parameter'];
    displayedColumns2: string[] = ['parameter'];

    dataSource:any = new MatTableDataSource();

    selectedCompID!: string;

    matTabIndex: number = 0;
    matTabNames:any = []
    lineChartDataSource:any
    barChartDataSource:any

    myformArray:any = new FormArray([]);

    @ViewChild('tabGroup', { static: true }) tabGroup:any;

    constructor(public dialog: MatDialog, public history: HistoryService,){}

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnInit() {
        setTimeout(()=> {
            if(document.getElementById('spanid')!.innerHTML.substring(0,2) == 'bc'){
                var minInput = document.getElementById('min') as HTMLInputElement
                minInput.setAttribute('min', '0');
                var maxInput = document.getElementById('max') as HTMLInputElement
                maxInput.setAttribute('min', '0');
                var tickInput = document.getElementById('tickAmount') as HTMLInputElement
                tickInput.setAttribute('min', '1');
                var refreshInput = document.getElementById('refreshRate') as HTMLInputElement
                refreshInput.setAttribute('min', '10');
                var columnWidthInput = document.getElementById('columnWidth') as HTMLInputElement
                minInput.setAttribute('min', '1');
                minInput.setAttribute('max', '99');

                document.getElementById("min")!.addEventListener("keyup", function() {
                    let v = parseInt(minInput.value);
                    if (v < 0) minInput.value = '0';
                });
                document.getElementById("min")!.addEventListener("change", function() {
                    let v = parseInt(minInput.value);
                    if (v < 0) minInput.value = '0';
                });
                document.getElementById("max")!.addEventListener("keyup", function() {
                    let v = parseInt(maxInput.value);
                    if (v < 0) maxInput.value = '0';
                });
                document.getElementById("max")!.addEventListener("change", function() {
                    let v = parseInt(maxInput.value);
                    if (v < 0) maxInput.value = '0';
                });
                document.getElementById("tickAmount")!.addEventListener("keyup", function() {
                    let v = parseInt(tickInput.value);
                    if (v < 1) tickInput.value = '1';
                });
                document.getElementById("tickAmount")!.addEventListener("change", function() {
                    let v = parseInt(tickInput.value);
                    if (v < 1) tickInput.value = '1';
                });
                document.getElementById("refreshRate")!.addEventListener("keyup", function() {
                    let v = parseInt(refreshInput.value);
                    if (v < 10) refreshInput.value = '10';
                });
                document.getElementById("refreshRate")!.addEventListener("click", function() {
                    let v = parseInt(refreshInput.value);
                    if (v < 10) refreshInput.value = '10';
                });
                document.getElementById("columnWidth")!.addEventListener("keyup", function() {
                    let v = parseInt(columnWidthInput.value);
                    if (v < 1) columnWidthInput.value = '1';
                    if (v > 99) columnWidthInput.value = '99';
                });
                document.getElementById("columnWidth")!.addEventListener("click", function() {
                    let v = parseInt(columnWidthInput.value);
                    if (v < 1) columnWidthInput.value = '1';
                    if (v > 99) columnWidthInput.value = '99';
                });
            }
        }, 50)
    }

    ngAfterViewInit() {
        this.matTabIndex = this.tabGroup.selectedIndex
    }

    ngOnChanges(changes: SimpleChanges) {

        if(changes.hasOwnProperty("trackBy") && changes["trackBy"].currentValue.hasOwnProperty('currentParameters')) {
            if(changes["trackBy"].currentValue.currentParameters !== this.currentParameters){
                this.renderTabs();
                this.generateTable();

                // Update the number of current parameters being used
                this.currentParameters =  changes["trackBy"].currentValue.currentParameters
            }
        }

        if(this.selections.length > 0 && this.selections[0].hasOwnProperty("childId")){

            if(this.selections.length > 0 && this.selections[0].hasOwnProperty("childId")){
                
                if(this.selectedCompID !== this.selections[0].childId){
                    //generate a new table for properties if the component is different
                    

                    this.renderTabs();
                    this.generateTable();
                    this.onEdition.emit(false);

                    

                }else{//we update the current values of the component in the properties panel
                    for (var i = 0; i < this.dataSource.data.length; i++) {
                        
                        if(this.dataSource.data[i]['propertyName'] === "w"){
                            this.dataSource.data[i]['data'] = this.selections[0].width
                        }
                        if(this.dataSource.data[i]['propertyName'] === "h"){
                            this.dataSource.data[i]['data'] = this.selections[0].height
                        }
                        if(this.dataSource.data[i]['propertyName'] === "x"){
                            this.dataSource.data[i]['data'] = this.selections[0].x1
                        }
                        if(this.dataSource.data[i]['propertyName'] === "y"){
                            this.dataSource.data[i]['data'] = this.selections[0].y1
                        }
                        if(this.dataSource.data[i]['propertyName'] === "rotationAngle"){
                            this.dataSource.data[i]['data'] = this.selections[0].rotationAngle
                        }
                    }
                }
            }
        }else if(this.selections.length  === 0){
            this.generateTable()
        }
    }

    generateTable(){
        this.properties = []
        this.selectedCompID = this.selections[0]['childId'];
        if(this.selections.length > 0){
            for (var i = 0; i < this.currentView.components.length; i++) {
                if(this.selections[0].childId === this.currentView.components[i].id && (this.selections[0].type != 'barChart' || this.matTabIndex != 3)){
                    let folder = "root"
                    let propertiesFolders = {}
                    let hmiComponents:any = new HMIComponents();

                    if(hmiComponents.hasOwnProperty(this.currentView.components[i].type)){
                        propertiesFolders = hmiComponents[this.currentView.components[i].type].properties
                    }
                    this.iterate(this.currentView.components[i], folder, propertiesFolders, this.currentView.components[i])
                }else if (
                    this.selections[0].type === 'lineChart' &&
                    this.selections[0].childId == this.currentView.components[i].id &&
                    this.matTabIndex === 3
                 ) {
                    this.myformArray.clear();
                    for (var j = 0; j < this.currentView.components[i].config['lineChartData']['tags'].length; j++) {
                       var obj:any = {};
                       obj["name"] = new FormControl(this.currentView.components[i].config['lineChartData']['names'][j]);
                       obj["tag"] = new FormControl(this.currentView.components[i].config['lineChartData']['tags'][j]);
                       obj["color"] = new FormControl(this.currentView.components[i].config['lineChartData']['colors'][j]);
                       this.myformArray.push(new FormGroup(obj));
                    }
                    this.lineChartDataSource = [...this.myformArray.controls]
                 }
                 else if (
                    this.selections[0].type === 'barChart' &&
                    this.selections[0].childId == this.currentView.components[i].id &&
                    this.matTabIndex === 3
                 ) {
                    this.myformArray.clear();
                    for (var j = 0; j < this.currentView.components[i].config['barChartData']['tags'].length; j++) {
                       var obj:any = {};
                       obj["name"] = new FormControl(this.currentView.components[i].config['barChartData']['names'][j]);
                       obj["tag"] = new FormControl(this.currentView.components[i].config['barChartData']['tags'][j]);
                       obj["color"] = new FormControl(this.currentView.components[i].config['barChartData']['colors'][j]);
                       this.myformArray.push(new FormGroup(obj));
                    }
                    this.barChartDataSource = [...this.myformArray.controls]
                 }
            }
        }
        if(this.properties.length > 0){ 
            this.dataSource = new MatTableDataSource(this.properties);
        }else{
            this.dataSource = new MatTableDataSource([]);
        }
    }

    renderTabs(){
        for (var i = 0; i < this.currentView.components.length; i++) {
            if(this.selections[0].childId === this.currentView.components[i].id){

                let propertiesFolders = {}; let folders: any = [];
                let hmiComponents:any = new HMIComponents(); let propTabs:any = new PropertiesTabs();

                if(hmiComponents.hasOwnProperty(this.currentView.components[i].type)){
                    propertiesFolders = hmiComponents[this.currentView.components[i].type].properties
                }

                for (var folderName in propertiesFolders){
                    folders.push(folderName)
                }
                folders = Array.from(new Set(folders))

                let tabs:any = []
                for (var index in folders){
                    if(folders[index] === "root" || folders[index] === "config" || folders[index] === "style"){
                        tabs.push("general")
                    }else{
                        tabs.push(folders[index])
                    }
                }
                tabs = Array.from(new Set(tabs))

                this.matTabNames = []
                for(var index in tabs){
                    if(propTabs.hasOwnProperty(tabs[index])) this.matTabNames.push(propTabs[tabs[index]])
                }
            }
        }
    }

    iterate = (obj:any, folder:any, propertiesFolders:any, component:any) => {
        Object.keys(obj).forEach(key => {
            if(this.matTabIndex === 0 && folder === "root") {
                let propertyField = this.formType(key, obj[key], folder, propertiesFolders)
                if(propertyField !== undefined) this.properties.push(propertyField)
            }else if(folder === "style" && this.matTabIndex === 0) {
                let propertyField = this.formType(key, obj[key], folder, propertiesFolders)
                if(propertyField !== undefined) this.properties.push(propertyField)
            }else if(folder === "config" && this.matTabIndex === 0){
                let propertyField = this.formType(key, obj[key], folder, propertiesFolders)
                if(propertyField !== undefined) this.properties.push(propertyField)
            }else if(folder === "animation" && this.matTabIndex === 1){
                let loadProperty = function(formType:any,properties:any){
                    let propertyField = formType(key, obj[key], folder, propertiesFolders)
                    if(propertyField !== undefined) properties.push(propertyField)
                }
                // The following makes sure to only display specific properties based on the behavior
                if(component.config.hasOwnProperty("behavior")){
                    if(propertiesFolders["animation"][key].hasOwnProperty("behavior")){
                        if(propertiesFolders["animation"][key]["behavior"] === component.config.behavior){
                            loadProperty(this.formType,this.properties);
                        }
                    }else{
                        loadProperty(this.formType,this.properties);
                    }
                }else{
                    loadProperty(this.formType,this.properties);
                }
            }else if(folder === "events" && this.matTabIndex === 2){
                let loadProperty = function(formType:any,properties:any){
                    let propertyField = formType(key, obj[key], folder, propertiesFolders)
                    if(propertyField !== undefined) properties.push(propertyField)
                }

                // The following makes sure to only display specific properties based on the behavior
                if(component.config.hasOwnProperty("behavior")){
                    if(propertiesFolders["events"][key]["behavior"] === component.config.behavior){

                        loadProperty(this.formType,this.properties);
                    }
                }else{
                    loadProperty(this.formType,this.properties);
                }
            }else if(folder === "varReplacement" && this.matTabIndex === 3){
                this.properties.push(obj[key])
            }else if(folder === "options" && this.matTabIndex === 3){
                this.properties.push(obj[key])
            }else if(folder === "logic" && this.matTabIndex ===3){
                let propertyField = this.formType(key, obj[key], folder, propertiesFolders)
                if(propertyField !== undefined) this.properties.push(propertyField)
            }
            if (typeof obj[key] === 'object'){
                if(folder == "lineChartData" || folder == 'barChartData') return
                this.iterate(obj[key], key, propertiesFolders, component)
            } 
        })
    }

    formType(propertyName:any, data:any, folder:any, propertiesFolders:any): any{
        if (propertiesFolders.hasOwnProperty(folder) && propertiesFolders[folder].hasOwnProperty(propertyName)){
            if (data.hasOwnProperty("function")){
                propertiesFolders[folder][propertyName]['data'] = data["function"]
                propertiesFolders[folder][propertyName]['formOptions']["defaultTimeout"] = data["timeoutVal"]
            }else{
                propertiesFolders[folder][propertyName]['data'] = data
            }
            
            if (propertiesFolders[folder][propertyName]['formType'] !== null){
                return propertiesFolders[folder][propertyName]
            }else{
                return undefined
            }
        }
    }

    onParamChange(element:any){
        for (var i = 0; i < this.currentView.components.length; i++) {
            if (this.selections[0].childId === this.currentView.components[i].id) {

                let propertiesComp = this.currentView.components[i]
                if(element['folder'] === "root"){
                    this.saveParamChange(propertiesComp, element)
                }else if(element['folder'] === "config"){
                    this.saveParamChange(propertiesComp['config'], element)
                }else if(element['folder'] === "style"){
                    this.saveParamChange(propertiesComp['config']['style'], element)
                }else if(element['folder'] === "events"){
                    this.saveParamChange(propertiesComp['events'], element)
                }else if(element['folder'] === "animation"){
                    this.saveParamChange(propertiesComp['animation'], element)
                }else if(element['folder'] === "logic"){
                    this.saveParamChange(propertiesComp['logic'], element)
                }
            }
        }
    }

    onParamChangee(type:any, element:any, index:any){
        if(type == 'lineChart'){
            for (var i = 0; i < this.currentView.components.length; i++) {
                if (this.selections[0].childId === this.currentView.components[i].id) {
                    let colors = this.currentView.components[i].config.lineChartData.colors 
                    colors[index] = element.color    
                    this.history.sendToHistory(this.hmi)                
                }
            }
        }else if(type == 'barChart'){
            for (var i = 0; i < this.currentView.components.length; i++) {
                if (this.selections[0].childId === this.currentView.components[i].id) {
                    let colors = this.currentView.components[i].config.barChartData.colors 
                    colors[index] = element.color
                    this.history.sendToHistory(this.hmi)                
                }
            }
        }   
    }

    saveParamChange(obj:any, element:any){
        let propertyName = element.propertyName
        let propertyData = element.data
        let dataType = element.dataType

        if (dataType=== "number" && propertyData !== ""){
            propertyData = parseInt(propertyData);
        }else if (dataType === "number" && propertyData === ""){
            propertyData = obj[propertyName]
        }
        if (propertyName === "timeout"){
            propertyData = {function: element.data, timeoutVal: parseInt(element.formOptions.defaultTimeout)}
        }

        if (propertyName === "x" && !isNaN(propertyData)) {
            this.selections[0].x = this.selections[0].x + (parseInt(propertyData) - obj[propertyName])
            this.selections[0].x1 = this.selections[0].x1 + (parseInt(propertyData) - obj[propertyName])
        }
        if (propertyName === "y" && !isNaN(propertyData)) {
            this.selections[0].y = this.selections[0].y + (parseInt(propertyData) - obj[propertyName])
            this.selections[0].y1 = this.selections[0].y1 + (parseInt(propertyData) - obj[propertyName])
        }

        if (obj[propertyName] !== propertyData) {
            obj[propertyName] = propertyData
            this.history.sendToHistory(this.hmi)

        } else {

            obj[propertyName] = propertyData
        }

        if (propertyName === "h") this.selections[0].height = parseInt(propertyData)
        if (propertyName === "w") this.selections[0].width = parseInt(propertyData)
        if (propertyName === "rotationAngle") this.selections[0].rotationAngle = parseFloat(propertyData);
    }

    onEdit(event:any, menu:any){
        if(event === true){
            this.onEdition.emit(true)
        }else if (event === false && menu === false){
            this.onEdition.emit(false)
        }
    }

    /**
     * Image manager
     */
    imageManager(element:any) {
        this.onEdit(true,false)
        let dialogRef = this.dialog.open(DialogImageManager, {
            position: {},
            data: { cmptProperties: element},
            height: '800px',
            width: '800px',
            panelClass: 'imageManager-container'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                element.data.url = result['imgSelected'].url
                element.data.name  = result['imgSelected'].name
                element.data.imgId  = result['imgSelected'].id

                this.onParamChange(element)
            }
            this.onEdit(false, false)
        });
    }

    removeImage(element:any){
        element.data.url = "/assets/images/NoImage.png"
        element.data.name = undefined; element.data.imgId = undefined;
    }

    deleteParam(element:any, index:any){
        for (var i = 0; i < this.hmi.views.length; i++) {
            if(this.currentView.id === this.hmi.views[i].id){

                for (var ii = 0; ii < this.currentView.components.length; ii++) {

                    if(this.currentView.components[ii].id === this.selections[0].childId){

                        delete this.currentView.components[ii].config.style[element.propertyName]
                        delete this.hmi.views[i].components[ii].config.style[element.propertyName]

                        this.generateTable()

                        this.iterate2(this.hmi.views[i].components[ii])
                    }
                }
            }
        }
    }

    addTag(){
        if(this.matTabIndex === 3){
            for (var i = 0; i < this.hmi.views.length; i++) {
                if(this.currentView.id === this.hmi.views[i].id){
    
                    for (var ii = 0; ii < this.currentView.components.length; ii++) {
    
                        if(this.currentView.components[ii].id === this.selections[0].childId){

                            if(this.currentView.components[ii].config.hasOwnProperty("varReplacement")){

                                this.currentView.components[ii].config['varReplacement'].push({var: "Tag name", value: ""})
                                this.generateTable()
                            }else{
                                this.currentView.components[ii].config['varReplacement'] = []

                                this.currentView.components[ii].config['varReplacement'].push({var: "Tag name", value: ""})
                                this.generateTable()
                            }
                        }
                    }
                }
            }
        }
    }

    addTagForOptions(){
        if(this.matTabIndex === 3){
            for (var i = 0; i < this.hmi.views.length; i++) {
                if(this.currentView.id === this.hmi.views[i].id){
    
                    for (var ii = 0; ii < this.currentView.components.length; ii++) {
    
                        if(this.currentView.components[ii].id === this.selections[0].childId){

                            if(this.currentView.components[ii].config.hasOwnProperty("options")){

                                this.currentView.components[ii].config['options'].push({value: ""})
                                this.generateTable()
                            }else{
                                this.currentView.components[ii].config['options'] = []

                                this.currentView.components[ii].config['options'].push({value: ""})
                                this.generateTable()
                            }
                        }
                    }
                }
            }
        }
    }

    deleteTag(element:any, index:any){
        for (var i = 0; i < this.hmi.views.length; i++) {
            if(this.currentView.id === this.hmi.views[i].id){

                for (var ii = 0; ii < this.currentView.components.length; ii++) {

                    if(this.currentView.components[ii].id === this.selections[0].childId){

                        for(var index1 in this.currentView.components[ii].config['varReplacement']){

                            if(this.currentView.components[ii].config['varReplacement'][index1]['var'] === element['var']){
                                this.currentView.components[ii].config['varReplacement'].splice(index1, 1)
                                //this.hmi.views[i].components[ii].config['varReplacement'].splice(index1, 1)
                            }
                        }
                        this.generateTable()
                    }
                }
            }
        }
    }

    deleteTagForOptions(element:any, index:any){
        for (var i = 0; i < this.hmi.views.length; i++) {
            if(this.currentView.id === this.hmi.views[i].id){

                for (var ii = 0; ii < this.currentView.components.length; ii++) {

                    if(this.currentView.components[ii].id === this.selections[0].childId){

                        for(var index1 in this.currentView.components[ii].config['options']){

                            if(this.currentView.components[ii].config['options'][index1]['value'] === element['value']){
                                this.currentView.components[ii].config['options'].splice(index1, 1)
                                //this.hmi.views[i].components[ii].config['varReplacement'].splice(index1, 1)
                            }
                        }
                        this.generateTable()
                    }
                }
            }
        }
    }

    onTagChange(){
        for (var i = 0; i < this.hmi.views.length; i++) {
            if(this.currentView.id === this.hmi.views[i].id){

                for (var ii = 0; ii < this.currentView.components.length; ii++) {

                    if(this.currentView.components[ii].id === this.selections[0].childId){

                        this.currentView.components[ii].config['varReplacement'] = this.dataSource.data
                    }
                }
            }
        }
    }

    onTagChangeForOptions(){
        for (var i = 0; i < this.hmi.views.length; i++) {
            if(this.currentView.id === this.hmi.views[i].id){

                for (var ii = 0; ii < this.currentView.components.length; ii++) {

                    if(this.currentView.components[ii].id === this.selections[0].childId){

                        this.currentView.components[ii].config['options'] = this.dataSource.data
                    }
                }
            }
        }
    }


    iterate2 = (obj:any) => {
        Object.keys(obj).forEach(key => {

            this.currentParameters = this.currentParameters + 1

            if (typeof obj[key] === 'object') {
                this.iterate2(obj[key])
            }
        })
    }

    AlignActive(data:any, align:any){
        if(data === align){
            return true
        }else{
            return false
        }
    }

    tabChanged(event:any){
        this.matTabIndex = event.index;
        this.generateTable();
    }

    addRowChart(type:any) {
        var chartType = ''
        if(type == 'lineChart'){
            chartType = 'lineChartData'
        }
        else if(type == 'barChart'){
            chartType = 'barChartData'
        }
        var length = 0
        for (var i = 0; i < this.hmi.views.length; i++) {
            if (this.currentView.id === this.hmi.views[i].id) {
                for (
                    var ii = 0;
                    ii < this.currentView.components.length;
                    ii++
                ) {
                    if (
                        this.currentView.components[ii].id ===
                        this.selections[0].childId
                    ) {
                        if(this.currentView.components[ii].config[chartType][
                            'tags'].length < 9){
                            this.currentView.components[ii].config[chartType][
                            'tags'][this.currentView.components[ii].config[chartType][
                                'tags'].length] = ""
                            this.currentView.components[ii].config[chartType][
                            'tagValues'][this.currentView.components[ii].config[chartType][
                                'tags'].length-1] = 0
                            this.currentView.components[ii].config[chartType][
                                'colors'][this.currentView.components[ii].config[chartType][
                                'tags'].length-1] = "#000000"
                        }else{
                            length = 10
                        }
                    }
                }
            }
        }
        if(length < 10){
            const newGroup = new FormGroup({});
            newGroup.addControl('name', new FormControl(""));
            newGroup.addControl('tag', new FormControl(""));
            newGroup.addControl('color', new FormControl("#000000"));
            this.myformArray.push(newGroup);
            if(type == 'lineChart'){
                this.lineChartDataSource = [...this.myformArray.controls];
            }
            else if(type == 'barChart'){
                this.barChartDataSource = [...this.myformArray.controls];
            }
        }
    }

    newData(e:any, type:any, input:any, index:any){
        var data = ''
        if(type == 'lineChart'){
            data = 'lineChartData'
        }else{
            data = 'barChartData'
        }
        var tr = document.getElementsByTagName('tr');
        var trs = [];
        for (var i = 0; i < tr.length; i++) {
           if (
              tr[i].classList.length > 2) {
              trs.push(tr[i]);
           }
        }
        for (var i = 0; i < this.currentView.components.length; i++) {
           if (
              this.selections[0].childId ===
              this.currentView.components[i].id
           ) {
                this.currentView.components[i].config[data][input][index] = e.target.value
           }
        }
     }
     
    
   deleteTagForChart(type:any, index:any){
    var chartType = ''
    if(type == 'lineChart'){
        chartType = 'lineChartData'
    }
    else{
        chartType = 'barChartData'
    }
    for (var i = 0; i < this.hmi.views.length; i++) {
       if(this.currentView.id === this.hmi.views[i].id){
          for (var ii = 0; ii < this.currentView.components.length; ii++) {
             if(this.currentView.components[ii].id === this.selections[0].childId){
                this.currentView.components[ii].config[chartType]["names"].splice(index, 1)
                this.currentView.components[ii].config[chartType]["tags"].splice(index, 1)
                this.currentView.components[ii].config[chartType]["tagValues"].splice(index, 1)
                this.currentView.components[ii].config[chartType]["colors"].splice(index, 1)
                this.generateTable()            
             }
          }
       }
    }
 }

 openTextArea(data:any, tabIndex:any, property:any, i:any) {
    if(tabIndex == 0 && property == 'Text'){
        return
    }
    const dialogRef = this.dialog.open(propertiesFunctionModal, {
      width: '630px',
      panelClass: 'propertiesFunctionModal',
      data: { type: property, data: data['data'] }
    });

    dialogRef.afterClosed().subscribe(result => {
        //data = result
        var d = String(result).replace(/\n/g, '+')
        data['data'] = d
        this.onParamChange(data)
      });
  }
}