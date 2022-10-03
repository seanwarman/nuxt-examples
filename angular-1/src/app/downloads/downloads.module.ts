import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadsComponent } from './downloads.component';
import { DownloadsRoutingModule } from './downloads.routing';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    DownloadsRoutingModule,
    MaterialDesignModule,
    SharedComponentsModule,
    FlexLayoutModule,
  ],
  declarations: [DownloadsComponent],
})
export class DownloadsModule {}
