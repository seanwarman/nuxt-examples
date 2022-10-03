import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomPlannerComponent } from './room-planner.component';
import { Component, Input } from '@angular/core';

import {
  MockFooterComponent,
  MockManagementFormComponent,
  MockPrimaryMediaComponent,
} from '../utils/test-utils.spec';
import { LayoutComponent } from '../layout/layout.component';
import { RoomConfig, RoomPlannerService } from './room-planner.service';
import { AppService } from '../app.service';

const roomConfig = {
  primaryImageValue: [
    {
      src: 'assets/images/system/placeholders/placeholder_1_960_jamboard.png',
      altText: 'Primary Image Jamboard',
    },
    {
      src: 'assets/images/system/placeholders/placeholder_1_960.png',
      altText: 'Primary Image',
    },
  ],
  secondaryImage: {
    src: 'assets/images/system/placeholders/placeholder_2_960.png',
    altText: 'Secondary Image',
  },
  specification: {
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
    logitech: 'Small room kit',
    jamboard: true,
    acousticWallTreatment: 18.6,
  },
};

@Component({
  selector: 'app-specification',
  template: '<p></p>',
})
class MockSpecificationComponent {
  @Input() data;
}

describe('RoomPlannerComponent', () => {
  let component: RoomPlannerComponent;
  let fixture: ComponentFixture<RoomPlannerComponent>;
  let roomPlannerService: RoomPlannerService;
  let getRoomConfig: jasmine.Spy;
  let appService: AppService;
  let setCurrentTheme: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RoomPlannerComponent,
        MockManagementFormComponent,
        MockSpecificationComponent,
        MockPrimaryMediaComponent,
        LayoutComponent,
        MockFooterComponent,
      ],
      providers: [RoomPlannerService, AppService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomPlannerComponent);

    roomPlannerService = TestBed.get(RoomPlannerService);
    getRoomConfig = spyOn(roomPlannerService, 'getRoomConfig').and.returnValue({
      subscribe: (fn: (value: RoomConfig) => void) => fn(roomConfig),
    });

    appService = TestBed.get(AppService);
    setCurrentTheme = spyOn(appService, 'setCurrentTheme');

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should load the default config', () => {
  //   expect(getRoomConfig).toHaveBeenCalledWith(4, 'conference', false, false);
  // });

  // it('should set up the default style theme', () => {
  //   expect(setCurrentTheme).toHaveBeenCalledWith('room-planner');
  // });

  // it('should update room config', () => {
  //   component.updateRoom(12, 'conference', true, true);

  //   expect(getRoomConfig).toHaveBeenCalledWith(12, 'conference', true, true);

  //   expect(component.primaryImage).toEqual(roomConfig.primaryImage);
  //   expect(component.secondaryImage).toEqual(roomConfig.secondaryImage);
  //   expect(component.specification).toEqual(roomConfig.specification);
  // });
});
