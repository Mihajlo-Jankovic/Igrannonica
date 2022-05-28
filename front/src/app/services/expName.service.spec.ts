import { TestBed } from '@angular/core/testing';

import { ExpNameService } from './expName.service';

describe('HomeServiceService', () => {
  let service: ExpNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
