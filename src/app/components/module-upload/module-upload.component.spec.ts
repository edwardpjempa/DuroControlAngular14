import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleUploadComponent } from './module-upload.component';

describe('ModuleUploadComponent', () => {
  let component: ModuleUploadComponent;
  let fixture: ComponentFixture<ModuleUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
