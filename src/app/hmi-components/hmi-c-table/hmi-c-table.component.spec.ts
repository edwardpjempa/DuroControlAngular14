import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HmiCTableComponent } from './hmi-c-table.component';

describe('HmiCTableComponent', () => {
  let component: HmiCTableComponent;
  let fixture: ComponentFixture<HmiCTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HmiCTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmiCTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});