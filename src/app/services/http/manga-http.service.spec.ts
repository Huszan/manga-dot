import { TestBed } from '@angular/core/testing';

import { MangaHttpService } from './manga-http.service';

describe('MangaHttpService', () => {
  let service: MangaHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MangaHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
