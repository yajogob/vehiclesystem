import { TestBed } from '@angular/core/testing';

import { GomapService } from './gomap.service';

describe('GomapService', () => {
  let service: GomapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GomapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
