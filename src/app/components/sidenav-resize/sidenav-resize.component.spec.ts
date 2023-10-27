import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavResizeComponent } from './sidenav-resize.component';

describe('SidenavResizeComponent', () => {
  let component: SidenavResizeComponent;
  let fixture: ComponentFixture<SidenavResizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavResizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavResizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
