import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadConfigComponent } from './download-config.component';

describe('DownloadConfigComponent', () => {
  let component: DownloadConfigComponent;
  let fixture: ComponentFixture<DownloadConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
