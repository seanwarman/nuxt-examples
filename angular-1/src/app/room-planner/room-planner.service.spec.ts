import { TestBed } from '@angular/core/testing';

import { RoomPlannerService } from './room-planner.service';

describe('RoomPlannerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoomPlannerService = TestBed.get(RoomPlannerService);
    expect(service).toBeTruthy();
  });
});
