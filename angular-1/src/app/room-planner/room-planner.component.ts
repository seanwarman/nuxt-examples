import { Component, OnDestroy, OnInit } from '@angular/core';
import { Image } from '../shared-components/primary-media/primary-media.component';
import { SystemImages } from 'src/assets/images';
import { RoomPlannerService } from './room-planner.service';
import { AppService } from '../app.service';
import { RoomPlannerImages } from '../../assets/images';
import { Subscription } from 'rxjs';

export interface RoomPlannerFormState {
  occupancy: number;
  selectedRoomType: string;
  selectedJamboard: boolean;
  selectedDualScreen: boolean;
}

export interface RoomSpec {
  minRoomSize: {
    length: number;
    width: number;
  };
  screenSize: string;
  microphoneNumber: number | null;
  table: {
    length: number;
    width: number;
  };
  occupancy: number;
  hardware: string;
  logitech: string;
  jamboard: boolean | null;
  acousticWallTreatment: number;
}

@Component({
  selector: 'app-room-planner',
  templateUrl: './room-planner.component.html',
  styleUrls: ['./room-planner.component.scss'],
})
export class RoomPlannerComponent implements OnInit, OnDestroy {
  roomPlannerSubscription: Subscription;
  downloadIcon: string;
  specification: RoomSpec;
  primaryImageValue: Image[];
  secondaryImage: Image;
  icon: string;
  selectedJamboard: boolean;
  selectedDualScreen: boolean;
  planView: boolean = false;
  modelLoading: boolean = true;

  constructor(
    private roomPlannerService: RoomPlannerService,
    private appService: AppService
  ) {
    this.icon = RoomPlannerImages.icons.mainIcon;
  }

  ngOnInit() {
    this.appService.setCurrentTheme('room-planner');
    // Set the default values
    this.updateRoom(4, 'conference', false, false);
    this.downloadIcon = SystemImages.homeImages.downloadIcon;
  }

  onModelLoaded() {
    // This delay is to allow the fade-in animation to finish
    setTimeout(() => (this.modelLoading = false), 500);
  }

  updateRoom(
    occupancy: number,
    selectedRoomType: string,
    selectedJamboard: boolean,
    selectedDualScreen: boolean
  ): void {
    this.roomPlannerSubscription = this.roomPlannerService
      .getRoomConfig(
        occupancy,
        selectedRoomType,
        selectedJamboard,
        selectedDualScreen
      )
      //.getRoomConfig(occupancy, selectedJamboard)
      .subscribe(config => {
        const { specification, primaryImageValue, secondaryImage } = config;
        this.specification = specification;
        this.primaryImageValue = primaryImageValue;
        this.secondaryImage = secondaryImage;
      });
  }

  updateView() {
    this.planView = !this.planView;
  }

  fetchConfig(state: RoomPlannerFormState) {
    const {
      occupancy,
      selectedRoomType,
      selectedJamboard,
      selectedDualScreen,
    } = state;

    let roomType;
    // detect change in room size
    if (occupancy !== this.specification.occupancy) {
      if (occupancy < 3) {
        if (selectedRoomType === 'meet-on-jam') roomType = 'meet-on-jam';
        else roomType = 'chromebase';
      } else if (occupancy > 2 && occupancy < 7) {
        if (selectedRoomType === 'meet-on-jam') roomType = 'meet-on-jam';
        else roomType = 'conference';
      } else {
        roomType = 'conference';
      }
    } else {
      roomType = selectedRoomType;
    }

    this.updateRoom(occupancy, roomType, selectedJamboard, selectedDualScreen);
  }

  ngOnDestroy() {
    this.roomPlannerSubscription.unsubscribe();
  }
}
