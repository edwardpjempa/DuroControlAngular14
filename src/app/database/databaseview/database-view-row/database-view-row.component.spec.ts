import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseViewRowComponent } from './database-view-row.component';

describe('DatabaseViewRowComponent', () => {
  let component: DatabaseViewRowComponent;
  let fixture: ComponentFixture<DatabaseViewRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseViewRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseViewRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
