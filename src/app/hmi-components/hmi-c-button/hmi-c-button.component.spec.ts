import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HmiCButtonComponent } from './hmi-c-button.component';

describe('HmiCButtonComponent', () => {
  let component: HmiCButtonComponent;
  let fixture: ComponentFixture<HmiCButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HmiCButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmiCButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});