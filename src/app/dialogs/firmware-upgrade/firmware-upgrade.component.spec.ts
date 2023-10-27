import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmwareUpgradeComponent } from './firmware-upgrade.component';

describe('FirmwareUpgradeComponent', () => {
  let component: FirmwareUpgradeComponent;
  let fixture: ComponentFixture<FirmwareUpgradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmwareUpgradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmwareUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
