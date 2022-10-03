import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Image } from '../shared-components/primary-media/primary-media.component';
import { RoomPlannerFormState } from '../room-planner/room-planner.component';
import { Card, Subsection, UpdateModel } from '../sections/section';

@Component({
  selector: 'app-subsection-nav',
  template: '<p></p>',
})
export class MockSubsectionNavComponent {
  @Input() subsections: Subsection[];
  @Input() sectionName: string;
}

@Component({
  selector: 'app-primary-media',
  template: '<p></p>',
})
export class MockPrimaryMediaComponent {
  @Input() primaryImage: Image;
  @Input() secondaryImage?: Image;
}

@Component({
  selector: 'app-management-form',
  template: '<p></p>',
})
export class MockManagementFormComponent {
  @Output() formChanged = new EventEmitter<RoomPlannerFormState>();
}

@Component({
  selector: 'app-card',
  template: '<p></p>',
})
export class MockCardComponent {
  @Input() card: Card;
  @Input() selected: boolean;
  @Input() subsection: Subsection;
}

@Component({
  selector: 'app-footer',
  template: '<p></p>',
})
export class MockFooterComponent {
  @Input() footerWidth: string;
}

@Component({
  selector: 'app-content-hotspot-drawer',
  template: '<p></p>',
})
export class MockContentHotspotDrawerComponent {
  @Input() selectedHotspot: string;
}

@Component({
  selector: 'app-threejs-model',
  template: '<p></p>',
})
export class MockThreejsModel {
  @Input() modelPath: string;
  @Input() updateModel: UpdateModel;
}
@Component({
  selector: 'app-homepage-model',
  template: '<p></p>',
})
export class HomepageModelComponent {
  @Output() hotspotEvent = new EventEmitter<string>();
  @Input() selectedHotspot: string;
}
