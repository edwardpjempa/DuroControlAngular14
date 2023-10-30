import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { PortalModule } from '@angular/cdk/portal';
import { CdkTreeModule } from '@angular/cdk/tree';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import {NgApexchartsModule} from 'ng-apexcharts';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { MatBadgeModule } from '@angular/material/badge';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { MatNativeDateModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MainNavComponent } from './main-nav/main-nav.component';
import { EipTagsConfigComponent } from './eip-tags-config/eip-tags-config.component';
import { MbtcpClientConfigComponent } from './mbtcp-client-config/mbtcp-client-config.component';
import { ModuleConfigComponent } from './module-config/module-config.component';
import { EditableFieldComponent } from './components/editable-field/editable-field.component';
import { ViewModeDirective } from './components/editable-field/view-mode.directive';
import { EditModeDirective } from './components/editable-field/edit-mode.directive';
import { EditableOnEnterDirective } from './components/editable-field/editable-on-enter.directive';
import { DatabaseComponent } from './database/database.component';
import { TreeTableRowComponent } from './database/tree-table-row/tree-table-row.component';
import { TreeTableComponent } from './database/tree-table/tree-table.component';
import { LogicConfigComponent } from './logic-config/logic-config/logic-config.component';
import { SidenavResizeComponent } from './components/sidenav-resize/sidenav-resize.component';
import { DatabaseViewHeaderComponent } from './database/databaseview/database-view-header/database-view-header.component';
import { DatabaseViewRowComponent } from './database/databaseview/database-view-row/database-view-row.component';
import { DatabaseViewComponent } from './database/databaseview/database-view/database-view.component';

import { EditorComponent } from './editor/editor.component';
import { DialogDocProperty, DialogDocName, DialogDocDelete, DialogLayoutSettings, DialogImageManager } from './editor/dialogs/index';
import { Editor_Sidenav } from './editor/sidenav/sidenav.component';
import { Editor_SidenavObj } from './editor/sidenav/objects/objects.component';
import { Editor_SidenavViews } from './editor/sidenav/views/views.component';
import { Editor_SidenavProperties } from './editor/sidenav/properties/properties.component';
import { Editor_SidenavDialogProperties } from './editor/sidenav/propertiesDialog/propertiesDialog.component';
import { ColorPaletteComponent } from './hmi-components/color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from './hmi-components/color-picker/color-picker.component';
import { ColorSliderComponent } from './hmi-components/color-picker/color-slider/color-slider.component';
import { TranspSliderComponent } from './hmi-components/color-picker/transp-slider/transp-slider.component';
import { BorderPickerComponent } from './hmi-components/border-picker/border-picker.component';
import { ShadowPickerComponent } from './hmi-components/shadow-picker/shadow-picker.component';
import { HistoryService } from './editor/history/history.service';
import { EditorContextMenuComponent } from './components/editor-context-menu/editor-context-menu.component';
import { EditableTableComponent } from './components/editable-table/editable-table.component';
import { EditorService } from './editor/service/editor.service';
import { MonitorComponent } from './monitor/monitor.component';
import { ImageManagerComponent } from './image-manager/image-manager.component';
import { IM_ThumbnailComponent } from './image-manager/thumbnail/thumbnail.component';
import { FilterPipe } from './image-manager/filter.pipe';
import { ModuleMainPageComponent } from './module-main-page/module-main-page.component';
import { WebsocketService, webSocketObject } from './websocket.service';
import { DbDataService } from './db-data.service';
import { PopupComponent } from './components/popup/popup.component';
import { HmiCDropdownComponent } from './hmi-components/hmi-c-dropdown/hmi-c-dropdown.component';
import { HmiCButtonComponent } from './hmi-components/hmi-c-button/hmi-c-button.component';
import { HmiCSliderComponent } from './hmi-components/hmi-c-slider/hmi-c-slider.component';
import { HmiCViewComponent } from './hmi-components/hmi-c-view/hmi-c-view.component';
import { HmiCImageComponent } from './hmi-components/hmi-c-image/hmi-c-image.component';
import { HmiCLabelComponent } from './hmi-components/hmi-c-label/hmi-c-label.component';
import { HmiCTableComponent } from './hmi-components/hmi-c-table/hmi-c-table.component';
import { HmiCLineChartComponent } from './hmi-components/hmi-c-line-chart/hmi-c-line-chart.component';
import { HmiCBarChartComponent } from './hmi-components/hmi-c-bar-chart/hmi-c-bar-chart.component';
import { ModbusTcpIpComponent } from './modbus-tcp-ip/modbus-tcp-ip.component';
import { ModbusMappingDialogComponent } from './components/modbus-mapping-dialog/modbus-mapping-dialog.component';
import { HmiCLevelComponent } from './hmi-components/hmi-c-level/hmi-c-level.component';
import { ModbusTcpIpServerComponent } from './modbus-tcp-ip-server/modbus-tcp-ip-server.component';
import { ChartsMainPageComponent } from './charts-main-page/charts-main-page.component';
import { ExportsMainPageComponent } from './analytics/db-exports-page/db-exports-page.component';
import { CdkColumnDef } from '@angular/cdk/table';
import { HmiCNumericInputComponent } from './hmi-components/hmi-c-numeric-input/hmi-c-numeric-input.component';
import { ChartWindowComponent } from './charts-main-page/chart-window/chart-window.component';
import { HmiCKeyboardComponent } from './hmi-components/hmi-c-keyboard/hmi-c-keyboard.component';
import { TimeMaskDirective } from './directives/time-mask/time-mask.directive';
import { ModuleUploadComponent } from './components/module-upload/module-upload.component';

