import { TestBed } from '@angular/core/testing';

import { NetworkNodeService } from './network-node.service';

describe('NetworkNodeService', () => {
  let service: NetworkNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
