import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmiCLevelComponent } from './hmi-c-level.component';

describe('HmiCLevelComponent', () => {
  let component: HmiCLevelComponent;
  let fixture: ComponentFixture<HmiCLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmiCLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmiCLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
