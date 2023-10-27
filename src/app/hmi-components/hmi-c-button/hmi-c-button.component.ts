import { Component } from '@angular/core';
import { HmiComponent } from '../hmi-component';

@Component({
  selector: 'app-hmi-c-button',
  templateUrl: './hmi-c-button.component.html',
  styleUrls: ['./hmi-c-button.component.scss']
})
export class HmiCButtonComponent extends HmiComponent {
  
  constructor() {
    super();
  }

  ngAfterViewInit() {}
}