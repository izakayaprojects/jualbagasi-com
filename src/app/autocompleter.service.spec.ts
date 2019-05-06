import { TestBed } from '@angular/core/testing';

import { AutocompleterService } from './autocompleter.service';

describe('AutocompleterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AutocompleterService = TestBed.get(AutocompleterService);
    expect(service).toBeTruthy();
  });
});
