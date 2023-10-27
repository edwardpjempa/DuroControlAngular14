import { TestBed } from '@angular/core/testing';

import { TransformNodesService } from './transform-nodes.service';

describe('TransformNodesService', () => {
  let service: TransformNodesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransformNodesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
