import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DragDataService {

  constructor() { }

  dragData: any;

  setDragData(data: any){
    this.dragData = data;
  }

  getDragData(){
    return this.dragData;
  }

}
