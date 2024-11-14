import { TestBed } from '@angular/core/testing';

import { ScrapperHttpServiceService } from './scrapper-http-service.service';

describe('ScrapperHttpServiceService', () => {
  let service: ScrapperHttpServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrapperHttpServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
