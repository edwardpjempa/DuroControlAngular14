import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleMainPageComponent } from './module-main-page.component';

describe('ModuleMainPageComponent', () => {
  let component: ModuleMainPageComponent;
  let fixture: ComponentFixture<ModuleMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
