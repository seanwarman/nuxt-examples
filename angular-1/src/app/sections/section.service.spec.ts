import { TestBed } from '@angular/core/testing';

import { SectionService } from './section.service';
import { Sections } from '../../data/sections';

describe('SectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SectionService = TestBed.get(SectionService);
    expect(service).toBeTruthy();
  });

  it('`getSection` should return a section if found', (done: DoneFn) => {
    const testSection = { slug: 'test' };

    spyOn(Sections, 'find').and.returnValue(testSection);

    const service: SectionService = TestBed.get(SectionService);

    service.getSection('test').subscribe(section => {
      expect(section as object).toEqual(testSection);
      done();
    });
  });

  it('`getSection` should throw an error if not found', () => {
    spyOn(Sections, 'find').and.returnValue(undefined);

    const service: SectionService = TestBed.get(SectionService);

    service.getSection('test').subscribe(
      () => {
        fail('expected exception');
      },
      error => {
        expect(error).toBe('Section not found');
      }
    );
  });
});
