import { TestBed, inject } from '@angular/core/testing';

import { TargetAccountService } from './target-account.service';

describe('TargetAccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TargetAccountService]
    });
  });

  it('should be created', inject([TargetAccountService], (service: TargetAccountService) => {
    expect(service).toBeTruthy();
  }));
});
