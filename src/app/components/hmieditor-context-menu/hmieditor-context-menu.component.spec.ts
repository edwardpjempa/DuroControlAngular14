import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HmiEditorContextMenuComponent } from './hmieditor-context-menu.component';

describe('EditorContextMenuComponent', () => {
  let component: HmiEditorContextMenuComponent;
  let fixture: ComponentFixture<HmiEditorContextMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HmiEditorContextMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmiEditorContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
