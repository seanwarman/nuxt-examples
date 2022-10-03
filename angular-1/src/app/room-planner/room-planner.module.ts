import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomPlannerComponent } from './room-planner.component';
import { ManagementFormComponent } from './management-form/management-form.component';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { SpecificationComponent } from './specification/specification.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { LayoutModule } from '../layout/layout.module';
import { RoomPlannerRoutingModule } from './room-planner.routing';
import { ThreeDRoomPlannerComponent } from './three-d-room-planner/three-d-room-planner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCarouselModule } from '@ngmodule/material-carousel';

@NgModule({
  declarations: [
    RoomPlannerComponent,
    ManagementFormComponent,
    SpecificationComponent,
    ThreeDRoomPlannerComponent,
  ],
  imports: [
    CommonModule,
    RoomPlannerRoutingModule,
    MaterialDesignModule,
    MatChipsModule,
    FormsModule,
    SharedComponentsModule,
    LayoutModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatCarouselModule,
  ],
  exports: [RoomPlannerComponent],
})
export class RoomPlannerModule {}
