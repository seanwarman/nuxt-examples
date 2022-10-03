import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubsectionNavComponent } from './subsection-nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialDesignModule } from '../../material-design/material-design.module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SubsectionService } from '../subsection.service';
import { Subsections, Sections } from '../../../data/sections';

describe('SubsectionNavComponent', () => {
  let component: SubsectionNavComponent;
  let fixture: ComponentFixture<SubsectionNavComponent>;
  let navigateToSubsectionSpy: jasmine.Spy;

  const subsections = Subsections['room-layout'].slice(0, 3);
  const sectionName = Sections['Room Layout'];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubsectionNavComponent],
      imports: [RouterTestingModule, MaterialDesignModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ slug: 'subsection' }),
            snapshot: { data: { slug: 'section' } },
          },
        },
        {
          provide: SubsectionService,
          useValue: {
            subsectionSwiped$: of({ from: {}, to: 'previous' }),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsectionNavComponent);
    component = fixture.componentInstance;
    component.subsections = subsections;
    component.sectionName = sectionName;
    navigateToSubsectionSpy = spyOn(component, 'navigateToSubsection');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call `navigateToSubsection` after subsection swipe detected', function() {
    expect(navigateToSubsectionSpy.calls.count()).toEqual(1);
    expect(navigateToSubsectionSpy).toHaveBeenCalledWith({}, 'previous');
  });
});
