import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomPlannerComponent } from './room-planner.component';

const routes: Routes = [
  {
    path: '',
    component: RoomPlannerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomPlannerRoutingModule {}
