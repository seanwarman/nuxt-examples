import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialDesignModule } from '../../material-design/material-design.module';
import { SpecificationComponent } from './specification.component';

describe('SpecificationComponent', () => {
  let component: SpecificationComponent;
  let fixture: ComponentFixture<SpecificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificationComponent],
      imports: [RouterTestingModule, MaterialDesignModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate a list of sections', () => {
    // sections with null values should not appear in the list
    const data = {
      minRoomSize: {
        length: 6.65,
        width: 4.1,
      },
      screenSize: '55"',
      microphoneNumber: 2,
      table: {
        length: 3.85,
        width: 1.4,
      },
      occupancy: 11,
      hardware: 'Hangouts meet hardware kit - Large',
      logitech: 'Small roomkit',
      jamboard: true,
      acousticWallTreatment: 18.6,
    };

    component.ngOnChanges({ data: new SimpleChange(null, data, true) });

    expect(component.sections).toEqual([
      {
        title: 'Minimum room size',
        icon: 'assets/images/room-planner/icons/roomplanner_minroomsize.svg',
        accessor: 'minRoomSize',
        value: 'Width: 4.1m / Length: 6.65m / Area: 27.27m<sup>2</sup>',
      },
      {
        title: 'Maximum occupancy',
        icon: 'assets/images/room-planner/icons/roomplanner_maxoccupancy.svg',
        accessor: 'occupancy',
        value: '11 people',
      },
      {
        title: 'Recommended screen size',
        icon: 'assets/images/room-planner/icons/roomplanner_screensize.svg',
        accessor: 'screenSize',
        value: '55"',
        learnLink: '/displays-and-extras/screen',
      },
      {
        title: 'Extra Mic Pod(s)',
        icon:
          'assets/images/room-planner/icons/roomplanner_speakermicquantity.svg',
        accessor: 'microphoneNumber',
        value: '2',
        learnLink: '/camera-and-audio/micpods',
      },
      {
        title: 'Acoustic wall treatment',
        icon:
          'assets/images/room-planner/icons/roomplanner_acousticfinishes.svg',
        accessor: 'acousticWallTreatment',
        value: '18.6m<sup>2</sup>',
        learnLink: '/acoustics/acoustic-finishes',
      },
      {
        title: 'Nominal table size',
        icon: 'assets/images/room-planner/icons/roomplanner_minroomsize.svg',
        accessor: 'table',
        value: 'Length: 3.85m / Width: 1.4m',
        learnLink: '/furniture-lighting/furniture',
      },
    ]);
  });

  it('should format values properly', () => {
    expect(
      SpecificationComponent.formatValue('minRoomSize', { length: 5, width: 2 })
    ).toEqual('Width: 2m / Length: 5m / Area: 10m<sup>2</sup>');

    expect(SpecificationComponent.formatValue('occupancy', 1)).toEqual(
      '1 person'
    );

    expect(SpecificationComponent.formatValue('occupancy', 5)).toEqual(
      '5 people'
    );

    expect(SpecificationComponent.formatValue('microphoneNumber', 1)).toEqual(
      '1'
    );

    expect(SpecificationComponent.formatValue('microphoneNumber', 5)).toEqual(
      '5'
    );

    expect(SpecificationComponent.formatValue('jamboard', false)).toEqual('No');

    expect(SpecificationComponent.formatValue('jamboard', true)).toEqual('Yes');

    expect(
      SpecificationComponent.formatValue('table', {
        length: 1.2,
        width: 1.2,
      })
    ).toEqual(`Length: 1.2m / Width: 1.2m`);

    expect(
      SpecificationComponent.formatValue('acousticWallTreatment', 3)
    ).toEqual('3m<sup>2</sup>');

    expect(SpecificationComponent.formatValue('default', 'default')).toEqual(
      'default'
    );
  });
});
