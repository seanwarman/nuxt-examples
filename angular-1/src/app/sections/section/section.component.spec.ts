import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionComponent } from './section.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MaterialDesignModule } from '../../material-design/material-design.module';
import { SectionService } from '../section.service';
import { Sections } from '../../../data/sections';
import { Section } from '../section';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Data } from '@angular/router';
import { of } from 'rxjs';
import {
  MockFooterComponent,
  MockPrimaryMediaComponent,
  MockSubsectionNavComponent,
  MockThreejsModel,
} from '../../utils/test-utils.spec';
import { LayoutComponent } from '../../layout/layout.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const section = Sections[0];

describe('SectionComponent', () => {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;

  // create fake observe
  const breakPointSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);

  breakPointSpy.observe.and.returnValue(of({ match: true }));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialDesignModule, RouterTestingModule],
      declarations: [
        SectionComponent,
        MockPrimaryMediaComponent,
        MockSubsectionNavComponent,
        MockFooterComponent,
        LayoutComponent,
        MockThreejsModel,
      ],
      providers: [
        {
          provide: BreakpointObserver,
          useValue: breakPointSpy,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            data: {
              subscribe: (fn: (value: Data) => void) =>
                fn({
                  slug: 'test',
                }),
            },
            params: of({ id: 1 }),
            snapshot: {},
          },
        },
        {
          provide: SectionService,
          useValue: {
            getSection: (slug: string) => ({
              subscribe: (fn: (value: Section) => void) => fn(section),
            }),
            currentSubsection$: of(section.children[0]),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should call getSections in onInit and assign the returned value`, () => {
    expect(component.section).toEqual(section);
  });
});
