import { TestBed, inject } from '@angular/core/testing';

import { TargetGroupService } from './target-group.service';

describe('TargetGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TargetGroupService]
    });
  });

  it('should be created', inject([TargetGroupService], (service: TargetGroupService) => {
    expect(service).toBeTruthy();
  }));
});
