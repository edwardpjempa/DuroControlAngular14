import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'
import { DatabaseComponent } from './database/database.component';
import { EipTagsConfigComponent } from './eip-tags-config/eip-tags-config.component';
import { MbtcpClientConfigComponent } from './mbtcp-client-config/mbtcp-client-config.component';
import { ModuleConfigComponent } from './module-config/module-config.component';
import { EditorComponent } from './editor/editor.component';
import { MonitorComponent } from './monitor/monitor.component';
import { ImageManagerComponent } from './image-manager/image-manager.component';
import { ModuleMainPageComponent } from './module-main-page/module-main-page.component';
import { ChartsMainPageComponent } from './charts-main-page/charts-main-page.component';
import { ExportsMainPageComponent } from './analytics/db-exports-page/db-exports-page.component';
import { ChartWindowComponent } from './charts-main-page/chart-window/chart-window.component';
import { SdExportsPageComponent } from './analytics/sd-exports-page/sd-exports-page.component';
import { SettingsComponent } from './controller/settings/settings.component';
import { NetworkMapComponent } from './modules/connection-manager/components/network-map/network-map.component';
import { ConnectionManagerModule } from './modules/connection-manager/connection-manager.module';

const routes: Routes = [
   { path: 'module-home/:moduleType', component: ModuleMainPageComponent },
   { path: 'module/:index', component: ModuleConfigComponent },   
   { path: 'dashboard', component: DashboardComponent },
   { path: 'database', component: DatabaseComponent },
   { path: 'mbtcpclient', component: MbtcpClientConfigComponent },
   { path: 'eiptagsclient', component: EipTagsConfigComponent },
   { path: 'editor', component: EditorComponent },
   { path: 'monitor/:view', component: MonitorComponent },
   { path: 'imageManager', component: ImageManagerComponent },
   { path: 'charts', component: ChartsMainPageComponent },
   { path: 'db-exports', component: ExportsMainPageComponent },
   { path: 'sd-exports', component: SdExportsPageComponent },
   { path: 'settings', component: SettingsComponent },
   { path: 'network-map', component: NetworkMapComponent}, 
   { path: 'charts', component: ChartWindowComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }


