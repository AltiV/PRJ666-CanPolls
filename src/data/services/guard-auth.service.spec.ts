import { TestBed } from '@angular/core/testing';

import { GuardAuthService } from './guard-auth.service';

describe('GuardAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuardAuthService = TestBed.get(GuardAuthService);
    expect(service).toBeTruthy();
  });
});
