import { Component, Input, Output, EventEmitter, HostBinding, ViewEncapsulation, SimpleChanges } from '@angular/core';
import { ThemePalette } from '@angular/material/core'

export type ThumbnailSize = 'xs'|'sm'|'md'|'lg';

@Component({
  selector: 'im-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss'],
  host: { 'class': 'wm-thumbnail' },
  encapsulation: ViewEncapsulation.None
})
export class IM_ThumbnailComponent {

  @Input() src!: string;

  @Input() onEdit!: string;

  @Input() data: any;

  @Input() trackBy: any;

  @Input() selected!: boolean;

  @Output() outData: EventEmitter<any> = new EventEmitter(true);

test!: string

  // Size customization 
  @HostBinding('attr.size')
  @Input() size: ThumbnailSize = 'sm';

  // Color customization 
  @HostBinding('attr.color')
  @Input() color: ThemePalette = 'accent';

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes)

    this.test = this.data.name 
  }

  select(event:any, name:any, id:any){
    //console.log(event.target.checked)
    this.outData.emit({onEdit:{imgSelect:{state: event.target.checked, name: name, id: id}}})
  }

  rename(name:any, id:any){

    this.outData.emit({onEdit:{imgRename:{name: name, id: id}}})
  }
}