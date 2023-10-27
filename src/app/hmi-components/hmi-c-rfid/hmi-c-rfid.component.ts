import { Component, OnInit } from '@angular/core';
import { HmiComponent } from '../hmi-component';

@Component({
  selector: 'app-hmi-c-rfid',
  templateUrl: './hmi-c-rfid.component.html',
  styleUrls: ['./hmi-c-rfid.component.scss']
})
export class HmiCRfidComponent extends HmiComponent implements OnInit {

  rfid_state: number = 0

  constructor() {
    super();
  }

  ngOnInit(): void {
  }



}
