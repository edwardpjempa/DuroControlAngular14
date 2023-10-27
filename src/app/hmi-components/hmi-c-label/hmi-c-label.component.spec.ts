import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmiCLabelComponent } from './hmi-c-label.component';

describe('HmiCLabelComponent', () => {
  let component: HmiCLabelComponent;
  let fixture: ComponentFixture<HmiCLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmiCLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmiCLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
