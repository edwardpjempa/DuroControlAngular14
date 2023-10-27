import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { HmiComponent } from '../hmi-component';

@Component({
  selector: 'app-hmi-c-table',
  templateUrl: './hmi-c-table.component.html',
  styleUrls: ['./hmi-c-table.component.scss']
})

export class HmiCTableComponent extends HmiComponent {

  ELEMENT_DATA = [{}, {}]

  columns = []
  dataSource = this.ELEMENT_DATA;
  displayedColumns = this.columns

  constructor(private tablee:ElementRef, private container:ElementRef, private cdr: ChangeDetectorRef) {
    super();
  }

  ngAfterViewChecked(){
    this.columns = this.config['matrix']['columns']
    this.dataSource = [...this.config['matrix']['elementTags']]
    for(var i = 0; i < this.container.nativeElement.children[0].children[0].children[0].children.length; i++){
     this.container.nativeElement.children[0].children[0].children[0].children[i].style.backgroundColor = this.config.style.headerColor
     this.container.nativeElement.children[0].children[0].children[0].children[i].style.fontSize = this.config.style["headerFontSize.px"] + "px"
     this.container.nativeElement.children[0].children[0].children[0].children[i].style.fontWeight = this.config.style.headerFontWeight
    }
    this.cdr.detectChanges();
  }  
}