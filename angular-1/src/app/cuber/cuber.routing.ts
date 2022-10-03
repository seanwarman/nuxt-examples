import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuberComponent } from './cuber.component';

const routes: Routes = [
  {
    path: '',
    component: CuberComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuberRoutingModule {}
