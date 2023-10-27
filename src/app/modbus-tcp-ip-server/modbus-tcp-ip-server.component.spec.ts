import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModbusTcpIpServerComponent } from './modbus-tcp-ip-server.component';

describe('ModbusTcpIpServerComponent', () => {
  let component: ModbusTcpIpServerComponent;
  let fixture: ComponentFixture<ModbusTcpIpServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModbusTcpIpServerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModbusTcpIpServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
