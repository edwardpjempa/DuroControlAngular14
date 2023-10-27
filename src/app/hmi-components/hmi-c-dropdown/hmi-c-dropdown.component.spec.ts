import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HmiCDropdownComponent } from './hmi-c-dropdown.component';

describe('HmiCDropdownComponent', () => {
  let component: HmiCDropdownComponent;
  let fixture: ComponentFixture<HmiCDropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HmiCDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmiCDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});