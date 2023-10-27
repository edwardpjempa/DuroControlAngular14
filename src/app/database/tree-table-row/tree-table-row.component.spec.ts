import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TreeTableRowComponent } from './tree-table-row.component';

describe('TreeTableRowComponent', () => {
  let component: TreeTableRowComponent;
  let fixture: ComponentFixture<TreeTableRowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeTableRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
