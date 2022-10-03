import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsectionComponent } from './subsection.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SectionService } from '../section.service';
import { Card, Subsection } from '../section';
import { Subsections } from '../../../data/sections';
import { SubsectionService } from '../subsection.service';
import { MockCardComponent } from '../../utils/test-utils.spec';
import { mockedCard } from '../card/card.component.spec';

describe('SubsectionComponent', () => {
  let component: SubsectionComponent;
  let subsectionService: SubsectionService;
  let fixture: ComponentFixture<SubsectionComponent>;
  let goFromToSubsectionSpy: jasmine.Spy;
  let cardSelectionServiceSpy: jasmine.Spy;

  const subsection = Subsections['room-layout'][1];
  const firstCard = subsection.cards[0];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubsectionComponent, MockCardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            url: of([{ path: 'subsection' }]),
            snapshot: { parent: { data: { slug: 'section' } } },
          },
        },
        {
          provide: SectionService,
          useValue: {
            getSubsection: (parentSlug: string, slug: string) => of(subsection),
            currentSubsection$: of(subsection),
          },
        },
        {
          provide: SubsectionService,
          useValue: {
            cardSelected$: of(firstCard),
            goFromToSubsection: (from: Subsection, to: string): void => {},
            selectCard: (card: Card): void => {},
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load subsection onInit', function() {
    expect(component.subsection).toEqual(subsection);
  });

  it('should select the first card from section by default', function() {
    expect(component.selectedCardId).toEqual(firstCard.id);
  });

  it('should call `goFromToSubsection` on swipe', function() {
    subsectionService = TestBed.get(SubsectionService);
    goFromToSubsectionSpy = spyOn(subsectionService, 'goFromToSubsection');

    component.swipe('previous');

    expect(goFromToSubsectionSpy.calls.count()).toEqual(1);
    expect(goFromToSubsectionSpy).toHaveBeenCalledWith(subsection, 'previous');
  });

  it('should call `swipe` on swipe events', function() {
    spyOn(component, 'swipe');

    const hostElement = fixture.nativeElement;
    const outerDiv: HTMLElement = hostElement.querySelector('div');

    outerDiv.dispatchEvent(new Event('swipeleft'));

    fixture.detectChanges();

    const swipe = component.swipe as jasmine.Spy;

    expect(swipe.calls.count()).toEqual(1);
    expect(swipe).toHaveBeenCalledWith('next');
  });

  it('should call service `selectCard` on `select`', function() {
    subsectionService = TestBed.get(SubsectionService);
    cardSelectionServiceSpy = spyOn(subsectionService, 'selectCard');

    component.select(mockedCard);

    expect(cardSelectionServiceSpy.calls.count()).toEqual(1);
    expect(cardSelectionServiceSpy).toHaveBeenCalledWith(mockedCard);
  });
});
