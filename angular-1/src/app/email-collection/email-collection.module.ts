import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailCollectionComponent } from './email-collection.component';
import { EmailCollectionRoutingModule } from './email-collection.routing';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    EmailCollectionRoutingModule,
    MaterialDesignModule,
    SharedComponentsModule,
    FlexLayoutModule,
  ],
  declarations: [EmailCollectionComponent],
})
export class EmailCollectionModule {}
