import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseViewHeaderComponent } from './database-view-header.component';

describe('DatabaseViewHeaderComponent', () => {
  let component: DatabaseViewHeaderComponent;
  let fixture: ComponentFixture<DatabaseViewHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseViewHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseViewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
