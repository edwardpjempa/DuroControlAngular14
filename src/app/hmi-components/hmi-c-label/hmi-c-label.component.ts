import { Component, OnInit } from '@angular/core';
import { HmiComponent } from '../hmi-component';

@Component({
  selector: 'app-hmi-c-label',
  templateUrl: './hmi-c-label.component.html',
  styleUrls: ['./hmi-c-label.component.css']
})
export class HmiCLabelComponent extends HmiComponent implements OnInit {

  constructor() { 
    super();
  }

  ngOnInit(): void {}
}
