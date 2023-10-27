import { Component } from '@angular/core';
import { HmiComponent } from '../hmi-component';

@Component({
  selector: 'app-hmi-c-dropdown',
  templateUrl: './hmi-c-dropdown.component.html',
  styleUrls: ['./hmi-c-dropdown.component.scss']
})

export class HmiCDropdownComponent extends HmiComponent {
  
  constructor() {
    super();
  }

  ngAfterViewInit() {}

  matMenuTimer: any;

  cardClick(): void {
    this.matMenuTimer = setTimeout( () => {this.clickedMe();}, 300); 
  }
  cardDoubleClick(): void {
      clearTimeout(this.matMenuTimer);
      this.matMenuTimer = undefined;
      this.clickedMeDouble();
  }
  clickedMe() {

    if (!this.matMenuTimer) return;
  }
  clickedMeDouble() {
    console.log("hey, you double clicked me!");
  }

}



