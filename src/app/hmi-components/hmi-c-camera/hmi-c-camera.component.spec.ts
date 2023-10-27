import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmiCCameraComponent } from './hmi-c-camera.component';

describe('HmiCCameraComponent', () => {
  let component: HmiCCameraComponent;
  let fixture: ComponentFixture<HmiCCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmiCCameraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmiCCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
