import { Injectable } from '@angular/core';
import { RoomSpec } from './room-planner.component';
import { Image } from '../shared-components/primary-media/primary-media.component';
import { NewRoomConfigMap } from '../../data/room-config';
import { Observable, of } from 'rxjs';

export interface RoomConfig {
  specification: RoomSpec;
  primaryImageValue: Image[];
  secondaryImage: Image;
}

@Injectable({
  providedIn: 'root',
})
export class RoomPlannerService {
  constructor() {}

  getRoomConfig(
    occupancy: number,
    selectedRoomType: string,
    jamboard: boolean,
    selectedDualScreen: boolean
  ): Observable<RoomConfig> {
    const {
      primaryImage,
      secondaryImage,
      roomSetup,
      screens,
    } = NewRoomConfigMap[occupancy];

    if (occupancy > 6) selectedRoomType = 'conference';
    if (occupancy < 3) selectedDualScreen = false;
    if (occupancy < 3) jamboard = false;

    let dataPath;
    if (selectedRoomType === 'conference' && !jamboard) {
      dataPath = roomSetup.conference.withoutJam;
    }
    if (selectedRoomType === 'conference' && jamboard) {
      dataPath = roomSetup.conference.withJam;
    }
    if (selectedRoomType === 'chromebase') {
      dataPath = roomSetup.chromebase;
    }
    if (selectedRoomType === 'meet-on-jam') {
      dataPath = roomSetup.meetOnJam;
    }
    if (selectedRoomType !== 'meet-on-jam') {
      dataPath.screen = selectedDualScreen ? screens.dual : screens.single;
    } else {
      dataPath.screen = [];
    }
    let primaryImageValue = primaryImage.default;
    if (selectedRoomType == 'meet-on-jam') {
      primaryImageValue = primaryImage.meetOnJam;
    }
    if (selectedDualScreen && !jamboard) {
      primaryImageValue = primaryImage.dualScreen;
    }
    if (selectedDualScreen && jamboard) {
      primaryImageValue = primaryImage.dualScreenJamboard;
    }
    if (!selectedDualScreen && jamboard) {
      primaryImageValue = primaryImage.jamboard;
    }

    // clone object so ngOnChanges in three-d-room-planner comp recognises changes
    dataPath = Object.assign({}, dataPath);

    return of({
      primaryImageValue,
      secondaryImage,
      specification: dataPath,
    });
  }
}
