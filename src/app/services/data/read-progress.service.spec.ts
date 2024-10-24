import { TestBed } from '@angular/core/testing';

import { ReadProgressService } from './read-progress.service';

describe('ReadProgressService', () => {
  let service: ReadProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
