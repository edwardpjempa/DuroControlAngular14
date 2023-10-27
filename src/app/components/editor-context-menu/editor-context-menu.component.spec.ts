import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditorContextMenuComponent } from './editor-context-menu.component';

describe('EditorContextMenuComponent', () => {
  let component: EditorContextMenuComponent;
  let fixture: ComponentFixture<EditorContextMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorContextMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
