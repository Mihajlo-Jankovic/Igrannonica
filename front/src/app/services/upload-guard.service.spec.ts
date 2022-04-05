import { TestBed } from '@angular/core/testing';

import { UploadGuardService } from './upload-guard.service';

describe('UploadGuardService', () => {
  let service: UploadGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
