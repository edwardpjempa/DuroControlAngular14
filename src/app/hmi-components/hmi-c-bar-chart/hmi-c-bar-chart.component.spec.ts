import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmiCBarChartComponent } from './hmi-c-bar-chart.component';

describe('HmiCBarChartComponent', () => {
  let component: HmiCBarChartComponent;
  let fixture: ComponentFixture<HmiCBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmiCBarChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmiCBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
