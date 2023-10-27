import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmiCLineChartComponent } from './hmi-c-line-chart.component';

describe('HmiCLineChartComponent', () => {
  let component: HmiCLineChartComponent;
  let fixture: ComponentFixture<HmiCLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmiCLineChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmiCLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