import { DownloadConfigComponent } from './dialogs/download-config/download-config.component';
import { FirmwareUpgradeComponent } from './dialogs/firmware-upgrade/firmware-upgrade.component';
import { HmiCRfidComponent } from './hmi-components/hmi-c-rfid/hmi-c-rfid.component';
import { HmiCCameraComponent } from './hmi-components/hmi-c-camera/hmi-c-camera.component';
import { SdExportsPageComponent } from './analytics/sd-exports-page/sd-exports-page.component';
import { SettingsComponent } from './controller/settings/settings.component';
import { settingsTags } from './controller/settings/settings.service';
import {  ConfirmDialogComponent } from './controller/confirm/confirm.component';
import { AboutComponent } from './about/about.component';
import { NetworkMapComponent } from './modules/connection-manager/components/network-map/network-map.component';
import { propertiesFunctionModal } from './editor/sidenav/propertiesFunctionModal/propertiesFunctionModal.component';
import { HmiFunctionEditorComponent } from './hmi-function-editor/hmi-function-editor.component';
import { HmiEditorContextMenuComponent } from './components/hmieditor-context-menu/hmieditor-context-menu.component';
import { InputComponent } from './hmi-components/input/input.component';
import { SelectComponent } from './hmi-components/select/select.component';
import { DialogComponent } from './editor/sidenav/Dialog/dialog.component';
const materialModules = [
  CdkTreeModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
   MatDialogModule,
   MatDividerModule,
   MatExpansionModule,
   MatIconModule,
   MatInputModule,
   MatListModule,
   MatMenuModule,
   MatPaginatorModule,
   MatRippleModule,
   MatSelectModule,
   MatSidenavModule,
   MatProgressSpinnerModule,
   MatSnackBarModule,
   MatSortModule,
   MatTableModule,
   MatTabsModule,
   MatToolbarModule,
   MatFormFieldModule,
   MatButtonToggleModule,
   MatTreeModule,
   OverlayModule,
   PortalModule,
   MatBadgeModule,
   MatGridListModule,
   MatRadioModule,
   MatDatepickerModule,
   MatTooltipModule,
   MatSliderModule,
   DragDropModule,
   ReactiveFormsModule,
   MatSlideToggleModule,
   MatDatepickerModule,
   MatNativeDateModule,
   MatProgressBarModule,
   ScrollingModule,
   NgApexchartsModule
 ];


@NgModule({
  declarations: [
    ConfirmDialogComponent,
    AppComponent,
    DashboardComponent,
    MainNavComponent,
    DatabaseViewComponent,
    EipTagsConfigComponent,
    MbtcpClientConfigComponent,
    ModuleConfigComponent,
    EditableFieldComponent,
    ViewModeDirective,
    EditModeDirective,
    EditableOnEnterDirective,
    DatabaseComponent,
    TreeTableRowComponent,
    TreeTableComponent,
    LogicConfigComponent,
    SidenavResizeComponent,
    DatabaseViewHeaderComponent,
    DatabaseViewRowComponent,
    EditorComponent,
    EditorContextMenuComponent,
    EditableTableComponent,
    Editor_Sidenav,
    Editor_SidenavObj,
    Editor_SidenavViews,
    Editor_SidenavProperties,
    Editor_SidenavDialogProperties,
    ColorPaletteComponent,
    ColorPickerComponent,
    ColorSliderComponent,
    TranspSliderComponent,
    BorderPickerComponent,
    ShadowPickerComponent,
    DialogDocName,
    DialogDocProperty,
    DialogDocDelete,
    DialogLayoutSettings,
    DialogImageManager,
    MonitorComponent,
    ImageManagerComponent,
    IM_ThumbnailComponent,
    FilterPipe,
    ModuleMainPageComponent,
    PopupComponent,
    HmiCDropdownComponent,
    HmiCViewComponent,
    HmiCImageComponent,
    HmiCLabelComponent,
    HmiCButtonComponent,
    HmiCSliderComponent,
    HmiCTableComponent,
    HmiCLineChartComponent,
    ModbusTcpIpComponent,
    ModbusMappingDialogComponent,
    HmiCLevelComponent,
    ModbusTcpIpServerComponent,
    ChartsMainPageComponent,
    ExportsMainPageComponent,
    HmiCNumericInputComponent,
    ChartWindowComponent,
    HmiCKeyboardComponent,
    TimeMaskDirective,
    ModuleUploadComponent,
    DownloadConfigComponent,
    FirmwareUpgradeComponent,
    HmiCRfidComponent,
    HmiCCameraComponent,
    SdExportsPageComponent,
    SettingsComponent,
    AboutComponent,
    NetworkMapComponent,
    propertiesFunctionModal,
    HmiFunctionEditorComponent,
    HmiEditorContextMenuComponent,
    HmiCBarChartComponent,
    InputComponent,
    SelectComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatGridListModule,
    materialModules,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [
    HistoryService,
    EditorService,
    DbDataService,
    settingsTags,
    MainNavComponent,
    MatDatepickerModule,
    webSocketObject],

  bootstrap: [AppComponent]
})
export class AppModule {}
