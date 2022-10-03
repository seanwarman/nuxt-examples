import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  MatCarousel,
  MatCarouselComponent,
  MatCarouselSlide,
  MatCarouselSlideComponent,
} from '@ngmodule/material-carousel';
import { RoomPlannerFormState } from '../room-planner.component';
import { GoogleAnalyticsService } from '../../google-analytics.service';

export const maxOccupancies = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  16,
  18,
  20,
];

export const RoomTypes1 = [
  {
    name: 'Desk 27',
    selected: true,
    value: 'chromebase',
  },
  {
    name: 'Board 65',
    selected: false,
    value: 'meet-on-jam',
  },
];

export const RoomTypes2 = [
  {
    name: 'Room Kits',
    selected: true,
    value: 'conference',
  },
  {
    name: 'Board 65',
    selected: false,
    value: 'meet-on-jam',
  },
];

export const RoomTypes3 = [
  {
    name: 'Room Kits',
    selected: true,
    value: 'conference',
  },
];

@Component({
  selector: 'app-management-form',
  templateUrl: './management-form.component.html',
  styleUrls: ['./management-form.component.scss'],
})
export class ManagementFormComponent implements OnInit {
  @Output() formChanged = new EventEmitter<RoomPlannerFormState>();
  @Output() viewChanged = new EventEmitter<boolean>();
  @Input() modelLoading: boolean = true;
  @Input() specification: any;
  @ViewChild('carousel') CarouselElement: ElementRef;

  occupancy = 4;
  selectedRoomType = 'conference';
  selectedJamboard = false;
  selectedDualScreen = false;
  roomTypes = [];
  public isUpdating = false;

  constructor(private googleAnalyticsService: GoogleAnalyticsService) {}

  ngOnInit() {
    this.roomTypes = RoomTypes2;
  }

  formatLabel(value: number | null) {
    if (!value || value >= maxOccupancies.length) {
      return 0;
    }

    return maxOccupancies[value];
  }

  handleRoomTypeChange(value) {
    if (value === 'meet-on-jam') {
      this.selectedDualScreen = false;
      this.selectedJamboard = false;
    }
    this.roomTypes.forEach(roomType => {
      if (roomType.value === value) {
        if (!roomType.selected) {
          roomType.selected = true;
          this.selectedRoomType = roomType.value;
          this.formChanged.emit({
            occupancy: this.formatLabel(this.occupancy),
            selectedRoomType: this.selectedRoomType,
            selectedJamboard: this.selectedJamboard,
            selectedDualScreen: this.selectedDualScreen,
          });
        }
      } else {
        roomType.selected = false;
      }
    });
  }

  emitFormChangedEvent(input = null): void {
    if (!this.occupancy) {
      return;
    }
    this.isUpdating = true;
    this.resetSlides();
    if (this.occupancy > 6) {
      this.selectedRoomType = 'conference';
    }

    this.formChanged.emit({
      occupancy: this.formatLabel(this.occupancy),
      selectedRoomType: this.selectedRoomType,
      selectedJamboard: this.selectedJamboard,
      selectedDualScreen: this.selectedDualScreen,
    });

    if (input === 'slider') {
      this.googleAnalyticsService.eventEmitter(
        'room_planner_slider',
        null,
        null
      );
    } else if (input === 'checkbox') {
      this.googleAnalyticsService.eventEmitter(
        'room_planner_jamboard',
        null,
        null
      );
    }

    setTimeout(() => {
      this.isUpdating = false;
    }, 1000);
  }

  isNotMultiple() {
    if (this.specification.primaryHardware.length > 1) {
      return false;
    } else {
      return true;
    }
  }

  resetSlides(): void {
    // handles the dynamic updating of slides where the indicator and index dont reset back to
    // the first slide
    (document.querySelector(
      '.carousel .carousel-list'
    ) as HTMLElement).style.transform = 'unset';
  }
  ngOnChanges(changes: SimpleChanges): void {
    const { specification } = changes;

    const numberOfPeople = specification.currentValue.occupancy;
    if (numberOfPeople < 3) {
      const updatedRoomTypes1 = RoomTypes1.map(x => x);
      if (this.selectedRoomType === 'meet-on-jam') {
        updatedRoomTypes1[0].selected = false;
        updatedRoomTypes1[1].selected = true;
        this.roomTypes = updatedRoomTypes1;
        this.selectedDualScreen = false;
        this.selectedJamboard = false;
      } else {
        updatedRoomTypes1[0].selected = true;
        updatedRoomTypes1[1].selected = false;
        this.roomTypes = updatedRoomTypes1;
      }
    }

    if (numberOfPeople > 2 && numberOfPeople < 7) {
      const updatedRoomTypes2 = RoomTypes2.map(x => x);
      if (this.selectedRoomType === 'meet-on-jam') {
        updatedRoomTypes2[0].selected = false;
        updatedRoomTypes2[1].selected = true;
        this.roomTypes = updatedRoomTypes2;
        this.selectedDualScreen = false;
        this.selectedJamboard = false;
      } else {
        updatedRoomTypes2[0].selected = true;
        updatedRoomTypes2[1].selected = false;
        this.roomTypes = updatedRoomTypes2;
      }
    }

    if (numberOfPeople > 6) {
      this.roomTypes = RoomTypes3;
    }
  }
}
