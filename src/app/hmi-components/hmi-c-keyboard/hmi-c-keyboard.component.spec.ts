import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmiCKeyboardComponent } from './hmi-c-keyboard.component';

describe('HmiCKeywordComponent', () => {
  let component: HmiCKeyboardComponent;
  let fixture: ComponentFixture<HmiCKeyboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmiCKeyboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmiCKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
