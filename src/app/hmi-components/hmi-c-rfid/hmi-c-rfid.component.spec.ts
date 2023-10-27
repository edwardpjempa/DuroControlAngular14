import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmiCRfidComponent } from './hmi-c-rfid.component';

describe('HmiCRfidComponent', () => {
  let component: HmiCRfidComponent;
  let fixture: ComponentFixture<HmiCRfidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmiCRfidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmiCRfidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
