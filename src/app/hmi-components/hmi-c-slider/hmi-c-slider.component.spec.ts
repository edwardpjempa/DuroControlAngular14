import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HmiCSliderComponent } from './hmi-c-slider.component';

describe('HmiCSliderComponent', () => {
  let component: HmiCSliderComponent;
  let fixture: ComponentFixture<HmiCSliderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HmiCSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmiCSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});