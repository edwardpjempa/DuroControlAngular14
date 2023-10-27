import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MbtcpClientConfigComponent } from './mbtcp-client-config.component';

describe('MbtcpClientConfigComponent', () => {
  let component: MbtcpClientConfigComponent;
  let fixture: ComponentFixture<MbtcpClientConfigComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MbtcpClientConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MbtcpClientConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
