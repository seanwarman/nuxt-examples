import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SubsectionService } from './subsection.service';
import { mockedCard } from './card/card.component.spec';
import { Card } from './section';

describe('SubsectionService', () => {
  let service: SubsectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SubsectionService] });
    service = TestBed.get(SubsectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit an observable value when `selectCard` called', (done: DoneFn) => {
    service.cardSelected$.subscribe(card => {
      expect(card as Card).toEqual(mockedCard);
      done();
    });
    service.selectCard(mockedCard);
  });
});
