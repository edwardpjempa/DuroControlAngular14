import { TestBed } from '@angular/core/testing';

import { DragDataService } from './drag-data.service';

describe('DragDataService', () => {
  let service: DragDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DragDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
