import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmiCNumericInputComponent } from './hmi-c-numeric-input.component';

describe('HmiCNumericInputComponent', () => {
  let component: HmiCNumericInputComponent;
  let fixture: ComponentFixture<HmiCNumericInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmiCNumericInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmiCNumericInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
