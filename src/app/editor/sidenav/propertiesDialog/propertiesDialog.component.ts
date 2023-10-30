import {
   Component,
   OnInit,
   Input,
   Output,
   EventEmitter,
   SimpleChanges,
   ViewEncapsulation,
   ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogImageManager } from '../../dialogs/index';
import { HMIComponents, PropertiesTabs } from '../../../models/components';
import { HistoryService } from '../../history/history.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DbDataService } from 'src/app/db-data.service';

@Component({
   selector: 'e-sidenav-propertiesDialog',
   templateUrl: './propertiesDialog.component.html',
   styleUrls: ['./propertiesDialog.component.scss'],
   encapsulation: ViewEncapsulation.None,
})
export class Editor_SidenavDialogProperties implements OnInit {
   @ViewChild('tabGroup', { static: true }) tabGroup: any;
   @Input() hmi: any;
   @Input() selections: any;
   @Input() currentView: any;
   @Output() imgSelected: EventEmitter<any> = new EventEmitter(true);

   currentParameters: number = 0;
   properties: Array<any> = [];

   displayedColumns: string[] = ['name', 'parameter'];
   displayedColumns2: string[] = ['parameter'];

   dataSource: any = new MatTableDataSource();
   keyboardDataSource: any = new MatTableDataSource();
   keypadDataSource: any = new MatTableDataSource();
   lineChartDataSource:any
   barChartDataSource:any
   xAxis:any = []
   chartData:any = []

   selectedCompID!: string;
   matTabIndex: number = 0;
   matTabKeyIndex: number = 0;

   matTabNames:any = [];
   elementTags:any = [];
   elementTagValues:any = [];
   elementKeyBoardOrKeyPad:any = [];
   isOpen = false;

   config!: {
      currentView: any;
      selections: any;
      hmi: any;
      trackBy: any;
      onEdition: any;
   };

   displayedColumns3: string[] = ['name', 'delete'];
   displayedFields: string[] = ['name'];
   myformArray:any = new FormArray([]);
   dataSource2: any;
   counter = 0;

   keyboardTableBackgroundColor!: string;
   keypadTableBackgroundColor!: string;
   keyboardTableFontColor!: string;
   keypadTableFontColor!: string;
   keyboardTableBorderStyle!: string;
   keyboardTableBorderColor!: string;
   keyboardTableBorderWidth!: number;
   keypadTableBorderStyle!: string;
   keypadTableBorderColor!: string;
   keypadTableBorderWidth!: number;
   keyboardProperties = [
      {
         propertyName: 'backgroundColor',
         data: '#ffffff',
         dataType: null,
         editable: true,
         formOptions: null,
         formType: 'color',
         placeholder: 'null',
         suffix: null,
         textarea: false,
         viewName: 'Background Color',
      },
      {
         propertyName: 'border',
         viewName: 'Borders',
         data: 'solid #000000 2px',
         formType: 'borders',
         formOptions: { style: ['none', 'dashed', 'dotted', 'solid'] },
         placeholder: null,
         dataType: null,
         editable: true,
         suffix: { width: 'px', corners: 'px' },
      },
   ];
   keypadProperties = [
      {
         propertyName: 'backgroundColor',
         data: '#ffffff',
         dataType: null,
         editable: true,
         formOptions: null,
         formType: 'color',
         placeholder: 'null',
         suffix: null,
         textarea: false,
         viewName: 'Background Color',
      },
      {
         propertyName: 'border',
         viewName: 'Borders',
         data: 'solid #000000 2px',
         formType: 'borders',
         formOptions: { style: ['none', 'dashed', 'dotted', 'solid'] },
         placeholder: null,
         dataType: null,
         editable: true,
         suffix: { width: 'px', corners: 'px' },
      },
   ];

   showWarning = false
   paginate = false
   rowPerPage = 10

   constructor(public dialog: MatDialog, public history: HistoryService, public dbDataService: DbDataService) {
    }

   applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
   }

   ngOnInit() {
      this.renderTabs();
      this.generateTable();
      this.counter = this.displayedFields.length;
      for (var i = 0; i < this.config.hmi.views.length; i++) {
         if (this.config.hmi.views[i].name == 'keyboardTable') {
            this.keyboardTableBackgroundColor =
               this.config.hmi.views[i].config.style['backgroundColor'];
            this.keyboardTableBorderStyle =
               this.config.hmi.views[i].config.style['borderStyle'];
            this.keyboardTableBorderColor =
               this.config.hmi.views[i].config.style['borderColor'];
            this.keyboardTableBorderWidth =
               this.config.hmi.views[i].config.style['borderWidth.px'];
            this.keyboardProperties[0]['data'] = this.config.hmi.views[i].config.style['backgroundColor']
            this.keyboardProperties[1]['data'] = this.config.hmi.views[i].config.style['borderStyle'] + " " +
               this.config.hmi.views[i].config.style['borderColor'] + " " + this.config.hmi.views[i].config.style['borderWidth.px']

            this.keyboardDataSource = new MatTableDataSource(this.keyboardProperties);
         }
         else if (this.config.hmi.views[i].name == 'keypadTable') {
            this.keypadTableBackgroundColor =
               this.config.hmi.views[i].config.style['backgroundColor'];
            this.keypadTableBorderStyle =
               this.config.hmi.views[i].config.style['borderStyle'];
            this.keypadTableBorderColor =
               this.config.hmi.views[i].config.style['borderColor'];
            this.keypadTableBorderWidth =
               this.config.hmi.views[i].config.style['borderWidth.px'];
            this.keypadProperties[0]['data'] = this.config.hmi.views[i].config.style['backgroundColor']
            this.keypadProperties[1]['data'] = this.config.hmi.views[i].config.style['borderStyle'] + " " +
               this.config.hmi.views[i].config.style['borderColor'] + " " + this.config.hmi.views[i].config.style['borderWidth.px']
            this.keypadDataSource = new MatTableDataSource(this.keypadProperties);
         }
      }
   }

   ngAfterViewInit() {
      this.matTabIndex = this.tabGroup.selectedIndex;
   }

   ngOnChanges(changes: SimpleChanges) {
      if (this.config.selections.length > 0 && this.config.selections[0].hasOwnProperty('childId')) {
         if (
            this.config.selections.length > 0 &&
            this.config.selections[0].hasOwnProperty('childId')
         ) {
            if (this.selectedCompID !== this.config.selections[0].childId) {
               //generate a new table for properties if the component is different
               this.renderTabs();
               this.generateTable();
               this.config.onEdition.emit(false);
            } else {
               //we update the current values of the component in the properties panel
               for (var i = 0; i < this.dataSource.data.length; i++) {
                  if (this.dataSource.data[i]['propertyName'] === 'w') {
                     this.dataSource.data[i]['data'] =
                        this.config.selections[0].width;
                  }
                  if (this.dataSource.data[i]['propertyName'] === 'h') {
                     this.dataSource.data[i]['data'] =
                        this.config.selections[0].height;
                  }
                  if (this.dataSource.data[i]['propertyName'] === 'x') {
                     this.dataSource.data[i]['data'] =
                        this.config.selections[0].x1;
                  }
                  if (this.dataSource.data[i]['propertyName'] === 'y') {
                     this.dataSource.data[i]['data'] =
                        this.config.selections[0].y1;
                  }
                  if (
                     this.dataSource.data[i]['propertyName'] === 'rotationAngle'
                  ) {
                     this.dataSource.data[i]['data'] =
                        this.config.selections[0].rotationAngle;
                  }
               }
            }
         }
      }
      else if (this.config.selections.length === 0) {
         this.generateTable();
      }
   }

   generateTable() {
      this.properties = [];
      this.selectedCompID = this.config.selections[0]['childId'];

      if (this.config.selections.length > 0) {
         for (var i = 0; i < this.config.currentView.components.length; i++) {
            if (this.config.selections[0].childId === this.config.currentView.components[i].id) {
               let folder = 'root';
               let propertiesFolders = {};
               let hmiComponents: any = new HMIComponents();

               if (hmiComponents.hasOwnProperty(this.config.currentView.components[i].type)) {
                  propertiesFolders = hmiComponents[this.config.currentView.components[i].type].properties;
               }
               this.iterate(
                  this.config.currentView.components[i],
                  folder,
                  propertiesFolders,
                  this.config.currentView.components[i]
               );
            }
            if (
               this.config.selections[0].type === 'table' &&
               this.config.selections[0].childId == this.config.currentView.components[i].id &&
               this.matTabIndex === 3
            ) {
               setTimeout(() => (this.counter = this.displayedFields.length), 400);
               this.myformArray.clear();
               this.elementTags = [];
               this.elementTagValues = [];
               this.elementKeyBoardOrKeyPad = [];
               this.paginate = this.config.currentView.components[i].config['matrix']['pagination']
               this.rowPerPage = this.config.currentView.components[i].config['matrix']['rowPerPage']
               this.displayedColumns3 = this.config.currentView.components[i].config['matrix']['columns'];
               this.displayedColumns3 = [...this.displayedColumns3, 'delete'];
               this.displayedFields = this.config.currentView.components[i].config['matrix']['columns'];
               this.elementKeyBoardOrKeyPad = this.config.currentView.components[i].config['matrix']['elementKeyBoardOrKeyPad']
               for (var j = 0; j < this.config.currentView.components[i].config['matrix']['elementTags'].length; j++) {
                  var obj: any = {};
                  for (const [key, value] of Object.entries(this.config.currentView.components[i].config['matrix']['elementTags'][j])) {
                     obj[key] = new FormControl(value);
                  }

                  this.myformArray.push(new FormGroup(obj));
               }
               var tds = document.getElementsByTagName('td');
               var index = 0;
               var indexx = 0;
               setTimeout(
                  (s:any) => {
                     tds = document.getElementsByTagName('td');
                     for (var y = 0; y < tds.length; y++) {
                        for (var j = 0; j < tds[y].children.length; j++) {
                           if (
                              tds[y].children[j].tagName == 'BUTTON' &&
                              tds[y].children[j].firstChild!.nodeName == 'I'
                           ) {
                              indexx = Math.floor(index / 2);
                              var rowLength = this.config.currentView.components[s].config['matrix']['elementKeyBoardOrKeyPad'][0].length;
                              var indexxx = indexx + 1;
                              var row = Math.floor(indexxx / (rowLength + 1));
                              var pos = indexxx - rowLength * row - 1;
                              if (
                                 this.config.currentView.components[s].config[
                                 'matrix'
                                 ]['elementKeyBoardOrKeyPad'][row][pos] ==
                                 tds[y].children[j].getAttribute('mattooltip')
                              ) {
                                 tds[y].children[j].setAttribute(
                                    'style',
                                    'background-color: #999999c4; border-width: 2px; border-color: black; border-radius: 3px;'
                                 );
                              }
                              index = index + 1;
                           }
                        }
                     }
                  },
                  100,
                  i
               );
               this.dataSource2 = this.myformArray.controls;
               for (var m = 0; m < this.dataSource2.length; m++) {
                  this.elementTags.push(this.dataSource2[m].value);
                  this.elementTagValues.push(this.dataSource2[m].value);
               }
            }
            else if (
               this.config.selections[0].type === 'lineChart' &&
               this.config.selections[0].childId == this.config.currentView.components[i].id &&
               this.matTabIndex === 3
            ) {
               this.myformArray.clear();
               for (var j = 0; j < this.config.currentView.components[i].config['lineChartData']['tags'].length; j++) {
                  var obj:any = {};
                  obj["name"] = new FormControl(this.config.currentView.components[i].config['lineChartData']['names'][j]);
                  obj["tag"] = new FormControl(this.config.currentView.components[i].config['lineChartData']['tags'][j]);
                  obj["color"] = new FormControl(this.config.currentView.components[i].config['lineChartData']['colors'][j]);
                  this.myformArray.push(new FormGroup(obj));
               }
               this.lineChartDataSource = [...this.myformArray.controls]
            }
            else if (
               this.config.selections[0].type === 'barChart' &&
               this.config.selections[0].childId == this.config.currentView.components[i].id &&
               this.matTabIndex === 3
            ) {
               this.myformArray.clear();
               for (var j = 0; j < this.config.currentView.components[i].config['barChartData']['tags'].length; j++) {
                  var obj:any = {};
                  obj["name"] = new FormControl(this.config.currentView.components[i].config['barChartData']['names'][j]);
                  obj["tag"] = new FormControl(this.config.currentView.components[i].config['barChartData']['tags'][j]);
                  obj["color"] = new FormControl(this.config.currentView.components[i].config['barChartData']['colors'][j]);
                  this.myformArray.push(new FormGroup(obj));
               }
               this.barChartDataSource = [...this.myformArray.controls]
            }
         }
      }
      if (this.properties.length > 0) {
         this.dataSource = new MatTableDataSource(this.properties);
      } else {
         this.dataSource = new MatTableDataSource([]);
      }
      if( this.config.selections[0].type === 'table' &&
      this.matTabIndex === 3)setTimeout(() => this.keyUpdated(), 100)
   }

   setPaginate(){
      this.paginate =!this.paginate
      this.save()
   }

   setPaginateNumber(e: any){
      this.rowPerPage = e.target.value
      this.save()
   }

   renderTabs() {
      for (var i = 0; i < this.config.currentView.components.length; i++) {
         if (
            this.config.selections[0].childId ===
            this.config.currentView.components[i].id
         ) {
            let propertiesFolders: any = {};
            let folders: any = [];
            let hmiComponents: any = new HMIComponents();
            let propTabs:any = new PropertiesTabs();

            if (hmiComponents.hasOwnProperty(this.config.currentView.components[i].type)) {
               propertiesFolders =
                  hmiComponents[this.config.currentView.components[i].type]
                     .properties;
            }

            for (var folderName in propertiesFolders) {
               folders.push(folderName);
            }
            folders = Array.from(new Set(folders));

            let tabs = [];
            for (var index in folders) {
               if (
                  folders[index] === 'root' ||
                  folders[index] === 'config' ||
                  folders[index] === 'style'
               ) {
                  tabs.push('general');
               } else {
                  tabs.push(folders[index]);
               }
            }
            tabs = Array.from(new Set(tabs));

            this.matTabNames = [];
            for (var index in tabs) {
               if (propTabs.hasOwnProperty(tabs[index]))
                  this.matTabNames.push(propTabs[tabs[index]]);
            }
         }
      }
   }

   iterate = (obj:any, folder:any, propertiesFolders:any, component:any) => {
      Object.keys(obj).forEach((key) => {
         if (this.matTabIndex === 0 && folder === 'root') {
            let propertyField = this.formType(
               key,
               obj[key],
               folder,
               propertiesFolders
            );
            if (propertyField !== undefined)
               this.properties.push(propertyField);
         } else if (folder === 'style' && this.matTabIndex === 0) {
            let propertyField = this.formType(
               key,
               obj[key],
               folder,
               propertiesFolders
            );
            if (propertyField !== undefined)
               this.properties.push(propertyField);
         } else if (folder === 'config' && this.matTabIndex === 0) {
            let propertyField = this.formType(
               key,
               obj[key],
               folder,
               propertiesFolders
            );
            if (propertyField !== undefined)
               this.properties.push(propertyField);
         } else if (folder === 'animation' && this.matTabIndex === 1) {
            let loadProperty = function (formType:any, properties:any) {
               let propertyField = formType(
                  key,
                  obj[key],
                  folder,
                  propertiesFolders
               );
               if (propertyField !== undefined) properties.push(propertyField);
            };
            // The following makes sure to only display specific properties based on the behavior
            if (component.config.hasOwnProperty('behavior')) {
               if (
                  propertiesFolders['animation'][key].hasOwnProperty('behavior')
               ) {
                  if (
                     propertiesFolders['animation'][key]['behavior'] ===
                     component.config.behavior
                  ) {
                     loadProperty(this.formType, this.properties);
                  }
               } else {
                  loadProperty(this.formType, this.properties);
               }
            } else {
               loadProperty(this.formType, this.properties);
            }
         } else if (folder === 'events' && this.matTabIndex === 2) {
            let loadProperty = function (formType:any, properties:any) {
               let propertyField = formType(
                  key,
                  obj[key],
                  folder,
                  propertiesFolders
               );
               if (propertyField !== undefined) properties.push(propertyField);
            };

            // The following makes sure to only display specific properties based on the behavior
            if (component.config.hasOwnProperty('behavior')) {
               if (
                  propertiesFolders['events'][key]['behavior'] ===
                  component.config.behavior
               ) {
                  loadProperty(this.formType, this.properties);
               }
            } else {
               loadProperty(this.formType, this.properties);
            }
         } else if (folder === 'varReplacement' && this.matTabIndex === 3) {
            this.properties.push(obj[key]);
         } else if (folder === 'options' && this.matTabIndex === 3) {
            this.properties.push(obj[key]);
         } else if (folder === 'logic' && this.matTabIndex === 3) {
            let propertyField = this.formType(
               key,
               obj[key],
               folder,
               propertiesFolders
            );
            if (propertyField !== undefined)
               this.properties.push(propertyField);
         }

         if (typeof obj[key] === 'object') {
            if(folder == "lineChartData" || folder == 'barChartData') return
            this.iterate(obj[key], key, propertiesFolders, component);
         }
      });
   };

   formType(propertyName:any, data:any, folder:any, propertiesFolders:any): any {
      if (
         propertiesFolders.hasOwnProperty(folder) &&
         propertiesFolders[folder].hasOwnProperty(propertyName)
      ) {
         if (data.hasOwnProperty('function')) {
            propertiesFolders[folder][propertyName]['data'] = data['function'];
            propertiesFolders[folder][propertyName]['formOptions'][
               'defaultTimeout'
            ] = data['timeoutVal'];
         } else {
            propertiesFolders[folder][propertyName]['data'] = data;
         }

         if (propertiesFolders[folder][propertyName]['formType'] !== null) {
            return propertiesFolders[folder][propertyName];
         } else {
            return undefined;
         }
      }
   }

   onParamChange(element:any) {
      for (var i = 0; i < this.config.currentView.components.length; i++) {
         if (
            this.config.selections[0].childId ===
            this.config.currentView.components[i].id
         ) {
            let propertiesComp = this.config.currentView.components[i];

            if (element['folder'] === 'root') {
               this.saveParamChange(propertiesComp, element);
            } else if (element['folder'] === 'config') {
               this.saveParamChange(propertiesComp['config'], element);
            } else if (element['folder'] === 'style') {
               this.saveParamChange(propertiesComp['config']['style'], element);
            } else if (element['folder'] === 'events') {
               this.saveParamChange(propertiesComp['events'], element);
            } else if (element['folder'] === 'animation') {
               this.saveParamChange(propertiesComp['animation'], element);
            } else if (element['folder'] === 'logic') {
               this.saveParamChange(propertiesComp['logic'], element);
            }
         }
      }
   }

   saveParamChange(obj:any, element:any) {
      let propertyName = element.propertyName;
      let propertyData = element.data;
      let dataType = element.dataType;

      if (dataType === 'number' && propertyData !== '') {
         propertyData = parseInt(propertyData);
      } else if (dataType === 'number' && propertyData === '') {
         propertyData = obj[propertyName];
      }
      if (propertyName === 'timeout') {
         propertyData = {
            function: element.data,
            timeoutVal: parseInt(element.formOptions.defaultTimeout),
         };
      }

      if (propertyName === 'x' && !isNaN(propertyData)) {
         this.config.selections[0].x =
            this.config.selections[0].x +
            (parseInt(propertyData) - obj[propertyName]);
         this.config.selections[0].x1 =
            this.config.selections[0].x1 +
            (parseInt(propertyData) - obj[propertyName]);
      }
      if (propertyName === 'y' && !isNaN(propertyData)) {
         this.config.selections[0].y =
            this.config.selections[0].y +
            (parseInt(propertyData) - obj[propertyName]);
         this.config.selections[0].y1 =
            this.config.selections[0].y1 +
            (parseInt(propertyData) - obj[propertyName]);
      }

      if (obj[propertyName] !== propertyData) {
         obj[propertyName] = propertyData;
         this.history.sendToHistory(this.config.hmi);
      } else {
         obj[propertyName] = propertyData;
      }
      if (propertyName === 'h')
         this.config.selections[0].height = parseInt(propertyData);
      if (propertyName === 'w')
         this.config.selections[0].width = parseInt(propertyData);
      if (propertyName === 'rotationAngle')
         this.config.selections[0].rotationAngle = parseFloat(propertyData);
   }

   /**
    * Image manager
    */
   imageManager(element: any) {
      this.onEdit(true, false);
      let dialogRef = this.dialog.open(DialogImageManager, {
         position: {},
         data: { cmptProperties: element },
         height: '800px',
         width: '800px',
         panelClass: 'imageManager-container',
      });

      dialogRef.afterClosed().subscribe((result) => {
         if (result) {
            element.data.url = result['imgSelected'].url;
            element.data.name = result['imgSelected'].name;
            element.data.imgId = result['imgSelected'].id;

            this.onParamChange(element);
         }
         this.onEdit(false, false);
      });
   }

   onEdit(event: any, menu: any) {
      if (event === true) {
         this.config.onEdition.emit(true);
      } else if (event === false && menu === false) {
         this.config.onEdition.emit(false);
      }
   }

   removeImage(element: any) {
      element.data.url = '/assets/images/NoImage.png';
      element.data.name = undefined;
      element.data.imgId = undefined;
   }

   deleteParam(element: any, index: any) {
      for (var i = 0; i < this.config.hmi.views.length; i++) {
         if (this.config.currentView.id === this.config.hmi.views[i].id) {
            for (
               var ii = 0;
               ii < this.config.currentView.components.length;
               ii++
            ) {
               if (
                  this.config.currentView.components[ii].id ===
                  this.config.selections[0].childId
               ) {
                  delete this.config.currentView.components[ii].config.style[
                     element.propertyName
                  ];
                  delete this.config.hmi.views[i].components[ii].config.style[
                     element.propertyName
                  ];

                  this.generateTable();

                  this.iterate2(this.config.hmi.views[i].components[ii]);
               }
            }
         }
      }
   }

   addTag() {
      if (this.matTabIndex === 3) {
         for (var i = 0; i < this.config.hmi.views.length; i++) {
            if (this.config.currentView.id === this.config.hmi.views[i].id) {
               for (
                  var ii = 0;
                  ii < this.config.currentView.components.length;
                  ii++
               ) {
                  if (
                     this.config.currentView.components[ii].id ===
                     this.config.selections[0].childId
                  ) {
                     if (
                        this.config.currentView.components[
                           ii
                        ].config.hasOwnProperty('varReplacement')
                     ) {
                        this.config.currentView.components[ii].config[
                           'varReplacement'
                        ].push({ var: 'Tag name', value: '' });
                        this.generateTable();
                     } else {
                        this.config.currentView.components[ii].config[
                           'varReplacement'
                        ] = [];

                        this.config.currentView.components[ii].config[
                           'varReplacement'
                        ].push({ var: 'Tag name', value: '' });
                        this.generateTable();
                     }
                  }
               }
            }
         }
      }
   }

   addTagForOptions() {
      if (this.matTabIndex === 3) {
         for (var i = 0; i < this.config.hmi.views.length; i++) {
            if (this.config.currentView.id === this.config.hmi.views[i].id) {
               for (
                  var ii = 0;
                  ii < this.config.currentView.components.length;
                  ii++
               ) {
                  if (
                     this.config.currentView.components[ii].id ===
                     this.config.selections[0].childId
                  ) {
                     if (
                        this.config.currentView.components[
                           ii
                        ].config.hasOwnProperty('options')
                     ) {
                        this.config.currentView.components[ii].config[
                           'options'
                        ].push({ value: '' });
                        this.generateTable();
                     } else {
                        this.config.currentView.components[ii].config[
                           'options'
                        ] = [];

                        this.config.currentView.components[ii].config[
                           'options'
                        ].push({ value: '' });
                        this.generateTable();
                     }
                  }
               }
            }
         }
      }
   }

   deleteTag(element: any, index: any) {
      for (var i = 0; i < this.config.hmi.views.length; i++) {
         if (this.config.currentView.id === this.config.hmi.views[i].id) {
            for (
               var ii = 0;
               ii < this.config.currentView.components.length;
               ii++
            ) {
               if (
                  this.config.currentView.components[ii].id ===
                  this.config.selections[0].childId
               ) {
                  for (var index1 in this.config.currentView.components[ii]
                     .config['varReplacement']) {
                     if (
                        this.config.currentView.components[ii].config[
                        'varReplacement'
                        ][index1]['var'] === element['var']
                     ) {
                        this.config.currentView.components[ii].config[
                           'varReplacement'
                        ].splice(index1, 1);
                        //this.config.hmi.views[i].components[ii].config['varReplacement'].splice(index1, 1)
                     }
                  }
                  this.generateTable();
               }
            }
         }
      }
   }

   deleteTagForOptions(element: any, index: any) {
      for (var i = 0; i < this.config.hmi.views.length; i++) {
         if (this.config.currentView.id === this.config.hmi.views[i].id) {
            for (
               var ii = 0;
               ii < this.config.currentView.components.length;
               ii++
            ) {
               if (
                  this.config.currentView.components[ii].id ===
                  this.config.selections[0].childId
               ) {
                  for (var index1 in this.config.currentView.components[ii]
                     .config['options']) {
                     if (
                        this.config.currentView.components[ii].config[
                        'options'
                        ][index1]['value'] === element['value']
                     ) {
                        this.config.currentView.components[ii].config[
                           'options'
                        ].splice(index1, 1);
                        //this.config.hmi.views[i].components[ii].config['varReplacement'].splice(index1, 1)
                     }
                  }
                  this.generateTable();
               }
            }
         }
      }
   }

   onTagChange() {
      for (var i = 0; i < this.config.hmi.views.length; i++) {
         if (this.config.currentView.id === this.config.hmi.views[i].id) {
            for (
               var ii = 0;
               ii < this.config.currentView.components.length;
               ii++
            ) {
               if (
                  this.config.currentView.components[ii].id ===
                  this.config.selections[0].childId
               ) {
                  this.config.currentView.components[ii].config[
                     'varReplacement'
                  ] = this.dataSource.data;
               }
            }
         }
      }
   }

   onTagChangeForOptions() {
      for (var i = 0; i < this.config.hmi.views.length; i++) {
         if (this.config.currentView.id === this.config.hmi.views[i].id) {
            for (
               var ii = 0;
               ii < this.config.currentView.components.length;
               ii++
            ) {
               if (
                  this.config.currentView.components[ii].id ===
                  this.config.selections[0].childId
               ) {
                  this.config.currentView.components[ii].config['options'] =
                     this.dataSource.data;
               }
            }
         }
      }
   }

   iterate2 = (obj: any) => {
      Object.keys(obj).forEach((key) => {

         this.currentParameters = this.currentParameters + 1;

         if (typeof obj[key] === 'object') {
            this.iterate2(obj[key]);
         }
      });
   };

   AlignActive(data:any, align:any) {
      if (data === align) {
         return true;
      } else {
         return false;
      }
   }

   tabChanged(event:any) {
      this.matTabIndex = event.index;
      this.generateTable();
   }

   tabChangedKey(event:any) {
      this.matTabKeyIndex = event.index;
   }

   // update table in editor on blur of table header cell input
   updatedTable(e: any, index: any) {
      e.target.parentNode.children[0].style.display = "none"
      e.target.style.border = "1px solid black"
      this.myformArray.controls.forEach((group: FormGroup) => {
         for (const [ii, [key, value]] of Object.entries(
            Object.entries(group.value)
         )) {
            if (index == ii) {
               if (value == null) {
                  group.addControl(
                     this.displayedFields[index],
                     new FormControl('')
                  );
               } else {
                  group.addControl(
                     this.displayedFields[index],
                     new FormControl(group.value[key])
                  );
               }
               group.removeControl(key);
            }
         }
      });

      var updatedElementTags:any = [];
      var updatedElementTagValues:any = [];
      for (var i = 0; i < this.elementTags.length; i++) {
         updatedElementTags[i] = {};
         updatedElementTagValues[i] = {};
         for (const [j, [key, value]] of Object.entries(
            Object.entries(this.elementTags[i])
         )) {
            if (j == index) {
               updatedElementTags[i][this.displayedFields[index]] = value;
               updatedElementTagValues[i][this.displayedFields[index]] = value;
            } else {
               updatedElementTags[i][key] = value;
               updatedElementTagValues[i][key] = value;
            }
         }
      }
      this.elementTags = updatedElementTags;
      this.elementTagValues = updatedElementTagValues;
      this.save();
      this.displayedColumns3[index] = this.displayedFields[index];
      this.dataSource2 = this.myformArray.controls;
      this.generateTable();
   }

   escapeRegExp(string: any) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
   }

   replaceAll(str: any, find: any, replace: any) {
      return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
   }

   checkDuplicateColumn(e: any, index: any, columnTitle: any){
      if(e.key == "ArrowLeft" || e.key == "ArrowRight" || e.key == "ArrowUp" 
      ||e.key == "ArrowDown" || e.key == "Meta" || e.key == "Alt" || e.key == "Control" 
      || e.key == "Tab" || e.key == "Escape" || e.key == "F1" || e.key == "F2" || e.key == "F3" 
      || e.key == "F4" || e.key == "F5" || e.key == "F6" || e.key == "F7" || e.key == "F8"
      || e.key == "F9" || e.key == "F10" || e.key == "F11" || e.key == "F12" ){
         return
      }
      var str = e.target.value
      if(e.key == "Backspace"){
         // get input with backspace
         str = e.target.value.substring(0, e.target.selectionStart-1)+e.target.value.substring( e.target.selectionStart, e.target.value.length)
         
      }
      else if(e.key != "Backspace" && e.key != "Shift" && e.key != "Enter"){
         //get input
         str = columnTitle.slice(0, e.target.selectionStart) + e.key + columnTitle.slice(e.target.selectionStart);
      }
      // check to see if column name already exist
      for(var o = 0; o < this.displayedFields.length; o++){
         // show warning and prevent input of key
         if(str == this.displayedFields[o]){
            e.target.parentNode.children[0].style.display = "block"
            e.target.style.outline = "none"
            e.target.style.border = "medium solid red"
            this.showWarning = true
            e.preventDefault()
            return
         }
      }
      // no duplicate detected
      e.target.parentNode.children[0].style.display = "none"
      e.target.style.border = "1px solid black"
      this.displayedFields[index] = str;
   }

   changeColumnName(e:any, index:any, columnTitle:any) {
      for(var o = 0; o < this.displayedFields.length; o++){
         if(columnTitle == this.displayedFields[o]){
            e.target.value = e.target.value.substring(0,e.target.value.length-1)
            e.preventDefault()
            return
         }
      }
      this.displayedFields[index] = columnTitle;
   }

   addRow() {
      const newGroup = new FormGroup({});
      this.displayedFields.forEach((x) => {
         newGroup.addControl(x, new FormControl(''));
      });
      this.myformArray.push(newGroup);
      for (var p = 0; p < this.config.currentView.components.length; p++) {
         if (
            this.config.selections[0].childId ==
            this.config.currentView.components[p].id
         ) {
            var arrK:any = [];
            var obj:any = {};
            for (var l = 0; l < this.displayedFields.length; l++) {
               arrK.push('');
               obj[this.displayedFields[l]] = '';
            }
            this.elementKeyBoardOrKeyPad.push(arrK);
            this.elementTags.push(obj);
            this.elementTagValues.push(obj);
         }
      }
      this.save();
      this.dataSource2 = [...this.myformArray.controls];
   }

   addColumn() {
      this.counter = this.counter + 1;
      var newField = 'column ' + this.counter;
      for(var n = 0 ; n < this.displayedFields.length; n++){
         if(newField == this.displayedFields[n]){
            this.counter = this.counter + 1;
            newField = 'column ' + this.counter
         }
      }
      this.myformArray.controls.forEach((group: FormGroup) => {
         group.addControl(newField, new FormControl(''));
      });
      this.dataSource2 = [...this.myformArray.controls];
      this.displayedFields.push(newField);
      this.displayedColumns3 = [...this.displayedFields, 'delete'];
      for (var n = 0; n < this.elementTags.length; n++) {
         this.elementTags[n][newField] = '';
         this.elementTagValues[n][newField] = '';
         this.elementKeyBoardOrKeyPad[n].push('');
      }
      var td = document.getElementsByTagName('td');
      var tds:any = [];
      setTimeout(() => {
         for (var i = 0; i < td.length; i++) {
            if (
               td[i].classList.length > 3 &&
               !td[i].classList.contains('mat-column-delete')
            ) {
               tds.push(td[i]);
            }
         }
         for (var y = 0; y < tds.length; y++) {
            for (var j = 0; j < tds[y].children.length; j++) {
               if (
                  tds[y].children[j].tagName == 'BUTTON' &&
                  tds[y].children[j].firstChild.nodeName == 'I'
               ) {
                  var row = Math.floor(y / this.displayedFields.length);
                  var index = y % this.displayedFields.length;
                  if (
                     this.elementKeyBoardOrKeyPad[row][index] ==
                     tds[y].children[j].getAttribute('mattooltip')
                  ) {
                     tds[y].children[j].setAttribute(
                        'style',
                        'background-color: #999999c4; border-width: 2px; border-color: black; border-radius: 3px;'
                     );
                  }
               }
            }
         }
      }, 100);
      this.save()
   }

   deleteRow(index: number) {
      this.myformArray.removeAt(index);
      this.dataSource2 = [...this.myformArray.controls];
      this.elementTags.splice(index, 1);
      this.elementTagValues.splice(index, 1);
      this.elementKeyBoardOrKeyPad.splice(index, 1);
      this.save()
   }

   deleteColumn(columnName:any) {
      var arrayWithoutH = [];
      for (let i = 0; i < this.displayedFields.length; i++) {
         if (this.displayedFields[i] !== columnName.value) {
            arrayWithoutH.push(this.displayedFields[i]);
         }
      }
      this.displayedFields = arrayWithoutH;
      arrayWithoutH = [];
      for (let i = 0; i < this.displayedColumns3.length; i++) {
         if (this.displayedColumns3[i] !== columnName.value) {
            arrayWithoutH.push(this.displayedColumns3[i]);
         }
      }
      this.displayedColumns3 = arrayWithoutH;

      for (var i = 0; i < this.myformArray.value.length; i++) {
         if (this.myformArray.value[i].hasOwnProperty(columnName.value)) {
            delete this.myformArray.value[i][columnName.value];
         }
      }
      var tags = this.elementTags[0];
      for (var [index, [key, value]] of Object.entries(Object.entries(tags))) {
         if (key == columnName.value) {
            for (var u = 0; u < this.elementTags.length; u++) {
               delete this.elementTags[u][key];
               delete this.elementTagValues[u][key];
               this.elementKeyBoardOrKeyPad[u].splice(index, 1);
            }
         }
      }
      this.save();
      setTimeout(() => this.keyUpdated(), 100);
   }

   save() {
      for (var i = 0; i < this.config.currentView.components.length; i++) {
         if (
            this.config.selections[0].childId ===
            this.config.currentView.components[i].id
         ) {
            this.config.currentView.components[i].config['matrix']['columns'] =
               this.displayedFields;
            this.config.currentView.components[i].config['matrix'][
               'elementTags'
            ] = this.elementTags;
            this.config.currentView.components[i].config['matrix'][
               'elementTagValues'
            ] = this.elementTagValues;
            this.config.currentView.components[i].config['matrix'][
               'elementKeyBoardOrKeyPad'
            ] = this.elementKeyBoardOrKeyPad;
            this.config.currentView.components[i].config['matrix'][
               'pagination'
            ] = this.paginate;
            this.config.currentView.components[i].config['matrix'][
               'rowPerPage'
            ] = this.rowPerPage;
            console.log(
               this.config.currentView.components[i].config['matrix'][
               'columns'
               ],
               this.config.currentView.components[i].config['matrix'][
               'elementTags'
               ],
               this.config.currentView.components[i].config['matrix'][
               'elementTagValues'
               ],
               this.config.currentView.components[i].config['matrix'][
               'elementKeyBoardOrKeyPad'
               ],
               this.config.currentView.components[i].config['matrix'][
                  'pagination'
                  ],
                  this.config.currentView.components[i].config['matrix'][
                  'rowPerPage'
                  ]
            );
         }
      }
   }

   // when keypress on a table cell happens
   cellInput(e: any, col: any) {
      if (e.key == 'Backspace') {
         e.preventDefault();
      }
      if (e.key == 'Enter') {
         return;
      }
      var td = document.getElementsByTagName('td');
      var tds:any = [];
      for (var i = 0; i < td.length; i++) {
         if (
            td[i].classList.length > 3 &&
            !td[i].classList.contains('mat-column-delete')
         ) {
            tds.push(td[i]);
         }
      }
      let totalColumns = e.target.parentNode.parentNode.children.length - 1;
      for (var u = 0; u < tds.length; u++) {
         if (tds[u].innerHTML === e.srcElement.parentNode.innerHTML) {
            for (
               var ii = 0;
               ii < this.config.currentView.components.length;
               ii++
            ) {
               if (
                  this.config.selections[0].childId ===
                  this.config.currentView.components[ii].id
               ) {
                  var rowLength = Object.entries(this.elementTags[0]).length;
                  var index = u + 1;
                  var row = Math.floor(u / totalColumns);
                  this.elementTags[row][
                     this.displayedFields[
                     index -
                     totalColumns *
                     Math.floor((index - 1) / totalColumns) -
                     1
                     ]
                  ] = tds[u].children[0].value;
                  this.elementTagValues[row][
                     this.displayedFields[
                     index -
                     totalColumns *
                     Math.floor((index - 1) / totalColumns) -
                     1
                     ]
                  ] = tds[u].children[0].value;
                  if (this.elementTags[row].hasOwnProperty(undefined)) {
                     delete this.elementTags[row]['undefined'];
                  }
                  if (this.elementTagValues[row].hasOwnProperty(undefined)) {
                     delete this.elementTagValues[row]['undefined'];
                  }
                  this.save();
               }
            }
         }
      }
   }

   //when keyboard button is pressed
   keyboardSelected(e: any) {
      var td = document.getElementsByTagName('td');
      var tds = [];
      for (var i = 0; i < td.length; i++) {
         if (
            td[i].classList.length > 3 &&
            !td[i].classList.contains('mat-column-delete')
         ) {
            tds.push(td[i]);
         }
      }
      for (var u = 0; u < tds.length; u++) {
         if (
            tds[u].innerHTML === e.srcElement.parentNode.parentNode.innerHTML
         ) {
            for (
               var ii = 0;
               ii < this.config.currentView.components.length;
               ii++
            ) {
               if (
                  this.config.selections[0].childId ===
                  this.config.currentView.components[ii].id
               ) {
                  var rowLength = this.elementKeyBoardOrKeyPad[0].length;
                  var index = u + 1;
                  var row = Math.ceil(index / rowLength) - 1;
                  var pos = index - rowLength * row - 1;
                  if (this.elementKeyBoardOrKeyPad[row][pos] == 'Keyboard') {
                     this.elementKeyBoardOrKeyPad[row][pos] = '';
                     e.srcElement.parentNode.setAttribute('style', '');
                  } else {
                     this.elementKeyBoardOrKeyPad[row][pos] = 'Keyboard';
                     e.srcElement.parentNode.parentNode.children[2].setAttribute(
                        'style',
                        ''
                     );
                     e.srcElement.parentNode.setAttribute(
                        'style',
                        'background-color: #999999c4; border-width: 2px; border-color: black; border-radius: 3px;'
                     );
                  }
               }
            }
         }
      }
   }

   //when keypad button is pressed
   keypadSelected(e: any) {
      var td = document.getElementsByTagName('td');
      var tds = [];
      for (var i = 0; i < td.length; i++) {
         if (
            td[i].classList.length > 3 &&
            !td[i].classList.contains('mat-column-delete')
         ) {
            tds.push(td[i]);
         }
      }
      for (var u = 0; u < tds.length; u++) {
         if (
            tds[u].innerHTML === e.srcElement.parentNode.parentNode.innerHTML
         ) {
            for (
               var ii = 0;
               ii < this.config.currentView.components.length;
               ii++
            ) {
               if (
                  this.config.selections[0].childId ===
                  this.config.currentView.components[ii].id
               ) {
                  var rowLength = this.elementKeyBoardOrKeyPad[0].length;
                  var index = u + 1;
                  var row = Math.ceil(index / rowLength) - 1;
                  var pos = index - rowLength * row - 1;
                  if (this.elementKeyBoardOrKeyPad[row][pos] == 'Keypad') {
                     this.elementKeyBoardOrKeyPad[row][pos] = '';
                     e.srcElement.parentNode.setAttribute('style', '');
                  } else {
                     this.elementKeyBoardOrKeyPad[row][pos] = 'Keypad';
                     e.srcElement.parentNode.parentNode.children[1].setAttribute(
                        'style',
                        ''
                     );
                     e.srcElement.parentNode.setAttribute(
                        'style',
                        'background-color: #999999c4; border-width: 1px; border-color: black; border-radius: 3px;'
                     );
                  }
               }
            }
         }
      }
   }

   // show buttons selected
   keyUpdated() {
      var td = document.getElementsByTagName('td');
      var tds = [];
      for (var i = 0; i < td.length; i++) {
         if (
            td[i].classList.length > 3 &&
            !td[i].classList.contains('mat-column-delete')
         ) {
            tds.push(td[i]);
         }
      }
      for (var u = 0; u < tds.length; u++) {
         for (var ii = 0; ii < this.config.currentView.components.length; ii++) {
            if (
               this.config.selections[0].childId ===
               this.config.currentView.components[ii].id
            ) {
               var rowLength = this.elementKeyBoardOrKeyPad[0].length;
               var index = u + 1;
               var row = Math.ceil(index / rowLength) - 1;
               var pos = index - rowLength * row - 1;
               if (this.elementKeyBoardOrKeyPad[row][pos] == 'Keypad') {
                  tds[u].children[1].setAttribute('style', '');
                  tds[u].children[2].setAttribute(
                     'style',
                     'background-color: #999999c4; border-width: 1px; border-color: black; border-radius: 3px;'
                  );
               } else if (
                  this.elementKeyBoardOrKeyPad[row][pos] == 'Keyboard'
               ) {
                  tds[u].children[1].setAttribute(
                     'style',
                     'background-color: #999999c4; border-width: 1px; border-color: black; border-radius: 3px;'
                  );
                  tds[u].children[2].setAttribute('style', '');
               } else {
                  tds[u].children[1].setAttribute('style', '');
                  tds[u].children[2].setAttribute('style', '');
               }
            }
         }
      }
   }
   prevTime = 0
   //update table in editor
   ngAfterViewChecked() {
      if(Math.round(Date.now() / 1000) % 1 == 0 && this.prevTime != Math.round(Date.now() / 1000)){
         for (var i = 0; i < this.config.hmi.views.length; i++) {
            if (this.config.hmi.views[i].name == 'keyboardTable') {
               if (this.matTabIndex == 3 && this.selectedCompID.substring(0, 3) == 'tbl') {
                  this.config.hmi.views[i].config.style['backgroundColor'] =
                     this.keyboardDataSource.data[0]['data'];
                  this.config.hmi.views[i].config.style['borderStyle'] =
                     this.keyboardDataSource.data[1]['data'].split(' ')[0];
                  this.config.hmi.views[i].config.style['borderColor'] =
                     this.keyboardDataSource.data[1]['data'].split(' ')[1];
                  this.config.hmi.views[i].config.style['borderWidth.px'] = Number(this.keyboardDataSource.data[1]['data'].split(' ')[2])
               }
            }
            else if (this.config.hmi.views[i].name == 'keypadTable') {
               if (this.matTabIndex == 3 && this.selectedCompID.substring(0, 3) == 'tbl') {
                  this.config.hmi.views[i].config.style['backgroundColor'] =
                     this.keypadDataSource.data[0]['data'];
                  this.config.hmi.views[i].config.style['borderStyle'] =
                     this.keypadDataSource.data[1]['data'].split(' ')[0];
                  this.config.hmi.views[i].config.style['borderColor'] =
                     this.keypadDataSource.data[1]['data'].split(' ')[1];
                  this.config.hmi.views[i].config.style['borderWidth.px'] =
                     this.keypadDataSource.data[1]['data'].split(' ')[2];
               }
            }
         }
         this.prevTime = Math.round(Date.now() / 1000)
      }
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
         for (var i = 0; i < this.config.hmi.views.length; i++) {
            if (this.config.currentView.id === this.config.hmi.views[i].id) {
               for (
                  var ii = 0;
                  ii < this.config.currentView.components.length;
                  ii++
               ) {
                  if (
                     this.config.currentView.components[ii].id ===
                     this.config.selections[0].childId
                  ) {
                     if(this.config.currentView.components[ii].config[chartType][
                        'tags'].length < 9){
                        this.config.currentView.components[ii].config[chartType][
                           'tags'][this.config.currentView.components[ii].config[chartType][
                              'tags'].length] = ""
                        this.config.currentView.components[ii].config[chartType][
                           'tagValues'][this.config.currentView.components[ii].config[chartType][
                              'tags'].length-1] = 0
                        this.config.currentView.components[ii].config[chartType][
                           'colors'][this.config.currentView.components[ii].config[chartType][
                              'tags'].length-1] = "#000000"
                     }
                     else{
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
      for (var i = 0; i < this.config.currentView.components.length; i++) {
         if (
            this.config.selections[0].childId ===
            this.config.currentView.components[i].id
         ) {
               this.config.currentView.components[i].config[data][input][index] = e.target.value
         }
      }
   }

   onParamChangee(type: any, element: any, index: any){
      if(type == 'lineChart'){
          for (var i = 0; i < this.config.currentView.components.length; i++) {
              if (this.config.selections[0].childId === this.config.currentView.components[i].id) {
                  let colors = this.config.currentView.components[i].config.lineChartData.colors 
                  colors[index] = element.color    
                  this.history.sendToHistory(this.hmi)                
              }
          }
      }else if(type == 'barChart'){
          for (var i = 0; i < this.config.currentView.components.length; i++) {
              if (this.config.selections[0].childId === this.config.currentView.components[i].id) {
                  let colors = this.config.currentView.components[i].config.barChartData.colors 
                  colors[index] = element.color
                  this.history.sendToHistory(this.hmi)                
              }
          }
      }   
  }

  deleteTagForChart(type: any, index: any){
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
}
