import { TestBed } from '@angular/core/testing';

import { ContactHttpService } from './contact-http.service';

describe('ContactHttpService', () => {
  let service: ContactHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
