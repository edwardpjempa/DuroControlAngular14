import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsMainPageComponent } from './charts-main-page.component';

describe('ChartsMainPageComponent', () => {
  let component: ChartsMainPageComponent;
  let fixture: ComponentFixture<ChartsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartsMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
