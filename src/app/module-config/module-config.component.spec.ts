import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModuleConfigComponent } from './module-config.component';

describe('ModuleConfigComponent', () => {
  let component: ModuleConfigComponent;
  let fixture: ComponentFixture<ModuleConfigComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
