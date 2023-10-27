import { Directive, HostListener } from '@angular/core';
import { EditableFieldComponent } from './editable-field.component'
@Directive({
  selector: '[editableOnEnter]'
})
export class EditableOnEnterDirective {
  constructor(private editable: EditableFieldComponent) {
  }

  @HostListener('keyup.enter')
  onEnter() {
    this.editable.toViewMode();
  }

}