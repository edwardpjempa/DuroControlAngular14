import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-node-info',
  templateUrl: './node-info.component.html',
  styleUrls: ['./node-info.component.css']
})
export class NodeInfoComponent implements OnInit {

  constructor() { }

  getDetails() {
    console.log("More Details")
  }
  
  ngOnInit(): void {
  }

}
