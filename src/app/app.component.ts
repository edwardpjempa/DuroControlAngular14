import { Component } from '@angular/core';
import { ConfigDataService } from './config-data.service';
import { UserModuleService } from './user-module.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DuroControl2';

  constructor(public configService: ConfigDataService, public userModuleService: UserModuleService) { }
  subs!: Subscription;
  userModules:any = []

  ngOnInit() {
    setTimeout(()=> {
      // create local storage items for each user module (console, status, enabled)
      for(var i = 0; i < this.configService.configFile.modules.length; i++){
        if(this.configService.configFile.modules[i]['module'] == 'userCode'){
          this.userModules.push(this.configService.configFile.modules[i]['uniqueId'])
          if(localStorage.getItem(this.configService.configFile.modules[i]['uniqueId']) == null){
            var status = this.configService.configFile.modules[i]['uniqueId']+"Status"
            var enabled = this.configService.configFile.modules[i]['uniqueId']+"Enabled"
            localStorage.setItem(this.configService.configFile.modules[i]['uniqueId'], '')
            localStorage.setItem(status, '')
            localStorage.setItem(enabled, '')
          }
        }
      }
      this.userModuleService.connect()
    }, 2000)
    window.onbeforeunload = () => {this.ngOnDestroy()};
  }

  disconnectModuleService(){
    this.userModuleService.disconnect();
  }

  ngOnDestroy(){
    this.disconnectModuleService()
  }
}
