import { Component, OnInit } from '@angular/core';
import { HmiComponent } from '../hmi-component';

@Component({
  selector: 'app-hmi-c-level',
  templateUrl: './hmi-c-level.component.html',
  styleUrls: ['./hmi-c-level.component.css']
})
export class HmiCLevelComponent extends HmiComponent implements OnInit {

  constructor() { 
    super();
  }
 
  ngOnInit(): void {}
}
