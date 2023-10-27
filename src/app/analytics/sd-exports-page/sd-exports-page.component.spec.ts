import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdExportsPageComponent } from './sd-exports-page.component';

describe('SdExportsPageComponent', () => {
  let component: SdExportsPageComponent;
  let fixture: ComponentFixture<SdExportsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdExportsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SdExportsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
