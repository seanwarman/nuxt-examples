import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ManagementFormComponent,
  maxOccupancies,
} from './management-form.component';
import { MaterialDesignModule } from '../../material-design/material-design.module';
import { MatChipsModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatCarouselComponent,
  MatCarouselSlideComponent,
} from '@ngmodule/material-carousel';

describe('ManagementFormComponent', () => {
  let component: ManagementFormComponent;
  let fixture: ComponentFixture<ManagementFormComponent>;
  const specification = {
    primaryHardware: [
      {
        name: 'Meetup',
        image:
          'assets/images/room-planner/secondary-media/kit/meetOnJamMeetUp.png',
      },
    ],
    secondaryHardware: [
      {
        name: 'Asus Large Kit',
        image: 'assets/images/room-planner/secondary-media/kit/asusLarge.png',
      },
      {
        name: 'Logitech Medium Kit',
        image:
          'assets/images/room-planner/secondary-media/kit/logitechMediumKit.png',
      },
    ],
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ManagementFormComponent,
        MatCarouselComponent,
        MatCarouselSlideComponent,
      ],
      imports: [
        MaterialDesignModule,
        MatChipsModule,
        FormsModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementFormComponent);
    component = fixture.componentInstance;
    component.specification = specification;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format the room length label', () => {
    expect(component.formatLabel(null)).toEqual(0);

    expect(component.formatLabel(maxOccupancies.length + 1)).toEqual(0);

    for (let i = 1; i < maxOccupancies.length; i++) {
      expect(component.formatLabel(i)).toEqual(maxOccupancies[i]);
    }
  });

  it('should update the state after room length change', done => {
    component.occupancy = 1;
    component.selectedRoomType = 'chromebase';
    component.selectedJamboard = true;
    component.selectedDualScreen = false;

    component.formChanged.subscribe(val => {
      expect(val).toEqual({
        occupancy: 1,
        selectedRoomType: 'chromebase',
        selectedJamboard: true,
        selectedDualScreen: false,
      });
      done();
    });
    component.emitFormChangedEvent();
  });
});
