import { TestBed } from '@angular/core/testing';

import { ReadProgressHttpService } from './read-progress-http.service';

describe('ReadProgressHttpService', () => {
  let service: ReadProgressHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadProgressHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
