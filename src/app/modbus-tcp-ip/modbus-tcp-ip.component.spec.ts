import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModbusTcpIpComponent } from './modbus-tcp-ip.component';

describe('ModbusTcpIpComponent', () => {
  let component: ModbusTcpIpComponent;
  let fixture: ComponentFixture<ModbusTcpIpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModbusTcpIpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModbusTcpIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
