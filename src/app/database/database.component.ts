import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigDataService } from '../config-data.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.css']
})

export class DatabaseComponent implements OnInit {
  list = []
  tagsToDelete: any;
  deleteStatus: boolean = false;
  editStatus: boolean = false;
  tableSelector: boolean = false;
  data: any;
  selectedTag!: string;

  constructor(
    private router: Router,
    public configDataService: ConfigDataService,
  ) { }

  ngOnInit() {}

  checkSelected($event:any) {}

  openModal(id: string) {}

  closeModal(id: string) {}

  clearList(){
    this.list = []
  }
}
