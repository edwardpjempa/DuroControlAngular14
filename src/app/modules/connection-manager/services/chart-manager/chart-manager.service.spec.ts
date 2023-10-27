import { TestBed } from '@angular/core/testing';

import { ChartManagerService } from './chart-manager.service';

describe('ChartManagerService', () => {
  let service: ChartManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
