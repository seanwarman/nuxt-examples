import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { RoomSpec } from '../room-planner.component';
import { RoomPlannerImages } from 'src/assets/images';

interface SpecificationWidget {
  title: string;
  value?: string | number;
  accessor: string;
  icon: string;
  learnLink?: string;
}

@Component({
  selector: 'app-specification',
  templateUrl: './specification.component.html',
  styleUrls: ['./specification.component.scss'],
})
export class SpecificationComponent implements OnInit, OnChanges {
  @Input() data: RoomSpec;

  sections: SpecificationWidget[] = [];

  private structure: SpecificationWidget[] = [
    {
      title: 'Minimum room size',
      icon: RoomPlannerImages.icons.minRoomSize,
      accessor: 'minRoomSize',
    },
    {
      title: 'Maximum occupancy',
      icon: RoomPlannerImages.icons.maxOccupancy,
      accessor: 'occupancy',
    },
    {
      title: 'Recommended screen size',
      icon: RoomPlannerImages.icons.screenSize,
      accessor: 'screenSize',
      learnLink: '/displays-and-extras/screen',
    },
    {
      title: 'Extra Mic Pod(s)',
      icon: RoomPlannerImages.icons.microphones,
      accessor: 'microphoneNumber',
      learnLink: '/camera-and-audio/micpods',
    },
    {
      title: 'Acoustic wall treatment',
      icon: RoomPlannerImages.icons.acousticFinishes,
      accessor: 'acousticWallTreatment',
      learnLink: '/acoustics/acoustic-finishes',
    },
    {
      title: 'Nominal table size',
      icon: RoomPlannerImages.icons.minRoomSize,
      accessor: 'table',
      learnLink: '/furniture-lighting/furniture',
    },
  ];

  constructor() {}

  static formatValue(accessor: string, value: any): string | number {
    switch (accessor) {
      case 'minRoomSize': {
        const { length, width } = value;

        return `Width: ${width}m / Length: ${length}m / Area: ${Math.round(
          width * length * 100
        ) / 100}m<sup>2</sup>`;
      }
      case 'occupancy': {
        return value > 1 ? `${value} people` : '1 person';
      }
      case 'microphoneNumber': {
        return `${value}`;
      }
      case 'jamboard': {
        return value ? 'Yes' : 'No';
      }
      case 'table': {
        const { length, width } = value;

        return `Length: ${length}m / Width: ${width}m`;
      }
      case 'acousticWallTreatment': {
        return `${value}m<sup>2</sup>`;
      }
      default: {
        return value;
      }
    }
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    const {
      data: { currentValue },
    } = changes;

    this.sections = this.structure
      .filter(widget => currentValue[widget.accessor] !== null)
      .map(widget => {
        const accessor = widget.accessor;
        const value = currentValue[accessor];

        return Object.assign({}, widget, {
          value: SpecificationComponent.formatValue(accessor, value),
        });
      });
  }
}
