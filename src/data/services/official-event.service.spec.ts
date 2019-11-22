import { TestBed } from '@angular/core/testing';

import { OfficialEventService } from './official-event.service';

describe('OfficialEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OfficialEventService = TestBed.get(OfficialEventService);
    expect(service).toBeTruthy();
  });
});
