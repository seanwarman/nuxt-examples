import { TestBed } from '@angular/core/testing';
import { WindowService } from './window.service';

describe('WindowService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [WindowService],
    })
  );

  it('should be created', () => {
    const service: WindowService = TestBed.get(WindowService);
    expect(service).toBeTruthy();
  });
});
