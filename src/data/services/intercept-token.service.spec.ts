import { TestBed } from '@angular/core/testing';

import { InterceptTokenService } from './intercept-token.service';

describe('InterceptTokenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InterceptTokenService = TestBed.get(InterceptTokenService);
    expect(service).toBeTruthy();
  });
});
