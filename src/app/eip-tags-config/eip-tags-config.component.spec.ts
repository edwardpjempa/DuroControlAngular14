import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EipTagsConfigComponent } from './eip-tags-config.component';

describe('EipTagsConfigComponent', () => {
  let component: EipTagsConfigComponent;
  let fixture: ComponentFixture<EipTagsConfigComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EipTagsConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EipTagsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
