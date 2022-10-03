import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CuberComponent } from './cuber.component';
import { CuberRoutingModule } from './cuber.routing';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  declarations: [CuberComponent],
  imports: [
    CommonModule,
    CuberRoutingModule,
    FormsModule,
    SharedComponentsModule,
    LayoutModule,
  ],
  exports: [CuberComponent],
})
export class CuberModule {}
