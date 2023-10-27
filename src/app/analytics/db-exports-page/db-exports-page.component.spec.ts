import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportsMainPageComponent } from './db-exports-page.component';

describe('ExportsMainPageComponent', () => {
  let component: ExportsMainPageComponent;
  let fixture: ComponentFixture<ExportsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportsMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
