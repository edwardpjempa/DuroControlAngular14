import { Component, Output, EventEmitter, OnInit, ElementRef, AfterViewInit, ContentChild, Input } from '@angular/core';
import { from, fromEvent, Subject } from 'rxjs';
import { filter, take, switchMapTo, merge, mergeScan, mergeMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EditModeDirective } from './edit-mode.directive';
import { ViewModeDirective } from './view-mode.directive';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'editable',
  template: `<ng-container *ngTemplateOutlet="currentView"></ng-container>`
})
export class EditableFieldComponent implements AfterViewInit {
  @Input() enterEditEvents!: string[];
  @Input() exitEditEvents!: string[];
  @Output() update = new EventEmitter<any>();
  @ContentChild(ViewModeDirective) viewModeTpl!: ViewModeDirective;
  @ContentChild(EditModeDirective) editModeTpl!: EditModeDirective;
  mode: 'view' | 'edit' = 'view';

  constructor(private host: ElementRef) {}


  get currentView() {
    return this.mode === 'view' ? this.viewModeTpl.tpl : this.editModeTpl.tpl;
  }

  ngAfterViewInit(){
    this.viewModeHandler();
    this.editModeHandler();
  }

  editMode = new Subject();
  editMode$ = this.editMode.asObservable();

  private viewModeHandler() {
    from(this.enterEditEvents).pipe(
      mergeMap(event => fromEvent(this.element, event)),
      untilDestroyed(this)
    ).subscribe((event) => {
      this.mode = 'edit';
      this.editMode.next(true);
    });
 }

 private editModeHandler() {

  const eventOutside$ = from(this.exitEditEvents).pipe(
    mergeMap(event =>fromEvent(document, event)),
      filter(({ target }) => this.element.contains(target) === false),
      take(1)
  )
    this.editMode$.pipe(
      switchMapTo(eventOutside$),
      untilDestroyed(this)
    ).subscribe(event => {
      this.update.next();
      this.mode = 'view';
    });
}

  private get element() {
    return this.host.nativeElement;
  }

  toViewMode() {
    console.log("To View Mode")
    this.update.next();
    this.mode = 'view';
  }

}
