import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmiFunctionEditorComponent } from './hmi-function-editor.component';

describe('HmiFunctionEditorComponent', () => {
  let component: HmiFunctionEditorComponent;
  let fixture: ComponentFixture<HmiFunctionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmiFunctionEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmiFunctionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
