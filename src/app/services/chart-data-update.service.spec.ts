import { TestBed } from '@angular/core/testing';

import { ChartDataUpdateService } from './chart-data-update.service';

describe('ChartDataUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChartDataUpdateService = TestBed.get(ChartDataUpdateService);
    expect(service).toBeTruthy();
  });
});
