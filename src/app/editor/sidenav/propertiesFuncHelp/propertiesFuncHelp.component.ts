import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewEncapsulation, ViewChild, Inject } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: "properties-Func-Help",
  templateUrl: "./propertiesFuncHelp.component.html",
  styleUrls: ["./propertiesFuncHelp.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class propertiesFuncHelp {

  help = {
    'if': "if(tag: Tag, trueEvent: String|Number|Tag, falseEvent: String|Number|Tag)",
    'border': 'borderType borderHexColor borderWidth'
  }
  helpExample = ["if(tag, 'true', 'false') \n if(tag, 1, 0) \n if(tag, newTag, newTag2)",
    'solid #000000 2px']

  helpindex = 1
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    console.log(this.data)
    if (this.data['data']['type'] == 'Borders') {
      document.getElementById('help')!.innerHTML = this.help['border']
      this.helpindex = 1
    }
    setTimeout(this.typeWriter, 500)
  }
  i = 0
  typeWriter = () => {
    if (this.i < this.helpExample[this.helpindex].length) {
      document.getElementById("example")!.innerHTML += this.helpExample[this.helpindex].charAt(this.i);
      this.i++;
      setTimeout(this.typeWriter, 40);
    }
  }
}
