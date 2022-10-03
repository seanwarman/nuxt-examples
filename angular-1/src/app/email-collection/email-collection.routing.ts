import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailCollectionComponent } from './email-collection.component';

const routes: Routes = [
  {
    path: '',
    component: EmailCollectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailCollectionRoutingModule {}
